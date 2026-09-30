import { GiaPhaData, ThanhVien, ChiPhai, SuKienGioTe, GiaoDichQuy, TaiKhoanNguoiDung, NhatKyThaoTac } from '../types/giapha';

function escapeXml(unsafe: string | number | boolean | undefined): string {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function unescapeXml(safe: string): string {
  return safe
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function getTagValue(parentXml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = parentXml.match(regex);
  return match ? unescapeXml(match[1].trim()) : '';
}

function getTagsBlocks(parentXml: string, tagName: string): string[] {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const blocks: string[] = [];
  let match;
  while ((match = regex.exec(parentXml)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

export function exportGiaPhaToXmlString(data: GiaPhaData): string {
  const { thongTinChung, danhSachChiPhai, danhSachThanhVien, lichGioTe, quyDongHo, danhSachTaiKhoan, nhatKyThaoTac } = data;

  const chiPhaiXml = danhSachChiPhai.map(c => `    <ChiPhai>
      <Id>${escapeXml(c.id)}</Id>
      <TenChi>${escapeXml(c.tenChi)}</TenChi>
      <TruongChi>${escapeXml(c.truongChi)}</TruongChi>
      <DiaBan>${escapeXml(c.diaBan)}</DiaBan>
      <MoTa>${escapeXml(c.moTa)}</MoTa>
    </ChiPhai>`).join('\n');

  const thanhVienXml = danhSachThanhVien.map(tv => `    <ThanhVien>
      <Id>${escapeXml(tv.id)}</Id>
      <HoVaTen>${escapeXml(tv.hoVaTen)}</HoVaTen>
      <TenThuongGoi>${escapeXml(tv.tenThuongGoi || '')}</TenThuongGoi>
      <GioiTinh>${escapeXml(tv.gioiTinh)}</GioiTinh>
      <TheHe>${tv.theHe}</TheHe>
      <ChiPhaiId>${escapeXml(tv.chiPhaiId)}</ChiPhaiId>
      <ChaId>${escapeXml(tv.chaId || '')}</ChaId>
      <MeId>${escapeXml(tv.meId || '')}</MeId>
      <VoChongIds>${escapeXml((tv.voChongIds || []).join(','))}</VoChongIds>
      <ThuTuTrongGiaDinh>${tv.thuTuTrongGiaDinh || 1}</ThuTuTrongGiaDinh>
      <NgaySinh>${escapeXml(tv.ngaySinh || '')}</NgaySinh>
      <NamSinh>${tv.namSinh || ''}</NamSinh>
      <ConSong>${tv.conSong ? 'true' : 'false'}</ConSong>
      <NgayMat>${escapeXml(tv.ngayMat || '')}</NgayMat>
      <NgayGioAm>${escapeXml(tv.ngayGioAm || '')}</NgayGioAm>
      <NoiAnTang>${escapeXml(tv.noiAnTang || '')}</NoiAnTang>
      <NgheNghiep>${escapeXml(tv.ngheNghiep || '')}</NgheNghiep>
      <HocVan>${escapeXml(tv.hocVan || '')}</HocVan>
      <DiaChiHienTai>${escapeXml(tv.diaChiHienTai || '')}</DiaChiHienTai>
      <SoDienThoai>${escapeXml(tv.soDienThoai || '')}</SoDienThoai>
      <Email>${escapeXml(tv.email || '')}</Email>
      <GhiChu>${escapeXml(tv.ghiChu || '')}</GhiChu>
      <DanhHieu>${escapeXml(tv.danhHieu || '')}</DanhHieu>
      <AnhDaiDien>${escapeXml(tv.anhDaiDien || '')}</AnhDaiDien>
    </ThanhVien>`).join('\n');

  const lichGioTeXml = lichGioTe.map(sk => `    <SuKien>
      <Id>${escapeXml(sk.id)}</Id>
      <TenLe>${escapeXml(sk.tenLe)}</TenLe>
      <ThanhVienLienQuanId>${escapeXml(sk.thanhVienLienQuanId || '')}</ThanhVienLienQuanId>
      <LoaiSuKien>${escapeXml(sk.loaiSuKien)}</LoaiSuKien>
      <NgayAmLich>${escapeXml(sk.ngayAmLich)}</NgayAmLich>
      <NgayDuongLichNamNay>${escapeXml(sk.ngayDuongLichNamNay)}</NgayDuongLichNamNay>
      <DiaDiem>${escapeXml(sk.diaDiem)}</DiaDiem>
      <NguoiChuTri>${escapeXml(sk.nguoiChuTri)}</NguoiChuTri>
      <NoiDung>${escapeXml(sk.noiDung)}</NoiDung>
      <NhacNhoTruocNgay>${sk.nhacNhoTruocNgay || 7}</NhacNhoTruocNgay>
      <DaGuiThongBao>${sk.daGuiThongBao ? 'true' : 'false'}</DaGuiThongBao>
    </SuKien>`).join('\n');

  const giaoDichXml = quyDongHo.danhSachGiaoDich.map(gd => `      <GiaoDich>
        <Id>${escapeXml(gd.id)}</Id>
        <Ngay>${escapeXml(gd.ngay)}</Ngay>
        <Loai>${escapeXml(gd.loai)}</Loai>
        <SoTien>${gd.soTien}</SoTien>
        <NguoiGiaoDich>${escapeXml(gd.nguoiGiaoDich)}</NguoiGiaoDich>
        <NoiDung>${escapeXml(gd.noiDung)}</NoiDung>
        <NguoiPheDuyet>${escapeXml(gd.nguoiPheDuyet)}</NguoiPheDuyet>
        <ChiPhaiId>${escapeXml(gd.chiPhaiId || '')}</ChiPhaiId>
      </GiaoDich>`).join('\n');

  const taiKhoanXml = danhSachTaiKhoan.map(u => `    <TaiKhoan>
      <Id>${escapeXml(u.id)}</Id>
      <Username>${escapeXml(u.username)}</Username>
      <Password>${escapeXml(u.password || '')}</Password>
      <HoTen>${escapeXml(u.hoTen)}</HoTen>
      <Role>${escapeXml(u.role)}</Role>
      <Email>${escapeXml(u.email)}</Email>
      <Sdt>${escapeXml(u.sdt)}</Sdt>
      <NgayTao>${escapeXml(u.ngayTao)}</NgayTao>
      <TrangThai>${escapeXml(u.trangThai)}</TrangThai>
    </TaiKhoan>`).join('\n');

  const nhatKyXml = nhatKyThaoTac.map(log => `    <NhatKy>
      <Id>${escapeXml(log.id)}</Id>
      <ThoiGian>${escapeXml(log.thoiGian)}</ThoiGian>
      <NguoiThucHien>${escapeXml(log.nguoiThucHien)}</NguoiThucHien>
      <HanhDong>${escapeXml(log.hanhDong)}</HanhDong>
      <ChiTiet>${escapeXml(log.chiTiet)}</ChiTiet>
    </NhatKy>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<GiaPhaChuGia>
  <ThongTinChung>
    <TenDongHo>${escapeXml(thongTinChung.tenDongHo)}</TenDongHo>
    <DiaChi>${escapeXml(thongTinChung.diaChi)}</DiaChi>
    <NguoiKhoiTao>${escapeXml(thongTinChung.nguoiKhoiTao)}</NguoiKhoiTao>
    <NienDai>${escapeXml(thongTinChung.nienDai)}</NienDai>
    <NhaThoTo>${escapeXml(thongTinChung.nhaThoTo)}</NhaThoTo>
    <CauDoi>${escapeXml(thongTinChung.cauDoi)}</CauDoi>
    <GiaHuan>${escapeXml(thongTinChung.giaHuan)}</GiaHuan>
    <LichSu>${escapeXml(thongTinChung.lichSu)}</LichSu>
  </ThongTinChung>

  <DanhSachChiPhai>
${chiPhaiXml}
  </DanhSachChiPhai>

  <DanhSachThanhVien>
${thanhVienXml}
  </DanhSachThanhVien>

  <LichGioTe>
${lichGioTeXml}
  </LichGioTe>

  <QuyDongHo>
    <SoDuHienTai>${quyDongHo.soDuHienTai}</SoDuHienTai>
    <DanhSachGiaoDich>
${giaoDichXml}
    </DanhSachGiaoDich>
  </QuyDongHo>

  <DanhSachTaiKhoan>
${taiKhoanXml}
  </DanhSachTaiKhoan>

  <NhatKyThaoTac>
${nhatKyXml}
  </NhatKyThaoTac>
</GiaPhaChuGia>`;
}

export function parseXmlStringToGiaPha(xmlString: string): GiaPhaData {
  const thongTinChungBlock = getTagValue(xmlString, 'ThongTinChung');
  const thongTinChung = {
    tenDongHo: getTagValue(thongTinChungBlock, 'TenDongHo') || 'Dòng họ Chu',
    diaChi: getTagValue(thongTinChungBlock, 'DiaChi') || 'Xã Lãng Sơn, huyện Yên Dũng, Tỉnh Bắc Giang',
    nguoiKhoiTao: getTagValue(thongTinChungBlock, 'NguoiKhoiTao') || 'Cụ Thủy Tổ Chu Doãn Phúc',
    nienDai: getTagValue(thongTinChungBlock, 'NienDai') || 'Thế kỷ XVII',
    nhaThoTo: getTagValue(thongTinChungBlock, 'NhaThoTo') || 'Nhà thờ họ Chu, Thôn Đông, Lãng Sơn, Yên Dũng, Bắc Giang',
    cauDoi: getTagValue(thongTinChungBlock, 'CauDoi') || 'Chu tộc quang minh lưu hậu thế - Tử tôn hiếu thuận chấn gia phong',
    giaHuan: getTagValue(thongTinChungBlock, 'GiaHuan') || 'Uống nước nhớ nguồn - Giữ trọn đạo hiếu',
    lichSu: getTagValue(thongTinChungBlock, 'LichSu') || 'Dòng họ Chu tại xã Lãng Sơn...',
  };

  const chiPhaiBlocks = getTagsBlocks(xmlString, 'ChiPhai');
  const danhSachChiPhai: ChiPhai[] = chiPhaiBlocks.map(block => ({
    id: getTagValue(block, 'Id'),
    tenChi: getTagValue(block, 'TenChi'),
    truongChi: getTagValue(block, 'TruongChi'),
    diaBan: getTagValue(block, 'DiaBan'),
    moTa: getTagValue(block, 'MoTa'),
  }));

  const thanhVienBlocks = getTagsBlocks(xmlString, 'ThanhVien');
  const danhSachThanhVien: ThanhVien[] = thanhVienBlocks.map(block => {
    const voChongRaw = getTagValue(block, 'VoChongIds');
    const namSinhRaw = getTagValue(block, 'NamSinh');
    return {
      id: getTagValue(block, 'Id'),
      hoVaTen: getTagValue(block, 'HoVaTen'),
      tenThuongGoi: getTagValue(block, 'TenThuongGoi') || undefined,
      gioiTinh: (getTagValue(block, 'GioiTinh') === 'nu' ? 'nu' : 'nam'),
      theHe: parseInt(getTagValue(block, 'TheHe') || '1', 10),
      chiPhaiId: getTagValue(block, 'ChiPhaiId') || 'chi-1',
      chaId: getTagValue(block, 'ChaId') || undefined,
      meId: getTagValue(block, 'MeId') || undefined,
      voChongIds: voChongRaw ? voChongRaw.split(',').filter(Boolean) : [],
      thuTuTrongGiaDinh: parseInt(getTagValue(block, 'ThuTuTrongGiaDinh') || '1', 10),
      ngaySinh: getTagValue(block, 'NgaySinh') || undefined,
      namSinh: namSinhRaw ? parseInt(namSinhRaw, 10) : undefined,
      conSong: getTagValue(block, 'ConSong') !== 'false',
      ngayMat: getTagValue(block, 'NgayMat') || undefined,
      ngayGioAm: getTagValue(block, 'NgayGioAm') || undefined,
      noiAnTang: getTagValue(block, 'NoiAnTang') || undefined,
      ngheNghiep: getTagValue(block, 'NgheNghiep') || undefined,
      hocVan: getTagValue(block, 'HocVan') || undefined,
      diaChiHienTai: getTagValue(block, 'DiaChiHienTai') || undefined,
      soDienThoai: getTagValue(block, 'SoDienThoai') || undefined,
      email: getTagValue(block, 'Email') || undefined,
      ghiChu: getTagValue(block, 'GhiChu') || undefined,
      danhHieu: getTagValue(block, 'DanhHieu') || undefined,
      anhDaiDien: getTagValue(block, 'AnhDaiDien') || undefined,
    };
  });

  const suKienBlocks = getTagsBlocks(xmlString, 'SuKien');
  const lichGioTe: SuKienGioTe[] = suKienBlocks.map(block => ({
    id: getTagValue(block, 'Id'),
    tenLe: getTagValue(block, 'TenLe'),
    thanhVienLienQuanId: getTagValue(block, 'ThanhVienLienQuanId') || undefined,
    loaiSuKien: (getTagValue(block, 'LoaiSuKien') as any) || 'gio_to',
    ngayAmLich: getTagValue(block, 'NgayAmLich'),
    ngayDuongLichNamNay: getTagValue(block, 'NgayDuongLichNamNay'),
    diaDiem: getTagValue(block, 'DiaDiem'),
    nguoiChuTri: getTagValue(block, 'NguoiChuTri'),
    noiDung: getTagValue(block, 'NoiDung'),
    nhacNhoTruocNgay: parseInt(getTagValue(block, 'NhacNhoTruocNgay') || '7', 10),
    daGuiThongBao: getTagValue(block, 'DaGuiThongBao') === 'true',
  }));

  const quyBlock = getTagValue(xmlString, 'QuyDongHo');
  const giaoDichBlocks = getTagsBlocks(quyBlock, 'GiaoDich');
  const danhSachGiaoDich: GiaoDichQuy[] = giaoDichBlocks.map(block => ({
    id: getTagValue(block, 'Id'),
    ngay: getTagValue(block, 'Ngay'),
    loai: (getTagValue(block, 'Loai') === 'chi' ? 'chi' : 'thu'),
    soTien: parseFloat(getTagValue(block, 'SoTien') || '0'),
    nguoiGiaoDich: getTagValue(block, 'NguoiGiaoDich'),
    noiDung: getTagValue(block, 'NoiDung'),
    nguoiPheDuyet: getTagValue(block, 'NguoiPheDuyet'),
    chiPhaiId: getTagValue(block, 'ChiPhaiId') || undefined,
  }));

  const soDuHienTai = parseFloat(getTagValue(quyBlock, 'SoDuHienTai') || '0');

  const taiKhoanBlocks = getTagsBlocks(xmlString, 'TaiKhoan');
  const danhSachTaiKhoan: TaiKhoanNguoiDung[] = taiKhoanBlocks.map(block => ({
    id: getTagValue(block, 'Id'),
    username: getTagValue(block, 'Username'),
    password: getTagValue(block, 'Password'),
    hoTen: getTagValue(block, 'HoTen'),
    role: (getTagValue(block, 'Role') as any) || 'member',
    email: getTagValue(block, 'Email'),
    sdt: getTagValue(block, 'Sdt'),
    ngayTao: getTagValue(block, 'NgayTao') || new Date().toISOString(),
    trangThai: (getTagValue(block, 'TrangThai') as any) || 'active',
  }));

  const nhatKyBlocks = getTagsBlocks(xmlString, 'NhatKy');
  const nhatKyThaoTac: NhatKyThaoTac[] = nhatKyBlocks.map(block => ({
    id: getTagValue(block, 'Id'),
    thoiGian: getTagValue(block, 'ThoiGian'),
    nguoiThucHien: getTagValue(block, 'NguoiThucHien'),
    hanhDong: getTagValue(block, 'HanhDong'),
    chiTiet: getTagValue(block, 'ChiTiet'),
  }));

  return {
    thongTinChung,
    danhSachChiPhai,
    danhSachThanhVien,
    lichGioTe,
    quyDongHo: {
      soDuHienTai,
      danhSachGiaoDich,
    },
    danhSachTaiKhoan,
    nhatKyThaoTac,
  };
}
