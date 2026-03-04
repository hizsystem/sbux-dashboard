"use client";

import { useState } from 'react';
import { LayoutDashboard, BarChart3, PieChart, Calendar, Database, Clock, Sparkles } from 'lucide-react';
import { SummaryView } from '@/components/SummaryView';
import { KpiTracker } from '@/components/KpiTracker';
import { BudgetManager } from '@/components/BudgetManager';
import { TimelineView } from '@/components/TimelineView';
import { DataBoard } from '@/components/DataBoard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'summary' | 'kpi' | 'budget' | 'timeline' | 'data';

const navItems = [
  { id: 'summary', label: 'SUMMARY', icon: LayoutDashboard },
  { id: 'kpi', label: 'KPI 트래킹', icon: BarChart3 },
  { id: 'budget', label: '예산/마진 관리', icon: PieChart },
  { id: 'timeline', label: '타임라인', icon: Calendar },
  { id: 'data', label: '데이터 보드', icon: Database },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const renderContent = () => {
    switch (activeTab) {
      case 'summary': return <SummaryView />;
      case 'kpi': return <KpiTracker />;
      case 'budget': return <BudgetManager />;
      case 'timeline': return <TimelineView />;
      case 'data': return <DataBoard />;
      default: return <SummaryView />;
    }
  };

  const activeLabel = navItems.find(n => n.id === activeTab)?.label ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-20 shrink-0">

        {/* Logo */}
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

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
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

        {/* Status */}
        <div className="px-3 pb-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-700">시스템 정상</span>
            </div>
            <p className="text-[10px] text-gray-400 pl-4">마지막 업데이트: 오늘 14:20</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-8 py-3.5 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">{activeLabel}</h2>
            {activeTab === 'summary' && (
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Clock size={12} />
            Project v2.4.0
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
