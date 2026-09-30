import React from 'react';
import { Scroll, MapPin, Landmark, HeartHandshake, BookOpen, Sparkles, Award } from 'lucide-react';
import { ThongTinChung, ChiPhai } from '../types/giapha';

interface ClanInfoViewProps {
  info: ThongTinChung;
  branches: ChiPhai[];
}

export const ClanInfoView: React.FC<ClanInfoViewProps> = ({ info, branches }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Visual Card: Lineage Hall Photography */}
      <div className="relative rounded-3xl overflow-hidden border border-[#5c2420] shadow-2xl">
        <div className="h-80 sm:h-96 w-full relative">
          <img
            src="/src/assets/images/chu_gia_temple_1790735189826.jpg"
            alt="Từ đường dòng họ Chu tại xã Lãng Sơn, huyện Yên Dũng, tỉnh Bắc Giang"
            className="w-full h-full object-cover brightness-90"
            onError={(e) => {
              // Fallback styling if image path is unavailable
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b0a08] via-[#1b0a08]/60 to-transparent"></div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col justify-end">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7a221b]/90 border border-amber-500/60 text-amber-200 text-xs font-semibold w-fit mb-2 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Từ Đường Đại Tôn Họ Chu · Di Sản Tổ Truyền</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-amber-100 tracking-wide drop-shadow-md">
              DÒNG HỌ CHU – XÃ LÃNG SƠN
            </h1>
            <p className="text-sm sm:text-base text-amber-200/90 font-medium flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Huyện Yên Dũng, Tỉnh Bắc Giang</span>
            </p>
          </div>
        </div>
      </div>

      {/* Couplet & Ancestral Motto Ribbon */}
      <div className="bg-gradient-to-r from-[#4d1612] via-[#2f0c09] to-[#4d1612] p-6 rounded-2xl border-2 border-amber-600/50 shadow-xl text-center space-y-3">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-bold font-seal">
          CÂU ĐỐI TỔ TRUYỀN TẠI TỪ ĐƯỜNG ĐẠI TÔN
        </div>
        <div className="text-lg sm:text-2xl font-bold font-heritage text-amber-200 tracking-wider">
          “ Chu tộc quang minh lưu hậu thế <br className="sm:hidden" /> — Tử tôn hiếu thuận chấn gia phong ”
        </div>
        <p className="text-xs text-[#ddbe9f] italic max-w-2xl mx-auto">
          (Nghĩa là: Ánh sáng rạng danh họ Chu muôn đời lưu truyền hậu thế — Con cháu thảo hiền giữ trọn nề nếp gia phong rực rỡ)
        </p>
      </div>

      {/* Main Narrative: History and Roots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Lược sử dòng họ */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-lg sm:text-xl font-bold font-heritage text-amber-200 flex items-center gap-2.5 pb-3 border-b border-[#3d1714]">
              <Landmark className="w-5 h-5 text-amber-400" />
              <span>Lược sử Khởi thủy Dòng họ Chu tại Lãng Sơn</span>
            </h3>

            <div className="text-xs sm:text-sm text-[#ecd3be] leading-relaxed space-y-3">
              <p>
                Xã Lãng Sơn, huyện Yên Dũng, tỉnh Bắc Giang là vùng đất bán sơn địa hữu tình, nằm ven bờ tả ngạn sông Thương hiền hòa và tựa lưng vào dãy núi Nham Biền kỳ vĩ. Nơi đây từ xa xưa đã là vùng đất phì nhiêu, địa linh nhân kiệt với truyền thống hiếu học và lòng yêu nước quật cường.
              </p>
              <p>
                Khởi tổ dòng họ Chu tại đất Lãng Sơn là <strong>Cụ Thủy Tổ Chu Doãn Phúc</strong> (hiệu Phấn Dũng Hầu), khởi nghiệp vào khoảng thế kỷ XVII thời Hậu Lê. Cụ đã cùng bà con khai hoang lập ấp, đắp đê ngăn lũ sông Thương, lập nên thôn xóm trù phú tại gò Đồng Cát, thôn Đông Lãng ngày nay.
              </p>
              <p>
                Trải qua hơn ba thế kỷ thăng trầm cùng lịch sử dân tộc, dòng họ Chu Lãng Sơn đã phát triển thành 3 chi phái lớn: <strong>Chi Đại Tôn (Chi Cả)</strong>, <strong>Chi Đệ Nhị (Chi Hai)</strong>, và <strong>Chi Đệ Tam (Chi Ba)</strong>. Con cháu họ Chu luôn giữ trọn đạo hiếu, có nhiều người đỗ đạt tú tài, nho sĩ, lương y, cán bộ tiền khởi nghĩa, thương binh liệt sĩ và các kỹ sư, bác sĩ, nhà giáo ưu tú trong thời đại ngày nay.
              </p>
            </div>
          </div>

          {/* Gia Huấn / Clan Rules */}
          <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-lg sm:text-xl font-bold font-heritage text-amber-200 flex items-center gap-2.5 pb-3 border-b border-[#3d1714]">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Gia huấn &amp; Nếp sống Chu tộc</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#180806] rounded-xl border border-[#3b1713] space-y-1.5">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>1. Hiếu đễ vi bản</span>
                </div>
                <p className="text-xs text-[#ccad8e]">
                  Kính yêu phụng dưỡng ông bà cha mẹ, giữ trọn chữ hiếu khi người còn sống cũng như lúc đã khuất núi, chăm nom hương khói mộ phần tiên tổ.
                </p>
              </div>

              <div className="p-4 bg-[#180806] rounded-xl border border-[#3b1713] space-y-1.5">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  <span>2. Hòa mục đồng tộc</span>
                </div>
                <p className="text-xs text-[#ccad8e]">
                  Anh em họ hàng trên dưới hòa thuận, tối lửa tắt đèn có nhau, tương thân tương ái, giúp đỡ nhau lúc hoạn nạn khó khăn.
                </p>
              </div>

              <div className="p-4 bg-[#180806] rounded-xl border border-[#3b1713] space-y-1.5">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>3. Khuyến học khuyến tài</span>
                </div>
                <p className="text-xs text-[#ccad8e]">
                  Khích lệ con cháu chăm lo học hành, rèn đức luyện tài, vươn lên làm rạng danh dòng giống họ Chu tại quê hương Bắc Giang và khắp mọi miền.
                </p>
              </div>

              <div className="p-4 bg-[#180806] rounded-xl border border-[#3b1713] space-y-1.5">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-rose-400" />
                  <span>4. Cần kiệm liêm chính</span>
                </div>
                <p className="text-xs text-[#ccad8e]">
                  Chăm chỉ lao động sản xuất, giữ gìn đạo đức trong sạch, sống thượng tôn pháp luật và cống hiến cho xã hội.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Directory of Clan Council */}
        <div className="space-y-6">
          <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-heritage text-amber-200 pb-3 border-b border-[#3b1713]">
              Hội đồng Gia tộc &amp; Ban Trị sự
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#180806] rounded-xl border border-[#3d1714]">
                <div className="font-bold text-amber-200">Chu Văn Lương</div>
                <div className="text-[11px] text-amber-400 font-medium">Trưởng tộc · Quản trị viên Gia phả số</div>
                <div className="text-[#a6866b] mt-1">Đại diện Chi Đại Tôn · Thôn Đông Lãng</div>
                <div className="text-[#8c6d52] text-[11px] mt-0.5">ĐT: 0983.123.456</div>
              </div>

              <div className="p-3 bg-[#180806] rounded-xl border border-[#3d1714]">
                <div className="font-bold text-amber-200">Chu Doãn Cường</div>
                <div className="text-[11px] text-amber-400 font-medium">Trưởng Chi Đệ Nhị</div>
                <div className="text-[#a6866b] mt-1">Thôn Tân Mỹ, Xã Lãng Sơn</div>
                <div className="text-[#8c6d52] text-[11px] mt-0.5">ĐT: 0903.222.111</div>
              </div>

              <div className="p-3 bg-[#180806] rounded-xl border border-[#3d1714]">
                <div className="font-bold text-amber-200">Chu Quang Minh</div>
                <div className="text-[11px] text-amber-400 font-medium">Trưởng Chi Đệ Tam · Ban Khuyến học</div>
                <div className="text-[#a6866b] mt-1">Thôn Sơn Mới, Xã Lãng Sơn</div>
                <div className="text-[#8c6d52] text-[11px] mt-0.5">ĐT: 0914.999.888</div>
              </div>
            </div>
          </div>

          {/* Location & Hall Details */}
          <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl space-y-3 text-xs text-[#ccad8e]">
            <h4 className="font-bold font-heritage text-amber-200 text-sm">
              Địa chỉ Từ Đường Đại Tôn
            </h4>
            <div className="space-y-1 text-[#b59579]">
              <p>📍 Thôn Đông Lãng, Xã Lãng Sơn, Huyện Yên Dũng, Tỉnh Bắc Giang</p>
              <p>🏛️ Kiến trúc: Gỗ lim cổ truyền 3 gian 2 chái, mái ngói mũi hài</p>
              <p>🕊️ Ngày đại tế: Rằm tháng Giêng (15/01 âm lịch hàng năm)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
