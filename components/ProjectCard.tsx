"use client";

import Link from 'next/link';
import type { ProjectRow } from '@/lib/db';

const STATUS = {
  active:    { label: '진행중', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  paused:    { label: '보류',   cls: 'bg-amber-50  text-amber-600  border-amber-200'   },
  completed: { label: '완료',   cls: 'bg-gray-50   text-gray-500   border-gray-200'    },
};

function MiniDonut({ value }: { value: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={40} height={40} viewBox="0 0 36 36" className="shrink-0">
      <circle cx={18} cy={18} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
      <circle
        cx={18} cy={18} r={r}
        fill="none" stroke="#6366f1" strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
      />
      <text x="18" y="22" textAnchor="middle" fontSize="8" fontWeight="800" fill="#111827">
        {value}%
      </text>
    </svg>
  );
}

export function ProjectCard({ project }: { project: ProjectRow }) {
  const st = STATUS[project.status] ?? STATUS.active;
  const updatedAt = new Date(project.updated_at);
  const diffDays = Math.floor((Date.now() - updatedAt.getTime()) / 86400000);
  const timeLabel = diffDays === 0 ? '오늘' : `${diffDays}일 전`;

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm
                      group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-200">

        {/* 헤더 */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="min-w-0">
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${st.cls}`}>
              {st.label}
            </span>
            <h3 className="mt-2 text-sm font-black text-gray-900 leading-snug
                           group-hover:text-indigo-600 transition-colors line-clamp-2">
              {project.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {project.client}{project.client && project.manager ? ' · ' : ''}{project.manager}
            </p>
          </div>
          <MiniDonut value={project.progress} />
        </div>

        {/* 예산 집행률 바 */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>예산 집행률</span>
            <span className="font-bold text-indigo-600">{project.execution_rate}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${project.execution_rate}%` }}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-3">
          <span>KPI <span className="font-bold text-gray-600">{project.kpi}%</span></span>
          <span>{project.period || '기간 미설정'}</span>
          <span>수정 {timeLabel}</span>
        </div>
      </div>
    </Link>
  );
}
