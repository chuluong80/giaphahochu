import React, { useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Heart, 
  Flame, 
  Network, 
  TrendingUp, 
  GraduationCap, 
  Briefcase, 
  Download,
  PieChart
} from 'lucide-react';
import { ThanhVien, ChiPhai } from '../types/giapha';

interface StatisticsViewProps {
  members: ThanhVien[];
  branches: ChiPhai[];
  onExportReport: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  members,
  branches,
  onExportReport,
}) => {
  const stats = useMemo(() => {
    const total = members.length;
    const living = members.filter(m => m.conSong).length;
    const deceased = total - living;
    const male = members.filter(m => m.gioiTinh === 'nam').length;
    const female = total - male;

    // By generation
    const genCounts: Record<number, number> = {};
    members.forEach(m => {
      genCounts[m.theHe] = (genCounts[m.theHe] || 0) + 1;
    });

    // By branch
    const branchCounts: Record<string, number> = {};
    branches.forEach(b => { branchCounts[b.id] = 0; });
    members.forEach(m => {
      branchCounts[m.chiPhaiId] = (branchCounts[m.chiPhaiId] || 0) + 1;
    });

    // By age groups (for living members with namSinh)
    const currentYear = new Date().getFullYear();
    let under18 = 0;
    let age18to35 = 0;
    let age36to60 = 0;
    let over60 = 0;

    members.filter(m => m.conSong && m.namSinh).forEach(m => {
      const age = currentYear - (m.namSinh || currentYear);
      if (age < 18) under18++;
      else if (age <= 35) age18to35++;
      else if (age <= 60) age36to60++;
      else over60++;
    });

    return {
      total,
      living,
      deceased,
      male,
      female,
      genCounts,
      branchCounts,
      ageStats: { under18, age18to35, age36to60, over60 },
    };
  }, [members, branches]);

  const maxGenCount = Math.max(...Object.values(stats.genCounts), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4d1f1b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-amber-200">
            Thống kê &amp; Báo cáo Dòng họ Chu
          </h2>
          <p className="text-xs text-[#c4a182] mt-1">
            Tổng hợp dữ liệu dân số, cơ cấu thế hệ, chi phái và độ tuổi thời gian thực
          </p>
        </div>

        <button
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2d110e] hover:bg-[#421814] text-amber-200 text-xs font-semibold rounded-lg border border-[#52211c] shadow transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Xuất báo cáo PDF</span>
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Members */}
        <div className="bg-[#240e0c] p-4 rounded-xl border border-[#4d1f1b] shadow-lg flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#451612] text-amber-400 border border-[#5e231e]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#b89574]">Tổng số tộc nhân</div>
            <div className="text-xl font-bold text-amber-100 tabular-nums">{stats.total}</div>
          </div>
        </div>

        {/* Living */}
        <div className="bg-[#240e0c] p-4 rounded-xl border border-[#4d1f1b] shadow-lg flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#0e301d] text-emerald-400 border border-emerald-800">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#b89574]">Hiện tại thế</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">
              {stats.living} <span className="text-xs font-normal text-[#a38062]">({Math.round((stats.living / stats.total) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Deceased */}
        <div className="bg-[#240e0c] p-4 rounded-xl border border-[#4d1f1b] shadow-lg flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#3b1c10] text-amber-400 border border-amber-800">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#b89574]">Đã quy tiên</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums">
              {stats.deceased} <span className="text-xs font-normal text-[#a38062]">({Math.round((stats.deceased / stats.total) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Male */}
        <div className="bg-[#240e0c] p-4 rounded-xl border border-[#4d1f1b] shadow-lg flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#18283d] text-sky-400 border border-sky-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#b89574]">Tộc nhân Nam</div>
            <div className="text-xl font-bold text-sky-300 tabular-nums">
              {stats.male} <span className="text-xs font-normal text-[#a38062]">({Math.round((stats.male / stats.total) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Female */}
        <div className="bg-[#240e0c] p-4 rounded-xl border border-[#4d1f1b] shadow-lg flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="p-3 rounded-lg bg-[#3d1326] text-rose-400 border border-rose-800">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#b89574]">Tộc nhân Nữ/Dâu</div>
            <div className="text-xl font-bold text-rose-300 tabular-nums">
              {stats.female} <span className="text-xs font-normal text-[#a38062]">({Math.round((stats.female / stats.total) * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Distribution by Generation */}
        <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3d1714]">
            <h3 className="text-base font-bold font-heritage text-amber-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Phân bố theo các Thế hệ (Đời)</span>
            </h3>
            <span className="text-xs text-[#a68469]">Từ Đời 1 đến hiện tại</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.keys(stats.genCounts).map((genKey) => {
              const gen = Number(genKey);
              const count = stats.genCounts[gen] || 0;
              const percent = Math.round((count / maxGenCount) * 100);

              return (
                <div key={gen} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#d6b99d]">
                    <span className="font-semibold text-amber-300">Đời thứ {gen}</span>
                    <span className="font-mono text-amber-100">{count} người</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#180806] overflow-hidden p-0.5 border border-[#3d1714]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-700 via-amber-600 to-amber-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Distribution by Branch */}
        <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3d1714]">
            <h3 className="text-base font-bold font-heritage text-amber-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-amber-400" />
              <span>Cơ cấu các Chi phái</span>
            </h3>
            <span className="text-xs text-[#a68469]">Dòng tộc xã Lãng Sơn</span>
          </div>

          <div className="space-y-4 pt-2">
            {branches.map(b => {
              const count = stats.branchCounts[b.id] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              return (
                <div key={b.id} className="p-3 bg-[#180806] rounded-xl border border-[#3b1713] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-100">{b.tenChi}</span>
                      <span className="text-[#a18166] text-[11px] block">{b.diaBan}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-300 font-mono">{count}</span>
                      <span className="text-[#a18166] text-xs"> ({percent}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-[#29100d] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Age Structure of Living Members */}
      <div className="bg-[#240e0c] rounded-2xl border border-[#4f1e1a] p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold font-heritage text-amber-200">
          Cơ cấu Độ tuổi Tộc nhân Đang sinh sống
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-[#180806] p-4 rounded-xl border border-[#3b1714]">
            <div className="text-xs text-[#b89574]">Dưới 18 tuổi</div>
            <div className="text-xl font-bold text-amber-300 mt-1 font-mono">
              {stats.ageStats.under18}
            </div>
            <div className="text-[10px] text-[#8c6d52] mt-0.5">Thế hệ tương lai</div>
          </div>

          <div className="bg-[#180806] p-4 rounded-xl border border-[#3b1714]">
            <div className="text-xs text-[#b89574]">18 - 35 tuổi</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
              {stats.ageStats.age18to35}
            </div>
            <div className="text-[10px] text-[#8c6d52] mt-0.5">Thanh niên lập nghiệp</div>
          </div>

          <div className="bg-[#180806] p-4 rounded-xl border border-[#3b1714]">
            <div className="text-xs text-[#b89574]">36 - 60 tuổi</div>
            <div className="text-xl font-bold text-sky-400 mt-1 font-mono">
              {stats.ageStats.age36to60}
            </div>
            <div className="text-[10px] text-[#8c6d52] mt-0.5">Trụ cột gia đình</div>
          </div>

          <div className="bg-[#180806] p-4 rounded-xl border border-[#3b1714]">
            <div className="text-xs text-[#b89574]">Trên 60 tuổi</div>
            <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
              {stats.ageStats.over60}
            </div>
            <div className="text-[10px] text-[#8c6d52] mt-0.5">Các cụ bô lão, cao niên</div>
          </div>
        </div>
      </div>
    </div>
  );
};
