import React, { useState } from 'react';
import { 
  CalendarDays, 
  Send, 
  Bell, 
  CheckCircle, 
  Clock, 
  MapPin, 
  UserCheck, 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2,
  Mail,
  Smartphone,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { SuKienGioTe, TaiKhoanNguoiDung } from '../types/giapha';

interface CeremonyCalendarProps {
  events: SuKienGioTe[];
  currentUser: TaiKhoanNguoiDung | null;
  onSendNotification: (event: SuKienGioTe) => void;
  onSaveEvent: (event: SuKienGioTe) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CeremonyCalendar: React.FC<CeremonyCalendarProps> = ({
  events,
  currentUser,
  onSendNotification,
  onSaveEvent,
  onDeleteEvent,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gio_to' | 'tao_mo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SuKienGioTe | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SuKienGioTe>>({
    tenLe: '',
    loaiSuKien: 'gio_to',
    ngayAmLich: '',
    ngayDuongLichNamNay: '',
    diaDiem: 'Nhà thờ Đại Tôn họ Chu, Thôn Đông Lãng, Xã Lãng Sơn',
    nguoiChuTri: 'Chu Văn Lương (Trưởng Tộc)',
    noiDung: '',
    nhacNhoTruocNgay: 7,
    daGuiThongBao: false,
  });

  const isAdmin = currentUser?.role === 'admin';

  const filteredEvents = events.filter(e => {
    if (selectedFilter === 'all') return true;
    return e.loaiSuKien === selectedFilter;
  });

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      id: 'sk-' + Date.now().toString(36),
      tenLe: '',
      loaiSuKien: 'gio_to',
      ngayAmLich: '',
      ngayDuongLichNamNay: new Date().toISOString().slice(0, 10),
      diaDiem: 'Nhà thờ Đại Tôn họ Chu, Thôn Đông Lãng, Xã Lãng Sơn, Yên Dũng',
      nguoiChuTri: currentUser?.hoTen || 'Chu Văn Lương',
      noiDung: '',
      nhacNhoTruocNgay: 7,
      daGuiThongBao: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: SuKienGioTe) => {
    setEditingEvent(evt);
    setFormData({ ...evt });
    setIsModalOpen(true);
  };

  const handleDelete = (evt: SuKienGioTe) => {
    if (!isAdmin) return;
    if (confirm(`Bạn có chắc chắn muốn xóa sự kiện giỗ tế "${evt.tenLe}"?`)) {
      onDeleteEvent(evt.id);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenLe?.trim() || !formData.ngayAmLich?.trim()) {
      alert('Vui lòng nhập tên ngày lễ và ngày âm lịch');
      return;
    }

    const payload: SuKienGioTe = {
      id: formData.id || 'sk-' + Date.now().toString(36),
      tenLe: formData.tenLe.trim(),
      loaiSuKien: formData.loaiSuKien || 'gio_to',
      ngayAmLich: formData.ngayAmLich.trim(),
      ngayDuongLichNamNay: formData.ngayDuongLichNamNay || new Date().toISOString().slice(0, 10),
      diaDiem: formData.diaDiem?.trim() || 'Nhà thờ họ Chu',
      nguoiChuTri: formData.nguoiChuTri?.trim() || 'Trưởng tộc họ Chu',
      noiDung: formData.noiDung?.trim() || 'Lễ tưởng niệm tiên tổ dòng họ Chu',
      nhacNhoTruocNgay: Number(formData.nhacNhoTruocNgay) || 7,
      daGuiThongBao: formData.daGuiThongBao || false,
    };

    onSaveEvent(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4d1f1b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-amber-200">
            Lịch Giỗ tế &amp; Nghi lễ Dòng họ Chu
          </h2>
          <p className="text-xs text-[#c7a485] mt-1">
            Theo dõi ngày giỗ tiên tổ, hiệp tế xuân thu, thanh minh tảo mộ và gửi thông báo tự động qua Email/SMS
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#1f0b09] p-1 rounded-lg border border-[#451915]">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                selectedFilter === 'all' ? 'bg-[#7a211a] text-amber-100 font-semibold' : 'text-[#b89574] hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedFilter('gio_to')}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                selectedFilter === 'gio_to' ? 'bg-[#7a211a] text-amber-100 font-semibold' : 'text-[#b89574] hover:text-white'
              }`}
            >
              Giỗ tổ &amp; Đại lễ
            </button>
            <button
              onClick={() => setSelectedFilter('tao_mo')}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                selectedFilter === 'tao_mo' ? 'bg-[#7a211a] text-amber-100 font-semibold' : 'text-[#b89574] hover:text-white'
              }`}
            >
              Tảo mộ
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-semibold text-xs rounded-lg shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Thêm sự kiện giỗ tế</span>
            </button>
          )}
        </div>
      </div>

      {/* Reminder Banner */}
      <div className="bg-gradient-to-r from-[#4d1612] via-[#3d120e] to-[#240a08] border border-amber-600/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-200">
              Hệ thống cảnh báo và phát thông báo giỗ tế tự động
            </h4>
            <p className="text-xs text-[#ddbca0] mt-0.5 max-w-2xl">
              Hội đồng gia tộc họ Chu tại xã Lãng Sơn thiết lập gửi thông báo nhắc lịch giỗ trước 7 ngày qua tin nhắn SMS và thư điện tử Email cho toàn thể đại diện các chi phái.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 bg-[#1b0806]/80 px-3 py-2 rounded-lg border border-[#52211c]">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Hệ thống SMS/Email tự động: Sẵn sàng</span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          return (
            <div
              key={event.id}
              className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-5 shadow-xl hover:border-amber-500/60 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Event Tag */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#3b1713]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#401612] text-amber-300 font-semibold border border-[#57221d]">
                    {event.loaiSuKien === 'gio_to' ? 'Đại lễ Giỗ Tổ' : event.loaiSuKien === 'tao_mo' ? 'Lễ Tảo mộ' : 'Lễ tế Chi phái'}
                  </span>

                  <div className="flex items-center gap-2">
                    {event.daGuiThongBao ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Đã phát thông báo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ gửi nhắc lịch
                      </span>
                    )}

                    {isAdmin && (
                      <div className="flex items-center gap-1 ml-2 border-l border-[#4a1c18] pl-2">
                        <button
                          onClick={() => handleOpenEdit(event)}
                          title="Sửa sự kiện"
                          className="p-1 text-amber-400 hover:text-white rounded hover:bg-[#3d1613] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          title="Xóa sự kiện"
                          className="p-1 text-red-400 hover:text-white rounded hover:bg-[#3d1613] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Name */}
                <h3 className="text-base sm:text-lg font-bold font-heritage text-amber-100 mt-3">
                  {event.tenLe}
                </h3>

                {/* Date highlight box */}
                <div className="mt-3 grid grid-cols-2 gap-2 bg-[#190806] p-3 rounded-xl border border-[#3d1714]">
                  <div>
                    <div className="text-[10px] text-[#9c7b60] uppercase tracking-wider">Ngày Âm lịch</div>
                    <div className="text-sm font-bold text-amber-300 font-heritage">{event.ngayAmLich}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9c7b60] uppercase tracking-wider">Dương lịch năm nay</div>
                    <div className="text-sm font-bold text-[#f5dfcc]">{event.ngayDuongLichNamNay}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-[#ccad8f]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{event.diaDiem}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Chủ trì: <strong className="text-amber-200">{event.nguoiChuTri}</strong></span>
                  </div>

                  <p className="text-xs text-[#b89574] leading-relaxed pt-1">
                    {event.noiDung}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-4 border-t border-[#3d1714] flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#a38062]">
                  Nhắc trước: {event.nhacNhoTruocNgay} ngày
                </span>

                <button
                  onClick={() => onSendNotification(event)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-semibold text-xs rounded-lg shadow transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gửi SMS &amp; Email</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-[#4d1612] to-[#2b0d0a] border-b border-[#5e2520] flex items-center justify-between">
              <h3 className="text-base font-bold font-heritage text-amber-200">
                {editingEvent ? 'Chỉnh sửa Sự kiện Giỗ tế' : 'Thêm Sự kiện Giỗ tế Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a38062] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-3.5 text-xs text-[#ebd3be]">
              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Tên ngày lễ / giỗ tế <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đại lễ Giỗ Cụ Thủy Tổ Chu Doãn Phúc"
                  value={formData.tenLe || ''}
                  onChange={(e) => setFormData({ ...formData, tenLe: e.target.value })}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">
                    Loại sự kiện:
                  </label>
                  <select
                    value={formData.loaiSuKien || 'gio_to'}
                    onChange={(e) => setFormData({ ...formData, loaiSuKien: e.target.value as any })}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                  >
                    <option value="gio_to">Đại lễ Giỗ Tổ</option>
                    <option value="gio_to_chi">Giỗ tế Chi phái</option>
                    <option value="tao_mo">Tảo mộ Thanh minh</option>
                    <option value="hop_dong_ho">Họp Hội đồng Gia tộc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">
                    Nhắc trước (ngày):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.nhacNhoTruocNgay || 7}
                    onChange={(e) => setFormData({ ...formData, nhacNhoTruocNgay: Number(e.target.value) })}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">
                    Ngày Âm lịch <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 15 tháng Giêng"
                    value={formData.ngayAmLich || ''}
                    onChange={(e) => setFormData({ ...formData, ngayAmLich: e.target.value })}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">
                    Dương lịch năm nay:
                  </label>
                  <input
                    type="date"
                    value={formData.ngayDuongLichNamNay || ''}
                    onChange={(e) => setFormData({ ...formData, ngayDuongLichNamNay: e.target.value })}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Địa điểm:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nhà thờ Đại Tôn họ Chu"
                    value={formData.diaDiem || ''}
                    onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Người chủ trì:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Chu Văn Lương"
                    value={formData.nguoiChuTri || ''}
                    onChange={(e) => setFormData({ ...formData, nguoiChuTri: e.target.value })}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Nội dung chi tiết chương trình:</label>
                <textarea
                  rows={3}
                  placeholder="Kế hoạch dâng hương, cúng lễ, trao thưởng khuyến học..."
                  value={formData.noiDung || ''}
                  onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
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
                  {editingEvent ? 'Cập nhật Sự kiện' : 'Lưu Sự kiện Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
