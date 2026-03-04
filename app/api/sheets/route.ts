import { fetchProjectData } from '@/lib/sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spreadsheetId = searchParams.get('spreadsheetId') ?? undefined;
  const gid = searchParams.get('gid') ?? undefined;
  try {
    const data = await fetchProjectData(spreadsheetId, gid);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
