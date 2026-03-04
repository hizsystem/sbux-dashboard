// 구글 시트에서 데이터를 가져오는 유틸리티

const SPREADSHEET_ID = '1PclZVVDW9Fg5QSwni-DzhfJHhswR5C792kW9875mqiQ';
const SHEET_GID = '1217305212';

// gviz API로 시트 데이터 가져오기 (API 키 불필요, 공개 시트)
async function fetchSheetData(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
  const res = await fetch(url, { next: { revalidate: 60 } }); // 60초마다 자동 갱신
  if (!res.ok) throw new Error('구글 시트 데이터를 불러오지 못했습니다');
  const text = await res.text();
  return parseCSV(text);
}

// CSV 파싱
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    rows.push(cells);
  }
  return rows;
}

// 값 찾기 헬퍼
function findValue(rows: string[][], label: string, colOffset = 1): string {
  for (const row of rows) {
    if (row[0] && row[0].includes(label)) {
      return row[colOffset] ?? '';
    }
  }
  return '';
}

// ── 프로젝트 정보 ────────────────────────────────────────
export interface ProjectData {
  name: string;
  manager: string;
  period: string;
  channels: string;
  totalBudget: string;
  spentBudget: string;
  remainingBudget: string;
  executionRate: number;
  igFollowers: number;
  igFollowersTarget: number;
  igFollowersRate: number;
  kaFollowers: number;
  kaFollowersTarget: number;
  kaFollowersRate: number;
}

export async function fetchProjectData(): Promise<ProjectData> {
  const rows = await fetchSheetData(SHEET_GID);

  const totalBudgetRaw = findValue(rows, '총 예산') || findValue(rows, 'Total Budget') || '150000000';
  const spentRaw = findValue(rows, '현재 집행') || findValue(rows, 'Current Spend') || '30000000';
  const remainingRaw = findValue(rows, '잔여') || findValue(rows, 'Remaining') || '120000000';
  const execRateRaw = findValue(rows, '집행률') || findValue(rows, 'Execution Rate') || '20';

  // KPI 데이터
  const igFollowers = parseInt(findValue(rows, 'Followers', 2).replace(/,/g, '') || '18500');
  const igFollowersTarget = parseInt(findValue(rows, 'Followers', 1).replace(/,/g, '') || '25000');
  const igRate = parseInt(findValue(rows, 'Followers', 3).replace(/%/g, '') || '74');

  const kaFollowers = parseInt(findValue(rows, 'Followers', 5).replace(/,/g, '') || '96000');
  const kaFollowersTarget = parseInt(findValue(rows, 'Followers', 4).replace(/,/g, '') || '105000');
  const kaRate = parseInt(findValue(rows, 'Followers', 6).replace(/%/g, '') || '91');

  const totalNum = parseInt(totalBudgetRaw.replace(/[^0-9]/g, '') || '150000000');
  const spentNum = parseInt(spentRaw.replace(/[^0-9]/g, '') || '30000000');
  const remainingNum = parseInt(remainingRaw.replace(/[^0-9]/g, '') || '120000000');
  const execRate = parseInt(execRateRaw.replace(/[^0-9]/g, '') || '20');

  return {
    name: '2026 네슬레 스타벅스앳홈 프로젝트',
    manager: '이슬기 PM',
    period: '2026.01 ~ 2026.06',
    channels: 'Instagram / KakaoStory',
    totalBudget: `₩ ${totalNum.toLocaleString('ko-KR')}`,
    spentBudget: `₩ ${spentNum.toLocaleString('ko-KR')}`,
    remainingBudget: `₩ ${remainingNum.toLocaleString('ko-KR')}`,
    executionRate: execRate,
    igFollowers,
    igFollowersTarget,
    igFollowersRate: igRate,
    kaFollowers,
    kaFollowersTarget,
    kaFollowersRate: kaRate,
  };
}
