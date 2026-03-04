"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save, ArrowLeft, Plus, Trash2, RotateCcw, CheckCircle2,
  Settings, BarChart2, TrendingUp, AlertCircle
} from 'lucide-react';
import { getAdminData, saveAdminData, clearAdminData, DEFAULT_DATA, type AdminData } from '@/lib/localData';

// ── 비밀번호 ────────────────────────────────────────────────
const PASSWORD = '1234';

// ── 인라인 입력 필드 ──────────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', suffix = '', min, max, step
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white transition"
        />
        {suffix && <span className="text-sm text-gray-400 shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

// ── 섹션 헤더 ────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
  );
}

// ── 메인 ────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);

  const [data, setData] = useState<AdminData>(DEFAULT_DATA);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authed) {
      setData(getAdminData());
    }
  }, [authed]);

  // ── 로그인 ──
  const handleLogin = () => {
    if (pw === PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  // ── 저장 ──
  const handleSave = () => {
    saveAdminData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── 초기화 ──
  const handleReset = () => {
    if (confirm('모든 데이터를 초기값으로 되돌리겠습니까?')) {
      clearAdminData();
      setData({ ...DEFAULT_DATA, updatedAt: new Date().toISOString() });
    }
  };

  // ── 헬퍼: 프로젝트 필드 업데이트 ──
  const setProject = (key: keyof AdminData['project'], value: string) => {
    setData(prev => ({
      ...prev,
      project: {
        ...prev.project,
        [key]: ['progress', 'executionRate', 'kpi', 'riskGreen', 'riskYellow', 'riskRed'].includes(key)
          ? Number(value)
          : value,
      },
    }));
  };

  // ── 헬퍼: 캠페인 업데이트 ──
  const setCampaign = (idx: number, key: keyof AdminData['campaigns'][0], value: string) => {
    setData(prev => {
      const campaigns = [...prev.campaigns];
      campaigns[idx] = {
        ...campaigns[idx],
        [key]: key === 'id' || key === 'progress' ? Number(value) : value,
      };
      return { ...prev, campaigns };
    });
  };

  const addCampaign = () => {
    const newId = Math.max(0, ...data.campaigns.map(c => c.id)) + 1;
    setData(prev => ({
      ...prev,
      campaigns: [
        ...prev.campaigns,
        { id: newId, name: '새 캠페인', phase: '기획', progress: 0, budget: '₩ 0M', spent: '₩ 0M', dates: '' },
      ],
    }));
  };

  const removeCampaign = (idx: number) => {
    if (data.campaigns.length <= 1) return;
    setData(prev => ({
      ...prev,
      campaigns: prev.campaigns.filter((_, i) => i !== idx),
    }));
  };

  // ── 헬퍼: 통계 업데이트 ──
  const setStat = (key: keyof AdminData['stats'], value: string) => {
    setData(prev => ({ ...prev, stats: { ...prev.stats, [key]: value } }));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 로그인 화면
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">관리자 페이지</p>
              <p className="text-[10px] text-gray-400">Admin Panel</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">비밀번호</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${pwError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {pwError && <p className="text-xs text-red-500 mt-1">비밀번호가 틀렸습니다.</p>}
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 관리자 화면
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={13} />
            대시보드로
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-indigo-500" />
            <span className="text-sm font-bold text-gray-800">데이터 관리</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 px-3 py-1.5 border border-gray-200 rounded-full transition-colors"
          >
            <RotateCcw size={11} />
            초기화
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
              saved
                ? 'bg-emerald-500 text-white border-transparent'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
            {saved ? '저장됨!' : '저장'}
          </button>
        </div>
      </header>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* 1. 프로젝트 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<Settings size={14} />} title="프로젝트 기본 정보" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="프로젝트명" value={data.project.name} onChange={v => setProject('name', v)} />
            <Field label="PM / 담당자" value={data.project.manager} onChange={v => setProject('manager', v)} />
            <Field label="기간" value={data.project.period} onChange={v => setProject('period', v)} />
            <Field label="총 예산" value={data.project.totalBudget} onChange={v => setProject('totalBudget', v)} />
          </div>
        </div>

        {/* 2. 수치 지표 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<TrendingUp size={14} />} title="수치 지표" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="전체 진행률" value={data.project.progress} onChange={v => setProject('progress', v)} type="number" suffix="%" min={0} max={100} />
            <Field label="예산 집행률" value={data.project.executionRate} onChange={v => setProject('executionRate', v)} type="number" suffix="%" min={0} max={100} />
            <Field label="KPI 달성도" value={data.project.kpi} onChange={v => setProject('kpi', v)} type="number" suffix="%" min={0} max={100} />
          </div>
        </div>

        {/* 3. 리스크 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<AlertCircle size={14} />} title="리스크 현황" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="🟢 정상" value={data.project.riskGreen} onChange={v => setProject('riskGreen', v)} type="number" min={0} />
            <Field label="🟡 주의" value={data.project.riskYellow} onChange={v => setProject('riskYellow', v)} type="number" min={0} />
            <Field label="🔴 위험" value={data.project.riskRed} onChange={v => setProject('riskRed', v)} type="number" min={0} />
          </div>
        </div>

        {/* 4. 캠페인 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <BarChart2 size={14} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">캠페인 목록</h3>
            </div>
            <button
              onClick={addCampaign}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 transition-colors"
            >
              <Plus size={11} />
              캠페인 추가
            </button>
          </div>

          <div className="space-y-5">
            {data.campaigns.map((c, idx) => (
              <div key={c.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400">캠페인 {idx + 1}</span>
                  <button
                    onClick={() => removeCampaign(idx)}
                    className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="캠페인명" value={c.name} onChange={v => setCampaign(idx, 'name', v)} />
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">단계</label>
                    <select
                      value={c.phase}
                      onChange={e => setCampaign(idx, 'phase', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    >
                      {['기획', '제작', '운영', '종료'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <Field label="진행률" value={c.progress} onChange={v => setCampaign(idx, 'progress', v)} type="number" suffix="%" min={0} max={100} />
                  <Field label="기간" value={c.dates} onChange={v => setCampaign(idx, 'dates', v)} />
                  <Field label="예산" value={c.budget} onChange={v => setCampaign(idx, 'budget', v)} />
                  <Field label="집행액" value={c.spent} onChange={v => setCampaign(idx, 'spent', v)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 요약 통계 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<TrendingUp size={14} />} title="요약 통계" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="종합 ROAS" value={data.stats.roas} onChange={v => setStat('roas', v)} />
            <Field label="총 도달수" value={data.stats.reach} onChange={v => setStat('reach', v)} />
            <Field label="완료 과업" value={data.stats.tasks} onChange={v => setStat('tasks', v)} />
            <Field label="활성 채널" value={data.stats.channels} onChange={v => setStat('channels', v)} />
          </div>
        </div>

        {/* 하단 저장 버튼 */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {saved ? '저장 완료!' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
