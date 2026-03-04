import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, Calculator, Percent, Coins, ChevronDown } from 'lucide-react';

const budgetData = [
  { name: 'SNS 채널 운영', value: 150000000, color: '#3b82f6' },
  { name: '인플루언서 마케팅', value: 200000000, color: '#8b5cf6' },
  { name: '기획/전략비', value: 80000000, color: '#ec4899' },
  { name: '오프라인 이벤트', value: 70000000, color: '#f59e0b' },
];

const marginData = [
  { name: '기획비', current: 4500, target: 5000 },
  { name: '대행 수수료', current: 7200, target: 8000 },
  { name: '콘텐츠 마진', current: 12000, target: 11000 },
  { name: '기타 수익', current: 3100, target: 3000 },
];

export const BudgetManager = () => {
  const totalBudget = budgetData.reduce((acc, curr) => acc + curr.value, 0);
  const spentBudget = totalBudget * 0.65; // Mock data: 65% spent

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Wallet size={20} className="text-blue-600" />
                예산 집행 상세
              </h3>
            </div>
            <button className="text-sm text-gray-500 flex items-center gap-1 font-medium hover:text-gray-900">
              분기별 보기 <ChevronDown size={14} />
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | undefined) => value != null ? `₩${value.toLocaleString()}` : ''}
                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">전체 예산</p>
                <h4 className="text-3xl font-extrabold text-gray-900">₩ {totalBudget.toLocaleString()}</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">현재 집행액</span>
                  <span className="font-bold text-gray-900">₩ {spentBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">집행률 65%</span>
                  <span className="text-blue-600 font-bold">남은 예산 ₩ {(totalBudget - spentBudget).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Margin Management Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calculator size={20} className="text-emerald-600" />
            마진 / 수익 분석
          </h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginData} layout="vertical" margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="current" fill="#10b981" radius={[0, 4, 4, 0]} name="현재" barSize={12} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[0, 4, 4, 0]} name="목표" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">예상 수익률</p>
              <h5 className="text-xl font-bold text-emerald-700">18.4%</h5>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">총 마진액</p>
              <h5 className="text-xl font-bold text-blue-700">₩ 92M</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Expense Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">항목명</th>
              <th className="px-6 py-4">카테고리</th>
              <th className="px-6 py-4">배정 예산</th>
              <th className="px-6 py-4">실행 금액</th>
              <th className="px-6 py-4">잔액</th>
              <th className="px-6 py-4">진척도</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { label: '인스타그램/카카오톡 기획', cat: '기획', budget: 120, spent: 110, status: 92 },
              { label: '스타벅스앳홈 화보 촬영', cat: '제작', budget: 80, spent: 45, status: 56 },
              { label: '인플루언서 챌린지 광고', cat: '매체', budget: 50, spent: 30, status: 60 },
              { label: '카카오톡 비즈보드 광고', cat: '매체', budget: 30, spent: 30, status: 100 },
              { label: '바이럴 샘플링 이벤트', cat: '이벤트', budget: 150, spent: 60, status: 40 },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.label}</td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">{item.cat}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">₩ {item.budget}M</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-bold font-mono">₩ {item.spent}M</td>
                <td className="px-6 py-4 text-sm text-rose-500 font-mono">₩ {item.budget - item.spent}M</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-[60px]">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${item.status}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{item.status}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
