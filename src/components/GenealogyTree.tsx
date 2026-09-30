import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Plus, 
  User, 
  Heart, 
  Flame, 
  Sparkles, 
  Eye, 
  Edit3, 
  Trash2, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  GitBranch,
  Layers
} from 'lucide-react';
import { ThanhVien, ChiPhai, TaiKhoanNguoiDung } from '../types/giapha';

interface GenealogyTreeProps {
  members: ThanhVien[];
  branches: ChiPhai[];
  currentUser: TaiKhoanNguoiDung | null;
  onSelectMember: (member: ThanhVien) => void;
  onAddChild: (parent: ThanhVien) => void;
  onAddSpouse: (member: ThanhVien) => void;
  onEditMember: (member: ThanhVien) => void;
  onDeleteMember: (memberId: string) => void;
}

interface TreeLine {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: 'parent-child' | 'spouse';
}

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({
  members,
  branches,
  currentUser,
  onSelectMember,
  onAddChild,
  onAddSpouse,
  onEditMember,
  onDeleteMember,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [collapsedGenerations, setCollapsedGenerations] = useState<Record<number, boolean>>({});
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null);
  const [lines, setLines] = useState<TreeLine[]>([]);
  const [showLines, setShowLines] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const treeContentRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser?.role === 'admin';

  // Group members by generations
  const generations = useMemo(() => {
    let filtered = members;
    if (selectedBranchFilter !== 'all') {
      filtered = members.filter(m => m.chiPhaiId === selectedBranchFilter || m.theHe <= 2);
    }

    const genMap: Record<number, ThanhVien[]> = {};
    filtered.forEach(m => {
      if (!genMap[m.theHe]) genMap[m.theHe] = [];
      genMap[m.theHe].push(m);
    });

    // Sort within each generation by order / birth year
    Object.keys(genMap).forEach(key => {
      const g = Number(key);
      genMap[g].sort((a, b) => (a.thuTuTrongGiaDinh || 1) - (b.thuTuTrongGiaDinh || 1));
    });

    return genMap;
  }, [members, selectedBranchFilter]);

  const maxGeneration = useMemo(() => {
    return Math.max(...members.map(m => m.theHe), 1);
  }, [members]);

  // Function to calculate connecting lines between parents and children
  const updateConnectingLines = useCallback(() => {
    if (!treeContentRef.current || !showLines) {
      setLines([]);
      return;
    }

    const contentRect = treeContentRef.current.getBoundingClientRect();
    const newLines: TreeLine[] = [];

    // Map all elements
    members.forEach((member) => {
      // Connect to parent
      if (member.chaId || member.meId) {
        const parentId = member.chaId || member.meId;
        const parentElem = document.getElementById(`tree-node-${parentId}`);
        const childElem = document.getElementById(`tree-node-${member.id}`);

        if (parentElem && childElem) {
          const pRect = parentElem.getBoundingClientRect();
          const cRect = childElem.getBoundingClientRect();

          // Coordinates relative to treeContent container
          const fromX = (pRect.left + pRect.width / 2 - contentRect.left) / zoomLevel;
          const fromY = (pRect.bottom - contentRect.top) / zoomLevel;
          const toX = (cRect.left + cRect.width / 2 - contentRect.left) / zoomLevel;
          const toY = (cRect.top - contentRect.top) / zoomLevel;

          newLines.push({
            id: `line-${parentId}-${member.id}`,
            fromX,
            fromY,
            toX,
            toY,
            type: 'parent-child',
          });
        }
      }

      // Connect to spouse if side-by-side
      if (member.voChongIds && member.voChongIds.length > 0 && member.gioiTinh === 'nam') {
        member.voChongIds.forEach(spouseId => {
          const mElem = document.getElementById(`tree-node-${member.id}`);
          const sElem = document.getElementById(`tree-node-${spouseId}`);

          if (mElem && sElem) {
            const mRect = mElem.getBoundingClientRect();
            const sRect = sElem.getBoundingClientRect();

            const fromX = (mRect.right - contentRect.left) / zoomLevel;
            const fromY = (mRect.top + mRect.height / 2 - contentRect.top) / zoomLevel;
            const toX = (sRect.left - contentRect.left) / zoomLevel;
            const toY = (sRect.top + sRect.height / 2 - contentRect.top) / zoomLevel;

            newLines.push({
              id: `spouse-${member.id}-${spouseId}`,
              fromX,
              fromY,
              toX,
              toY,
              type: 'spouse',
            });
          }
        });
      }
    });

    setLines(newLines);
  }, [members, zoomLevel, showLines]);

  // Center tree on mount & update lines
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      if (scrollWidth > clientWidth) {
        containerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
      }
    }
    const timer = setTimeout(updateConnectingLines, 250);
    return () => clearTimeout(timer);
  }, [selectedBranchFilter, collapsedGenerations, zoomLevel, updateConnectingLines]);

  // Update lines on window resize
  useEffect(() => {
    window.addEventListener('resize', updateConnectingLines);
    return () => window.removeEventListener('resize', updateConnectingLines);
  }, [updateConnectingLines]);

  // Handle Search Member
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return members.filter(m => 
      m.hoVaTen.toLowerCase().includes(q) || 
      (m.tenThuongGoi && m.tenThuongGoi.toLowerCase().includes(q)) ||
      (m.danhHieu && m.danhHieu.toLowerCase().includes(q))
    );
  }, [members, searchQuery]);

  const scrollToMember = (memberId: string) => {
    setHighlightedMemberId(memberId);
    const element = document.getElementById(`tree-node-${memberId}`);
    if (element && containerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  const toggleGenCollapse = (gen: number) => {
    setCollapsedGenerations(prev => ({
      ...prev,
      [gen]: !prev[gen],
    }));
    setTimeout(updateConnectingLines, 150);
  };

  const getBranchName = (branchId: string) => {
    const found = branches.find(b => b.id === branchId);
    return found ? found.tenChi : 'Chi Họ Chu';
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1b0a08] relative">
      
      {/* Visual Controls Toolbar */}
      <div className="bg-[#240e0c]/90 border-b border-[#4d1f1b] p-3 sm:px-6 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        {/* Left: Branch Filter & Line Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#d8bca2] font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Chi phái:</span>
          </div>
          <div className="flex items-center gap-1 bg-[#190806] p-1 rounded-lg border border-[#421814]">
            <button
              onClick={() => setSelectedBranchFilter('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedBranchFilter === 'all'
                  ? 'bg-[#82241d] text-amber-100 font-semibold'
                  : 'text-[#c29f80] hover:text-white'
              }`}
            >
              Toàn bộ dòng họ
            </button>
            {branches.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchFilter(b.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedBranchFilter === b.id
                    ? 'bg-[#82241d] text-amber-100 font-semibold'
                    : 'text-[#c29f80] hover:text-white'
                }`}
              >
                {b.tenChi}
              </button>
            ))}
          </div>

          {/* Toggle Connecting Lines Button */}
          <button
            onClick={() => setShowLines(!showLines)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
              showLines
                ? 'bg-amber-950/80 border-amber-600/80 text-amber-300'
                : 'bg-[#190806] border-[#421814] text-[#8c6d52]'
            }`}
            title="Bật/Tắt đường line kết nối phả hệ"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Đường line: {showLines ? 'Bật' : 'Tắt'}</span>
          </button>
        </div>

        {/* Center: Search Member in Pedigree Tree */}
        <div className="relative min-w-[200px] sm:min-w-[280px]">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400/80 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm tộc nhân trên cây..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#160705] border border-[#4f1e1a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#faede1] placeholder-[#947459] focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#220d0b] border border-[#5c2420] rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-[#3d1714]">
              {searchResults.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    scrollToMember(m.id);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#3d1512] flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-amber-200">{m.hoVaTen}</span>
                    <span className="text-[#a8896d] ml-1.5">· Đời {m.theHe}</span>
                  </div>
                  <span className="text-[10px] text-amber-400/90">{getBranchName(m.chiPhaiId)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Zoom & Center Controls */}
        <div className="flex items-center gap-1.5 bg-[#190806] p-1 rounded-lg border border-[#421814]">
          <button
            onClick={() => {
              setZoomLevel(prev => Math.max(0.6, prev - 0.1));
              setTimeout(updateConnectingLines, 200);
            }}
            title="Thu nhỏ"
            className="p-1.5 text-[#c29f80] hover:text-white hover:bg-[#341411] rounded cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-medium text-amber-300 px-1 min-w-[40px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => {
              setZoomLevel(prev => Math.min(1.4, prev + 0.1));
              setTimeout(updateConnectingLines, 200);
            }}
            title="Phóng to"
            className="p-1.5 text-[#c29f80] hover:text-white hover:bg-[#341411] rounded cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              if (containerRef.current) {
                const scrollWidth = containerRef.current.scrollWidth;
                const clientWidth = containerRef.current.clientWidth;
                containerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
              }
              setTimeout(updateConnectingLines, 200);
            }}
            title="Căn giữa mặc định"
            className="p-1.5 text-[#c29f80] hover:text-white hover:bg-[#341411] rounded cursor-pointer ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Pedigree Tree Canvas - Mặc định Căn giữa */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-6 sm:p-10 relative bg-viet-pattern min-h-[650px] flex justify-center"
      >
        <div 
          ref={treeContentRef}
          className="transition-transform duration-200 origin-top flex flex-col items-center min-w-max my-auto relative"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Connecting Lines Layer Behind Nodes */}
          {showLines && lines.length > 0 && (
            <svg 
              className="absolute inset-0 pointer-events-none z-0" 
              style={{ width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
            >
              <defs>
                <linearGradient id="parentChildGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="spouseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
                </linearGradient>
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#b45309" floodOpacity="0.4" />
                </filter>
              </defs>

              {lines.map((l) => {
                if (l.type === 'spouse') {
                  // Direct horizontal dashed pink line between spouses
                  return (
                    <line
                      key={l.id}
                      x1={l.fromX}
                      y1={l.fromY}
                      x2={l.toX}
                      y2={l.toY}
                      stroke="url(#spouseGrad)"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  );
                }

                // Orthogonal / S-curve branch from parent to child
                const midY = l.fromY + (l.toY - l.fromY) / 2;
                const pathData = `M ${l.fromX} ${l.fromY} L ${l.fromX} ${midY} L ${l.toX} ${midY} L ${l.toX} ${l.toY}`;

                return (
                  <g key={l.id}>
                    {/* Glow outline */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#45120c"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Primary Gold Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="url(#parentChildGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#lineGlow)"
                    />
                    {/* Connection Joint Dots */}
                    <circle cx={l.fromX} cy={l.fromY} r="3" fill="#d97706" />
                    <circle cx={l.toX} cy={l.toY} r="3" fill="#f59e0b" />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Altar / Pedigree Tree Header Emblem */}
          <div className="mb-8 text-center flex flex-col items-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#381410] border border-amber-600/50 shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase tracking-widest font-heritage text-amber-200 font-bold">
                PHẢ ĐỒ DÒNG TỘC HỌ CHU
              </span>
            </div>
            <p className="text-xs text-[#cfb092] mt-1 italic">
              Khởi nguồn từ Đất Lãng Sơn, Phượng Hoàng - Yên Dũng, Bắc Giang
            </p>
          </div>

          {/* Render Generations Sequentially */}
          <div className="flex flex-col items-center space-y-14 relative w-full z-10">
            {Array.from({ length: maxGeneration }, (_, i) => i + 1).map((genNum) => {
              const genMembers = generations[genNum] || [];
              if (genMembers.length === 0) return null;

              const isCollapsed = collapsedGenerations[genNum];

              return (
                <div key={genNum} className="flex flex-col items-center relative w-full">
                  
                  {/* Generation Label Banner with Toggle */}
                  <div className="mb-6 flex items-center gap-2">
                    <button
                      onClick={() => toggleGenCollapse(genNum)}
                      className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#591b15] via-[#85251c] to-[#591b15] border border-amber-500/60 shadow-lg text-amber-200 hover:text-white transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold font-heritage tracking-wider">
                        ĐỜI THỨ {genNum}
                      </span>
                      <span className="text-[10px] text-amber-300/80 bg-[#3b120f] px-1.5 py-0.5 rounded">
                        {genMembers.length} vị
                      </span>
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  </div>

                  {/* Generation Members Tier */}
                  {!isCollapsed && (
                    <div className="flex flex-wrap items-center justify-center gap-8 relative px-4">
                      {genMembers.map((member) => {
                        const isHighlighted = highlightedMemberId === member.id;
                        const isMale = member.gioiTinh === 'nam';
                        const isAlive = member.conSong;

                        // Check if member has spouse
                        const spouses = member.voChongIds
                          ? members.filter(m => member.voChongIds?.includes(m.id))
                          : [];

                        return (
                          <div
                            key={member.id}
                            id={`tree-node-${member.id}`}
                            className={`relative rounded-xl p-3 transition-all duration-300 shadow-xl flex flex-col justify-between w-64 z-10 ${
                              isHighlighted
                                ? 'ring-4 ring-amber-400 scale-105 bg-[#421713] shadow-amber-500/20'
                                : 'bg-[#29100d] hover:bg-[#381612] border border-[#57241f] hover:border-amber-600/60'
                            }`}
                          >
                            {/* Card Top: Generational order & Status badges */}
                            <div className="flex items-center justify-between text-[10px] pb-2 border-b border-[#471c17] mb-2">
                              <span className="text-[#c7a485] font-medium">
                                {member.thuTuTrongGiaDinh ? `Thứ ${member.thuTuTrongGiaDinh}` : 'Con cả'}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {isAlive ? (
                                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    Tại thế
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500/30" />
                                    {member.ngayGioAm ? `Giỗ ${member.ngayGioAm}` : 'Đã khuất'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Body: Member Name & Details */}
                            <div className="flex items-start gap-3 my-1">
                              {/* Avatar / Monogram */}
                              <div
                                className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-sm shadow-inner border ${
                                  isMale
                                    ? 'bg-[#1e293b] text-amber-300 border-amber-500/60'
                                    : 'bg-[#431407] text-rose-200 border-rose-400/60'
                                }`}
                              >
                                {member.hoVaTen.split(' ').slice(-1)[0]?.charAt(0) || 'C'}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 
                                  onClick={() => onSelectMember(member)}
                                  className="text-sm font-bold text-amber-100 truncate cursor-pointer hover:text-amber-300 transition-colors"
                                  title={member.hoVaTen}
                                >
                                  {member.hoVaTen}
                                </h4>
                                
                                {member.tenThuongGoi && (
                                  <p className="text-[11px] text-[#b89574] italic truncate">
                                    ({member.tenThuongGoi})
                                  </p>
                                )}

                                <p className="text-[11px] text-[#d6b899] mt-0.5">
                                  {member.namSinh ? `Năm sinh: ${member.namSinh}` : 'Năm sinh: Chưa rõ'}
                                </p>

                                {member.danhHieu && (
                                  <span className="inline-block text-[10px] text-amber-300 font-semibold bg-[#401814] px-1.5 py-0.5 rounded mt-1 border border-[#5e2722] truncate max-w-full">
                                    {member.danhHieu}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Branch indicator */}
                            <div className="mt-2 pt-2 border-t border-[#3d1714] text-[10px] text-[#aa886b] flex items-center justify-between">
                              <span className="truncate max-w-[130px]">
                                {getBranchName(member.chiPhaiId)}
                              </span>

                              {/* Spouses count pill if any */}
                              {spouses.length > 0 && (
                                <span className="flex items-center gap-1 text-rose-300 text-[10px]">
                                  <Heart className="w-3 h-3 text-rose-400 fill-rose-500" />
                                  <span>{spouses.map(s => s.hoVaTen).join(', ')}</span>
                                </span>
                              )}
                            </div>

                            {/* Action Buttons Toolbar */}
                            <div className="mt-3 pt-2 border-t border-[#4a1d18] flex items-center justify-between text-xs">
                              <button
                                onClick={() => onSelectMember(member)}
                                title="Xem thông tin chi tiết"
                                className="flex items-center gap-1 text-[11px] text-[#d4b596] hover:text-white px-2 py-1 rounded bg-[#1e0a08] hover:bg-[#3d1714] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-amber-400" />
                                <span>Chi tiết</span>
                              </button>

                              {isAdmin && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => onAddChild(member)}
                                    title="Thêm hậu duệ (con)"
                                    className="p-1 rounded text-emerald-400 hover:text-white hover:bg-emerald-950 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onAddSpouse(member)}
                                    title="Thêm phu quân / chính thất"
                                    className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-950 transition-colors cursor-pointer"
                                  >
                                    <Heart className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onEditMember(member)}
                                    title="Chỉnh sửa thông tin"
                                    className="p-1 rounded text-amber-400 hover:text-white hover:bg-amber-950 transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc chắn muốn xóa thành viên ${member.hoVaTen} khỏi gia phả họ Chu?`)) {
                                        onDeleteMember(member.id);
                                      }
                                    }}
                                    title="Xóa thành viên"
                                    className="p-1 rounded text-red-400 hover:text-white hover:bg-red-950 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
