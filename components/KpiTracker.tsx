import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell } from 'recharts';
import { Target, TrendingUp, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';

const data = [
  { name: '1월', target: 5000, actual: 4800 },
  { name: '2월', target: 8000, actual: 8200 },
  { name: '3월', target: 12000, actual: 11500 },
  { name: '4월', target: 18000, actual: 21000 },
  { name: '5월', target: 25000, actual: 28000 },
  { name: '6월', target: 35000, actual: 0 },
];

const qualKpi = [
  { name: '브랜드 인지도', score: 85, target: 80 },
  { name: '사용자 만족도', score: 92, target: 90 },
  { name: 'SNS 바이럴', score: 65, target: 75 },
  { name: '핵심 가치 인지', score: 78, target: 70 },
];

export const KpiTracker = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantitative Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target size={20} className="text-blue-600" />
                정량 KPI 추이 (가입자수)
              </h3>
              <p className="text-sm text-gray-500">목표 대비 실제 성과 실시간 비교</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded text-emerald-700 text-xs font-bold">
              <ArrowUpRight size={14} /> 12% 목표 상회
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="target" stroke="#cbd5e1" fillOpacity={1} fill="url(#colorTarget)" strokeWidth={2} name="목표" />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} name="실제" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Qualitative Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-600" />
                정성 성과 지표 (브랜드 헬스)
              </h3>
              <p className="text-sm text-gray-500">주기별 설문 및 분석 데이터 기반</p>
            </div>
          </div>

          <div className="space-y-6">
            {qualKpi.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">목표 {item.target}%</span>
                    <span className={`text-sm font-bold ${item.score >= item.target ? 'text-blue-600' : 'text-rose-500'}`}>
                      {item.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.score >= item.target ? 'bg-blue-500' : 'bg-rose-400'}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">분석 인사이트</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              SNS 바이럴 지수는 목표치에 미치지 못하고 있으나, 실사용자 만족도가 92%로 매우 높아 전환율이 긍정적으로 작용하고 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">누적 유입</p>
            <h4 className="text-2xl font-bold text-gray-900">421,902 <span className="text-sm font-normal text-emerald-500">+15.2%</span></h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-5">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">전환율 (CVR)</p>
            <h4 className="text-2xl font-bold text-gray-900">4.82% <span className="text-sm font-normal text-emerald-500">+0.5%</span></h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-5">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase">광고 효율 (ROAS)</p>
            <h4 className="text-2xl font-bold text-gray-900">382% <span className="text-sm font-normal text-rose-500">-2.1%</span></h4>
          </div>
        </div>
      </div>
    </div>
  );
};
