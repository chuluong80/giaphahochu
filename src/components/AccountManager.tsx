import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  Unlock, 
  UserPlus, 
  Edit2, 
  LogIn, 
  LogOut, 
  Mail, 
  Phone,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { TaiKhoanNguoiDung, UserRole } from '../types/giapha';

interface AccountManagerProps {
  accounts: TaiKhoanNguoiDung[];
  currentUser: TaiKhoanNguoiDung | null;
  onLogin: (username: string, password: string) => Promise<void>;
  onLogout: () => void;
  onUpdateAccounts: (updatedList: TaiKhoanNguoiDung[]) => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({
  accounts,
  currentUser,
  onLogin,
  onLogout,
  onUpdateAccounts,
}) => {
  const [loginUsername, setLoginUsername] = useState('chuluong');
  const [loginPassword, setLoginPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // New account modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newHoTen, setNewHoTen] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('member');
  const [newEmail, setNewEmail] = useState('');
  const [newSdt, setNewSdt] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await onLogin(loginUsername, loginPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (!isAdmin) {
      alert('Chỉ tài khoản Quản trị viên (Chu Văn Lương) mới có quyền phân quyền tài khoản');
      return;
    }
    const updated = accounts.map(acc => {
      if (acc.id === userId) {
        return { ...acc, role: newRole };
      }
      return acc;
    });
    onUpdateAccounts(updated);
  };

  const handleToggleLock = (userId: string) => {
    if (!isAdmin) return;
    const target = accounts.find(a => a.id === userId);
    if (target?.username === 'chuluong') {
      alert('Không thể khóa tài khoản Quản trị viên tối cao');
      return;
    }
    const updated = accounts.map(acc => {
      if (acc.id === userId) {
        return { ...acc, trangThai: (acc.trangThai === 'active' ? 'locked' : 'active') as any };
      }
      return acc;
    });
    onUpdateAccounts(updated);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newUsername.trim() || !newPassword.trim() || !newHoTen.trim()) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }
    if (accounts.some(a => a.username.toLowerCase() === newUsername.toLowerCase())) {
      alert('Tên đăng nhập đã tồn tại trong hệ thống');
      return;
    }

    const newAcc: TaiKhoanNguoiDung = {
      id: 'usr-' + Date.now().toString(36),
      username: newUsername.trim().toLowerCase(),
      password: newPassword,
      hoTen: newHoTen.trim(),
      role: newRole,
      email: newEmail.trim() || `${newUsername}@chugia.langson`,
      sdt: newSdt.trim() || 'Chưa cập nhật',
      ngayTao: new Date().toISOString().slice(0, 10),
      trangThai: 'active',
    };

    onUpdateAccounts([...accounts, newAcc]);
    setShowNewModal(false);
    setNewUsername('');
    setNewPassword('');
    setNewHoTen('');
    setNewEmail('');
    setNewSdt('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4d1f1b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-amber-200">
            Quản lý Tài khoản &amp; Phân quyền Dòng họ Chu
          </h2>
          <p className="text-xs text-[#c4a182] mt-1">
            Bảo mật cơ sở dữ liệu gia phả, phân định quyền hạn Quản trị viên, Ban liên lạc và Tộc nhân
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-semibold text-xs rounded-lg shadow-lg transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>Tạo tài khoản mới</span>
          </button>
        )}
      </div>

