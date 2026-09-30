import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { exportGiaPhaToXmlString, parseXmlStringToGiaPha } from './src/utils/xmlParser';
import { GiaPhaData } from './src/types/giapha';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const XML_FILE = path.join(DATA_DIR, 'giapha_chugia.xml');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

app.use(express.json({ limit: '20mb' }));
app.use(express.text({ type: 'application/xml', limit: '20mb' }));

// Helper to read XML file
function readDatabaseXml(): string {
  if (fs.existsSync(XML_FILE)) {
    return fs.readFileSync(XML_FILE, 'utf-8');
  }
  return '';
}

// Helper to write XML file
function writeDatabaseXml(xmlContent: string) {
  fs.writeFileSync(XML_FILE, xmlContent, 'utf-8');
}

// API: Get Gia Pha Data (parsed from XML)
app.get('/api/giapha', (_req: Request, res: Response) => {
  try {
    const xml = readDatabaseXml();
    if (!xml) {
      return res.status(404).json({ error: 'Chưa có cơ sở dữ liệu XML' });
    }
    const data = parseXmlStringToGiaPha(xml);
    return res.json({ success: true, data, rawXml: xml });
  } catch (err: any) {
    console.error('Lỗi đọc XML:', err);
    return res.status(500).json({ error: 'Lỗi phân tích cơ sở dữ liệu XML: ' + err.message });
  }
});

// API: Save Gia Pha Data (writes to XML file)
app.post('/api/giapha', (req: Request, res: Response) => {
  try {
    const updatedData: GiaPhaData = req.body;
    if (!updatedData || !updatedData.danhSachThanhVien) {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }

    // Convert to XML string and save
    const xml = exportGiaPhaToXmlString(updatedData);
    writeDatabaseXml(xml);

    // Auto-create snapshot in backup dir
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const autoBackupPath = path.join(BACKUP_DIR, `giapha_autobackup_${timestamp}.xml`);
    fs.writeFileSync(autoBackupPath, xml, 'utf-8');

    return res.json({
      success: true,
      message: 'Đã lưu thành công vào cơ sở dữ liệu XML!',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Lỗi ghi XML:', err);
    return res.status(500).json({ error: 'Lỗi lưu cơ sở dữ liệu XML: ' + err.message });
  }
});

// API: Export Raw XML File (download)
app.get('/api/giapha/export-xml', (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(XML_FILE)) {
      return res.status(404).send('Không tìm thấy tệp XML cơ sở dữ liệu');
    }
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="giapha_chugia_langson_bacgiang.xml"');
    return fs.createReadStream(XML_FILE).pipe(res);
  } catch (err: any) {
    return res.status(500).send('Lỗi xuất XML: ' + err.message);
  }
});

// API: Import XML File Content
app.post('/api/giapha/import-xml', (req: Request, res: Response) => {
  try {
    const xmlContent = typeof req.body === 'string' ? req.body : req.body.xml;
    if (!xmlContent || !xmlContent.includes('<GiaPhaChuGia>')) {
      return res.status(400).json({ error: 'Nội dung tệp XML không đúng cấu trúc GiaPhaChuGia' });
    }

    // Validate parsing
    const parsed = parseXmlStringToGiaPha(xmlContent);
    if (!parsed.danhSachThanhVien || parsed.danhSachThanhVien.length === 0) {
      return res.status(400).json({ error: 'Tệp XML không chứa dữ liệu thành viên hợp lệ' });
    }

    // Save previous version as backup before overwriting
    if (fs.existsSync(XML_FILE)) {
      const prev = fs.readFileSync(XML_FILE, 'utf-8');
      const backupPath = path.join(BACKUP_DIR, `pre_import_backup_${Date.now()}.xml`);
      fs.writeFileSync(backupPath, prev, 'utf-8');
    }

    writeDatabaseXml(xmlContent);
    return res.json({
      success: true,
      message: 'Nhập tệp XML cơ sở dữ liệu thành công!',
      count: parsed.danhSachThanhVien.length,
      data: parsed,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi nhập tệp XML: ' + err.message });
  }
});

// API: Backups list
app.get('/api/giapha/backups', (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.json({ backups: [] });
    }
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.xml'));
    const backups = files.map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        id: file,
        tenFile: file,
        thoiGian: stat.mtime.toISOString(),
        kichThuoc: `${(stat.size / 1024).toFixed(1)} KB`,
        nguoiTao: file.includes('autobackup') ? 'Hệ thống tự động' : 'Chu Văn Lương (Admin)',
      };
    }).sort((a, b) => new Date(b.thoiGian).getTime() - new Date(a.thoiGian).getTime());

    return res.json({ backups });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi tải danh sách sao lưu: ' + err.message });
  }
});

