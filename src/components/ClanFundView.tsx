import React, { useState } from 'react';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Calendar, 
  UserCheck, 
  FileText, 
  Filter,
  CheckCircle,
  Receipt
} from 'lucide-react';
import { QuyDongHoData, GiaoDichQuy, TaiKhoanNguoiDung } from '../types/giapha';

interface ClanFundViewProps {
  fundData: QuyDongHoData;
  currentUser: TaiKhoanNguoiDung | null;
  onAddTransaction: (transaction: GiaoDichQuy) => void;
}

export const ClanFundView: React.FC<ClanFundViewProps> = ({
  fundData,
  currentUser,
  onAddTransaction,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'thu' | 'chi'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<'thu' | 'chi'>('thu');
  const [newAmount, setNewAmount] = useState('');
  const [newPayer, setNewPayer] = useState('');
  const [newContent, setNewContent] = useState('');

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  const totalIncome = fundData.danhSachGiaoDich
    .filter(g => g.loai === 'thu')
    .reduce((acc, curr) => acc + curr.soTien, 0);

  const totalExpense = fundData.danhSachGiaoDich
    .filter(g => g.loai === 'chi')
    .reduce((acc, curr) => acc + curr.soTien, 0);

  const filteredTransactions = fundData.danhSachGiaoDich.filter(g => {
    if (filterType === 'all') return true;
    return g.loai === filterType;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (!newPayer.trim() || !newContent.trim()) {
      alert('Vui lòng điền đầy đủ người giao dịch và nội dung');
      return;
    }

    const newTx: GiaoDichQuy = {
      id: 'gd-' + Date.now(),
      ngay: new Date().toISOString().slice(0, 10),
      loai: newType,
      soTien: amount,
      nguoiGiaoDich: newPayer.trim(),
      noiDung: newContent.trim(),
      nguoiPheDuyet: currentUser?.hoTen || 'Chu Văn Lương',
    };

    onAddTransaction(newTx);
    setShowAddModal(false);
    setNewAmount('');
    setNewPayer('');
    setNewContent('');
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4d1f1b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-amber-200">
            Quỹ Dòng họ Chu Lãng Sơn
          </h2>
          <p className="text-xs text-[#c4a182] mt-1">
            Quản lý thu chi minh bạch: Phụng sự hương hỏa từ đường, lễ giỗ hiệp tế và khuyến học khuyến tài
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-semibold text-xs rounded-lg shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Thêm khoản thu / chi</span>
          </button>
        )}
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Current Balance */}
        <div className="bg-gradient-to-br from-[#3b120e] to-[#220a08] p-5 rounded-2xl border border-amber-500/50 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-amber-300/90 uppercase tracking-wider">
              Số dư Quỹ Họ hiện tại
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-heritage text-amber-200 mt-1 tabular-nums">
              {formatVnd(fundData.soDuHienTai)}
            </div>
            <div className="text-[11px] text-[#a6866b] mt-1">
              Thủ quỹ: Ban Trị sự Đại Tôn · Kiểm toán công khai
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Coins className="w-8 h-8" />
          </div>
        </div>

        {/* Card 2: Total Income */}
        <div className="bg-[#240e0c] p-5 rounded-2xl border border-[#4d1f1b] shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-emerald-400/90 uppercase tracking-wider">
              Tổng tiền công đức &amp; đóng góp
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
              {formatVnd(totalIncome)}
            </div>
            <div className="text-[11px] text-[#a6866b] mt-1">
              Từ các chi phái và con cháu xa gần
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Expense */}
        <div className="bg-[#240e0c] p-5 rounded-2xl border border-[#4d1f1b] shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-rose-400/90 uppercase tracking-wider">
              Tổng chi phí giỗ tế &amp; khuyến học
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1 tabular-nums">
              {formatVnd(totalExpense)}
            </div>
            <div className="text-[11px] text-[#a6866b] mt-1">
              Tu bổ từ đường, cỗ lễ, khen thưởng
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Transaction List */}
      <div className="bg-[#240e0c] rounded-2xl border border-[#4d1f1a] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#190806] border-b border-[#3b1713] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-heritage text-amber-200">
              Sổ Nhật ký Thu Chi Quỹ Dòng họ
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-[#250d0a] p-1 rounded-lg border border-[#471a15] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-[#7a221b] text-amber-100 font-semibold' : 'text-[#a38062] hover:text-white'
              }`}
            >
              Tất cả ({fundData.danhSachGiaoDich.length})
            </button>
            <button
              onClick={() => setFilterType('thu')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'thu' ? 'bg-emerald-900 text-emerald-200 font-semibold' : 'text-[#a38062] hover:text-white'
              }`}
            >
              Khoản Thu
            </button>
            <button
              onClick={() => setFilterType('chi')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filterType === 'chi' ? 'bg-rose-900 text-rose-200 font-semibold' : 'text-[#a38062] hover:text-white'
              }`}
            >
              Khoản Chi
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#ebd3bd]">
            <thead className="bg-[#150604] border-b border-[#3b1713] text-[#a8876c] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Ngày ghi nhận</th>
                <th className="py-3 px-3">Loại giao dịch</th>
                <th className="py-3 px-3">Người nộp / thụ hưởng</th>
                <th className="py-3 px-4">Nội dung chi tiết</th>
                <th className="py-3 px-3 text-right">Số tiền (VNĐ)</th>
                <th className="py-3 px-4 text-center">Người phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b1713]">
              {filteredTransactions.map(tx => {
                const isIncome = tx.loai === 'thu';
                return (
                  <tr key={tx.id} className="hover:bg-[#30120f] transition-colors">
                    <td className="py-3 px-4 text-[#a38267] font-mono">{tx.ngay}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                        isIncome ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {isIncome ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {isIncome ? 'Thu / Công đức' : 'Chi dùng'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-amber-200">{tx.nguoiGiaoDich}</td>
                    <td className="py-3 px-4 text-[#cfb095] max-w-xs">{tx.noiDung}</td>
                    <td className={`py-3 px-3 text-right font-bold tabular-nums text-sm ${
                      isIncome ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isIncome ? '+' : '-'}{formatVnd(tx.soTien)}
                    </td>
                    <td className="py-3 px-4 text-center text-[#99795e]">
                      <span className="bg-[#1b0907] px-2 py-0.5 rounded border border-[#421714]">
                        {tx.nguoiPheDuyet}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-[#4d1612] to-[#2b0d0a] border-b border-[#5e2520] flex items-center justify-between">
              <h3 className="text-base font-bold font-heritage text-amber-200">
                Ghi nhận Giao dịch Quỹ Họ Chu
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#a38062] hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs text-[#ebd3be]">
              <div>
                <label className="block text-amber-300 font-semibold mb-1">Loại giao dịch:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('thu')}
                    className={`py-2 rounded-lg border text-center font-bold transition-colors cursor-pointer ${
                      newType === 'thu' ? 'bg-emerald-900 border-emerald-500 text-emerald-100' : 'bg-[#180806] border-[#421814] text-[#a38062]'
                    }`}
                  >
                    + Thu / Công đức
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('chi')}
                    className={`py-2 rounded-lg border text-center font-bold transition-colors cursor-pointer ${
                      newType === 'chi' ? 'bg-rose-900 border-rose-500 text-rose-100' : 'bg-[#180806] border-[#421814] text-[#a38062]'
                    }`}
                  >
                    - Chi tiêu / Hậu sự
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Số tiền (VNĐ):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  placeholder="Ví dụ: 5000000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">
                  Người đóng góp / Ban nhận chi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chu Doãn Cường hoặc Ban Khánh tiết"
                  value={newPayer}
                  onChange={(e) => setNewPayer(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Nội dung chi tiết:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Công đức tu bổ sân từ đường, cúng giỗ cụ Thủy Tổ..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#421814] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-[#381613] text-[#c9a788]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-gradient-to-r from-red-700 to-amber-700 text-amber-100 font-bold"
                >
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
