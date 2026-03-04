import { fetchProjectData } from '@/lib/sheets';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchProjectData();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