// API: Create Manual Backup
app.post('/api/giapha/create-backup', (req: Request, res: Response) => {
  try {
    const { note } = req.body || {};
    const xml = readDatabaseXml();
    if (!xml) {
      return res.status(400).json({ error: 'Không có dữ liệu để sao lưu' });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `giapha_backup_manual_${timestamp}.xml`;
    const target = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(target, xml, 'utf-8');

    return res.json({
      success: true,
      message: `Đã tạo bản sao lưu ${filename} thành công!`,
      backup: {
        id: filename,
        tenFile: filename,
        thoiGian: new Date().toISOString(),
        kichThuoc: `${(Buffer.byteLength(xml) / 1024).toFixed(1)} KB`,
        nguoiTao: 'Chu Văn Lương (Admin)',
        ghiChu: note || 'Bản sao lưu thủ công',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi tạo sao lưu: ' + err.message });
  }
});

// API: Restore Backup
app.post('/api/giapha/restore-backup', (req: Request, res: Response) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Thiếu tên tệp khôi phục' });
    }
    const target = path.join(BACKUP_DIR, path.basename(filename));
    if (!fs.existsSync(target)) {
      return res.status(404).json({ error: 'Tệp sao lưu không tồn tại' });
    }
    const content = fs.readFileSync(target, 'utf-8');
    const parsed = parseXmlStringToGiaPha(content);
    writeDatabaseXml(content);

    return res.json({
      success: true,
      message: `Đã phục hồi dữ liệu từ bản sao lưu ${filename}!`,
      data: parsed,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi phục hồi bản sao lưu: ' + err.message });
  }
});

// API: Send Event Notification (Email/SMS simulation with logging)
app.post('/api/giapha/notify-event', (req: Request, res: Response) => {
  try {
    const { eventTitle, eventDate, channels, recipients, customMessage } = req.body;
    if (!eventTitle) {
      return res.status(400).json({ error: 'Thiếu tiêu đề sự kiện' });
    }

    const logEntry = {
      id: 'notify-' + Date.now(),
      tieuDe: `Thông báo Giỗ tế: ${eventTitle}`,
      noiDung: customMessage || `Kính mời bà con tộc nhân họ Chu về dự ${eventTitle} vào ngày ${eventDate} tại Nhà thờ Đại Tôn Họ Chu, xã Lãng Sơn, huyện Yên Dũng, tỉnh Bắc Giang.`,
      kenh: channels || 'all',
      danhSachNhan: recipients || ['Bà con Chi Đại Tôn', 'Bà con Chi Đệ Nhị', 'Bà con Chi Đệ Tam'],
      thoiGianGui: new Date().toISOString(),
      trangThai: 'thanh_cong',
    };

    return res.json({
      success: true,
      message: `Đã phát thông báo thành công qua ${channels === 'all' ? 'Email & SMS' : channels.toUpperCase()} tới ${recipients ? recipients.length : 150} tộc nhân họ Chu!`,
      log: logEntry,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi gửi thông báo: ' + err.message });
  }
});

// API: User Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // Default admin required by prompt: chuluong / Admin@123456
    if (username === 'chuluong' && password === 'Admin@123456') {
      return res.json({
        success: true,
        user: {
          id: 'usr-01',
          username: 'chuluong',
          hoTen: 'Chu Văn Lương',
          role: 'admin',
          email: 'chuluong.langson@gmail.com',
          sdt: '0983123456',
        },
      });
    }

    // Check in database XML accounts
    const xml = readDatabaseXml();
    if (xml) {
      const data = parseXmlStringToGiaPha(xml);
      const matched = data.danhSachTaiKhoan.find(
        u => u.username.toLowerCase() === (username || '').toLowerCase() && u.password === password
      );
      if (matched) {
        if (matched.trangThai === 'locked') {
          return res.status(403).json({ error: 'Tài khoản này đang bị tạm khóa' });
        }
        return res.json({
          success: true,
          user: {
            id: matched.id,
            username: matched.username,
            hoTen: matched.hoTen,
            role: matched.role,
            email: matched.email,
            sdt: matched.sdt,
          },
        });
      }
    }

    return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi đăng nhập: ' + err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Chu Gia Genealogies Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
