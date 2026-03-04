// 관리자 페이지에서 저장한 데이터를 브라우저에 보관
// 대시보드는 이 데이터를 구글 시트보다 우선 사용

const KEY = 'sbux_admin_data';

export interface AdminData {
  project: {
    name: string;
    manager: string;
    period: string;
    progress: number;         // 0-100
    totalBudget: string;      // "₩ 1,200,000,000"
    executionRate: number;    // 0-100
    kpi: number;              // 0-100
    riskGreen: number;
    riskYellow: number;
    riskRed: number;
  };
  campaigns: Array<{
    id: number;
    name: string;
    phase: string;
    progress: number;
    budget: string;
    spent: string;
    dates: string;
  }>;
  stats: {
    roas: string;
    reach: string;
    tasks: string;
    channels: string;
  };
  updatedAt: string;
}

export const DEFAULT_DATA: AdminData = {
  project: {
    name: '2026 네슬레 스타벅스앳홈 프로젝트',
    manager: '이슬기 PM',
    period: '2026.01.01 ~ 2026.06.30',
    progress: 45,
    totalBudget: '₩ 150,000,000',
    executionRate: 20,
    kpi: 74,
    riskGreen: 3,
    riskYellow: 1,
    riskRed: 0,
  },
  campaigns: [
    { id: 1, name: '인스타그램 & 카카오톡 기획/운영', phase: '제작', progress: 75, budget: '₩ 450M', spent: '₩ 380M', dates: '01.01 - 04.30' },
    { id: 2, name: '인플루언서 바이럴 캠페인',        phase: '운영', progress: 30, budget: '₩ 250M', spent: '₩ 80M',  dates: '03.01 - 06.15' },
  ],
  stats: {
    roas: '342%',
    reach: '24.5M',
    tasks: '12/48',
    channels: '12개',
  },
  updatedAt: new Date().toISOString(),
};

export function getAdminData(): AdminData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_DATA, ...JSON.parse(raw) } : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveAdminData(data: AdminData): void {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearAdminData(): void {
  localStorage.removeItem(KEY);
}
