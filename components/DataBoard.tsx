import React from 'react';
import { Search, Filter, Download, ExternalLink, Tag, Eye, MousePointer2, Share2 } from 'lucide-react';

const contentData = [
  { id: 1, title: '캠페인 티저 영상 (Shorts)', type: 'Short-form', channel: 'Instagram', views: '1.2M', ctr: '4.2%', spend: '₩ 12M', roas: '380%' },
  { id: 2, title: '메인 화보 촬영 비하인드', type: 'Image/Carousel', channel: 'Instagram', views: '450K', ctr: '5.8%', spend: '₩ 5M', roas: '410%' },
  { id: 3, title: '유튜브 프리롤 A안', type: 'Video', channel: 'YouTube', views: '2.8M', ctr: '2.1%', spend: '₩ 45M', roas: '220%' },
  { id: 4, title: '인플루언서 @lifestyle_joy 브랜디드', type: 'Branded', channel: 'Blog/SNS', views: '150K', ctr: '8.4%', spend: '₩ 8M', roas: '520%' },
  { id: 5, title: '카카오 비즈보드 리마케팅', type: 'Banner', channel: 'Kakao', views: '8.2M', ctr: '1.2%', spend: '₩ 20M', roas: '180%' },
];

export const DataBoard = () => {
  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="콘텐츠 제목, 채널 검색..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} /> 필터
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={16} /> 내보내기
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataStatCard label="총 노출수" value="13.2M" sub="+2.1M" icon={<Eye size={20} className="text-blue-500" />} />
        <DataStatCard label="평균 클릭률" value="3.42%" sub="+0.15%" icon={<MousePointer2 size={20} className="text-purple-500" />} />
        <DataStatCard label="공유/바이럴" value="24.8K" sub="+3.2K" icon={<Share2 size={20} className="text-emerald-500" />} />
        <DataStatCard label="매체 효율" value="4.2x" sub="0.2x" icon={<Tag size={20} className="text-rose-500" />} />
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">콘텐츠 & 광고 퍼포먼스</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Update: Real-time</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">콘텐츠/광고명</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">채널</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">노출/조회</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">CTR</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">집행액</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">ROAS</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{item.title}</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-600">{item.channel}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-mono text-gray-700">{item.views}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">{item.ctr}</td>
                  <td className="px-6 py-4 text-right text-sm font-mono text-gray-600">{item.spend}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${parseInt(item.roas) > 300 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {item.roas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-300 hover:text-blue-500 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DataStatCard = ({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">{sub}</span>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <h4 className="text-2xl font-black text-gray-900">{value}</h4>
    </div>
  </div>
);
