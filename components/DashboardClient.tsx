"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, BarChart3, PieChart, Calendar, Database, Clock, Sparkles, RefreshCw, Settings, ChevronLeft, Kanban, Activity } from 'lucide-react';
import { SummaryView } from '@/components/SummaryView';
import { KpiTracker } from '@/components/KpiTracker';
import { BudgetManager } from '@/components/BudgetManager';
import { TimelineView } from '@/components/TimelineView';
import { DataBoard } from '@/components/DataBoard';
import { CampaignKanban } from '@/components/CampaignKanban';
import { ActivityLog } from '@/components/ActivityLog';
import type { ProjectData } from '@/lib/sheets';
import type { ProjectRow, CampaignRow, MilestoneRow, ActivityRow } from '@/lib/db';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'summary' | 'kanban' | 'kpi' | 'budget' | 'timeline' | 'data' | 'activity';

const navItems = [
  { id: 'summary',  label: 'SUMMARY',      icon: LayoutDashboard },
  { id: 'kanban',   label: '캠페인 칸반',   icon: Kanban          },
  { id: 'kpi',      label: 'KPI 트래킹',   icon: BarChart3       },
  { id: 'budget',   label: '예산/마진',     icon: PieChart        },
  { id: 'timeline', label: '타임라인',      icon: Calendar        },
  { id: 'data',     label: '데이터 보드',   icon: Database        },
  { id: 'activity', label: '활동 로그',     icon: Activity        },
];

interface Props {
  project: ProjectRow;
  campaigns: CampaignRow[];
  milestones: MilestoneRow[];
  activities: ActivityRow[];
  projectData: ProjectData | null;
}

export default function DashboardClient({ project, campaigns, milestones, activities, projectData }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [refreshing, setRefreshing] = useState(false);

  const activeLabel = navItems.find(n => n.id === activeTab)?.label ?? '';

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => window.location.reload(), 300);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':  return <SummaryView project={project} campaigns={campaigns} projectData={projectData} />;
      case 'kanban':   return <CampaignKanban campaigns={campaigns} />;
      case 'kpi':      return <KpiTracker projectData={projectData} />;
      case 'budget':   return <BudgetManager project={project} projectData={projectData} />;
      case 'timeline': return <TimelineView milestones={milestones} projectId={project.id} />;
      case 'data':     return <DataBoard />;
      case 'activity': return <ActivityLog activities={activities} />;
      default:         return <SummaryView project={project} campaigns={campaigns} projectData={projectData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── 사이드바 ── */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-20 shrink-0">

        {/* 로고 */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-none">Project Master</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        {/* 프로젝트명 */}
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">현재 프로젝트</p>
          <p className="text-xs font-bold text-gray-700 leading-snug line-clamp-2">{project.name}</p>
          {project.client && <p className="text-[10px] text-gray-400 mt-0.5">{project.client}</p>}
        </div>

        {/* 뒤로가기 */}
        <div className="px-3 pt-2">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:bg-gray-50 hover:text-gray-700 font-medium transition-all duration-150"
          >
            <ChevronLeft size={13} />
            전체 프로젝트
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left',
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium'
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-lg transition-colors',
                  active ? 'bg-indigo-100' : 'bg-transparent'
                )}>
                  <Icon size={14} />
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* 하단 */}
        <div className="px-3 pb-4 space-y-2 border-t border-gray-100 pt-3">
          <button
            onClick={() => router.push(`/projects/${project.id}/admin`)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-all duration-150"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-transparent">
              <Settings size={14} />
            </span>
            데이터 관리
          </button>
          {project.sheets_url && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-gray-700">구글 시트 연동 중</span>
              </div>
              <p className="text-[10px] text-gray-400 pl-4">60초마다 자동 갱신</p>
            </div>
          )}
        </div>
      </aside>

      {/* ── 메인 ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-8 py-3.5 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">{activeLabel}</h2>
            {activeTab === 'summary' && project.sheets_url && (
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                구글 시트 연동
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 transition-colors"
            >
              <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
              새로고침
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Clock size={12} />
              Project v4.0.0
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
