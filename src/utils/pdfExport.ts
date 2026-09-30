import jsPDF from 'jspdf';
import { GiaPhaData } from '../types/giapha';

export function exportGiaPhaToPdf(data: GiaPhaData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title decoration
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(140, 29, 24); // Red-brown lacquer
  doc.text('GIA PHẢ DÒNG HỌ CHU', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(13);
  doc.setTextColor(70, 70, 70);
  doc.setFont('times', 'italic');
  doc.text('Xã Lãng Sơn, huyện Yên Dũng, Tỉnh Bắc Giang', pageWidth / 2, yPos, { align: 'center' });

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Ngày trích lục xuất bản: ${new Date().toLocaleDateString('vi-VN')} | Người duyệt: Chu Văn Lương`, pageWidth / 2, yPos, { align: 'center' });

  // Divider line
  yPos += 6;
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.6);
  doc.line(20, yPos, pageWidth - 20, yPos);

  // Section 1: Gia huấn & Thủy tổ
  yPos += 10;
  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.setTextColor(140, 29, 24);
  doc.text('I. THÔNG TIN TIÊN TỔ & GIA HUẤN', 20, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(`• Thủy Tổ: ${data.thongTinChung.nguoiKhoiTao} (${data.thongTinChung.nienDai})`, 25, yPos);
  yPos += 6;
  doc.text(`• Từ đường: ${data.thongTinChung.nhaThoTo}`, 25, yPos);
  yPos += 6;
  doc.text(`• Câu đối tổ truyền: "${data.thongTinChung.cauDoi}"`, 25, yPos);
  yPos += 6;
  const splitHuan = doc.splitTextToSize(`• Gia huấn: ${data.thongTinChung.giaHuan}`, pageWidth - 45);
  doc.text(splitHuan, 25, yPos);
  yPos += splitHuan.length * 5 + 4;

  // Section 2: Chi phái
  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.setTextColor(140, 29, 24);
  doc.text('II. DANH SÁCH CÁC CHI PHÁI', 20, yPos);
  yPos += 7;

  data.danhSachChiPhai.forEach((chi, idx) => {
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(`${idx + 1}. ${chi.tenChi} - Trưởng chi: ${chi.truongChi}`, 25, yPos);
    yPos += 5;
    doc.setFont('times', 'normal');
    doc.text(`   Địa bàn: ${chi.diaBan} | ${chi.moTa}`, 25, yPos);
    yPos += 6;
  });

  // Section 3: Tộc nhân qua các thế hệ
  yPos += 4;
  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.setTextColor(140, 29, 24);
  doc.text('III. DANH BẠ TỘC NHÂN THEO ĐỜI (TRÍCH LỤC)', 20, yPos);
  yPos += 7;

  const sortedMembers = [...data.danhSachThanhVien].sort((a, b) => a.theHe - b.theHe);

  sortedMembers.slice(0, 18).forEach((tv) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    const statusText = tv.conSong ? 'Hiện đang sống' : `Đã tạ thế (Giỗ: ${tv.ngayGioAm || 'Chưa rõ'})`;
    const spouseText = tv.voChongIds && tv.voChongIds.length > 0 ? ' [Có phu quân/chính thất]' : '';
    doc.setFontSize(9.5);
    doc.setFont('times', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(`[Đời ${tv.theHe}] ${tv.hoVaTen} (${tv.gioiTinh === 'nam' ? 'Nam' : 'Nữ'})${spouseText}`, 25, yPos);
    yPos += 4.5;
    doc.setFont('times', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`   - Năm sinh: ${tv.namSinh || 'Khuyết'} | ${statusText} | Nghề: ${tv.ngheNghiep || 'Tự do'}`, 25, yPos);
    if (tv.danhHieu) {
      yPos += 4;
      doc.text(`   - Danh hiệu: ${tv.danhHieu}`, 25, yPos);
    }
    yPos += 5;
  });

  if (sortedMembers.length > 18) {
    if (yPos > 275) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont('times', 'italic');
    doc.text(`... cùng ${sortedMembers.length - 18} tộc nhân khác được lưu chi tiết trong cơ sở dữ liệu XML dòng họ Chu.`, 25, yPos);
    yPos += 7;
  }

  // Section 4: Lịch giỗ tế
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 4;
  }

  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.setTextColor(140, 29, 24);
  doc.text('IV. LỊCH GIỖ TẾ CHÍNH TRONG NĂM', 20, yPos);
  yPos += 7;

  data.lichGioTe.forEach((sk) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(9.5);
    doc.setFont('times', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(`• ${sk.tenLe}`, 25, yPos);
    yPos += 4.5;
    doc.setFont('times', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(`   Ngày âm: ${sk.ngayAmLich} (Dương: ${sk.ngayDuongLichNamNay}) | Địa điểm: ${sk.diaDiem}`, 25, yPos);
    yPos += 5.5;
  });

  // Footer signature
  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 10;
  }
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(120, 20, 20);
  doc.text('HỘI ĐỒNG GIA TỘC HỌ CHU XÃ LÃNG SƠN', pageWidth - 80, yPos, { align: 'center' });
  yPos += 5;
  doc.setFont('times', 'italic');
  doc.setTextColor(80, 80, 80);
  doc.text('Trưởng tộc đương nhiệm', pageWidth - 80, yPos, { align: 'center' });
  yPos += 15;
  doc.setFont('times', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('Chu Văn Lương', pageWidth - 80, yPos, { align: 'center' });

  // Save PDF
  doc.save(`Gia_Pha_Dong_Ho_Chu_Lang_Son_Bac_Giang_${new Date().getFullYear()}.pdf`);
}
