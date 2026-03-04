"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Plus, FolderOpen, LayoutGrid, CheckCircle2, PauseCircle, Circle } from 'lucide-react';
import { NewProjectModal } from '@/components/NewProjectModal';
import { ProjectCard } from '@/components/ProjectCard';
import type { ProjectRow } from '@/lib/db';

type Filter = 'all' | 'active' | 'paused' | 'completed';

const FILTERS: { id: Filter; label: string; icon: React.ElementType }[] = [
  { id: 'all',       label: '전체',   icon: LayoutGrid   },
  { id: 'active',    label: '진행중', icon: Circle       },
  { id: 'paused',    label: '보류',   icon: PauseCircle  },
  { id: 'completed', label: '완료',   icon: CheckCircle2 },
];

export function PortfolioLayout({ projects }: { projects: ProjectRow[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const counts = {
    all:       projects.length,
    active:    projects.filter(p => p.status === 'active').length,
    paused:    projects.filter(p => p.status === 'paused').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

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

        {/* 필터 */}
        <nav className="px-3 py-3 space-y-0.5">
          <p className="px-3 text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">프로젝트 목록</p>
          {FILTERS.map(({ id, label, icon: Icon }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={13} />
                  {label}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {counts[id]}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 프로젝트 바로가기 */}
        {projects.length > 0 && (
          <div className="px-3 pb-3 flex-1 overflow-y-auto">
            <p className="px-3 text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">바로가기</p>
            {projects.slice(0, 8).map(p => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium transition-all duration-150 group"
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  p.status === 'active' ? 'bg-emerald-400' :
                  p.status === 'paused' ? 'bg-amber-400' : 'bg-gray-300'
                }`} />
                <span className="truncate group-hover:text-indigo-600 transition-colors">{p.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* 새 프로젝트 버튼 */}
        <div className="px-3 pb-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            새 프로젝트
          </button>
        </div>
      </aside>

      {/* ── 메인 ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-black text-gray-900">
                {FILTERS.find(f => f.id === filter)?.label ?? '전체'} 프로젝트
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">{filtered.length}개</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <FolderOpen size={24} className="text-gray-300" />
              </div>
              <p className="text-base font-bold text-gray-500">프로젝트가 없습니다</p>
              <p className="text-sm mt-1">사이드바의 &quot;새 프로젝트&quot; 버튼을 눌러 시작하세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </main>
      </div>

      {modalOpen && <NewProjectModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
