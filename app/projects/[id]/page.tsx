import { getProject, getCampaigns, getMilestones, getActivityLog } from '@/lib/db';
import { fetchProjectData } from '@/lib/sheets';
import DashboardClient from '@/components/DashboardClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const [campaigns, milestones, activities] = await Promise.all([
    getCampaigns(id),
    getMilestones(id),
    getActivityLog(id),
  ]);

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
      milestones={milestones}
      activities={activities}
      projectData={projectData}
    />
  );
}
