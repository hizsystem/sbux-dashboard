"use client";

import type { CampaignRow } from '@/lib/db';

const PHASES = ['기획', '제작', '운영', '종료'] as const;

const PHASE_STYLE = {
  기획: { bg: 'bg-blue-50',    border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-500'    },
  제작: { bg: 'bg-violet-50',  border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  운영: { bg: 'bg-emerald-50', border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700',bar: 'bg-emerald-500'},
  종료: { bg: 'bg-gray-50',    border: 'border-gray-200',   badge: 'bg-gray-100 text-gray-500',   bar: 'bg-gray-400'    },
};

function CampaignCard({ c }: { c: CampaignRow }) {
  const style = PHASE_STYLE[c.phase as keyof typeof PHASE_STYLE] ?? PHASE_STYLE['기획'];
  return (
    <div className={`bg-white rounded-xl border ${style.border} p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-gray-800 leading-snug">{c.name}</p>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md ${style.badge}`}>
          {c.phase}
        </span>
      </div>

      {/* 진행률 */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>진행률</span>
          <span className="font-bold text-gray-600">{c.progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${c.progress}%` }} />
        </div>
      </div>

      {/* 예산 */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-2.5">
        <span>예산 <span className="font-bold text-gray-600">{c.budget || '—'}</span></span>
        <span>집행 <span className="font-bold text-gray-600">{c.spent || '—'}</span></span>
      </div>

      {c.dates && (
        <p className="text-[10px] text-gray-300 mt-1.5">{c.dates}</p>
      )}
    </div>
  );
}

export function CampaignKanban({ campaigns }: { campaigns: CampaignRow[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 font-medium">캠페인 데이터가 없습니다.</p>
        <p className="text-sm text-gray-300 mt-1">데이터 관리에서 캠페인을 추가하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-1">캠페인 칸반</h3>
        <p className="text-xs text-gray-400">단계별 캠페인 현황</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PHASES.map(phase => {
          const cards = campaigns.filter(c => c.phase === phase);
          const style = PHASE_STYLE[phase];
          return (
            <div key={phase} className={`rounded-2xl border ${style.border} ${style.bg} p-4`}>
              {/* 컬럼 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${style.badge}`}>
                  {phase}
                </span>
                <span className="text-xs font-bold text-gray-400">{cards.length}</span>
              </div>

              {/* 카드 목록 */}
              <div className="space-y-3">
                {cards.map(c => <CampaignCard key={c.id} c={c} />)}
                {cards.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-300">
                    캠페인 없음
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
