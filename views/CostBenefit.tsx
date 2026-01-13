
import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Wallet, ArrowUpRight, Target } from 'lucide-react';

const data = [
  { name: '尾矿还田', cost: 120, benefit: 80, roi: 0.67 },
  { name: '污泥基基质', cost: 240, benefit: 310, roi: 1.29 },
  { name: '秸秆改良', cost: 80, benefit: 140, roi: 1.75 },
  { name: '工业灰渣', cost: 180, benefit: 160, roi: 0.89 },
];

export default function CostBenefit() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">成本效益分析</h2>
        <p className="text-slate-500 text-sm mt-1">对不同固废资源化利用路径的投入产出比（ROI）进行量化评估</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 text-emerald-600 mb-2">
            <DollarSign size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">平均利用成本</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">¥165.5 <span className="text-xs text-slate-400 font-normal">/ 吨</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-2">
            <Wallet size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">综合经济收益</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">¥210.2 <span className="text-xs text-slate-400 font-normal">/ 吨</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 text-indigo-600 mb-2">
            <ArrowUpRight size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">投资回收期</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">1.8 <span className="text-xs text-slate-400 font-normal">年</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 text-amber-600 mb-2">
            <Target size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">预期 ROI</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">1.27x</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-8">不同路径经济性对比 (CNY/t)</h3>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#10b981', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar yAxisId="left" dataKey="cost" name="投入成本" fill="#64748b" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar yAxisId="left" dataKey="benefit" name="直接收益" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI指数" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981'}} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 成本优化建议 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">成本优化建议</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 成本降低建议 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <DollarSign size={16} />
              <h4 className="font-semibold">降低平均利用成本</h4>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>优化运输路线，减少运输成本（预计降低 15-20%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>采用规模化处理工艺，降低单位处理成本（预计降低 10-15%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>利用政策补贴，降低设备投入成本（预计降低 5-8%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>优化原材料配比，减少昂贵添加剂使用（预计降低 8-12%）</span>
              </li>
            </ul>
          </div>
          
          {/* 缩短投资回收期建议 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-purple-600">
              <ArrowUpRight size={16} />
              <h4 className="font-semibold">缩短投资回收期</h4>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>增加产品附加值，开发高利润产品（预计缩短 25-30%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>提高生产效率，增加年产量（预计缩短 15-20%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>采用分期付款或租赁设备，减少初始投资（预计缩短 10-15%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>开发多元化收入来源，增加额外收益（预计缩短 10-15%）</span>
              </li>
            </ul>
          </div>
          
          {/* 极限成本降低程序 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-orange-600">
              <Target size={16} />
              <h4 className="font-semibold">极限成本降低程序</h4>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>优化能源利用，采用清洁能源（预计降低 20-25%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>实现自动化生产，减少人力成本（预计降低 30-35%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>建立循环经济模式，回收利用副产品（预计降低 15-20%）</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>与供应商建立长期合作关系，降低原材料采购成本（预计降低 5-10%）</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h3 className="text-2xl font-bold mb-4">需要更详细的经济效益报告？</h3>
          <p className="text-slate-400 leading-relaxed">基于当前的市场价格（如煤矸石、改良剂价格）以及当地政策补贴，我们可以为您生成更精准的财务敏感性分析报告。</p>
        </div>
        <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 shrink-0">
          生成深度经济分析报表
        </button>
      </div>
    </div>
  );
}
