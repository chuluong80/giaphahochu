import React, { useState, useEffect } from 'react';
import { X, Save, User, Heart, Calendar, MapPin, Briefcase, Award, Shield, FileText } from 'lucide-react';
import { ThanhVien, ChiPhai } from '../types/giapha';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ThanhVien | null;
  allMembers: ThanhVien[];
  branches: ChiPhai[];
  onSave: (memberData: ThanhVien) => void;
  isReadOnly?: boolean;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  member,
  allMembers,
  branches,
  onSave,
  isReadOnly = false,
}) => {
  const [formData, setFormData] = useState<Partial<ThanhVien>>({
    hoVaTen: '',
    tenThuongGoi: '',
    gioiTinh: 'nam',
    theHe: 1,
    chiPhaiId: branches[0]?.id || 'chi-1',
    thuTuTrongGiaDinh: 1,
    conSong: true,
    voChongIds: [],
  });

  useEffect(() => {
    if (member) {
      setFormData({ ...member });
    } else {
      setFormData({
        id: 'chu-' + Date.now().toString(36),
        hoVaTen: '',
        tenThuongGoi: '',
        gioiTinh: 'nam',
        theHe: 6,
        chiPhaiId: branches[0]?.id || 'chi-1',
        thuTuTrongGiaDinh: 1,
        conSong: true,
        namSinh: 1980,
        voChongIds: [],
      });
    }
  }, [member, branches]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hoVaTen?.trim()) {
      alert('Vui lòng nhập Họ và tên thành viên');
      return;
    }

    const payload: ThanhVien = {
      id: formData.id || 'chu-' + Date.now().toString(36),
      hoVaTen: formData.hoVaTen.trim(),
      tenThuongGoi: formData.tenThuongGoi?.trim() || undefined,
      gioiTinh: formData.gioiTinh || 'nam',
      theHe: Number(formData.theHe) || 1,
      chiPhaiId: formData.chiPhaiId || 'chi-1',
      chaId: formData.chaId || undefined,
      meId: formData.meId || undefined,
      voChongIds: formData.voChongIds || [],
      thuTuTrongGiaDinh: Number(formData.thuTuTrongGiaDinh) || 1,
      ngaySinh: formData.ngaySinh || undefined,
      namSinh: formData.namSinh ? Number(formData.namSinh) : undefined,
      conSong: formData.conSong ?? true,
      ngayMat: formData.ngayMat || undefined,
      ngayGioAm: formData.ngayGioAm || undefined,
      noiAnTang: formData.noiAnTang || undefined,
      ngheNghiep: formData.ngheNghiep || undefined,
      hocVan: formData.hocVan || undefined,
      diaChiHienTai: formData.diaChiHienTai || undefined,
      soDienThoai: formData.soDienThoai || undefined,
      email: formData.email || undefined,
      ghiChu: formData.ghiChu || undefined,
      danhHieu: formData.danhHieu || undefined,
    };

    onSave(payload);
    onClose();
  };

  // Potential parents (one generation older)
  const potentialParents = allMembers.filter(m => m.id !== formData.id && m.theHe === (formData.theHe || 1) - 1);
  const potentialSpouses = allMembers.filter(m => m.id !== formData.id && m.gioiTinh !== formData.gioiTinh);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4d1612] to-[#300e0a] border-b border-[#5e2520] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#691f19] border border-amber-500/50 text-amber-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heritage text-amber-200">
                {isReadOnly ? 'Hồ sơ Tộc nhân Họ Chu' : member ? 'Chỉnh sửa Thông tin Tộc nhân' : 'Thêm mới Tộc nhân Họ Chu'}
              </h3>
              <p className="text-xs text-[#c9a788]">
                Xã Lãng Sơn, huyện Yên Dũng, Tỉnh Bắc Giang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#b89574] hover:text-white hover:bg-[#471b17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs text-[#ebd2bd]">
          
          {/* Row 1: Họ tên & Tên thường gọi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-300 font-semibold mb-1">
                Họ và tên <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.hoVaTen || ''}
                onChange={(e) => setFormData({ ...formData, hoVaTen: e.target.value })}
                placeholder="Ví dụ: Chu Văn Lương"
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">
                Tên thường gọi / Tên tự / Tự hiệu
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.tenThuongGoi || ''}
                onChange={(e) => setFormData({ ...formData, tenThuongGoi: e.target.value })}
                placeholder="Ví dụ: Cụ Cửu, Bác Cả Lương..."
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>
          </div>

          {/* Row 2: Giới tính, Thế hệ & Chi phái */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Giới tính</label>
              <select
                disabled={isReadOnly}
                value={formData.gioiTinh || 'nam'}
                onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value as any })}
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70 cursor-pointer"
              >
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Thế hệ (Đời)</label>
              <input
                type="number"
                min="1"
                max="25"
                disabled={isReadOnly}
                value={formData.theHe || 1}
                onChange={(e) => setFormData({ ...formData, theHe: Number(e.target.value) })}
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Chi phái</label>
              <select
                disabled={isReadOnly}
                value={formData.chiPhaiId || 'chi-1'}
                onChange={(e) => setFormData({ ...formData, chiPhaiId: e.target.value })}
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70 cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.tenChi}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Cha, Mẹ & Thứ tự sinh */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Thân sinh (Cha)</label>
              <select
                disabled={isReadOnly}
                value={formData.chaId || ''}
                onChange={(e) => setFormData({ ...formData, chaId: e.target.value || undefined })}
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70 cursor-pointer"
              >
                <option value="">-- Không rõ / Thủy tổ --</option>
                {potentialParents.filter(p => p.gioiTinh === 'nam').map(p => (
                  <option key={p.id} value={p.id}>{p.hoVaTen} (Đời {p.theHe})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Thân mẫu (Mẹ)</label>
              <select
                disabled={isReadOnly}
                value={formData.meId || ''}
                onChange={(e) => setFormData({ ...formData, meId: e.target.value || undefined })}
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70 cursor-pointer"
              >
                <option value="">-- Không rõ --</option>
                {potentialParents.filter(p => p.gioiTinh === 'nu').map(p => (
                  <option key={p.id} value={p.id}>{p.hoVaTen} (Đời {p.theHe})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Thứ tự trong anh em</label>
              <input
                type="number"
                min="1"
                max="20"
                disabled={isReadOnly}
                value={formData.thuTuTrongGiaDinh || 1}
                onChange={(e) => setFormData({ ...formData, thuTuTrongGiaDinh: Number(e.target.value) })}
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>
          </div>

          {/* Row 4: Tình trạng sinh tử & Giỗ chạp */}
          <div className="p-3.5 bg-[#1a0806] rounded-xl border border-[#451915] space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-amber-300 font-semibold flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={formData.conSong ?? true}
                  onChange={(e) => setFormData({ ...formData, conSong: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Hiện đang còn sống (Tại thế)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#cfb094] font-medium mb-1">Năm sinh</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.namSinh || ''}
                  onChange={(e) => setFormData({ ...formData, namSinh: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Ví dụ: 1968"
                  className="w-full bg-[#130504] border border-[#421612] rounded px-3 py-1.5 text-xs text-white"
                />
              </div>

              {!formData.conSong && (
                <>
                  <div>
                    <label className="block text-amber-400 font-medium mb-1">Ngày giỗ Âm lịch</label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={formData.ngayGioAm || ''}
                      onChange={(e) => setFormData({ ...formData, ngayGioAm: e.target.value })}
                      placeholder="Ví dụ: 15/01 hoặc 08/03 âm"
                      className="w-full bg-[#130504] border border-[#421612] rounded px-3 py-1.5 text-xs text-amber-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[#cfb094] font-medium mb-1">Nơi an táng / Mộ phần</label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={formData.noiAnTang || ''}
                      onChange={(e) => setFormData({ ...formData, noiAnTang: e.target.value })}
                      placeholder="Ví dụ: Nghĩa trang Núi Chùa, Lãng Sơn"
                      className="w-full bg-[#130504] border border-[#421612] rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 5: Danh hiệu, Nghề nghiệp & Học vấn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-amber-300 font-medium mb-1">Danh hiệu / Tước vị</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.danhHieu || ''}
                onChange={(e) => setFormData({ ...formData, danhHieu: e.target.value })}
                placeholder="Ví dụ: Trưởng tộc, Tiên hiền, Bác sĩ..."
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Nghề nghiệp / Chức vụ</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.ngheNghiep || ''}
                onChange={(e) => setFormData({ ...formData, ngheNghiep: e.target.value })}
                placeholder="Ví dụ: Kỹ sư, Cán bộ, Doanh nhân..."
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Học vấn</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.hocVan || ''}
                onChange={(e) => setFormData({ ...formData, hocVan: e.target.value })}
                placeholder="Ví dụ: Đại học Bách Khoa, Thạc sĩ..."
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>
          </div>

          {/* Row 6: Liên hệ & Địa chỉ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Số điện thoại</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.soDienThoai || ''}
                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                placeholder="0983123456"
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Email</label>
              <input
                type="email"
                disabled={isReadOnly}
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-[#cfb094] font-medium mb-1">Địa chỉ hiện tại</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.diaChiHienTai || ''}
                onChange={(e) => setFormData({ ...formData, diaChiHienTai: e.target.value })}
                placeholder="Thôn Đông, Xã Lãng Sơn..."
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
              />
            </div>
          </div>

          {/* Row 7: Ghi chú & Tiểu sử */}
          <div>
            <label className="block text-[#cfb094] font-medium mb-1">Tiểu sử &amp; Ghi chú dòng họ</label>
            <textarea
              rows={3}
              disabled={isReadOnly}
              value={formData.ghiChu || ''}
              onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
              placeholder="Ghi lại công đức, thành tích học tập, cống hiến cho quê hương Lãng Sơn, Yên Dũng..."
              className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-70 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#4f1e1a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#381613] hover:bg-[#4d1f1b] text-[#edd5c0] transition-colors cursor-pointer"
            >
              {isReadOnly ? 'Đóng' : 'Hủy bỏ'}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-red-700 via-amber-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-amber-100 font-bold shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Lưu thông tin</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
