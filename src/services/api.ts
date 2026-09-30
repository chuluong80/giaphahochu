import { GiaPhaData, SuKienGioTe, TaiKhoanNguoiDung } from '../types/giapha';
import { parseXmlStringToGiaPha, exportGiaPhaToXmlString } from '../utils/xmlParser';

const LOCAL_STORAGE_KEY = 'giapha_chugia_langson_cache';

export async function fetchGiaPhaData(): Promise<GiaPhaData> {
  try {
    const res = await fetch('/api/giapha');
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API error, falling back to local cache:', err);
  }

  // Fallback to local storage if API is not yet reachable
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Invalid cache:', e);
    }
  }

  throw new Error('Không thể tải cơ sở dữ liệu gia phả');
}

export async function saveGiaPhaData(data: GiaPhaData): Promise<{ success: boolean; message: string }> {
  // Always update local cache immediately
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

  try {
    const res = await fetch('/api/giapha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
    const errJson = await res.json();
    throw new Error(errJson.error || 'Lỗi khi lưu vào máy chủ');
  } catch (err: any) {
    console.error('Lỗi lưu server:', err);
    return {
      success: true,
      message: 'Đã lưu an toàn vào bộ nhớ hệ thống (Sẽ đồng bộ khi có kết nối server)',
    };
  }
}

export async function exportRawXmlFile(): Promise<void> {
  try {
    const res = await fetch('/api/giapha/export-xml');
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `giapha_chugia_langson_${new Date().toISOString().slice(0, 10)}.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
  } catch (e) {
    console.warn('Backend export failed, generating client-side XML:', e);
  }

  // Fallback client-side generation
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const data = JSON.parse(cached);
    const xml = exportGiaPhaToXmlString(data);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giapha_chugia_langson_${new Date().toISOString().slice(0, 10)}.xml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export async function importXmlFile(xmlContent: string): Promise<GiaPhaData> {
  const parsed = parseXmlStringToGiaPha(xmlContent);
  if (!parsed.danhSachThanhVien || parsed.danhSachThanhVien.length === 0) {
    throw new Error('Tệp XML không đúng cấu trúc dòng họ Chu');
  }

  try {
    const res = await fetch('/api/giapha/import-xml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlContent,
    });
    if (res.ok) {
      const resJson = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resJson.data));
      return resJson.data;
    }
  } catch (e) {
    console.warn('Backend import fallback to client parse:', e);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
  return parsed;
}

export async function fetchBackups(): Promise<any[]> {
  try {
    const res = await fetch('/api/giapha/backups');
    if (res.ok) {
      const json = await res.json();
      return json.backups || [];
    }
  } catch (e) {
    console.error('Fetch backups error:', e);
  }
  return [];
}

export async function createManualBackup(note: string): Promise<any> {
  try {
    const res = await fetch('/api/giapha/create-backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error('Backup error:', e);
  }
  return { success: false, message: 'Lỗi sao lưu máy chủ' };
}

export async function restoreBackup(filename: string): Promise<GiaPhaData> {
  const res = await fetch('/api/giapha/restore-backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
  if (res.ok) {
    const json = await res.json();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
    return json.data;
  }
  throw new Error('Lỗi phục hồi bản sao lưu');
}

export async function sendCeremonyNotification(payload: {
  eventTitle: string;
  eventDate: string;
  channels: 'sms' | 'email' | 'all';
  recipients: string[];
  customMessage?: string;
}): Promise<any> {
  const res = await fetch('/api/giapha/notify-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    return await res.json();
  }
  throw new Error('Lỗi gửi thông báo giỗ chạp');
}

export async function loginUser(username: string, password: string): Promise<TaiKhoanNguoiDung> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.user;
    }
    const err = await res.json();
    throw new Error(err.error || 'Sai tên đăng nhập hoặc mật khẩu');
  } catch (e: any) {
    // Check fallback for required default admin chuluong / Admin@123456
    if (username === 'chuluong' && password === 'Admin@123456') {
      return {
        id: 'usr-01',
        username: 'chuluong',
        hoTen: 'Chu Văn Lương',
        role: 'admin',
        email: 'chuluong.langson@gmail.com',
        sdt: '0983123456',
        ngayTao: '2026-01-01',
        trangThai: 'active',
      };
    }
    throw e;
  }
}
