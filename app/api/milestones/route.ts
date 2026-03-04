import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  const { projectId, title, date, team, status, notes } = await req.json();
  const { error } = await supabase.from('milestones').insert({
    project_id: projectId, title, date, team: team || '', status, notes: notes || '',
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity(projectId, '마일스톤 추가', `"${title}" 마일스톤이 추가되었습니다.`);
  return NextResponse.json({ ok: true });
}
