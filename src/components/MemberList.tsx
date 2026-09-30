import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  LayoutGrid, 
  Table as TableIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Flame, 
  Heart, 
  Edit3, 
  Trash2, 
  Eye, 
  GraduationCap, 
  Briefcase,
  Award
} from 'lucide-react';
import { ThanhVien, ChiPhai, TaiKhoanNguoiDung } from '../types/giapha';

interface MemberListProps {
  members: ThanhVien[];
  branches: ChiPhai[];
  currentUser: TaiKhoanNguoiDung | null;
  onSelectMember: (member: ThanhVien) => void;
  onAddNewMember: () => void;
  onEditMember: (member: ThanhVien) => void;
  onDeleteMember: (memberId: string) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  branches,
  currentUser,
  onSelectMember,
  onAddNewMember,
  onEditMember,
  onDeleteMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedGen, setSelectedGen] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const isAdmin = currentUser?.role === 'admin';

  const branchMap = useMemo(() => {
    const map: Record<string, string> = {};
    branches.forEach(b => { map[b.id] = b.tenChi; });
    return map;
  }, [branches]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Search
      const searchMatch = !searchTerm.trim() || 
        m.hoVaTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.tenThuongGoi && m.tenThuongGoi.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.ngheNghiep && m.ngheNghiep.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.danhHieu && m.danhHieu.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.diaChiHienTai && m.diaChiHienTai.toLowerCase().includes(searchTerm.toLowerCase()));

      // Branch
      const branchMatch = selectedBranch === 'all' || m.chiPhaiId === selectedBranch;

      // Gen
      const genMatch = selectedGen === 'all' || m.theHe === Number(selectedGen);

      // Status
      const statusMatch = selectedStatus === 'all' || 
        (selectedStatus === 'living' && m.conSong) ||
        (selectedStatus === 'deceased' && !m.conSong);

      // Gender
      const genderMatch = selectedGender === 'all' || m.gioiTinh === selectedGender;

      return searchMatch && branchMatch && genMatch && statusMatch && genderMatch;
    }).sort((a, b) => {
      if (a.theHe !== b.theHe) return a.theHe - b.theHe;
      return (a.thuTuTrongGiaDinh || 1) - (b.thuTuTrongGiaDinh || 1);
    });
  }, [members, searchTerm, selectedBranch, selectedGen, selectedStatus, selectedGender]);

  const maxGen = Math.max(...members.map(m => m.theHe), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4d1e19]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-amber-200">
            Danh bạ Tộc nhân Họ Chu
          </h2>
          <p className="text-xs text-[#c4a182] mt-0.5">
            Tổng cộng: <strong className="text-amber-300 font-semibold">{members.length}</strong> thành viên · Hiển thị: <strong className="text-amber-300 font-semibold">{filteredMembers.length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs Table View Switcher */}
          <div className="flex items-center bg-[#250d0a] p-1 rounded-lg border border-[#4d1d18]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#78201a] text-amber-200' : 'text-[#a38062] hover:text-white'
              }`}
              title="Xem dạng thẻ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#78201a] text-amber-200' : 'text-[#a38062] hover:text-white'
              }`}
              title="Xem dạng bảng"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={onAddNewMember}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 text-xs font-semibold rounded-lg shadow-lg transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>Thêm tộc nhân</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#240e0c] p-4 rounded-xl border border-[#4f1e1a] shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-amber-400/80 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, tên gọi khác, nghề nghiệp, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#180806] border border-[#471a16] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#faeee1] placeholder-[#8c6d54] focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Branch Filter */}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-[#180806] border border-[#471a16] rounded-lg px-2.5 py-1.5 text-xs text-[#edd4bf] focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="all">Tất cả chi phái</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.tenChi}</option>
          ))}
        </select>

        {/* Generation Filter */}
        <select
          value={selectedGen}
          onChange={(e) => setSelectedGen(e.target.value)}
          className="bg-[#180806] border border-[#471a16] rounded-lg px-2.5 py-1.5 text-xs text-[#edd4bf] focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="all">Tất cả thế hệ (Đời)</option>
          {Array.from({ length: maxGen }, (_, i) => i + 1).map(g => (
            <option key={g} value={g}>Đời thứ {g}</option>
          ))}
        </select>

        {/* Status / Gender Filter */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#180806] border border-[#471a16] rounded-lg px-2 py-1.5 text-xs text-[#edd4bf] focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Trạng thái</option>
            <option value="living">Tại thế</option>
            <option value="deceased">Đã mất</option>
          </select>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="bg-[#180806] border border-[#471a16] rounded-lg px-2 py-1.5 text-xs text-[#edd4bf] focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Giới tính</option>
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
          </select>
        </div>
      </div>

      {/* Members Presentation */}
      {filteredMembers.length === 0 ? (
        <div className="bg-[#240e0c] rounded-xl border border-[#4d1f1b] p-12 text-center text-[#c29f80]">
          <Search className="w-10 h-10 mx-auto text-amber-500/50 mb-3" />
          <p className="text-sm font-medium">Không tìm thấy tộc nhân nào phù hợp với bộ lọc.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBranch('all');
              setSelectedGen('all');
              setSelectedStatus('all');
              setSelectedGender('all');
            }}
            className="mt-3 px-3 py-1.5 text-xs bg-[#421714] text-amber-200 rounded hover:bg-[#57201b] transition-colors cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const isMale = member.gioiTinh === 'nam';
            return (
              <div
                key={member.id}
                className="bg-[#260f0d] rounded-xl border border-[#52211c] hover:border-amber-500/60 p-4 transition-all duration-200 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#3d1714] mb-3">
                    <span className="font-semibold text-amber-300">
                      Đời thứ {member.theHe} · {member.thuTuTrongGiaDinh ? `Thứ ${member.thuTuTrongGiaDinh}` : 'Con cả'}
                    </span>
                    {member.conSong ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Tại thế
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                        <Flame className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                        Giỗ: {member.ngayGioAm || 'Chưa rõ'}
                      </span>
                    )}
                  </div>

                  {/* Identity */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-base shadow border ${
                        isMale
                          ? 'bg-[#1b2533] text-amber-300 border-amber-500/50'
                          : 'bg-[#3b120c] text-rose-300 border-rose-400/50'
                      }`}
                    >
                      {member.hoVaTen.split(' ').slice(-1)[0]?.charAt(0) || 'C'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => onSelectMember(member)}
                        className="text-base font-bold text-amber-100 hover:text-amber-300 transition-colors cursor-pointer truncate"
                      >
                        {member.hoVaTen}
                      </h3>
                      {member.tenThuongGoi && (
                        <p className="text-xs text-[#b89574] italic">({member.tenThuongGoi})</p>
                      )}
                      <p className="text-xs text-[#a6866b] mt-0.5">
                        {branchMap[member.chiPhaiId] || 'Chi họ Chu'}
                      </p>
                    </div>
                  </div>

                  {/* Highlights / Badges */}
                  {member.danhHieu && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 bg-[#3b1512] px-2.5 py-1 rounded-md border border-[#52211c]">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{member.danhHieu}</span>
                    </div>
                  )}

                  {/* Details metadata */}
                  <div className="mt-3 space-y-1 text-xs text-[#c9a788]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#8c6d54]">Năm sinh:</span>
                      <span className="text-[#ebd0b8] font-medium">{member.namSinh || 'Chưa rõ'}</span>
                      {!member.conSong && member.ngayMat && (
                        <span className="text-[#8c6d54] ml-2">Mất: {member.ngayMat}</span>
                      )}
                    </div>

                    {member.ngheNghiep && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Briefcase className="w-3 h-3 text-[#a18166] shrink-0" />
                        <span className="truncate">{member.ngheNghiep}</span>
                      </div>
                    )}

                    {member.diaChiHienTai && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-[#a18166] shrink-0" />
                        <span className="truncate">{member.diaChiHienTai}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Toolbar */}
                <div className="mt-4 pt-3 border-t border-[#3d1714] flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectMember(member)}
                    className="flex items-center gap-1 text-[#d4b79b] hover:text-white px-2 py-1 rounded bg-[#1c0806] hover:bg-[#34120f] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Xem hồ sơ</span>
                  </button>

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditMember(member)}
                        className="p-1.5 text-amber-400 hover:text-amber-200 hover:bg-[#3b1512] rounded transition-colors cursor-pointer"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa thành viên ${member.hoVaTen}?`)) {
                            onDeleteMember(member.id);
                          }
                        }}
                        className="p-1.5 text-red-400 hover:text-red-200 hover:bg-[#3b1512] rounded transition-colors cursor-pointer"
                        title="Xóa thành viên"
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
      ) : (
        /* Table View */
        <div className="bg-[#240e0c] rounded-xl border border-[#4d1f1a] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#ecd6c3]">
              <thead className="bg-[#180806] border-b border-[#471a16] text-[#bda087] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-3">Thế hệ</th>
                  <th className="py-3 px-3">Chi phái</th>
                  <th className="py-3 px-3">Năm sinh</th>
                  <th className="py-3 px-3">Trạng thái / Giỗ</th>
                  <th className="py-3 px-3">Nghề nghiệp / Học vấn</th>
                  <th className="py-3 px-3">Liên lạc / Địa chỉ</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b1512]">
                {filteredMembers.map(m => (
                  <tr key={m.id} className="hover:bg-[#331310] transition-colors">
                    <td className="py-3 px-4 font-semibold text-amber-200">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${m.gioiTinh === 'nam' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                        <span>{m.hoVaTen}</span>
                        {m.tenThuongGoi && <span className="text-[11px] text-[#9c7d63] font-normal">({m.tenThuongGoi})</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-amber-400">Đời {m.theHe}</td>
                    <td className="py-3 px-3 text-[#c9a788]">{branchMap[m.chiPhaiId] || 'Chi họ'}</td>
                    <td className="py-3 px-3">{m.namSinh || '—'}</td>
                    <td className="py-3 px-3">
                      {m.conSong ? (
                        <span className="text-emerald-400 font-medium">Tại thế</span>
                      ) : (
                        <span className="text-amber-400/90 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" />
                          Giỗ {m.ngayGioAm || 'Đã mất'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#c9a788]">
                      <div>{m.ngheNghiep || '—'}</div>
                      {m.danhHieu && <span className="text-[10px] text-amber-300 bg-[#3d1714] px-1 py-0.5 rounded">{m.danhHieu}</span>}
                    </td>
                    <td className="py-3 px-3 text-[#b59579]">
                      <div>{m.soDienThoai || m.diaChiHienTai || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectMember(m)}
                          className="p-1 text-amber-400 hover:text-white"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onEditMember(m)}
                              className="p-1 text-amber-400 hover:text-white"
                              title="Sửa"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Xác nhận xóa thành viên ${m.hoVaTen}?`)) {
                                  onDeleteMember(m.id);
                                }
                              }}
                              className="p-1 text-red-400 hover:text-white"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
