export type GioiTinh = 'nam' | 'nu';

export type UserRole = 'admin' | 'moderator' | 'member';

export interface ThongTinChung {
  tenDongHo: string;
  diaChi: string;
  nguoiKhoiTao: string;
  nienDai: string;
  nhaThoTo: string;
  cauDoi: string;
  giaHuan: string;
  lichSu: string;
}

export interface ChiPhai {
  id: string;
  tenChi: string;
  truongChi: string;
  diaBan: string;
  moTa: string;
}

export interface ThanhVien {
  id: string;
  hoVaTen: string;
  tenThuongGoi?: string;
  gioiTinh: GioiTinh;
  theHe: number; // Đời 1, 2, 3...
  chiPhaiId: string;
  chaId?: string;
  meId?: string;
  voChongIds?: string[];
  thuTuTrongGiaDinh: number;
  ngaySinh?: string;
  namSinh?: number;
  conSong: boolean;
  ngayMat?: string;
  ngayGioAm?: string; // Ví dụ: "15/01"
  noiAnTang?: string;
  ngheNghiep?: string;
  hocVan?: string;
  diaChiHienTai?: string;
  soDienThoai?: string;
  email?: string;
  ghiChu?: string;
  anhDaiDien?: string;
  danhHieu?: string;
}

export interface SuKienGioTe {
  id: string;
  tenLe: string;
  thanhVienLienQuanId?: string;
  loaiSuKien: 'gio_to' | 'gio_to_chi' | 'le_hoi' | 'tao_mo' | 'hop_dong_ho';
  ngayAmLich: string;
  ngayDuongLichNamNay: string;
  diaDiem: string;
  nguoiChuTri: string;
  noiDung: string;
  nhacNhoTruocNgay: number;
  daGuiThongBao: boolean;
}

export interface GiaoDichQuy {
  id: string;
  ngay: string;
  loai: 'thu' | 'chi';
  soTien: number;
  nguoiGiaoDich: string;
  noiDung: string;
  nguoiPheDuyet: string;
  chiPhaiId?: string;
}

export interface QuyDongHoData {
  soDuHienTai: number;
  danhSachGiaoDich: GiaoDichQuy[];
}

export interface TaiKhoanNguoiDung {
  id: string;
  username: string;
  password?: string;
  hoTen: string;
  role: UserRole;
  email: string;
  sdt: string;
  ngayTao: string;
  trangThai: 'active' | 'locked';
}

export interface NhatKyThaoTac {
  id: string;
  thoiGian: string;
  nguoiThucHien: string;
  hanhDong: string;
  chiTiet: string;
}

export interface ThongBaoGuiDi {
  id: string;
  tieuDe: string;
  noiDung: string;
  kenh: 'sms' | 'email' | 'all';
  danhSachNhan: string[];
  thoiGianGui: string;
  trangThai: 'thanh_cong' | 'cho_gui' | 'that_bai';
}

export interface BanSaoLuu {
  id: string;
  tenFile: string;
  thoiGian: string;
  kichThuoc: string;
  nguoiTao: string;
  ghiChu?: string;
}

export interface GiaPhaData {
  thongTinChung: ThongTinChung;
  danhSachChiPhai: ChiPhai[];
  danhSachThanhVien: ThanhVien[];
  lichGioTe: SuKienGioTe[];
  quyDongHo: QuyDongHoData;
  danhSachTaiKhoan: TaiKhoanNguoiDung[];
  nhatKyThaoTac: NhatKyThaoTac[];
  lichSuThongBao?: ThongBaoGuiDi[];
  danhSachSaoLuu?: BanSaoLuu[];
}
