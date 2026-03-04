"use client";

import React from 'react';
import { TrendingUp, Users, Target, Calendar, AlertCircle, CheckCircle2, MoreHorizontal, ChevronRight, Flag, Layers, BarChart2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SummaryView = () => {
  const masterProject = {
    name: '2026 네슬레 스타벅스앳홈 프로젝트',
    totalBudget: '₩ 1,200,000,000',
    executionRate: 60,
    overallProgress: 45,
    manager: '이슬기 PM',
    dates: '2026.01.01 ~ 2026.06.30',
  };

  const campaigns = [
    {
      id: 1,
      name: '인스타그램 & 카카오톡 기획/운영',
      phase: '제작',
      progress: 75,
      budget: '₩ 450M',
      spent: '₩ 380M',
      status: 'active',
      dates: '01.01 - 04.30',
    },
    {
      id: 2,
      name: '인플루언서 바이럴 캠페인',
      phase: '운영',
      progress: 30,
      budget: '₩ 250M',
      spent: '₩ 80M',
      status: 'active',
      dates: '03.01 - 06.15',
    },
  ];

  const getPhaseStyle = (phase: string) => {
    switch (phase) {
      case '기획': return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' };
      case '제작': return { text: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', bar: 'bg-violet-500' };
      case '운영': return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
      case '종료': return { text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', bar: 'bg-gray-400' };
      default: return { text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', bar: 'bg-gray-400' };
    }
  };

  return (
    <div className="space-y-6">

      {/* ── MASTER PROJECT HERO ── */}
      <section className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        {/* Dark header */}
        <div
          className="p-8 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}
        >
          {/* subtle grid bg */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.3) 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.3) 40px)',
            }}
          />

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-[10px] font-black uppercase tracking-widest">
                  Master Project
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">정상 가동 중</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                {masterProject.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Users size={13} />{masterProject.manager}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} />{masterProject.dates}</span>
                <span className="flex items-center gap-1.5"><Layers size={13} />{campaigns.length}개 캠페인 운영 중</span>
              </div>
            </div>

            {/* Progress donut */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke="#818cf8" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - masterProject.overallProgress / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white leading-none">{masterProject.overallProgress}%</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">진행률</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
          {/* Budget */}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={11} />총 예산 집행
              </p>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {masterProject.executionRate}%
              </span>
            </div>
            <p className="text-lg font-extrabold text-gray-900">{masterProject.totalBudget}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${masterProject.executionRate}%` }}
              />
            </div>
          </div>

          {/* KPI */}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Target size={11} />마스터 KPI 달성도
              </p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                목표 근접
              </span>
            </div>
            <p className="text-lg font-extrabold text-gray-900">82.4%</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: '82.4%' }} />
            </div>
          </div>

          {/* Risk */}
          <div className="p-6 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle size={11} />리스크 관리
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  { n: 3, bg: 'bg-emerald-100', text: 'text-emerald-700' },
                  { n: 1, bg: 'bg-amber-100', text: 'text-amber-700' },
                  { n: 0, bg: 'bg-rose-100', text: 'text-rose-700' },
                ].map((r, i) => (
                  <div key={i} className={cn('w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold', r.bg, r.text)}>
                    {r.n}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">진행 중인 4건 중 <span className="font-semibold text-amber-600">1건 주의</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPAIGNS ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-500" />
            캠페인별 진행 상황
          </h2>
          <button className="text-xs font-semibold text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
            전체 보기<ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => {
            const style = getPhaseStyle(camp.phase);
            return (
              <div
                key={camp.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border', style.text, style.bg, style.border)}>
                      {camp.phase}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-2 leading-snug group-hover:text-indigo-600 transition-colors truncate">
                      {camp.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-[10px] text-gray-400 font-medium">{camp.dates}</p>
                    <p className="text-sm font-black text-gray-800 mt-0.5">{camp.progress}%</p>
                  </div>
                </div>

                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', style.bar)}
                    style={{ width: `${camp.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-4 text-gray-500">
                    <span>예산 <span className="font-semibold text-gray-700">{camp.budget}</span></span>
                    <span>집행 <span className="font-semibold text-indigo-600">{camp.spent}</span></span>
                  </div>
                  <button className="p-1 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {[
          { title: '종합 ROAS', value: '342%', sub: '전 캠페인 평균', icon: <TrendingUp size={18} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { title: '총 도달수', value: '24.5M', sub: '목표 대비 105%', icon: <Users size={18} />, color: 'text-teal-500', bg: 'bg-teal-50' },
          { title: '완료 과업', value: '12/48', sub: '전체 마일스톤 기준', icon: <CheckCircle2 size={18} />, color: 'text-violet-500', bg: 'bg-violet-50' },
          { title: '활성 채널', value: '12개', sub: '글로벌 채널 통합', icon: <Flag size={18} />, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map(({ title, value, sub, icon, color, bg }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">{title}</p>
              <div className={cn('p-2 rounded-xl', bg)}>
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
