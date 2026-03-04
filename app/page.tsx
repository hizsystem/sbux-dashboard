import { getAllProjects } from '@/lib/db';
import { PortfolioLayout } from '@/components/PortfolioLayout';

export const revalidate = 0;

export default async function PortfolioPage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  try {
    projects = await getAllProjects();
  } catch (e) {
    console.error('Supabase 연결 실패:', e);
  }
  return <PortfolioLayout projects={projects} />;
}
