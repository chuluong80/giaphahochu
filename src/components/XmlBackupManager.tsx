import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  FileCode, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Copy,
  Check
} from 'lucide-react';
import { exportGiaPhaToXmlString } from '../utils/xmlParser';
import { GiaPhaData, BanSaoLuu } from '../types/giapha';
import { exportRawXmlFile, importXmlFile, fetchBackups, createManualBackup, restoreBackup } from '../services/api';

interface XmlBackupManagerProps {
  isOpen: boolean;
  onClose: () => void;
  data: GiaPhaData;
  onDataRestored: (newData: GiaPhaData) => void;
  isAdmin: boolean;
}

export const XmlBackupManager: React.FC<XmlBackupManagerProps> = ({
  isOpen,
  onClose,
  data,
  onDataRestored,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'backups' | 'xmlViewer'>('backups');
  const [backups, setBackups] = useState<BanSaoLuu[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [backupNote, setBackupNote] = useState('');
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const currentXml = exportGiaPhaToXmlString(data);

  useEffect(() => {
    if (isOpen) {
      loadBackupsList();
    }
  }, [isOpen]);

  const loadBackupsList = async () => {
    setLoadingBackups(true);
    try {
      const list = await fetchBackups();
      setBackups(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBackups(false);
    }
  };

  if (!isOpen) return null;

  const handleCreateSnapshot = async () => {
    if (!isAdmin) {
      alert('Chỉ quản trị viên mới có quyền tạo bản sao lưu hệ thống');
      return;
    }
    setCreatingBackup(true);
    setStatusMessage(null);
    try {
      const res = await createManualBackup(backupNote || 'Sao lưu thủ công bởi Quản trị viên Chu Văn Lương');
      if (res.success) {
        setStatusMessage({ text: 'Tạo bản sao lưu XML thành công!', type: 'success' });
        setBackupNote('');
        await loadBackupsList();
      }
    } catch (e: any) {
      setStatusMessage({ text: 'Lỗi tạo sao lưu: ' + e.message, type: 'error' });
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleRestore = async (filename: string) => {
    if (!isAdmin) {
      alert('Chỉ quản trị viên mới có quyền khôi phục dữ liệu');
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn khôi phục toàn bộ gia phả từ bản sao lưu: ${filename}?`)) {
      return;
    }

    setRestoring(true);
    setStatusMessage(null);
    try {
      const restored = await restoreBackup(filename);
      onDataRestored(restored);
      setStatusMessage({ text: `Đã khôi phục thành công từ bản ${filename}!`, type: 'success' });
    } catch (e: any) {
      setStatusMessage({ text: 'Lỗi khôi phục: ' + e.message, type: 'error' });
    } finally {
      setRestoring(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      alert('Chỉ quản trị viên mới có quyền nạp tệp XML');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const content = ev.target?.result as string;
      try {
        const imported = await importXmlFile(content);
        onDataRestored(imported);
        setStatusMessage({ text: 'Nạp tệp XML thành công!', type: 'success' });
        await loadBackupsList();
      } catch (err: any) {
        setStatusMessage({ text: 'Lỗi nạp tệp: ' + err.message, type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(currentXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#240e0c] border border-[#59221d] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#4d1612] to-[#2d0d0a] border-b border-[#5e2520] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#691f19] border border-amber-500/50 text-amber-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heritage text-amber-200">
                Trung tâm Cơ sở Dữ liệu XML &amp; Sao lưu An toàn
              </h3>
              <p className="text-xs text-[#c9a788]">
                Bảo vệ toàn vẹn gia phả họ Chu Lãng Sơn, phòng tránh mất mát dữ liệu
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

        {/* Tab switcher */}
        <div className="bg-[#180806] px-6 pt-3 border-b border-[#3d1714] flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('backups')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'backups'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-[#9c7b60] hover:text-[#ebd3bd]'
            }`}
          >
            Bản sao lưu &amp; Phục hồi
          </button>
          <button
            onClick={() => setActiveTab('xmlViewer')}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'xmlViewer'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-[#9c7b60] hover:text-[#ebd3bd]'
            }`}
          >
            Trực quan hóa Mã nguồn XML ({Math.round(currentXml.length / 1024)} KB)
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div className={`mx-6 mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border border-red-800 text-red-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#ebd3be]">
          {activeTab === 'backups' ? (
            <>
              {/* Quick Actions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Download XML */}
                <div className="p-4 bg-[#190806] rounded-xl border border-[#421814] flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-amber-200 flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Xuất tệp CSDL XML về máy tính</span>
                    </h4>
                    <p className="text-[#a6866b] text-[11px] mt-1">
                      Tải toàn bộ hồ sơ gia phả dạng tệp XML chuẩn để lưu trữ ngoại tuyến hoặc gửi lưu chi phái.
                    </p>
                  </div>
                  <button
                    onClick={() => exportRawXmlFile()}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#3b1512] hover:bg-[#521f1a] text-amber-200 font-bold border border-[#5e231e] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải tệp giapha_chugia.xml</span>
                  </button>
                </div>

                {/* Upload XML */}
                <div className="p-4 bg-[#190806] rounded-xl border border-[#421814] flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-amber-200 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Nạp CSDL từ tệp XML đã lưu</span>
                    </h4>
                    <p className="text-[#a6866b] text-[11px] mt-1">
                      Khôi phục gia phả từ một tệp XML bất kỳ trên máy của bạn (Hệ thống sẽ tự động sao lưu trước khi nạp).
                    </p>
                  </div>
                  <label className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold border transition-colors cursor-pointer ${
                    isAdmin
                      ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-800 text-emerald-200'
                      : 'bg-stone-900 border-stone-800 text-stone-500 opacity-60 cursor-not-allowed'
                  }`}>
                    <Upload className="w-4 h-4" />
                    <span>Chọn tệp XML nạp vào</span>
                    <input
                      type="file"
                      accept=".xml"
                      disabled={!isAdmin}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Create Manual Backup Box */}
              {isAdmin && (
                <div className="p-4 bg-[#190806] rounded-xl border border-[#421814] space-y-3">
                  <h4 className="font-bold text-amber-200 flex items-center gap-2">
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Tạo bản sao lưu tức thì (Snapshot)</span>
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ghi chú bản sao lưu (Ví dụ: Trước ngày Giỗ Thủy Tổ 2026)..."
                      value={backupNote}
                      onChange={(e) => setBackupNote(e.target.value)}
                      className="flex-1 bg-[#130504] border border-[#3b1713] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      onClick={handleCreateSnapshot}
                      disabled={creatingBackup}
                      className="px-4 py-1.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-amber-100 font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      {creatingBackup ? 'Đang tạo...' : 'Tạo sao lưu ngay'}
                    </button>
                  </div>
                </div>
              )}

              {/* Backup History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Lịch sử các Bản sao lưu máy chủ</span>
                  </h4>
                  <span className="text-[11px] text-[#9c7b60]">
                    Tự động tạo snapshot mỗi khi có chỉnh sửa
                  </span>
                </div>

                {loadingBackups ? (
                  <div className="text-center py-6 text-[#9c7b60]">Đang kiểm tra danh sách sao lưu...</div>
                ) : backups.length === 0 ? (
                  <div className="p-4 rounded-lg bg-[#180806] border border-[#3d1714] text-center text-[#9c7b60]">
                    Chưa có bản sao lưu bổ sung nào trên máy chủ.
                  </div>
                ) : (
                  <div className="bg-[#180806] rounded-xl border border-[#3d1714] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#120403] border-b border-[#3b1713] text-[#a6866b] uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3">Tên tệp</th>
                            <th className="py-2.5 px-3">Thời gian tạo</th>
                            <th className="py-2.5 px-3">Dung lượng</th>
                            <th className="py-2.5 px-3">Người tạo</th>
                            <th className="py-2.5 px-3 text-right">Phục hồi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#33120f]">
                          {backups.map(b => (
                            <tr key={b.id} className="hover:bg-[#260e0c]">
                              <td className="py-2.5 px-3 font-mono text-amber-200">{b.tenFile}</td>
                              <td className="py-2.5 px-3 text-[#a8876c]">
                                {new Date(b.thoiGian).toLocaleString('vi-VN')}
                              </td>
                              <td className="py-2.5 px-3 text-[#cfb095]">{b.kichThuoc}</td>
                              <td className="py-2.5 px-3 text-[#cfb095]">{b.nguoiTao}</td>
                              <td className="py-2.5 px-3 text-right">
                                {isAdmin && (
                                  <button
                                    onClick={() => handleRestore(b.tenFile)}
                                    disabled={restoring}
                                    className="px-2.5 py-1 rounded bg-[#3b1512] hover:bg-emerald-950 hover:text-emerald-200 text-amber-300 font-semibold text-[11px] border border-[#52211c] transition-colors cursor-pointer"
                                  >
                                    Phục hồi bản này
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* XML Source Viewer */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#a6866b]">
                  Dữ liệu cấu trúc XML hiện thời (GiaPhaChuGia)
                </span>
                <button
                  onClick={handleCopyXml}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#3b1512] hover:bg-[#521f1a] text-amber-200 border border-[#57221e] cursor-pointer"
                >
                  {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedXml ? 'Đã sao chép!' : 'Sao chép XML'}</span>
                </button>
              </div>

              <pre className="bg-[#120403] border border-[#3d1714] rounded-xl p-4 text-[11px] font-mono text-amber-100/90 overflow-x-auto max-h-[450px] leading-relaxed">
                {currentXml}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#180806] border-t border-[#3b1713] flex items-center justify-between text-xs text-[#99795e]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chuẩn hóa XML dòng họ Chu · Tự động đồng bộ</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#381613] hover:bg-[#4d1f1b] text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
