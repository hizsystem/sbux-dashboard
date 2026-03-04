"use client";

import { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { NewProjectModal } from '@/components/NewProjectModal';

export function PortfolioHeader({ projectCount }: { projectCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-none">Project Master</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
                {projectCount}개 프로젝트 관리 중
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white
                       text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={15} />
            새 프로젝트
          </button>
        </div>
      </header>

      {open && <NewProjectModal onClose={() => setOpen(false)} />}
    </>
  );
}
