"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Save, ArrowLeft, Plus, Trash2, CheckCircle2,
  Settings, BarChart2, TrendingUp, AlertCircle, Download, Loader2, Link2, Trash
} from 'lucide-react';
import { getProject, getCampaigns, upsertProject, upsertCampaigns, deleteProject, type ProjectRow, type CampaignRow } from '@/lib/db';

const PASSWORD = '1234';

// ── 입력 필드 ─────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', suffix = '', min, max, placeholder }: {
  label: string; value: string | number;
  onChange: (v: string) => void; type?: string;
  suffix?: string; min?: number; max?: number; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type} value={value} min={min} max={max} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
        />
        {suffix && <span className="text-sm text-gray-400 shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
  );
}

// ── 캠페인 편집용 타입 ─────────────────────────────────────────
type EditCampaign = {
  id?: string; name: string; phase: string; progress: number;
  budget: string; spent: string; dates: string;
};

// ── 메인 ─────────────────────────────────────────────────────
export default function ProjectAdminPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [authed, setAuthed]   = useState(false);
  const [pw, setPw]           = useState('');
  const [pwError, setPwError] = useState(false);

  const [project, setProject]     = useState<ProjectRow | null>(null);
  const [campaigns, setCampaigns] = useState<EditCampaign[]>([]);
  const [loading, setLoading]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  // 인증 후 데이터 로드
  useEffect(() => {
    if (!authed || !id) return;
    setLoading(true);
    Promise.all([getProject(id), getCampaigns(id)]).then(([p, c]) => {
      if (p) setProject(p);
      setCampaigns(c.map(camp => ({
        id: camp.id, name: camp.name, phase: camp.phase,
        progress: camp.progress, budget: camp.budget, spent: camp.spent, dates: camp.dates,
      })));
    }).finally(() => setLoading(false));
  }, [authed, id]);

  const handleLogin = () => {
    if (pw === PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  // ── 저장 ──
  const handleSave = async () => {
    if (!project) return;
    setSaved(false);
    try {
      await upsertProject({ ...project, id });
      await upsertCampaigns(id, campaigns.map(c => ({
        name: c.name, phase: c.phase, progress: c.progress,
        budget: c.budget, spent: c.spent, dates: c.dates, sort_order: 0,
      })));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('저장 실패. 다시 시도해주세요.');
    }
  };

  // ── 구글 시트 불러오기 ──
  const handleImport = async () => {
    if (!project) return;
    setImporting(true); setImportMsg('');
    const url = project.sheets_url;
    const gid = project.sheets_gid;
    if (!url || !gid) {
      setImportMsg('✗ 구글 시트 URL/GID를 먼저 입력해주세요');
      setImporting(false);
      setTimeout(() => setImportMsg(''), 4000);
      return;
    }
    try {
      const res = await fetch(`/api/sheets?spreadsheetId=${url}&gid=${gid}`);
      if (!res.ok) throw new Error();
      const sheets = await res.json();
      setProject(prev => prev ? {
        ...prev,
        total_budget: sheets.totalBudget ?? prev.total_budget,
        execution_rate: sheets.executionRate ?? prev.execution_rate,
        kpi: sheets.igFollowersRate ?? prev.kpi,
      } : prev);
      setImportMsg('✓ 구글 시트에서 불러왔어요');
    } catch {
      setImportMsg('✗ 연결 실패');
    } finally {
      setImporting(false);
      setTimeout(() => setImportMsg(''), 4000);
    }
  };

  // ── 프로젝트 삭제 ──
  const handleDelete = async () => {
    if (!confirm('이 프로젝트를 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    try {
      await deleteProject(id);
      router.push('/');
    } catch {
      alert('삭제 실패.');
    }
  };

  // ── 프로젝트 필드 업데이트 헬퍼 ──
  const setField = (key: keyof ProjectRow, value: string) => {
    setProject(prev => prev ? {
      ...prev,
      [key]: ['progress','execution_rate','kpi','risk_green','risk_yellow','risk_red','revenue','cost'].includes(key)
        ? Number(value) : value,
    } : prev);
  };

  const setCampaign = (idx: number, key: keyof EditCampaign, value: string) => {
    setCampaigns(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: key === 'progress' ? Number(value) : value };
      return next;
    });
  };

  const addCampaign = () => setCampaigns(prev => [
    ...prev,
    { name: '새 캠페인', phase: '기획', progress: 0, budget: '₩ 0M', spent: '₩ 0M', dates: '' },
  ]);

  const removeCampaign = (idx: number) => {
    if (campaigns.length <= 1) return;
    setCampaigns(prev => prev.filter((_, i) => i !== idx));
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
              <p className="text-sm font-black text-gray-900">데이터 관리</p>
              <p className="text-[10px] text-gray-400">Admin Panel</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">비밀번호</label>
              <input
                type="password" value={pw} placeholder="••••"
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${pwError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {pwError && <p className="text-xs text-red-500 mt-1">비밀번호가 틀렸습니다.</p>}
            </div>
            <button onClick={handleLogin} className="w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors">
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/projects/${id}`)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={13} /> 대시보드로
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-indigo-500" />
            <span className="text-sm font-bold text-gray-800 truncate max-w-48">{project.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {importMsg && (
            <span className={`text-xs font-medium ${importMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
              {importMsg}
            </span>
          )}
          <button onClick={handleImport} disabled={importing}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 border border-indigo-200 rounded-full transition-colors disabled:opacity-50">
            {importing ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
            구글 시트 불러오기
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            {saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
            {saved ? '저장됨!' : '저장'}
          </button>
        </div>
      </header>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* 1. 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<Settings size={14} />} title="프로젝트 기본 정보" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="프로젝트명" value={project.name} onChange={v => setField('name', v)} />
            <Field label="클라이언트명" value={project.client} onChange={v => setField('client', v)} />
            <Field label="PM / 담당자" value={project.manager} onChange={v => setField('manager', v)} />
            <Field label="기간" value={project.period} onChange={v => setField('period', v)} />
            <Field label="총 예산" value={project.total_budget} onChange={v => setField('total_budget', v)} />
            <Field label="운영 채널" value={project.channels} onChange={v => setField('channels', v)} placeholder="예: IG / KA" />
            <Field label="핵심 목표" value={project.objective ?? ''} onChange={v => setField('objective', v)} placeholder="예: 채널 성장 + 브랜드 인지도 강화" />
            <Field label="핵심 KPI" value={project.kpi_desc ?? ''} onChange={v => setField('kpi_desc', v)} placeholder="예: IG 팔로워 25,000 / KA 105,000" />
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">팀 목표</label>
              <textarea
                rows={3} value={project.team_goal ?? ''}
                onChange={e => setField('team_goal', e.target.value)}
                placeholder="예: 효율성 개선&#10;- 프로젝트 이익률 1% → 10% 개선&#10;- 커뮤니케이션 개선"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</label>
              <select value={project.status} onChange={e => setField('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                <option value="active">진행중</option>
                <option value="paused">보류</option>
                <option value="completed">완료</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. 재무 정보 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<TrendingUp size={14} />} title="재무 정보 (매출 / 매입)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="매출 (원)" value={project.revenue ?? 0} onChange={v => setField('revenue', v)} type="number" suffix="원" placeholder="예: 150000000" />
            <Field label="매입 (원)" value={project.cost ?? 0} onChange={v => setField('cost', v)} type="number" suffix="원" placeholder="예: 120000000" />
          </div>
          {(project.revenue > 0 || project.cost > 0) && (
            <div className="mt-4 grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">수익</p>
                <p className={`text-sm font-black ${(project.revenue - project.cost) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {((project.revenue - project.cost) >= 0 ? '+' : '')}
                  {((project.revenue - project.cost) / 10000).toFixed(0)}만원
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">수익률</p>
                <p className="text-sm font-black text-indigo-600">
                  {project.revenue > 0 ? `${Math.round(((project.revenue - project.cost) / project.revenue) * 100)}%` : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">총 예산</p>
                <p className="text-sm font-bold text-gray-600">{project.total_budget || '—'}</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. 수치 지표 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<TrendingUp size={14} />} title="수치 지표" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="전체 진행률" value={project.progress} onChange={v => setField('progress', v)} type="number" suffix="%" min={0} max={100} />
            <Field label="예산 집행률" value={project.execution_rate} onChange={v => setField('execution_rate', v)} type="number" suffix="%" min={0} max={100} />
            <Field label="KPI 달성도" value={project.kpi} onChange={v => setField('kpi', v)} type="number" suffix="%" min={0} max={100} />
            <Field label="종합 ROAS" value={project.roas} onChange={v => setField('roas', v)} placeholder="예: 342%" />
            <Field label="총 도달수" value={project.reach} onChange={v => setField('reach', v)} placeholder="예: 24.5M" />
            <Field label="완료 과업" value={project.tasks} onChange={v => setField('tasks', v)} placeholder="예: 12/48" />
            <Field label="활성 채널" value={project.channels} onChange={v => setField('channels', v)} placeholder="예: 12개" />
          </div>
        </div>

        {/* 3. 리스크 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<AlertCircle size={14} />} title="리스크 현황" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="🟢 정상" value={project.risk_green} onChange={v => setField('risk_green', v)} type="number" min={0} />
            <Field label="🟡 주의" value={project.risk_yellow} onChange={v => setField('risk_yellow', v)} type="number" min={0} />
            <Field label="🔴 위험" value={project.risk_red} onChange={v => setField('risk_red', v)} type="number" min={0} />
          </div>
        </div>

        {/* 4. 캠페인 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><BarChart2 size={14} /></div>
              <h3 className="text-sm font-bold text-gray-800">캠페인 목록</h3>
            </div>
            <button onClick={addCampaign} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 transition-colors">
              <Plus size={11} /> 캠페인 추가
            </button>
          </div>
          <div className="space-y-5">
            {campaigns.map((c, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400">캠페인 {idx + 1}</span>
                  <button onClick={() => removeCampaign(idx)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="캠페인명" value={c.name} onChange={v => setCampaign(idx, 'name', v)} />
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">단계</label>
                    <select value={c.phase} onChange={e => setCampaign(idx, 'phase', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                      {['기획','제작','운영','종료'].map(p => <option key={p} value={p}>{p}</option>)}
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

        {/* 5. 구글 시트 연동 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <SectionHeader icon={<Link2 size={14} />} title="구글 시트 연동 (선택)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Spreadsheet ID" value={project.sheets_url ?? ''} onChange={v => setField('sheets_url', v)}
              placeholder="1PclZVVDW9Fg5QSwni..." />
            <Field label="Sheet GID" value={project.sheets_gid ?? ''} onChange={v => setField('sheets_gid', v)}
              placeholder="1217305212" />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            구글 시트 URL에서 <code className="bg-gray-100 px-1 rounded">/d/여기부분/</code>이 ID, <code className="bg-gray-100 px-1 rounded">gid=여기부분</code>이 GID입니다.
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between pb-6">
          <button onClick={handleDelete}
            className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-600 px-4 py-2.5 border border-red-200 hover:border-red-300 rounded-xl transition-colors">
            <Trash size={14} /> 프로젝트 삭제
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {saved ? '저장 완료!' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
