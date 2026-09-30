import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GenealogyTree } from './components/GenealogyTree';
import { MemberList } from './components/MemberList';
import { MemberModal } from './components/MemberModal';
import { BranchView } from './components/BranchView';
import { CeremonyCalendar } from './components/CeremonyCalendar';
import { StatisticsView } from './components/StatisticsView';
import { ClanFundView } from './components/ClanFundView';
import { AccountManager } from './components/AccountManager';
import { ClanInfoView } from './components/ClanInfoView';
import { XmlBackupManager } from './components/XmlBackupManager';
import { NotificationModal } from './components/NotificationModal';
import { LoginModal } from './components/LoginModal';

import { 
  GiaPhaData, 
  ThanhVien, 
  ChiPhai, 
  SuKienGioTe, 
  GiaoDichQuy, 
  TaiKhoanNguoiDung 
} from './types/giapha';
import { 
  fetchGiaPhaData, 
  saveGiaPhaData, 
  loginUser, 
  sendCeremonyNotification 
} from './services/api';
import { exportGiaPhaToPdf } from './utils/pdfExport';
import { Bell, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function App() {
  // Default tab required by user: Cây phả hệ
  const [currentTab, setCurrentTab] = useState<string>('tree');

  // Application Data
  const [data, setData] = useState<GiaPhaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication: default admin user logged in or guest
  const [currentUser, setCurrentUser] = useState<TaiKhoanNguoiDung | null>({
    id: 'usr-01',
    username: 'chuluong',
    hoTen: 'Chu Văn Lương',
    role: 'admin',
    email: 'chuluong.langson@gmail.com',
    sdt: '0983123456',
    ngayTao: '2026-01-01',
    trangThai: 'active',
  });

  // Modals state
  const [editingMember, setEditingMember] = useState<ThanhVien | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState<boolean>(false);

  const [isXmlBackupOpen, setIsXmlBackupOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [selectedNotifyEvent, setSelectedNotifyEvent] = useState<SuKienGioTe | null>(null);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);

  // In-app alert notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pushReminderDismissed, setPushReminderDismissed] = useState<boolean>(false);

  // Load Initial XML Data
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const result = await fetchGiaPhaData();
        setData(result);
      } catch (err: any) {
        console.error('Lỗi nạp dữ liệu:', err);
        setError(err.message || 'Không thể tải cơ sở dữ liệu gia phả');
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper to commit changes to XML database
  const commitDataChanges = async (newData: GiaPhaData, actionNote: string) => {
    // Add audit log
    const logEntry = {
      id: 'log-' + Date.now(),
      thoiGian: new Date().toISOString(),
      nguoiThucHien: currentUser?.username || 'khach',
      hanhDong: actionNote,
      chiTiet: `Cập nhật bởi ${currentUser?.hoTen || 'Khách'}`,
    };
    newData.nhatKyThaoTac = [logEntry, ...(newData.nhatKyThaoTac || [])];

    setData(newData);
    showToast(`Đang lưu vào CSDL XML: ${actionNote}...`);

    try {
      const res = await saveGiaPhaData(newData);
      showToast(res.message || 'Đã lưu vĩnh viễn vào cơ sở dữ liệu XML!');
    } catch (e: any) {
      showToast('Lỗi lưu CSDL XML: ' + e.message);
    }
  };

  // Member CRUD handlers (Admin only)
  const handleSaveMember = (member: ThanhVien) => {
    if (!data) return;
    if (currentUser?.role !== 'admin') {
      alert('Chỉ tài khoản Quản trị viên (Chu Văn Lương) mới có quyền lưu chỉnh sửa gia phả');
      return;
    }

    const existingIdx = data.danhSachThanhVien.findIndex(m => m.id === member.id);
    let updatedMembers = [...data.danhSachThanhVien];

    if (existingIdx >= 0) {
      updatedMembers[existingIdx] = member;
    } else {
      updatedMembers.push(member);
    }

    // Auto-link spouse reciprocal if applicable
    if (member.voChongIds && member.voChongIds.length > 0) {
      member.voChongIds.forEach(spouseId => {
        const spouseIdx = updatedMembers.findIndex(m => m.id === spouseId);
        if (spouseIdx >= 0) {
          const spouse = { ...updatedMembers[spouseIdx] };
          const sVoChong = spouse.voChongIds ? [...spouse.voChongIds] : [];
          if (!sVoChong.includes(member.id)) {
            sVoChong.push(member.id);
            spouse.voChongIds = sVoChong;
            updatedMembers[spouseIdx] = spouse;
          }
        }
      });
    }

    const updatedData: GiaPhaData = {
      ...data,
      danhSachThanhVien: updatedMembers,
    };

    commitDataChanges(updatedData, existingIdx >= 0 ? `Cập nhật tộc nhân ${member.hoVaTen}` : `Thêm tộc nhân mới ${member.hoVaTen}`);
  };

  const handleDeleteMember = (memberId: string) => {
    if (!data) return;
    if (currentUser?.role !== 'admin') {
      alert('Chỉ tài khoản Quản trị viên mới có quyền xóa thành viên');
      return;
    }

    const target = data.danhSachThanhVien.find(m => m.id === memberId);
    const updatedMembers = data.danhSachThanhVien.filter(m => m.id !== memberId);

    const updatedData: GiaPhaData = {
      ...data,
      danhSachThanhVien: updatedMembers,
    };

    commitDataChanges(updatedData, `Xóa thành viên ${target?.hoVaTen || memberId}`);
  };

  // Add child helper
  const handleAddChild = (parent: ThanhVien) => {
    const newChild: Partial<ThanhVien> = {
      id: 'chu-' + Date.now().toString(36),
      hoVaTen: '',
      theHe: parent.theHe + 1,
      chiPhaiId: parent.chiPhaiId,
      chaId: parent.gioiTinh === 'nam' ? parent.id : undefined,
      meId: parent.gioiTinh === 'nu' ? parent.id : undefined,
      gioiTinh: 'nam',
      conSong: true,
      thuTuTrongGiaDinh: 1,
      namSinh: parent.namSinh ? parent.namSinh + 25 : undefined,
    };
    setEditingMember(newChild as ThanhVien);
    setIsReadOnlyModal(false);
    setIsMemberModalOpen(true);
  };

  // Add spouse helper
  const handleAddSpouse = (member: ThanhVien) => {
    const newSpouse: Partial<ThanhVien> = {
      id: 'chu-' + Date.now().toString(36),
      hoVaTen: '',
      theHe: member.theHe,
      chiPhaiId: member.chiPhaiId,
      voChongIds: [member.id],
      gioiTinh: member.gioiTinh === 'nam' ? 'nu' : 'nam',
      conSong: true,
      thuTuTrongGiaDinh: 1,
      namSinh: member.namSinh || undefined,
    };
    setEditingMember(newSpouse as ThanhVien);
    setIsReadOnlyModal(false);
    setIsMemberModalOpen(true);
  };

  // Fund transaction handler
  const handleAddTransaction = (transaction: GiaoDichQuy) => {
    if (!data) return;
    const newBalance = transaction.loai === 'thu'
      ? data.quyDongHo.soDuHienTai + transaction.soTien
      : data.quyDongHo.soDuHienTai - transaction.soTien;

    const updatedData: GiaPhaData = {
      ...data,
      quyDongHo: {
        soDuHienTai: newBalance,
        danhSachGiaoDich: [transaction, ...data.quyDongHo.danhSachGiaoDich],
      },
    };

    commitDataChanges(updatedData, `Giao dịch Quỹ họ: ${transaction.loai === 'thu' ? 'Thu' : 'Chi'} ${transaction.soTien.toLocaleString('vi-VN')} VNĐ`);
  };

  // Branch CRUD handlers
  const handleSaveBranch = (branch: ChiPhai) => {
    if (!data) return;
    if (currentUser?.role !== 'admin') {
      alert('Chỉ tài khoản Quản trị viên mới có quyền cập nhật chi phái');
      return;
    }
    const idx = data.danhSachChiPhai.findIndex(b => b.id === branch.id);
    let updatedBranches = [...data.danhSachChiPhai];
    if (idx >= 0) {
      updatedBranches[idx] = branch;
    } else {
      updatedBranches.push(branch);
    }
    commitDataChanges({ ...data, danhSachChiPhai: updatedBranches }, idx >= 0 ? `Cập nhật chi phái ${branch.tenChi}` : `Thêm mới chi phái ${branch.tenChi}`);
  };

  const handleDeleteBranch = (branchId: string) => {
    if (!data) return;
    if (currentUser?.role !== 'admin') {
      alert('Chỉ tài khoản Quản trị viên mới có quyền xóa chi phái');
      return;
    }
    const target = data.danhSachChiPhai.find(b => b.id === branchId);
    const updatedBranches = data.danhSachChiPhai.filter(b => b.id !== branchId);
    commitDataChanges({ ...data, danhSachChiPhai: updatedBranches }, `Xóa chi phái ${target?.tenChi || branchId}`);
  };

  // Ceremony Event CRUD handlers
  const handleSaveEvent = (evt: SuKienGioTe) => {
    if (!data) return;
    if (currentUser?.role !== 'admin') {
      alert('Chỉ tài khoản Quản trị viên mới có quyền cập nhật lịch giỗ tế');
      return;
    }
    const idx = data.lichGioTe.findIndex(e => e.id === evt.id);
    let updatedEvents = [...data.lichGioTe];
    if (idx >= 0) {
      updatedEvents[idx] = evt;
    } else {
      updatedEvents.push(evt);
    }
    commitDataChanges({ ...data, lichGioTe: updatedEvents }, idx >= 0 ? `Cập nhật sự kiện giỗ ${evt.tenLe}` : `Thêm sự kiện giỗ tế ${evt.tenLe}`);
  };

  const handleDeleteEvent = (evtId: string) => {
    if (!data) return;
    if (currentUser?.role !== 'admin') {
      alert('Chỉ tài khoản Quản trị viên mới có quyền xóa sự kiện giỗ tế');
      return;
    }
    const target = data.lichGioTe.find(e => e.id === evtId);
    const updatedEvents = data.lichGioTe.filter(e => e.id !== evtId);
    commitDataChanges({ ...data, lichGioTe: updatedEvents }, `Xóa sự kiện giỗ tế ${target?.tenLe || evtId}`);
  };

  // Account RBAC handler
  const handleUpdateAccounts = (updatedList: TaiKhoanNguoiDung[]) => {
    if (!data) return;
    const updatedData: GiaPhaData = {
      ...data,
      danhSachTaiKhoan: updatedList,
    };
    commitDataChanges(updatedData, 'Cập nhật danh sách tài khoản & phân quyền');
  };

  // Auth login handler
  const handleLogin = async (username: string, pass: string) => {
    const user = await loginUser(username, pass);
    setCurrentUser(user);
    showToast(`Chào mừng ${user.hoTen} (${user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'})!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Đã đăng xuất khỏi hệ thống');
  };

  // Ceremony notification sender
  const handleSendNotification = (event: SuKienGioTe) => {
    setSelectedNotifyEvent(event);
    setIsNotifyModalOpen(true);
  };

  const handleConfirmNotificationSend = async (payload: any) => {
    await sendCeremonyNotification(payload);
    if (data && selectedNotifyEvent) {
      const updatedEvents = data.lichGioTe.map(e => {
        if (e.id === selectedNotifyEvent.id) {
          return { ...e, daGuiThongBao: true };
        }
        return e;
      });
      const updatedData = { ...data, lichGioTe: updatedEvents };
      commitDataChanges(updatedData, `Đã gửi thông báo giỗ: ${selectedNotifyEvent.tenLe}`);
    }
  };

  // Export PDF
  const handleExportPdf = () => {
    if (!data) return;
    showToast('Đang tạo và tải tệp PDF Gia phả Dòng họ Chu...');
    exportGiaPhaToPdf(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1b0a08] text-amber-200 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-amber-600/30 border-t-amber-500 animate-spin"></div>
        <p className="font-heritage text-lg font-bold tracking-wide">
          ĐANG TẢI CƠ SỞ DỮ LIỆU GIA PHẢ HỌ CHU (XML)...
        </p>
        <p className="text-xs text-[#b89574]">
          Xã Lãng Sơn, huyện Yên Dũng, Tỉnh Bắc Giang
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#1b0a08] text-amber-200 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold font-heritage">Lỗi tải cơ sở dữ liệu gia phả</h2>
        <p className="text-xs text-red-300 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-lg text-xs font-semibold"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  // Find upcoming event for push notification banner
  const nextEvent = data.lichGioTe[0];

  return (
    <div className="min-h-screen bg-[#170908] text-[#f7f2e8] flex flex-col selection:bg-[#922e23] selection:text-white">
      
      {/* Header with Circular CHU GIA logo & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onExportPdf={handleExportPdf}
        onOpenXmlBackup={() => setIsXmlBackupOpen(true)}
        onOpenNotificationCenter={() => setCurrentTab('calendar')}
        upcomingEventsCount={data.lichGioTe.filter(e => !e.daGuiThongBao).length}
      />

      {/* Real-time Push Notification Banner (Tích hợp thông báo đẩy nhắc nhở sự kiện giỗ chạp dòng họ) */}
      {!pushReminderDismissed && nextEvent && (
        <div className="bg-gradient-to-r from-[#571913] via-[#7d241c] to-[#45120e] border-b border-amber-600/50 py-2.5 px-4 text-xs shadow-lg animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
              </span>
              <div className="truncate">
                <strong className="text-amber-200 uppercase font-semibold mr-1.5">[NHẮC NHỞ GIỖ CHẠP]</strong>
                <span className="text-amber-100 font-medium">{nextEvent.tenLe}</span>
                <span className="text-[#fadfc5] ml-2 hidden sm:inline">
                  — Ngày âm: <strong>{nextEvent.ngayAmLich}</strong> tại {nextEvent.diaDiem}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedNotifyEvent(nextEvent);
                  setIsNotifyModalOpen(true);
                }}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded text-[11px] shadow transition-colors cursor-pointer"
              >
                Gửi SMS/Email
              </button>
              <button
                onClick={() => setPushReminderDismissed(true)}
                title="Đóng thông báo"
                className="text-amber-300/80 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Box */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2d100d] border border-amber-500/80 text-amber-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area: Default is Cây phả hệ (GenealogyTree) */}
      <main className="flex-1 w-full">
        {currentTab === 'tree' && (
          <GenealogyTree
            members={data.danhSachThanhVien}
            branches={data.danhSachChiPhai}
            currentUser={currentUser}
            onSelectMember={(m) => {
              setEditingMember(m);
              setIsReadOnlyModal(true);
              setIsMemberModalOpen(true);
            }}
            onAddChild={handleAddChild}
            onAddSpouse={handleAddSpouse}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsReadOnlyModal(false);
              setIsMemberModalOpen(true);
            }}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {currentTab === 'members' && (
          <MemberList
            members={data.danhSachThanhVien}
            branches={data.danhSachChiPhai}
            currentUser={currentUser}
            onSelectMember={(m) => {
              setEditingMember(m);
              setIsReadOnlyModal(true);
              setIsMemberModalOpen(true);
            }}
            onAddNewMember={() => {
              setEditingMember(null);
              setIsReadOnlyModal(false);
              setIsMemberModalOpen(true);
            }}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsReadOnlyModal(false);
              setIsMemberModalOpen(true);
            }}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {currentTab === 'branches' && (
          <BranchView
            branches={data.danhSachChiPhai}
            members={data.danhSachThanhVien}
            currentUser={currentUser}
            onSelectMember={(m) => {
              setEditingMember(m);
              setIsReadOnlyModal(true);
              setIsMemberModalOpen(true);
            }}
            onSaveBranch={handleSaveBranch}
            onDeleteBranch={handleDeleteBranch}
          />
        )}

        {currentTab === 'calendar' && (
          <CeremonyCalendar
            events={data.lichGioTe}
            currentUser={currentUser}
            onSendNotification={handleSendNotification}
            onSaveEvent={handleSaveEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {currentTab === 'statistics' && (
          <StatisticsView
            members={data.danhSachThanhVien}
            branches={data.danhSachChiPhai}
            onExportReport={handleExportPdf}
          />
        )}

        {currentTab === 'fund' && (
          <ClanFundView
            fundData={data.quyDongHo}
            currentUser={currentUser}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {currentTab === 'accounts' && (
          <AccountManager
            accounts={data.danhSachTaiKhoan}
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onUpdateAccounts={handleUpdateAccounts}
          />
        )}

        {currentTab === 'info' && (
          <ClanInfoView
            info={data.thongTinChung}
            branches={data.danhSachChiPhai}
          />
        )}
      </main>

      {/* Member Profile / Edit Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        member={editingMember}
        allMembers={data.danhSachThanhVien}
        branches={data.danhSachChiPhai}
        onSave={handleSaveMember}
        isReadOnly={isReadOnlyModal}
      />

      {/* XML Database & Cloud Backup Modal */}
      <XmlBackupManager
        isOpen={isXmlBackupOpen}
        onClose={() => setIsXmlBackupOpen(false)}
        data={data}
        onDataRestored={(restored) => {
          setData(restored);
          showToast('Đã khôi phục thành công cơ sở dữ liệu XML!');
        }}
        isAdmin={currentUser?.role === 'admin'}
      />

      {/* Notification SMS/Email Modal */}
      <NotificationModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        event={selectedNotifyEvent}
        onConfirmSend={handleConfirmNotificationSend}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Footer with Copyright: Chu Văn Lương */}
      <Footer />
    </div>
  );
}
