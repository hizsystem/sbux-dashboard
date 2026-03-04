"use client";

import React from 'react';
import {
  TrendingUp, Users, Target, Calendar, AlertCircle,
  CheckCircle2, MoreHorizontal, ChevronRight, Flag, Layers, BarChart2
} from 'lucide-react';

// ── 타입 ──────────────────────────────────────────────
const PHASE_STYLES: Record<string, { label: string; bar: string; badge: string }> = {
  '기획': { label: 'text-blue-700 bg-blue-50 border-blue-200',   bar: 'bg-blue-500',   badge: '' },
  '제작': { label: 'text-violet-700 bg-violet-50 border-violet-200', bar: 'bg-violet-500', badge: '' },
  '운영': { label: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500', badge: '' },
  '종료': { label: 'text-gray-500 bg-gray-50 border-gray-200',   bar: 'bg-gray-400',   badge: '' },
};

// ── 도넛 차트 (SVG) ────────────────────────────────────
function DonutChart({ value, size = 96 }: { value: number; size?: number }) {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r; // ≈ 238.76
  const offset = circumference * (1 - value / 100);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#818cf8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      {/* Label */}
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">{value}%</text>
      <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8" fontWeight="600" letterSpacing="1">진행률</text>
    </svg>
  );
}

// ── 프로그레스 바 ──────────────────────────────────────
function ProgressBar({ value, color = 'bg-indigo-500' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%`, transition: 'width 0.7s ease' }} />
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────
export const SummaryView = () => {
  const project = {
    name: '2026 네슬레 스타벅스앳홈 프로젝트',
    manager: '이슬기 PM',
    dates: '2026.01.01 ~ 2026.06.30',
    progress: 45,
    totalBudget: '₩ 1,200,000,000',
    budgetRate: 60,
    kpi: 82.4,
    campaignCount: 2,
  };

  const campaigns = [
    { id: 1, name: '인스타그램 & 카카오톡 기획/운영', phase: '제작', progress: 75, budget: '₩ 450M', spent: '₩ 380M', dates: '01.01 - 04.30' },
    { id: 2, name: '인플루언서 바이럴 캠페인',        phase: '운영', progress: 30, budget: '₩ 250M', spent: '₩ 80M',  dates: '03.01 - 06.15' },
  ];

  const stats = [
    { label: '종합 ROAS',  value: '342%',  sub: '전 캠페인 평균',      icon: <TrendingUp size={16} />,   color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: '총 도달수',  value: '24.5M', sub: '목표 대비 105%',      icon: <Users size={16} />,        color: 'text-teal-500',   bg: 'bg-teal-50'   },
    { label: '완료 과업',  value: '12/48', sub: '전체 마일스톤 기준',  icon: <CheckCircle2 size={16} />, color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: '활성 채널',  value: '12개',  sub: '글로벌 채널 통합',    icon: <Flag size={16} />,         color: 'text-amber-500',  bg: 'bg-amber-50'  },
  ];

  return (
    <div className="space-y-5">

      {/* ━━ 1. 히어로 카드 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* 상단 다크 영역 */}
        <div className="relative px-8 py-7 text-white" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)' }}>

          {/* 배경 점선 패턴 */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }}
          />

          <div className="relative flex items-start justify-between gap-6">
            {/* 왼쪽: 프로젝트 정보 */}
            <div className="space-y-3 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-[10px] font-black uppercase tracking-widest">
                  Master Project
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  정상 가동 중
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-black leading-snug tracking-tight truncate">
                {project.name}
              </h1>

              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Users size={13} />{project.manager}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} />{project.dates}</span>
                <span className="flex items-center gap-1.5"><Layers size={13} />{project.campaignCount}개 캠페인 운영 중</span>
              </div>
            </div>

            {/* 오른쪽: 도넛 차트 */}
            <div className="shrink-0 self-center">
              <DonutChart value={project.progress} size={100} />
            </div>
          </div>
        </div>

        {/* 하단 지표 3칸 */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">

          {/* 예산 */}
          <div className="px-6 py-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={11} /> 총 예산 집행
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {project.budgetRate}%
              </span>
            </div>
            <p className="text-lg font-extrabold text-gray-900">{project.totalBudget}</p>
            <ProgressBar value={project.budgetRate} color="bg-indigo-500" />
          </div>

          {/* KPI */}
          <div className="px-6 py-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Target size={11} /> 마스터 KPI 달성도
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                목표 근접
              </span>
            </div>
            <p className="text-lg font-extrabold text-gray-900">{project.kpi}%</p>
            <ProgressBar value={project.kpi} color="bg-emerald-500" />
          </div>

          {/* 리스크 */}
          <div className="px-6 py-5 space-y-2.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle size={11} /> 리스크 관리
            </span>
            <div className="flex items-center gap-3 pt-0.5">
              <div className="flex items-center -space-x-2">
                {[
                  { n: 3, ring: 'ring-emerald-200', bg: 'bg-emerald-100', text: 'text-emerald-700' },
                  { n: 1, ring: 'ring-amber-200',   bg: 'bg-amber-100',   text: 'text-amber-700'   },
                  { n: 0, ring: 'ring-rose-200',     bg: 'bg-rose-100',    text: 'text-rose-700'    },
                ].map((r, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ring-2 ${r.ring} ${r.bg} flex items-center justify-center text-xs font-bold ${r.text}`}>
                    {r.n}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                4건 중 <span className="font-semibold text-amber-600">1건 주의</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━ 2. 캠페인별 진행 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 size={15} className="text-indigo-500" />
            캠페인별 진행 상황
          </h2>
          <button className="text-xs font-semibold text-gray-400 hover:text-indigo-600 flex items-center gap-0.5 transition-colors">
            전체 보기 <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c) => {
            const s = PHASE_STYLES[c.phase] ?? PHASE_STYLES['종료'];
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${s.label}`}>
                      {c.phase}
                    </span>
                    <p className="mt-2 text-sm font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {c.name}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400">{c.dates}</p>
                    <p className="text-sm font-black text-gray-800 mt-0.5">{c.progress}%</p>
                  </div>
                </div>

                <ProgressBar value={c.progress} color={s.bar} />

                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex gap-4 text-gray-500">
                    <span>예산 <span className="font-semibold text-gray-700">{c.budget}</span></span>
                    <span>집행 <span className="font-semibold text-indigo-600">{c.spent}</span></span>
                  </div>
                  <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ━━ 3. 하단 통계 4칸 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-400 leading-tight">{label}</p>
              <div className={`p-2 rounded-xl ${bg}`}>
                <span className={color}>{icon}</span>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none mb-1">{value}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
