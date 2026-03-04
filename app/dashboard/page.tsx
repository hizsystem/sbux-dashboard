import { fetchProjectData } from '@/lib/sheets';
import DashboardClient from '@/components/DashboardClient';

export const revalidate = 60; // 60초마다 최신 데이터로 갱신

export default async function DashboardPage() {
  let projectData = null;
  try {
    projectData = await fetchProjectData();
  } catch (e) {
    console.error('시트 데이터 로드 실패:', e);
  }

  return <DashboardClient projectData={projectData} />;
}
