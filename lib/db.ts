import { supabase as _supabase } from './supabase';

function db() {
  if (!_supabase) throw new Error('Supabase 자격증명이 설정되지 않았습니다. .env.local을 확인하세요.');
  return _supabase;
}

// ── 타입 정의 ────────────────────────────────────────────────

export interface ProjectRow {
  id: string;
  name: string;
  client: string;
  manager: string;
  period: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  total_budget: string;
  execution_rate: number;
  kpi: number;
  risk_green: number;
  risk_yellow: number;
  risk_red: number;
  roas: string;
  reach: string;
  tasks: string;
  channels: string;
  sheets_url: string | null;
  sheets_gid: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string;
  project_id: string;
  name: string;
  phase: string;
  progress: number;
  budget: string;
  spent: string;
  dates: string;
  sort_order: number;
  created_at: string;
}

// ── 조회 ────────────────────────────────────────────────────

export async function getAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await db()
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const { data, error } = await db()
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function getCampaigns(projectId: string): Promise<CampaignRow[]> {
  const { data, error } = await db()
    .from('campaigns')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

// ── 생성 ────────────────────────────────────────────────────

export async function createProject(
  name: string,
  client: string,
  manager: string
): Promise<ProjectRow> {
  const { data, error } = await db()
    .from('projects')
    .insert({ name, client, manager, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── 수정 ────────────────────────────────────────────────────

export async function upsertProject(
  project: Partial<ProjectRow> & { id: string }
): Promise<ProjectRow> {
  const { data, error } = await db()
    .from('projects')
    .upsert({ ...project, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 캠페인 전체 교체 (삭제 후 재삽입)
export async function upsertCampaigns(
  projectId: string,
  campaigns: Omit<CampaignRow, 'id' | 'project_id' | 'created_at'>[]
): Promise<void> {
  await db().from('campaigns').delete().eq('project_id', projectId);
  if (campaigns.length === 0) return;
  const rows = campaigns.map((c, i) => ({ ...c, project_id: projectId, sort_order: i }));
  const { error } = await db().from('campaigns').insert(rows);
  if (error) throw error;
}

// ── 삭제 ────────────────────────────────────────────────────

export async function deleteProject(id: string): Promise<void> {
  const { error } = await db().from('projects').delete().eq('id', id);
  if (error) throw error;
}
