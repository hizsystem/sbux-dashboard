"use client";

import type { ProjectRow } from '@/lib/db';

function fmt(n: number) {
  if (n === 0) return '—';
  if (Math.abs(n) >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (Math.abs(n) >= 10_000) return `${(n / 10_000).toFixed(0)}만`;
  return n.toLocaleString();
}

function fmtKRW(n: number) {
  if (n === 0) return '₩ —';
  if (Math.abs(n) >= 100_000_000) return `₩ ${(n / 100_000_000).toFixed(1)}억`;
  if (Math.abs(n) >= 10_000) return `₩ ${(n / 10_000).toFixed(0)}만`;
  return `₩ ${n.toLocaleString()}`;
}

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: 'default' | 'green' | 'red' | 'blue';
}

function KpiCard({ label, value, sub, accent = 'default' }: CardProps) {
  const accents = {
    default: 'border-gray-200',
    green:   'border-emerald-200 bg-emerald-50/40',
    red:     'border-red-200 bg-red-50/30',
    blue:    'border-indigo-200 bg-indigo-50/30',
  };
  const valueColors = {
    default: 'text-gray-900',
    green:   'text-emerald-700',
    red:     'text-red-600',
    blue:    'text-indigo-700',
  };
  return (
    <div className={`rounded-2xl border p-5 ${accents[accent]}`}>
      <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
      <p className={`text-xl font-black ${valueColors[accent]} leading-none`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </div>
  );
}

export function FinancialSummary({ projects }: { projects: ProjectRow[] }) {
  const withData = projects.filter(p => p.revenue > 0 || p.cost > 0);

  const totalRevenue = projects.reduce((s, p) => s + (p.revenue ?? 0), 0);
  const totalCost    = projects.reduce((s, p) => s + (p.cost    ?? 0), 0);
  const totalProfit  = totalRevenue - totalCost;
  const marginRate   = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  if (withData.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      {/* KPI 카드 4개 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          label="총 매출"
          value={fmtKRW(totalRevenue)}
          sub={`${projects.length}개 프로젝트`}
          accent="blue"
        />
        <KpiCard
          label="총 매입"
          value={fmtKRW(totalCost)}
          sub="집행 비용 합계"
        />
        <KpiCard
          label="총 수익"
          value={fmtKRW(totalProfit)}
          sub={totalProfit >= 0 ? '흑자' : '적자'}
          accent={totalProfit >= 0 ? 'green' : 'red'}
        />
        <KpiCard
          label="평균 수익률"
          value={totalRevenue > 0 ? `${marginRate}%` : '—'}
          sub={marginRate >= 30 ? '양호' : marginRate >= 10 ? '주의' : totalRevenue > 0 ? '위험' : '데이터 없음'}
          accent={marginRate >= 30 ? 'green' : marginRate >= 10 ? 'default' : totalRevenue > 0 ? 'red' : 'default'}
        />
      </div>

      {/* 프로젝트별 재무 테이블 */}
      {withData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">프로젝트별 재무 현황</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">프로젝트</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">매출</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">매입</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">수익</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">수익률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withData.map(p => {
                  const profit = (p.revenue ?? 0) - (p.cost ?? 0);
                  const margin = p.revenue > 0 ? Math.round((profit / p.revenue) * 100) : null;
                  const positive = profit >= 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            p.status === 'active' ? 'bg-emerald-400' :
                            p.status === 'paused' ? 'bg-amber-400' : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className="text-sm font-bold text-gray-800 leading-none">{p.name}</p>
                            {p.client && <p className="text-[10px] text-gray-400 mt-0.5">{p.client}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-indigo-600">{fmtKRW(p.revenue ?? 0)}</td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{fmtKRW(p.cost ?? 0)}</td>
                      <td className={`px-4 py-4 text-right text-sm font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {positive ? '+' : ''}{fmtKRW(profit)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {margin !== null ? (
                          <span className={`text-sm font-black px-2 py-1 rounded-lg ${
                            margin >= 30 ? 'bg-emerald-50 text-emerald-700' :
                            margin >= 10 ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {margin}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* 합계 행 */}
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50/80">
                  <td className="px-5 py-3 text-xs font-black text-gray-600">합계</td>
                  <td className="px-4 py-3 text-right text-sm font-black text-indigo-700">{fmtKRW(totalRevenue)}</td>
                  <td className="px-4 py-3 text-right text-sm font-black text-gray-700">{fmtKRW(totalCost)}</td>
                  <td className={`px-4 py-3 text-right text-sm font-black ${totalProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {totalProfit >= 0 ? '+' : ''}{fmtKRW(totalProfit)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-black px-2 py-1 rounded-lg ${
                      marginRate >= 30 ? 'bg-emerald-50 text-emerald-700' :
                      marginRate >= 10 ? 'bg-amber-50 text-amber-700' :
                      totalRevenue > 0 ? 'bg-red-50 text-red-600' : 'text-gray-300'
                    }`}>
                      {totalRevenue > 0 ? `${marginRate}%` : '—'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
