"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { createProject } from '@/lib/db';

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      />
    </div>
  );
}

export function NewProjectModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName]       = useState('');
  const [client, setClient]   = useState('');
  const [manager, setManager] = useState('');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleCreate = async () => {
    if (!name.trim()) { setError('프로젝트명을 입력해주세요.'); return; }
    setSaving(true);
    setError('');
    try {
      const project = await createProject(name.trim(), client.trim(), manager.trim());
      router.push(`/projects/${project.id}/admin`);
      onClose();
    } catch (e) {
      setError('생성 실패. 잠시 후 다시 시도해주세요.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-black text-gray-900">새 프로젝트 만들기</h2>
            <p className="text-xs text-gray-400 mt-0.5">생성 후 세부 정보를 입력할 수 있어요</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-4">
          <Field label="프로젝트명 *" value={name} onChange={setName} placeholder="예: 2026 네슬레 스타벅스앳홈" />
          <Field label="클라이언트명" value={client} onChange={setClient} placeholder="예: 네슬레" />
          <Field label="담당자 (PM)" value={manager} onChange={setManager} placeholder="예: 이슬기 PM" />
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

        {/* 버튼 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white
                       rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {saving ? '생성 중...' : '프로젝트 생성'}
          </button>
        </div>
      </div>
    </div>
  );
}
