"use client";

import type { ProjectData } from '@/lib/sheets';
import type { ProjectRow, CampaignRow } from '@/lib/db';
import { TrendingUp, AlertCircle, Target } from 'lucide-react';

function fmtKRW(n: number) {
  if (!n) return '—';
  if (n >= 100_000_000) return `₩ ${(n / 100_000_000).toFixed(0)}억`;
  if (n >= 10_000)      return `₩ ${(n / 10_000).toFixed(0)}만`;
  return `₩ ${n.toLocaleString()}`;
}

function fmtNum(n: number) { return n ? n.toLocaleString() : '—'; }

function Bar({ value, color = 'bg-indigo-500' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function RateBadge({ rate }: { rate: number }) {
  const cls = rate >= 80 ? 'bg-emerald-50 text-emerald-700' : rate >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600';
  return <span className={`text-xs font-black px-2 py-0.5 rounded-md ${cls}`}>{rate}%</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 text-white px-5 py-2.5">
      <p className="text-sm font-black tracking-tight">{children}</p>
    </div>
  );
}

interface Props {
  projectData?: ProjectData | null;
  project?: ProjectRow | null;
  campaigns?: CampaignRow[];
}

export const SummaryView = ({ projectData, project: p, campaigns = [] }: Props) => {
  const totalBudgetStr = p?.total_budget ?? projectData?.totalBudget ?? '';
  const totalBudgetNum = parseInt(totalBudgetStr.replace(/[^0-9]/g, '') || '0');
  const execRate       = p?.execution_rate ?? projectData?.executionRate ?? 0;
  const spentNum       = projectData
    ? parseInt((projectData.spentBudget ?? '').replace(/[^0-9]/g, '') || '0')
    : Math.round(totalBudgetNum * execRate / 100);
  const remainingNum   = totalBudgetNum - spentNum;

  const revenue = p?.revenue ?? 0;
  const cost    = p?.cost    ?? 0;
  const profit  = revenue - cost;
  const margin  = revenue > 0 ? Math.round((profit / revenue) * 100) : null;

  const igTarget  = projectData?.igFollowersTarget ?? 25000;
  const igCurrent = projectData?.igFollowers       ?? 0;
  const igRate    = projectData?.igFollowersRate    ?? (igTarget > 0 ? Math.round((igCurrent / igTarget) * 100) : 0);
  const kaTarget  = projectData?.kaFollowersTarget  ?? 105000;
  const kaCurrent = projectData?.kaFollowers        ?? 0;
  const kaRate    = projectData?.kaFollowersRate     ?? (kaTarget > 0 ? Math.round((kaCurrent / kaTarget) * 100) : 0);

  const PHASE_COLOR: Record<string, string> = {
    '기획': 'bg-blue-500', '제작': 'bg-violet-500', '운영': 'bg-emerald-500', '종료': 'bg-gray-300',
  };
  const PHASE_BADGE: Record<string, string> = {
    '기획': 'bg-blue-50 text-blue-700 border-blue-200',
    '제작': 'bg-violet-50 text-violet-700 border-violet-200',
    '운영': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '종료': 'bg-gray-50 text-gray-500 border-gray-200',
  };

  return (
    <div className="space-y-3">

      {/* Row 1: 매출 현황 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-gray-700">매출 현황</p>
          <span className="text-[10px] text-gray-400">세금계산서 발행 기준</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '총 매출', value: fmtKRW(revenue), sub: '청구액', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
            { label: '총 매입', value: fmtKRW(cost),    sub: '집행액', color: 'text-gray-700',   bg: 'bg-gray-50',   border: 'border-gray-100'  },
            { label: '수익',    value: fmtKRW(profit),  sub: '마진',   color: profit >= 0 ? 'text-emerald-600' : 'text-red-500', bg: profit >= 0 ? 'bg-emerald-50' : 'bg-red-50', border: profit >= 0 ? 'border-emerald-100' : 'border-red-100' },
            { label: '수익률',  value: margin !== null ? `${margin}%` : '—', sub: '마진율', color: margin !== null ? (margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-500' : 'text-red-500') : 'text-gray-300', bg: 'bg-gray-50', border: 'border-gray-100' },
          ].map(({ label, value, sub, color, bg, border }) => (
            <div key={label} className={`rounded-xl border ${border} ${bg} px-4 py-3`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-lg font-black ${color} leading-none`}>{value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>
        {revenue > 0 && cost > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span className="font-bold">매출 대비 매입 비율</span>
              <span className="font-black text-gray-600">{Math.round((cost / revenue) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-700" style={{ width: `${Math.min(Math.round((cost / revenue) * 100), 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Row 2: 프로젝트 개요 + KPI */}
      <div className="grid grid-cols-2 gap-3">

        {/* 프로젝트 개요 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-800">
            <p className="text-xs font-black text-white">프로젝트 개요</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: '프로젝트명', value: p?.name ?? '—' },
                { label: '운영 기간',  value: p?.period ?? '—' },
                { label: '핵심 목표',  value: p?.objective || '—' },
                { label: '핵심 KPI',   value: p?.kpi_desc || '—' },
                { label: '운영 채널',  value: p?.channels || '—' },
                { label: '담당',       value: p?.manager ?? '—' },
              ].map(({ label, value }) => (
                <tr key={label} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5 font-bold text-gray-500 w-24 bg-gray-50 border-r border-gray-100 text-xs">{label}</td>
                  <td className="px-4 py-2.5 text-gray-800 font-medium text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-100 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-500">전체 진행률</span>
                <span className="font-black text-indigo-600">{p?.progress ?? 0}%</span>
              </div>
              <Bar value={p?.progress ?? 0} />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <AlertCircle size={10} className="text-gray-300" />
              <span className="text-gray-400">리스크</span>
              <span className="text-emerald-600 font-bold">정상 {p?.risk_green ?? 0}</span>
              <span className="text-amber-500 font-bold">주의 {p?.risk_yellow ?? 0}</span>
              <span className="text-red-500 font-bold">위험 {p?.risk_red ?? 0}</span>
            </div>
          </div>
        </div>

        {/* KPI 진행 현황 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-800">
            <p className="text-xs font-black text-white">KPI 진행 현황</p>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: '📸 IG (Instagram)', bg: 'bg-pink-50', textCls: 'text-pink-600',
                rows: [
                  { name: '팔로워', target: igTarget, current: igCurrent, rate: igRate, hasData: !!igCurrent },
                  { name: '월 평균 도달', target: 120000, current: 0, rate: 0, hasData: false },
                  { name: '평균 참여율', target: 0, current: 0, rate: 0, hasData: false },
                ]},
              { label: '💬 KA (KakaoStory)', bg: 'bg-yellow-50', textCls: 'text-yellow-700',
                rows: [
                  { name: '팔로워', target: kaTarget, current: kaCurrent, rate: kaRate, hasData: !!kaCurrent },
                  { name: '월 평균 도달', target: 0, current: 0, rate: 0, hasData: false },
                  { name: '광고 기여율', target: 0, current: 0, rate: 0, hasData: false },
                ]},
            ].map(({ label, bg, textCls, rows }) => (
              <div key={label}>
                <div className={`px-4 py-2 border-b border-gray-100 ${bg}`}>
                  <p className={`text-xs font-black ${textCls}`}>{label}</p>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['지표','목표','현재','달성률'].map(h => (
                        <th key={h} className={`px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase ${h === '지표' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map(r => (
                      <tr key={r.name} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2 font-bold text-gray-700">{r.name}</td>
                        <td className="px-3 py-2 text-right text-gray-500">{r.target ? fmtNum(r.target) : '—'}</td>
                        <td className="px-3 py-2 text-right font-bold text-gray-800">{r.hasData ? fmtNum(r.current) : '—'}</td>
                        <td className="px-3 py-2 text-right">{r.hasData ? <RateBadge rate={r.rate} /> : <span className="text-gray-300">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: 예산 현황 + 성과 지표 */}
      <div className="grid grid-cols-2 gap-3">

        {/* 예산 현황 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-800">
            <p className="text-xs font-black text-white">예산 현황</p>
          </div>
          <div className="divide-x divide-gray-100 flex">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-left">항목</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">총 예산</td>
                  <td className="px-4 py-2.5 text-right font-black text-gray-900">{p?.total_budget || '—'}</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">현재 집행</td>
                  <td className="px-4 py-2.5 text-right font-bold text-indigo-600">{spentNum > 0 ? `₩ ${spentNum.toLocaleString()}` : '—'}</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">잔액</td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-600">{remainingNum > 0 ? `₩ ${remainingNum.toLocaleString()}` : '—'}</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">집행률</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16"><Bar value={execRate} /></div>
                      <span className="font-black text-indigo-600 shrink-0">{execRate}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-xs border-l border-gray-100">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-left">재무</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">금액</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">비율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">매출</td>
                  <td className="px-4 py-2.5 text-right font-bold text-indigo-600">{fmtKRW(revenue)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-300">—</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">매입</td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-600">{fmtKRW(cost)}</td>
                  <td className="px-4 py-2.5 text-right">
                    {revenue > 0 && cost > 0
                      ? <span className="font-bold text-gray-500">{Math.round((cost / revenue) * 100)}%</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-bold text-gray-700">수익</td>
                  <td className="px-4 py-2.5 text-right font-black">
                    <span className={profit >= 0 ? 'text-emerald-600' : 'text-red-500'}>{fmtKRW(profit)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {margin !== null ? <RateBadge rate={margin} /> : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
                <tr className="bg-gray-50/80">
                  <td className="px-4 py-2.5 font-black text-gray-800">수익률</td>
                  <td colSpan={2} className="px-4 py-2.5 text-right">
                    {margin !== null
                      ? <span className={`text-base font-black ${margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-500' : 'text-red-500'}`}>{margin}%</span>
                      : <span className="text-gray-300">미입력</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 성과 지표 + 팀 목표 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '종합 ROAS',  value: p?.roas  || '—', icon: <TrendingUp size={13} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { label: '총 도달수',  value: p?.reach || '—', icon: <Target size={13} />,     color: 'text-teal-500',   bg: 'bg-teal-50'   },
              { label: '완료 과업',  value: p?.tasks || '—', icon: <Target size={13} />,     color: 'text-violet-500', bg: 'bg-violet-50' },
              { label: '활성 채널',  value: p?.channels || '—', icon: <Target size={13} />,  color: 'text-amber-500',  bg: 'bg-amber-50'  },
            ].map(({ label, value, icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                  <div className={`p-1.5 rounded-lg ${bg}`}><span className={color}>{icon}</span></div>
                </div>
                <p className="text-lg font-black text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">팀 목표</p>
            {p?.team_goal
              ? <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{p.team_goal}</div>
              : <p className="text-xs text-gray-300">데이터 관리에서 입력하세요</p>}
          </div>
        </div>
      </div>

    </div>
  );
};
