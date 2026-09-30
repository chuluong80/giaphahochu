import React, { useState } from 'react';
import { 
  Network, 
  Users, 
  MapPin, 
  UserCheck, 
  Shield, 
  ChevronRight, 
  Edit3, 
  Plus, 
  Trash2, 
  X, 
  Save, 
  CheckCircle2,
  Building
} from 'lucide-react';
import { ChiPhai, ThanhVien, TaiKhoanNguoiDung } from '../types/giapha';

interface BranchViewProps {
  branches: ChiPhai[];
  members: ThanhVien[];
  currentUser: TaiKhoanNguoiDung | null;
  onSelectMember: (member: ThanhVien) => void;
  onSaveBranch: (branch: ChiPhai) => void;
  onDeleteBranch: (branchId: string) => void;
}

export const BranchView: React.FC<BranchViewProps> = ({
  branches,
  members,
  currentUser,
  onSelectMember,
  onSaveBranch,
  onDeleteBranch,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || 'chi-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<ChiPhai | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ChiPhai>>({
    tenChi: '',
    truongChi: '',
    diaBan: '',
    moTa: '',
  });

  const isAdmin = currentUser?.role === 'admin';
  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const branchMembers = members.filter(m => m.chiPhaiId === activeBranch?.id);
  const livingCount = branchMembers.filter(m => m.conSong).length;
  const deceasedCount = branchMembers.filter(m => !m.conSong).length;

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      id: 'chi-' + Date.now().toString(36),
      tenChi: '',
      truongChi: '',
      diaBan: 'Xã Lãng Sơn, Huyện Yên Dũng, Tỉnh Bắc Giang',
      moTa: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: ChiPhai, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingBranch(branch);
    setFormData({ ...branch });
    setIsModalOpen(true);
  };

  const handleDelete = (branch: ChiPhai, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;

    if (branches.length <= 1) {
      alert('Hệ thống phải có ít nhất một chi phái chính');
      return;
    }

    const count = members.filter(m => m.chiPhaiId === branch.id).length;
    const msg = count > 0
      ? `Chi phái "${branch.tenChi}" đang có ${count} tộc nhân. Bạn có chắc chắn muốn xóa không?`
      : `Bạn có chắc chắn muốn xóa chi phái "${branch.tenChi}"?`;

    if (confirm(msg)) {
      onDeleteBranch(branch.id);
      if (selectedBranchId === branch.id) {
        const next = branches.find(b => b.id !== branch.id);
        if (next) setSelectedBranchId(next.id);
      }
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenChi?.trim() || !formData.truongChi?.trim()) {
      alert('Vui lòng nhập tên chi phái và người trưởng chi');
      return;
    }

    const payload: ChiPhai = {
      id: formData.id || 'chi-' + Date.now().toString(36),
      tenChi: formData.tenChi.trim(),
      truongChi: formData.truongChi.trim(),
      diaBan: formData.diaBan?.trim() || 'Xã Lãng Sơn, Yên Dũng',
      moTa: formData.moTa?.trim() || 'Chi phái thuộc Dòng họ Chu xã Lãng Sơn',
    };

    onSaveBranch(payload);
    setSelectedBranchId(payload.id);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4d1f1b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-amber-200">
            Các Chi phái Dòng họ Chu
          </h2>
          <p className="text-xs text-[#c4a182] mt-1">
            Hệ thống phân chi dòng họ Chu tại Xã Lãng Sơn, huyện Yên Dũng, tỉnh Bắc Giang
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-semibold text-xs rounded-lg shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Thêm chi phái mới</span>
          </button>
        )}
      </div>

      {/* Branch Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {branches.map((branch) => {
          const isSelected = branch.id === selectedBranchId;
          const count = members.filter(m => m.chiPhaiId === branch.id).length;

          return (
            <div
              key={branch.id}
              onClick={() => setSelectedBranchId(branch.id)}
              className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer shadow-lg relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#421714] to-[#2b0f0c] border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-[#220d0b] border-[#4a1d18] hover:border-amber-600/50 hover:bg-[#2b110f]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#3d1714]">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                    Phân chi họ Chu
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1b0a08] text-amber-300 font-bold border border-[#4d1f1a]">
                      {count} thành viên
                    </span>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleOpenEdit(branch, e)}
                          title="Sửa chi phái"
                          className="p-1 text-amber-400 hover:text-white rounded hover:bg-[#471a16] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(branch, e)}
                          title="Xóa chi phái"
                          className="p-1 text-red-400 hover:text-white rounded hover:bg-[#471a16] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-heritage text-amber-100 mt-3">
                  {branch.tenChi}
                </h3>

                <p className="text-xs text-[#ccad8e] mt-2 line-clamp-2">
                  {branch.moTa}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-[#b89574]">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Trưởng chi: <strong className="text-amber-200">{branch.truongChi}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{branch.diaBan}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#3b1713] flex items-center justify-between text-xs">
                <span className="text-amber-300 font-medium">Bấm để xem danh bạ</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Branch Details */}
      {activeBranch && (
        <div className="bg-[#240e0c] rounded-2xl border border-[#52211c] p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#471a16]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h3 className="text-lg sm:text-xl font-bold font-heritage text-amber-200">
                  {activeBranch.tenChi}
                </h3>
              </div>
              <p className="text-xs text-[#bfa084] mt-1">
                Địa bàn cư trú: {activeBranch.diaBan} · Trưởng chi đại diện: <strong className="text-amber-300">{activeBranch.truongChi}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#180806] px-3 py-1.5 rounded-lg border border-[#421713] text-xs">
                <span className="text-[#a6866b]">Tại thế: </span>
                <strong className="text-emerald-400">{livingCount}</strong>
                <span className="mx-2 text-[#4d1f1a]">|</span>
                <span className="text-[#a6866b]">Đã mất: </span>
                <strong className="text-amber-400">{deceasedCount}</strong>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(activeBranch)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3b1512] hover:bg-[#521f1a] text-amber-300 text-xs font-semibold border border-[#59221d] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa chi này</span>
                  </button>
                  <button
                    onClick={() => handleDelete(activeBranch)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#381412] hover:bg-red-950 text-red-300 text-xs font-semibold border border-red-900/60 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1b0a08] p-4 rounded-xl border border-[#3d1714] text-xs text-[#d6b799] leading-relaxed">
            <h4 className="font-semibold text-amber-300 mb-1">Nhiệm vụ &amp; Truyền thống chi phái:</h4>
            {activeBranch.moTa}
          </div>

          {/* Members in Branch Grid */}
          <div>
            <h4 className="text-sm font-semibold text-amber-300 font-heritage mb-3">
              Danh sách thành viên thuộc {activeBranch.tenChi} ({branchMembers.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {branchMembers.map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className="bg-[#1f0b09] hover:bg-[#331310] border border-[#421814] rounded-lg p-3 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      m.gioiTinh === 'nam' ? 'bg-[#1e2a3a] text-amber-300' : 'bg-[#3b120c] text-rose-300'
                    }`}>
                      {m.hoVaTen.split(' ').slice(-1)[0]?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-amber-100">{m.hoVaTen}</div>
                      <div className="text-[11px] text-[#99795e]">Đời {m.theHe} · {m.conSong ? 'Tại thế' : 'Đã khuất'}</div>
                    </div>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-[#4d1612] to-[#2b0d0a] border-b border-[#5e2520] flex items-center justify-between">
              <h3 className="text-base font-bold font-heritage text-amber-200">
                {editingBranch ? 'Chỉnh sửa Thông tin Chi phái' : 'Thêm Chi phái Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a38062] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-3.5 text-xs text-[#ebd3be]">
              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Tên chi phái <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chi Đệ Tứ (Chi Bốn)"
                  value={formData.tenChi || ''}
                  onChange={(e) => setFormData({ ...formData, tenChi: e.target.value })}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Người đứng đầu (Trưởng chi) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chu Văn Lương"
                  value={formData.truongChi || ''}
                  onChange={(e) => setFormData({ ...formData, truongChi: e.target.value })}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Địa bàn cư trú:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thôn Đông Lãng, Xã Lãng Sơn, Huyện Yên Dũng"
                  value={formData.diaBan || ''}
                  onChange={(e) => setFormData({ ...formData, diaBan: e.target.value })}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Mô tả / Truyền thống chi phái:
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả về đặc điểm, truyền thống nghề nghiệp, nhiệm vụ trong họ..."
                  value={formData.moTa || ''}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#421814] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#381613] text-[#c9a788]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-gradient-to-r from-red-700 to-amber-700 text-amber-100 font-bold"
                >
                  {editingBranch ? 'Cập nhật Chi phái' : 'Lưu Chi phái Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
