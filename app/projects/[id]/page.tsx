import { getProject, getCampaigns } from '@/lib/db';
import { fetchProjectData } from '@/lib/sheets';
import DashboardClient from '@/components/DashboardClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const campaigns = await getCampaigns(id);

  // 구글 시트는 해당 프로젝트에 sheets_url이 설정된 경우에만 호출
  let projectData = null;
  if (project.sheets_url && project.sheets_gid) {
    try {
      projectData = await fetchProjectData(project.sheets_url, project.sheets_gid);
    } catch (e) {
      console.error('Sheets fetch 실패:', e);
    }
  }

  return (
    <DashboardClient
      project={project}
      campaigns={campaigns}
      projectData={projectData}
    />
  );
}
