import React, { useState } from 'react';
import { X, LogIn, Key, User, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, pass: string) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [username, setUsername] = useState('chuluong');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(username, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setUsername('chuluong');
    setPassword('Admin@123456');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4d1612] to-[#2d0d0a] border-b border-[#5e2520] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#691f19] border border-amber-500/50 text-amber-300">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heritage text-amber-200">
                Đăng nhập Hệ thống Gia phả
              </h3>
              <p className="text-xs text-[#c9a788]">
                Dòng họ Chu · Lãng Sơn, Yên Dũng, Bắc Giang
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#ebd3be]">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick preset notice */}
          <div className="p-3 bg-[#190806] rounded-xl border border-[#421814] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Tài khoản Quản trị viên:
              </span>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="text-[11px] text-amber-300 hover:underline font-bold cursor-pointer"
              >
                Nhập nhanh
              </button>
            </div>
            <div className="text-[11px] text-[#cfb094] space-y-0.5">
              <div>Tài khoản: <strong className="text-amber-200">chuluong</strong></div>
              <div>Mật khẩu: <strong className="text-amber-200">Admin@123456</strong></div>
            </div>
          </div>

          <div>
            <label className="block text-amber-300 font-semibold mb-1">
              Tên đăng nhập:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-amber-400/80 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="chuluong"
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-300 font-semibold mb-1">
              Mật khẩu:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-amber-400/80 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@123456"
                className="w-full bg-[#180806] border border-[#4d1d18] rounded-lg pl-9 pr-9 py-2 text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-[#a38062] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-700 via-amber-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-amber-100 font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào Hệ thống'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
