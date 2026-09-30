import React from 'react';
import { MapPin, ShieldCheck, Heart, Scroll } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-[#160705] border-t border-[#481c17] text-[#c9a788] text-xs">
      {/* Decorative Traditional Border Motifs */}
      <div className="h-1 bg-gradient-to-r from-amber-700 via-red-600 to-amber-700 opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#361411]">
          
          {/* Column 1: Clan Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#82241d] border border-amber-500/50 flex items-center justify-center font-bold text-amber-300 font-seal text-xs">
                CHU
              </span>
              <h3 className="text-base font-bold text-amber-200 font-heritage tracking-wide">
                GIA PHẢ DÒNG HỌ CHU
              </h3>
            </div>
            <p className="text-xs text-[#b89574] leading-relaxed">
              Dòng họ Chu xã Lãng Sơn, huyện Yên Dũng, tỉnh Bắc Giang có truyền thống hiếu học, đoàn kết, tương thân tương ái. Cây cao bóng cả, cội rễ bền sâu, cháu con đời đời hưng thịnh.
            </p>
            <div className="flex items-center gap-1.5 text-amber-400/90 text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Thôn Đông, Xã Lãng Sơn, Huyện Yên Dũng, Tỉnh Bắc Giang</span>
            </div>
          </div>

          {/* Column 2: Ancestral Hall & Principles */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-300 font-heritage flex items-center gap-2">
              <Scroll className="w-4 h-4 text-amber-500" />
              <span>Gia quy &amp; Lời răn tiên tổ</span>
            </h4>
            <blockquote className="border-l-2 border-amber-600/60 pl-3 italic text-xs text-[#ddbe9f] bg-[#220d0b] py-2 rounded-r">
              "Chu tộc quang minh lưu hậu thế<br />
              Tử tôn hiếu thuận chấn gia phong"
            </blockquote>
            <p className="text-[11px] text-[#a88667]">
              Nhà thờ Đại Tôn mở cửa vào các dịp sóc vọng, ngày giỗ chạp và Tết Nguyên đán để con cháu về chiêm bái thắp hương.
            </p>
          </div>

          {/* Column 3: Data Integrity & Copyright Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-300 font-heritage flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>An toàn &amp; Bảo mật Dữ liệu</span>
            </h4>
            <p className="text-xs text-[#b89574] leading-relaxed">
              Hệ thống lưu trữ trên cơ sở dữ liệu XML độc lập định kỳ sao lưu máy chủ, phòng tránh tuyệt đối việc mất dữ liệu do cache hay sự cố mạng.
            </p>
            <div className="p-2.5 rounded bg-[#250d0a] border border-[#4a1d18] text-[11px] text-[#f0d4b8]">
              <div className="font-semibold text-amber-300">Quản trị viên trưởng tộc:</div>
              <div>Chu Văn Lương · Email: chuluong.langson@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright Required by Prompt */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-sm font-semibold text-amber-300 tracking-wide">
            Bản quyền thuộc về: Chu Văn Lương
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a38062]">
            <span>Gia phả họ Chu Lãng Sơn</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#c9a788]">
              Gìn giữ cội nguồn <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            </span>
            <span>·</span>
            <span>Yên Dũng - Bắc Giang</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
