"use client";

import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus, X } from 'lucide-react';
import type { MilestoneRow } from '@/lib/db';

const STATUS_STYLE = {
  완료: { icon: CheckCircle2, cls: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200', line: 'bg-emerald-400' },
  예정: { icon: Clock,        cls: 'text-blue-400',    badge: 'bg-blue-50 text-blue-600 border-blue-200',         line: 'bg-blue-300'   },
  지연: { icon: AlertCircle,  cls: 'text-red-400',     badge: 'bg-red-50 text-red-600 border-red-200',           line: 'bg-red-400'    },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface Props {
  milestones: MilestoneRow[];
  projectId: string;
}

export function TimelineView({ milestones, projectId }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', team: '', status: '예정' as MilestoneRow['status'] });
  const [saving, setSaving] = useState(false);

  const done  = milestones.filter(m => m.status === '완료').length;
  const total = milestones.length;

  const handleAdd = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, ...form }),
      });
      if (res.ok) {
        setAdding(false);
        setForm({ title: '', date: '', team: '', status: '예정' });
        window.location.reload();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 카드 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-0.5">프로젝트 타임라인</h3>
          <p className="text-xs text-gray-400">
            총 {total}개 마일스톤 · 완료 {done}개
            {total > 0 && <span className="ml-2 font-bold text-indigo-600">{Math.round((done / total) * 100)}%</span>}
          </p>
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus size={13} />
          마일스톤 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {adding && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">새 마일스톤</p>
            <button onClick={() => setAdding(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="마일스톤 명 (예: 캠페인 론칭)"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
            <input
              type="date"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            />
            <input
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="담당팀 (예: 운영팀)"
              value={form.team}
              onChange={e => setForm(p => ({ ...p, team: e.target.value }))}
            />
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value as MilestoneRow['status'] }))}
            >
              <option value="예정">예정</option>
              <option value="완료">완료</option>
              <option value="지연">지연</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      )}

      {/* 타임라인 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {milestones.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="font-medium">마일스톤이 없습니다.</p>
            <p className="text-sm mt-1">상단 버튼으로 추가하세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {milestones.map((m, idx) => {
              const st = STATUS_STYLE[m.status] ?? STATUS_STYLE['예정'];
              const Icon = st.icon;
              const isLast = idx === milestones.length - 1;
              return (
                <div key={m.id} className="flex gap-0 hover:bg-gray-50/50 transition-colors">
                  {/* 타임라인 선 */}
                  <div className="flex flex-col items-center w-12 shrink-0 py-5">
                    <Icon size={18} className={st.cls} />
                    {!isLast && <div className={`w-0.5 flex-1 mt-2 ${st.line} opacity-30`} />}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 py-5 pr-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{m.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 font-mono">{formatDate(m.date)}</span>
                          {m.team && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-semibold">{m.team}</span>}
                        </div>
                        {m.notes && <p className="text-xs text-gray-400 mt-1">{m.notes}</p>}
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border ${st.badge}`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
