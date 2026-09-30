import React, { useState } from 'react';
import { 
  GitFork, 
  Users, 
  Network, 
  CalendarDays, 
  BarChart3, 
  Coins, 
  UserCheck, 
  Info, 
  Bell, 
  FileDown, 
  Database, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';
import { TaiKhoanNguoiDung } from '../types/giapha';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: TaiKhoanNguoiDung | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onExportPdf: () => void;
  onOpenXmlBackup: () => void;
  onOpenNotificationCenter: () => void;
  upcomingEventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenLogin,
  onLogout,
  onExportPdf,
  onOpenXmlBackup,
  onOpenNotificationCenter,
  upcomingEventsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'tree', label: 'Cây phả hệ', icon: GitFork },
    { id: 'members', label: 'Tộc nhân', icon: Users },
    { id: 'branches', label: 'Chi phái', icon: Network },
    { id: 'calendar', label: 'Lịch giỗ tế', icon: CalendarDays },
    { id: 'statistics', label: 'Thống kê', icon: BarChart3 },
    { id: 'fund', label: 'Quỹ dòng họ', icon: Coins },
    { id: 'accounts', label: 'Tài khoản', icon: UserCheck },
    { id: 'info', label: 'Thông tin họ Chu', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#220d0b]/95 backdrop-blur-md border-b border-[#54211b] shadow-xl">
      {/* Top Banner Ribbon */}
      <div className="bg-[#180806] px-4 py-1 text-xs text-[#d6b797] border-b border-[#3b1713] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Hệ thống Gia phả Điện tử Dòng họ Chu · Xã Lãng Sơn, Yên Dũng, Bắc Giang</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#e2c7a8]">
          <span>Cơ sở dữ liệu XML độc lập an toàn</span>
          <span>·</span>
          <span className="text-amber-400 font-medium">Bản quyền: Chu Văn Lương</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Zone: Circular Logo with "CHU GIA" & Lineage Title */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectTab('tree')}>
            {/* Circular Clan Seal Logo */}
            <div className="relative group">
              <div className="w-14 h-14 rounded-full border-2 border-amber-500/80 bg-gradient-to-br from-[#721c17] via-[#48120e] to-[#1e0705] p-0.5 shadow-lg shadow-black/60 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                <img 
                  src="/src/assets/images/chu_gia_seal_1790735202767.jpg" 
                  alt="Logo Chu Gia"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to circular stylized monogram if image not found
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 rounded-full bg-gradient-to-b from-[#8f2820]/90 to-[#3b110e]/95 pointer-events-none">
                  <span className="text-[11px] font-extrabold text-amber-200 tracking-wider font-seal uppercase">CHU</span>
                  <span className="text-[10px] font-extrabold text-amber-300 tracking-widest font-seal uppercase">GIA</span>
                </div>
              </div>
            </div>

            {/* Title Lockup */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-heritage tracking-wide text-amber-200 drop-shadow-sm leading-tight">
                  DÒNG HỌ CHU
                </h1>
                {currentUser?.role === 'admin' && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-red-950/80 text-amber-300 border border-red-800/80 rounded px-1.5 py-0.5 font-medium">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    Quản trị
                  </span>
                )}
              </div>
              <p className="text-xs text-[#d8bca2] font-normal leading-snug">
                Xã Lãng Sơn, huyện Yên Dũng, Tỉnh Bắc Giang
              </p>
            </div>
          </div>

          {/* Center Zone: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8b2921] to-[#6d1b14] text-amber-100 shadow-md border border-amber-600/50'
                      : 'text-[#e6cfb8] hover:text-white hover:bg-[#381613]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#c29e80]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Actions & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationCenter}
              title="Thông báo giỗ chạp & sự kiện họ Chu"
              className="relative p-2 rounded-lg bg-[#2e1310] hover:bg-[#451c18] border border-[#522520] text-[#e0c3a5] hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              {upcomingEventsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow">
                  {upcomingEventsCount}
                </span>
              )}
            </button>

            {/* XML Database Management button */}
            <button
              onClick={onOpenXmlBackup}
              title="Cơ sở dữ liệu XML & Bản sao lưu"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2e1310] hover:bg-[#451c18] border border-[#522520] text-xs text-[#e0c3a5] hover:text-white transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">CSDL XML</span>
            </button>

            {/* PDF Export button */}
            <button
              onClick={onExportPdf}
              title="Xuất gia phả ra tệp PDF"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2e1310] hover:bg-[#451c18] border border-[#522520] text-xs text-[#e0c3a5] hover:text-white transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-red-300" />
              <span className="hidden xl:inline">Xuất PDF</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#4a1f1b]">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-amber-200 truncate max-w-[130px]">
                    {currentUser.hoTen}
                  </div>
                  <div className="text-[10px] text-[#c9a788]">
                    {currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.role === 'moderator' ? 'Thành viên BLL' : 'Tộc nhân'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-2 rounded-lg bg-[#3d1612] hover:bg-[#541f1a] text-red-300 hover:text-white border border-[#5a241f] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs rounded-lg shadow transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-stone-950" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#2e1310] text-[#e0c3a5] hover:text-white focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1f0b09] border-b border-[#4d1f1b] px-4 pt-3 pb-5 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#82241d] text-amber-100 font-semibold border-l-4 border-amber-400'
                    : 'text-[#d6b797] hover:bg-[#341411] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#ab8766]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#3b1713] flex items-center justify-between">
            <button
              onClick={() => {
                onExportPdf();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-[#2e1310] rounded text-amber-200"
            >
              <FileDown className="w-4 h-4" />
              <span>Xuất sổ PDF</span>
            </button>
            <button
              onClick={() => {
                onOpenXmlBackup();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-[#2e1310] rounded text-amber-200"
            >
              <Database className="w-4 h-4" />
              <span>CSDL XML & Sao lưu</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