      {/* Login Box if not logged in or Quick Switch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Current User Status or Login Box */}
        <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3b1713]">
                <span className="text-xs text-[#a6866b] uppercase tracking-wider font-semibold">
                  Tài khoản đang đăng nhập
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                  Đang hoạt động
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#82241d] border-2 border-amber-500/70 flex items-center justify-center font-bold text-base text-amber-200 shadow">
                  {currentUser.hoTen.split(' ').slice(-1)[0]?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-100">{currentUser.hoTen}</h3>
                  <p className="text-xs text-[#b89574]">@{currentUser.username}</p>
                </div>
              </div>

              <div className="p-3 bg-[#180806] rounded-xl border border-[#3d1714] space-y-2 text-xs text-[#ccad8e]">
                <div className="flex items-center justify-between">
                  <span className="text-[#8c6d52]">Vai trò hệ thống:</span>
                  <span className="font-bold text-amber-300">
                    {currentUser.role === 'admin' ? 'Quản trị viên tối cao (Admin)' : currentUser.role === 'moderator' ? 'Ban Liên Lạc' : 'Tộc nhân'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8c6d52]">Quyền chỉnh sửa gia phả:</span>
                  <span className={`font-semibold ${currentUser.role === 'admin' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentUser.role === 'admin' ? 'Toàn quyền Thêm/Sửa/Xóa' : 'Chỉ xem dữ liệu'}
                  </span>
                </div>
                {currentUser.email && (
                  <div className="flex items-center justify-between truncate">
                    <span className="text-[#8c6d52]">Email:</span>
                    <span className="text-amber-200 truncate">{currentUser.email}</span>
                  </div>
                )}
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#3b1512] hover:bg-[#521f1a] text-red-300 hover:text-white border border-[#52211c] text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất khỏi hệ thống</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#3b1713]">
                <LogIn className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold font-heritage text-amber-200">
                  Đăng nhập Hệ thống Gia phả
                </h3>
              </div>

              <p className="text-xs text-[#b89574]">
                Tài khoản quản trị mặc định: <strong className="text-amber-300">chuluong</strong> / Mật khẩu: <strong className="text-amber-300">Admin@123456</strong>
              </p>

              <form onSubmit={handleLoginForm} className="space-y-3 text-xs">
                {loginError && (
                  <div className="p-2.5 rounded bg-red-950/80 border border-red-800 text-red-200 text-xs">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-amber-300 font-medium mb-1">Tên đăng nhập:</label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="chuluong"
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-medium mb-1">Mật khẩu:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Admin@123456"
                      className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#a38062] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-bold rounded-lg shadow transition-all cursor-pointer"
                >
                  {loginLoading ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Permissions Matrix & Role-Based Access Control list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3b1713]">
              <h3 className="text-base font-bold font-heritage text-amber-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảng Phân quyền &amp; Danh sách Tài khoản ({accounts.length})</span>
              </h3>
              <span className="text-xs text-[#a6866b]">Lưu trữ trực tiếp trong CSDL XML</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#ecd6c3]">
                <thead className="bg-[#180806] border-b border-[#471a16] text-[#bda087] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Tài khoản</th>
                    <th className="py-3 px-3">Họ và tên</th>
                    <th className="py-3 px-3">Vai trò</th>
                    <th className="py-3 px-3">Trạng thái</th>
                    <th className="py-3 px-3">Phân quyền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b1713]">
                  {accounts.map(acc => {
                    const isSuperAdmin = acc.username === 'chuluong';
                    return (
                      <tr key={acc.id} className="hover:bg-[#30120f] transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-amber-300">
                          @{acc.username}
                          {isSuperAdmin && (
                            <span className="ml-1.5 text-[9px] bg-red-950 text-red-300 border border-red-800 px-1 rounded">
                              Chính
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-amber-100">{acc.hoTen}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            acc.role === 'admin'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : acc.role === 'moderator'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-stone-900 text-stone-300 border border-stone-800'
                          }`}>
                            {acc.role === 'admin' ? 'Quản trị viên' : acc.role === 'moderator' ? 'Ban Liên Lạc' : 'Tộc nhân'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            disabled={!isAdmin || isSuperAdmin}
                            onClick={() => handleToggleLock(acc.id)}
                            className={`flex items-center gap-1 text-[11px] ${
                              acc.trangThai === 'active' ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {acc.trangThai === 'active' ? (
                              <>
                                <Unlock className="w-3 h-3" />
                                <span>Hoạt động</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Tạm khóa</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          {isAdmin && !isSuperAdmin ? (
                            <select
                              value={acc.role}
                              onChange={(e) => handleRoleChange(acc.id, e.target.value as UserRole)}
                              className="bg-[#180806] border border-[#471a16] rounded px-2 py-1 text-xs text-amber-200 cursor-pointer"
                            >
                              <option value="member">Tộc nhân (Xem)</option>
                              <option value="moderator">Ban liên lạc</option>
                              <option value="admin">Quản trị viên</option>
                            </select>
                          ) : (
                            <span className="text-[#8c6d52] italic text-[11px]">
                              {isSuperAdmin ? 'Cố định' : 'Chỉ Admin'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Account Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-[#4d1612] to-[#2b0d0a] border-b border-[#5e2520] flex items-center justify-between">
              <h3 className="text-base font-bold font-heritage text-amber-200">
                Thêm Tài khoản Tộc nhân Mới
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-[#a38062] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-5 space-y-3.5 text-xs text-[#ebd3be]">
              <div>
                <label className="block text-amber-300 font-semibold mb-1">Tên đăng nhập:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: chucuong, chuminh..."
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Mật khẩu:</label>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Họ và tên thành viên:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chu Doãn Cường"
                  value={newHoTen}
                  onChange={(e) => setNewHoTen(e.target.value)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-amber-300 font-semibold mb-1">Phân quyền vai trò:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-3 py-2 text-white"
                >
                  <option value="member">Tộc nhân (Chỉ xem gia phả)</option>
                  <option value="moderator">Ban Liên Lạc (Xem &amp; Góp ý)</option>
                  <option value="admin">Quản trị viên (Toàn quyền Sửa/Xóa)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#cfb094] mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    placeholder="098..."
                    value={newSdt}
                    onChange={(e) => setNewSdt(e.target.value)}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#cfb094] mb-1">Email:</label>
                  <input
                    type="email"
                    placeholder="email@..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[#180806] border border-[#4a1d18] rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#421814] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded bg-[#381613] text-[#c9a788]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-gradient-to-r from-red-700 to-amber-700 text-amber-100 font-bold"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
