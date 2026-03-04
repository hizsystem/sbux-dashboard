import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, MessageSquare, Paperclip, MoreVertical } from 'lucide-react';

const timelineData = [
  { id: 1, task: '캠페인 기획 및 전략 수립', group: 'Planning', start: '01.01', end: '01.20', progress: 100, status: 'done', team: '전략팀' },
  { id: 2, task: '브랜드 비주얼 가이드 제작', group: 'Design', start: '01.15', end: '02.10', progress: 100, status: 'done', team: '디자인팀' },
  { id: 3, task: '메인 홍보 영상 촬영', group: 'Production', start: '02.01', end: '03.05', progress: 85, status: 'in-progress', team: '영상팀' },
  { id: 4, task: '인플루언서 섭외 및 가이드', group: 'Marketing', start: '02.20', end: '03.20', progress: 60, status: 'in-progress', team: '운영팀' },
  { id: 5, task: '디지털 광고 매체 부킹', group: 'Marketing', start: '03.10', end: '03.30', progress: 30, status: 'upcoming', team: '매체팀' },
  { id: 6, task: '캠페인 런칭 및 운영', group: 'Main', start: '04.01', end: '06.30', progress: 0, status: 'upcoming', team: '공통' },
];

export const TimelineView = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">프로젝트 타임라인</h3>
          <p className="text-sm text-gray-500">전체 일정 및 리소스 현황</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-600 border-r border-gray-200">Day</button>
            <button className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white">Week</button>
            <button className="px-3 py-1.5 text-xs font-bold bg-white text-gray-600 border-l border-gray-200">Month</button>
          </div>
          <button className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left w-64">작업 내용</th>
              <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">진행팀</th>
              <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">기간</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left w-48">진척도</th>
              <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {timelineData.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{item.task}</span>
                    <span className="text-[10px] font-medium text-gray-400 mt-0.5">{item.group}</span>
                  </div>
                </td>
                <td className="px-4 py-5">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[11px] font-semibold">{item.team}</span>
                </td>
                <td className="px-4 py-5 text-center">
                  <span className="text-xs font-mono text-gray-500">{item.start} - {item.end}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1.5">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          item.status === 'done' ? 'bg-emerald-500' : 
                          item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className={
                        item.status === 'done' ? 'text-emerald-500' : 
                        item.status === 'in-progress' ? 'text-blue-500' : 'text-gray-400'
                      }>
                        {item.status === 'done' ? '완료' : item.status === 'in-progress' ? '진행중' : '대기'}
                      </span>
                      <span className="text-gray-400">{item.progress}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="flex justify-end gap-2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-blue-600"><MessageSquare size={16} /></button>
                    <button className="p-1 hover:text-blue-600"><Paperclip size={16} /></button>
                    <button className="p-1 hover:text-gray-600"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-400">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold text-gray-600">February 2026</span>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
