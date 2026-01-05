import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         LineChart, Line, Legend } from 'recharts';
import { EnhancedWasteProperty } from './FilterPanel';
import { WasteType } from '../../types';

interface VisualizationPanelProps {
  data: EnhancedWasteProperty[];
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ data }) => {
  // 生成pH值分布直方图数据
  const phDistributionData = useMemo(() => {
    const bins = [0, 3, 6, 9, 12, 15];
    const distribution = bins.slice(0, -1).map((start, index) => {
      const end = bins[index + 1];
      const count = data.filter(item => item.ph >= start && item.ph < end).length;
      return { range: `${start}-${end}`, count };
    });
    return distribution;
  }, [data]);
  
  // 生成固废类型分布数据
  const wasteTypeDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    Object.values(WasteType).forEach(type => {
      distribution[type] = data.filter(item => item.type === type).length;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [data]);
  
  // 生成有机质时间趋势数据
  const organicMatterTrend = useMemo(() => {
    return [
      { month: '1月', value: 45.2 },
      { month: '2月', value: 46.8 },
      { month: '3月', value: 47.5 },
      { month: '4月', value: 48.2 },
      { month: '5月', value: 49.0 },
      { month: '6月', value: 49.5 }
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* 属性分布直方图 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">pH值分布</h3>
        </div>
        <div className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value} 条`, '数量']}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 固废类型分布 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">固废类型分布</h3>
        </div>
        <div className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteTypeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 时间趋势图 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">有机质时间趋势</h3>
        </div>
        <div className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={organicMatterTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value}%`, '有机质含量']}
                />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 空间分布地图（简化版） */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">空间分布地图</h3>
        </div>
        <div className="p-4">
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="text-4xl mb-2">🗺️</div>
              <p>空间分布地图</p>
              <p className="text-sm mt-1">基于固废位置信息生成</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
