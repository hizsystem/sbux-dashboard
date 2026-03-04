import { redirect } from 'next/navigation';

// /projects/[id] 라우트로 이전됨
export default function DashboardPage() {
  redirect('/');
}
