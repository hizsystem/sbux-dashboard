"use client";

import { useState } from 'react';
import { Layout, BarChart3, PieChart, Calendar, Database, ClipboardList, Clock } from 'lucide-react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const navItems = [
    { id: 'summary', label: 'SUMMARY', icon: Layout },
    { id: 'kpi', label: 'KPI 트래킹', icon: BarChart3 },
    { id: 'budget', label: '예산/마진 관리', icon: PieChart },
    { id: 'timeline', label: '타임라인', icon: Calendar },
    { id: 'data', label: '데이터 보드', icon: Database },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 md:h-screen z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="text-blue-600" />
            Project Master
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Management System</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-700">시스템 정상</span>
            </div>
            <p className="text-[10px] text-gray-400">마지막 업데이트: 오늘 14:20</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(n => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <Clock size={14} />
            <span>Project v2.4.0</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
