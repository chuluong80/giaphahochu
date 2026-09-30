import React, { useState } from 'react';
import { X, Send, Smartphone, Mail, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { SuKienGioTe } from '../types/giapha';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SuKienGioTe | null;
  onConfirmSend: (payload: {
    eventTitle: string;
    eventDate: string;
    channels: 'sms' | 'email' | 'all';
    recipients: string[];
    customMessage: string;
  }) => Promise<void>;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  event,
  onConfirmSend,
}) => {
  const [channel, setChannel] = useState<'all' | 'sms' | 'email'>('all');
  const [customMsg, setCustomMsg] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    'Chi Đại Tôn (Thôn Đông Lãng)',
    'Chi Đệ Nhị (Thôn Tân Mỹ)',
    'Chi Đệ Tam (Thôn Sơn Mới)',
    'Hội đồng Gia tộc & Ban Liên lạc',
  ]);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const defaultMessage = `[GIA PHẢ HỌ CHU LÃNG SƠN] Kính mời đại diện gia đình và con cháu họ Chu tề tựu về Nhà thờ Đại Tôn Họ Chu (xã Lãng Sơn, Yên Dũng, Bắc Giang) tham dự: ${event.tenLe}. Thời gian: ${event.ngayAmLich} (Dương lịch: ${event.ngayDuongLichNamNay}). Trân trọng kính báo!`;

  const handleSend = async () => {
    setSending(true);
    try {
      await onConfirmSend({
        eventTitle: event.tenLe,
        eventDate: `${event.ngayAmLich} (${event.ngayDuongLichNamNay})`,
        channels: channel,
        recipients: selectedGroups,
        customMessage: customMsg || defaultMessage,
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1800);
    } catch (e: any) {
      alert('Lỗi gửi thông báo: ' + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4d1612] to-[#2d0d0a] border-b border-[#5e2520] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#691f19] border border-amber-500/50 text-amber-300">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heritage text-amber-200">
                Gửi thông báo Giỗ chạp Dòng tộc
              </h3>
              <p className="text-xs text-[#c9a788]">
                Tự động gửi qua tin nhắn SMS &amp; Thư điện tử Email
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-[#ebd3be]">
          {sentSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-amber-200">
                Đã phát thông báo thành công!
              </h4>
              <p className="text-xs text-[#d1b297]">
                Thông điệp đã được chuyển tới toàn thể bà con tộc nhân theo các kênh đã chọn.
              </p>
            </div>
          ) : (
            <>
              {/* Event Summary */}
              <div className="p-3 bg-[#180806] rounded-xl border border-[#421814] space-y-1">
                <span className="text-[10px] text-amber-400 font-semibold uppercase">Sự kiện:</span>
                <div className="text-sm font-bold text-amber-100">{event.tenLe}</div>
                <div className="text-[#a8886e]">
                  Ngày: <strong className="text-amber-300">{event.ngayAmLich}</strong> (Dương lịch: {event.ngayDuongLichNamNay})
                </div>
              </div>

              {/* Delivery Channels */}
              <div>
                <label className="block text-amber-300 font-semibold mb-2">
                  Kênh gửi thông báo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('all')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      channel === 'all'
                        ? 'bg-[#7a221b] border-amber-500 text-amber-100 font-bold'
                        : 'bg-[#1b0907] border-[#421814] text-[#b89574]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span>Cả SMS &amp; Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      channel === 'sms'
                        ? 'bg-[#7a221b] border-amber-500 text-amber-100 font-bold'
                        : 'bg-[#1b0907] border-[#421814] text-[#b89574]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Tin nhắn SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      channel === 'email'
                        ? 'bg-[#7a221b] border-amber-500 text-amber-100 font-bold'
                        : 'bg-[#1b0907] border-[#421814] text-[#b89574]'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Hòm thư Email</span>
                  </button>
                </div>
              </div>

              {/* Recipients Groups */}
              <div>
                <label className="block text-amber-300 font-semibold mb-2 flex items-center justify-between">
                  <span>Đối tượng nhận thông báo:</span>
                  <span className="text-[11px] text-[#9c7c61]">Toàn bộ thành viên họ Chu</span>
                </label>
                <div className="space-y-1.5 bg-[#180806] p-3 rounded-xl border border-[#421814]">
                  {selectedGroups.map(grp => (
                    <div key={grp} className="flex items-center gap-2 text-xs text-[#ddbe9f]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{grp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Nội dung thông điệp gửi:
                </label>
                <textarea
                  rows={4}
                  value={customMsg || defaultMessage}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#451915] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#381613] hover:bg-[#4d1f1b] text-[#edd5c0] transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleSend}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-700 via-amber-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-amber-100 font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{sending ? 'Đang phát thông báo...' : 'Phát thông báo ngay'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
