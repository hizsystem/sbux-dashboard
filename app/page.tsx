import { getAllProjects } from '@/lib/db';
import { ProjectCard } from '@/components/ProjectCard';
import { PortfolioHeader } from '@/components/PortfolioHeader';
import { FolderOpen } from 'lucide-react';

export const revalidate = 0;

export default async function PortfolioPage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  try {
    projects = await getAllProjects();
  } catch (e) {
    console.error('Supabase 연결 실패:', e);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortfolioHeader projectCount={projects.length} />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <FolderOpen size={24} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-500">프로젝트가 없습니다</p>
            <p className="text-sm mt-1">상단의 &quot;새 프로젝트&quot; 버튼을 눌러 시작하세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
