import React, { useState, useRef, useEffect } from 'react';
import { X, Search, AlertCircle, ExternalLink, FileDown, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EnhancedWasteProperty } from './FilterPanel';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: EnhancedWasteProperty | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, item }) => {
  // 管理激活的标签页
  const [activeTab, setActiveTab] = useState('basic');
  const tabRefs = {
    basic: useRef<HTMLDivElement>(null),
    toxicity: useRef<HTMLDivElement>(null),
    references: useRef<HTMLDivElement>(null),
    similar: useRef<HTMLDivElement>(null),
    history: useRef<HTMLDivElement>(null)
  };

  if (!isOpen || !item) return null;

  // 滚动到指定标签页
  const scrollToTab = (tabId: string) => {
    setActiveTab(tabId);
    const ref = tabRefs[tabId as keyof typeof tabRefs];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 bg-white shadow-2xl z-50 w-full max-w-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
      {/* 详情页头部 */}
      <div className="sticky top-0 z-10 p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-slate-50 shadow-sm">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{item.name} - 详情</h3>
          <p className="text-slate-500 text-sm mt-1">ID: {item.id.padStart(6, '0')}</p>
        </div>
        <button 
          className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-all"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* 详情页标签页导航 - 固定在顶部 */}
      <div className="sticky top-[88px] z-10 border-b border-slate-100 bg-white">
        <div className="flex overflow-x-auto">
          {[
            { id: 'basic', label: '基本信息', icon: <Search size={16} /> },
            { id: 'toxicity', label: '毒性释放数据', icon: <AlertCircle size={16} /> },
            { id: 'references', label: '文献参考', icon: <ExternalLink size={16} /> },
            { id: 'similar', label: '相似案例', icon: <FileDown size={16} /> },
            { id: 'history', label: '处理历史', icon: <Trash2 size={16} /> }
          ].map(tab => (
            <button 
              key={tab.id} 
              className={`px-6 py-3 text-sm font-medium flex items-center space-x-2 transition-all ${activeTab === tab.id ? 'border-b-2 border-emerald-600 text-emerald-600' : 'border-b-2 border-transparent hover:bg-slate-50 hover:text-emerald-600'}`}
              onClick={() => scrollToTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 详情页内容 - 单页滚动，带标签锚点 */}
      <div className="p-6 space-y-12">
        {/* 基本信息 */}
        <div ref={tabRefs.basic} className="space-y-4">
          <div className="flex items-center space-x-3">
            <Search size={20} className="text-emerald-600" />
            <h4 className="text-xl font-semibold text-slate-800">核心属性指标</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h5 className="text-sm font-medium text-slate-600 mb-3">固废基本信息</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">类型</span>
                  <span className="text-sm font-medium text-slate-800">{item.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">学科分类</span>
                  <span className="text-sm font-medium text-slate-800">{item.discipline}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">数据来源</span>
                  <span className="text-sm font-medium text-slate-800">{item.dataSource}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">采样时间</span>
                  <span className="text-sm font-medium text-slate-800">{item.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">采样地点</span>
                  <span className="text-sm font-medium text-slate-800">{item.location || '未知'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl">
              <h5 className="text-sm font-medium text-slate-600 mb-3">理化性质</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">pH值</span>
                  <span className="text-sm font-medium text-slate-800">{item.ph}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">有机质含量</span>
                  <span className="text-sm font-medium text-slate-800">{item.organicMatter}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">含水率</span>
                  <span className="text-sm font-medium text-slate-800">{item.moisture}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">毒性等级</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.toxicityLevel === '低' ? 'bg-green-50 text-green-700' : item.toxicityLevel === '中' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                    {item.toxicityLevel}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl">
              <h5 className="text-sm font-medium text-slate-600 mb-3">重金属含量 (mg/kg)</h5>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(item.heavyMetals).map(([metal, value]) => (
                  <div key={metal} className="text-center">
                    <div className="text-sm font-semibold text-slate-700 capitalize">{metal}</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">{value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">mg/kg</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 毒性释放数据 */}
        <div ref={tabRefs.toxicity} className="space-y-4">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-emerald-600" />
            <h4 className="text-xl font-semibold text-slate-800">毒性释放模拟数据</h4>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: '1月', cd: 0.2, pb: 1.5 },
                  { month: '2月', cd: 0.3, pb: 1.8 },
                  { month: '3月', cd: 0.25, pb: 1.6 },
                  { month: '4月', cd: 0.18, pb: 1.4 },
                  { month: '5月', cd: 0.15, pb: 1.2 },
                  { month: '6月', cd: 0.12, pb: 1.0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`${value} mg/kg`, '释放量']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="cd" stroke="#f59e0b" strokeWidth={2} name="Cd 释放量" />
                  <Line type="monotone" dataKey="pb" stroke="#3b82f6" strokeWidth={2} name="Pb 释放量" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* 文献参考 */}
        <div ref={tabRefs.references} className="space-y-4">
          <div className="flex items-center space-x-3">
            <ExternalLink size={20} className="text-emerald-600" />
            <h4 className="text-xl font-semibold text-slate-800">相关文献参考</h4>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-600">
                    <ExternalLink size={14} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-slate-800">尾矿重金属污染与修复技术研究进展</h5>
                    <p className="text-xs text-slate-500 mt-1">环境科学学报, 2023, 43(5): 1234-1245</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center space-x-1 cursor-pointer hover:underline">
                      <span>查看原文</span>
                      <ExternalLink size={12} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 相似案例 */}
        <div ref={tabRefs.similar} className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileDown size={20} className="text-emerald-600" />
            <h4 className="text-xl font-semibold text-slate-800">相似固废案例</h4>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-emerald-200 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-slate-800">相似固废案例 #{i}</h5>
                      <p className="text-xs text-slate-500 mt-1">{item.type} | {item.discipline} | 相似度: {(85 - i * 5)}%</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      查看详情
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 处理历史 */}
        <div ref={tabRefs.history} className="space-y-4">
          <div className="flex items-center space-x-3">
            <Trash2 size={20} className="text-emerald-600" />
            <h4 className="text-xl font-semibold text-slate-800">处理分析历史</h4>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="space-y-3">
              {[
                { id: '1', type: '成土潜力评估', date: '2023-10-20', result: '潜力指数: 78', status: '已完成' },
                { id: '2', type: '环境风险评估', date: '2023-10-22', result: '风险等级: 低', status: '已完成' },
                { id: '3', type: '成本效益分析', date: '2023-10-25', result: '收益: 120元/吨', status: '已完成' }
              ].map(record => (
                <div key={record.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-slate-800">{record.type}</h5>
                      <p className="text-xs text-slate-500 mt-1">{record.date} | {record.result}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${record.status === '已完成' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
