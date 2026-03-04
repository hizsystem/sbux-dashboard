import Sidebar from "@/components/Sidebar";
import { TrendingUp, Target, AlertTriangle, Users, CheckSquare, Radio } from "lucide-react";

// 임시 데이터 (나중에 Supabase에서 가져올 예정)
const projectData = {
  name: "2026 네슬레 스타벅스앳홈 프로젝트",
  pm: "이슬기",
  startDate: "2026.01.01",
  endDate: "2026.06.30",
  progress: 45,
  activeCampaigns: 2,
  totalBudget: 1200000000,
  budgetExecution: 60,
  kpiAchievement: 82.4,
  risks: { normal: 3, caution: 1, danger: 0 },
  campaigns: [
    {
      id: 1,
      type: "제작",
      name: "인스타그램 & 카카오톡 기획/운영",
      startDate: "01.01",
      endDate: "04.30",
      progress: 75,
      budget: 450000000,
      execution: 380000000,
      typeColor: "bg-purple-100 text-purple-700",
    },
    {
      id: 2,
      type: "운영",
      name: "인플루언서 바이럴 캠페인",
      startDate: "03.01",
      endDate: "06.15",
      progress: 30,
      budget: 250000000,
      execution: 80000000,
      typeColor: "bg-green-100 text-green-700",
    },
  ],
  stats: {
    roas: "342%",
    roasDesc: "전 캠페인 평균",
    reach: "24.5M",
    reachDesc: "목표 대비 105%",
    tasks: "12/48",
    tasksDesc: "전체 마일스톤 기준",
    channels: "12개",
    channelsDesc: "글로벌 채널 통틀어",
  },
};

function formatBudget(amount: number): string {
  return `₩ ${(amount / 100000000).toFixed(0)}억`;
}

function formatBudgetFull(amount: number): string {
  return `₩ ${amount.toLocaleString("ko-KR")}`;
}

export default function SummaryPage() {
  const { campaigns, stats } = projectData;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content */}
      <main className="ml-48 flex-1 px-8 py-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">SUMMARY</h1>
          <span className="text-xs text-gray-400">● Project v2.4.0</span>
        </div>

        {/* Project Hero Card */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  MASTER PROJECT
                </span>
                <span className="flex items-center gap-1 text-emerald-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  정상 가동 중
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{projectData.name}</h2>
              <div className="flex items-center gap-5 text-sm text-gray-400">
                <span>👤 {projectData.pm} PM</span>
                <span>📅 {projectData.startDate} ~ {projectData.endDate}</span>
                <span>📋 {projectData.activeCampaigns}개 캠페인 운영 중</span>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#374151" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="#6366f1" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - projectData.progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-bold text-lg">{projectData.progress}%</span>
                </div>
              </div>
              <span className="text-gray-400 text-xs mt-1">전체 진행</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Budget */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <TrendingUp size={13} />
              총 예산 집행
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xl font-bold text-gray-900">
                {formatBudgetFull(projectData.totalBudget)}
              </span>
              <span className="text-indigo-600 font-semibold text-sm">{projectData.budgetExecution}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{ width: `${projectData.budgetExecution}%` }}
              />
            </div>
          </div>

          {/* KPI */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Target size={13} />
              마스터 KPI 달성도
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xl font-bold text-gray-900">{projectData.kpiAchievement}%</span>
              <span className="text-emerald-500 font-semibold text-xs">목표 근접</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${projectData.kpiAchievement}%` }}
              />
            </div>
          </div>

          {/* Risk */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <AlertTriangle size={13} />
              리스크 관리
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                  {projectData.risks.normal}
                </span>
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                  {projectData.risks.caution}
                </span>
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">
                  {projectData.risks.danger}
                </span>
              </div>
              <span className="text-xs text-gray-500">진행 중인 4건 중 1건 주의</span>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">📊 캠페인별 진행 상황</h3>
            <button className="text-xs text-gray-400 hover:text-indigo-600">전체 보기 &gt;</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${campaign.typeColor}`}>
                    {campaign.type}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{campaign.startDate} - {campaign.endDate}</span>
                    <span className="text-xs font-semibold text-gray-700 ml-2">{campaign.progress}%</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 mb-3 text-sm">{campaign.name}</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>예산: {formatBudget(campaign.budget)}</span>
                  <span className="text-indigo-600 font-medium">집행: {formatBudget(campaign.execution)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "종합 ROAS", value: stats.roas, desc: stats.roasDesc, icon: TrendingUp, color: "text-indigo-500" },
            { label: "총 도달수", value: stats.reach, desc: stats.reachDesc, icon: Users, color: "text-teal-500" },
            { label: "완료 과업", value: stats.tasks, desc: stats.tasksDesc, icon: CheckSquare, color: "text-purple-500" },
            { label: "활성 채널", value: stats.channels, desc: stats.channelsDesc, icon: Radio, color: "text-amber-500" },
          ].map(({ label, value, desc, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">{label}</span>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
