"use client";

import { Activity, FileEdit, LayoutGrid } from 'lucide-react';
import type { ActivityRow } from '@/lib/db';

const ACTION_ICON: Record<string, React.ElementType> = {
  '프로젝트 정보 수정': FileEdit,
  '캠페인 업데이트':    LayoutGrid,
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)   return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export function ActivityLog({ activities }: { activities: ActivityRow[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-0.5">활동 로그</h3>
        <p className="text-xs text-gray-400">최근 50건의 변경 이력</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <Activity size={24} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium">아직 활동 기록이 없습니다.</p>
            <p className="text-xs text-gray-300 mt-1">데이터 관리에서 저장하면 기록됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activities.map(a => {
              const Icon = ACTION_ICON[a.action] ?? Activity;
              return (
                <div key={a.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{a.action}</p>
                    {a.detail && <p className="text-xs text-gray-400 mt-0.5">{a.detail}</p>}
                  </div>
                  <span className="text-[10px] text-gray-300 shrink-0 mt-1">{timeAgo(a.created_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
