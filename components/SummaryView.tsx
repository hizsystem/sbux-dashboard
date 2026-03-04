import React from 'react';
import { TrendingUp, Users, Target, Calendar, AlertCircle, CheckCircle2, Clock, MoreHorizontal, ChevronRight, Flag, Layers, BarChart } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SummaryView = () => {
  const masterProject = {
    name: '2026 네슬레 스타벅스앳홈 프로젝트',
    brand: 'Nestlé Starbucks at Home / 글로벌',
    totalBudget: '₩ 1,200,000,000',
    spentBudget: '₩ 720,000,000',
    executionRate: 60,
    overallProgress: 45,
    manager: '이슬기 PM',
    dates: '2026.01.01 ~ 2026.06.30',
    risk: 'green',
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
      dates: '01.01 - 04.30'
    },
    { 
      id: 2, 
      name: '인플루언서 바이럴 캠페인', 
      phase: '운영', 
      progress: 30, 
      budget: '₩ 250M', 
      spent: '₩ 80M', 
      status: 'active',
      dates: '03.01 - 06.15'
    }
  ];

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case '기획': return 'text-blue-600 bg-blue-50 border-blue-100';
      case '제작': return 'text-purple-600 bg-purple-50 border-purple-100';
      case '운영': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case '종료': return 'text-gray-600 bg-gray-50 border-gray-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. MASTER PROJECT SUMMARY */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded bg-blue-500 text-[10px] font-black uppercase tracking-wider">Master Project</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-medium text-emerald-400">정상 가동 중</span>
                </div>
              </div>
              <h1 className="text-3xl font-black leading-tight">{masterProject.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 text-sm">
                <div className="flex items-center gap-1.5"><Users size={14} /> {masterProject.manager}</div>
                <div className="flex items-center gap-1.5"><Calendar size={14} /> {masterProject.dates}</div>
                <div className="flex items-center gap-1.5"><Layers size={14} /> {campaigns.length}개 캠페인 운영 중</div>
              </div>
            </div>
            
            {/* Master Progress Circle */}
            <div className="relative w-28 h-28 flex items-center justify-center bg-gray-800 rounded-full border-4 border-gray-700 shrink-0">
              <svg className="w-full h-full transform -rotate-90 absolute">
                <circle
                  cx="56" cy="56" r="48"
                  stroke="currentColor" strokeWidth="6" fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="56" cy="56" r="48"
                  stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={301.6}
                  strokeDashoffset={301.6 * (1 - masterProject.overallProgress / 100)}
                  strokeLinecap="round"
                  className="text-blue-400 transition-all duration-1000"
                />
              </svg>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">{masterProject.overallProgress}%</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">전체 진행</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
          <div className="p-6 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={12} /> 총 예산 집행
            </p>
            <div className="flex justify-between items-end">
              <h4 className="text-xl font-bold text-gray-900">{masterProject.totalBudget}</h4>
              <span className="text-sm font-bold text-blue-600">{masterProject.executionRate}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${masterProject.executionRate}%` }}></div>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Target size={12} /> 마스터 KPI 달성도
            </p>
            <div className="flex justify-between items-end">
              <h4 className="text-xl font-bold text-gray-900">82.4%</h4>
              <span className="text-xs font-medium text-emerald-500">목표 근접</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '82.4%' }}></div>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={12} /> 리스크 관리
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600 font-bold text-[10px]">3</div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-amber-600 font-bold text-[10px]">1</div>
                <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-600 font-bold text-[10px]">0</div>
              </div>
              <p className="text-xs text-gray-500 font-medium">진행 중인 4건 중 1건 주의</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INDIVIDUAL CAMPAIGNS SUMMARY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart size={20} className="text-blue-600" />
            캠페인별 진행 상황
          </h2>
          <button className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest flex items-center gap-1">
            전체 보기 <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", getPhaseColor(camp.phase))}>
                    {camp.phase}
                  </span>
                  <h3 className="text-md font-bold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">{camp.name}</h3>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{camp.dates}</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{camp.progress}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", 
                      camp.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                    )}
                    style={{ width: `${camp.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-gray-400">예산:</span> <span className="font-bold text-gray-700">{camp.budget}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">집행:</span> <span className="font-bold text-blue-600">{camp.spent}</span>
                    </div>
                  </div>
                  <button className="p-1 text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUICK STATUS WIDGETS (Aggregated) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
        <StatusCard title="통합 ROAS" value="342%" icon={<TrendingUp className="text-blue-500" />} subtitle="전 캠페인 평균" />
        <StatusCard title="총 도달수" value="24.5M" icon={<Users size={20} className="text-emerald-500" />} subtitle="목표 대비 105%" />
        <StatusCard title="완료 과업" value="12/48" icon={<CheckCircle2 className="text-purple-500" />} subtitle="전체 마일스톤 기준" />
        <StatusCard title="활성 채널" value="12개" icon={<Flag className="text-amber-500" />} subtitle="글로벌 채널 통합" />
      </div>
    </div>
  );
};

const StatusCard = ({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);
