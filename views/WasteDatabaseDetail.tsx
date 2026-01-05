import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, AlertTriangle, BookOpen, FileCheck,
  History, Trash2, Edit2, BarChart3, Database, Zap,
  Users, Eye, Globe, Clock, CheckCircle2, AlertCircle,
  ExternalLink, FileDown
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EnhancedWasteProperty } from './WasteDatabase/FilterPanel';
import { api } from '../services/api';

const WasteDatabaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 返回列表
  const onBack = () => {
    navigate('/database');
  };
  
  // 确保id存在
  if (!id) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-slate-600 mb-4">无效的详情ID</p>
          <button 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
            onClick={onBack}
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }
  // 管理激活的标签页
  const [activeTab, setActiveTab] = useState('basic');
  const [item, setItem] = useState<EnhancedWasteProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabRefs = {
    basic: useRef<HTMLDivElement>(null),
    toxicity: useRef<HTMLDivElement>(null),
    references: useRef<HTMLDivElement>(null),
    similar: useRef<HTMLDivElement>(null),
    history: useRef<HTMLDivElement>(null)
  };

  // 加载详情数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getWasteDataById(id);
        if (!data) {
          setError('数据不存在');
        } else {
          setItem(data);
        }
      } catch (err) {
        setError('加载数据失败，请重试');
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-slate-600">正在加载数据...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-slate-600 mb-4">{error || '数据不存在'}</p>
          <button 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
            onClick={onBack}
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  // 滚动到指定标签页
  const scrollToTab = (tabId: string) => {
    setActiveTab(tabId);
    const ref = tabRefs[tabId as keyof typeof tabRefs];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            <span>返回列表</span>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{item.name} - 详情</h2>
            <p className="text-slate-500 text-sm mt-1">ID: {String(item.id).padStart(6, '0')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
          >
            <Edit2 size={18} />
            <span>编辑</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm transition-all"
          >
            <Trash2 size={18} />
            <span>删除</span>
          </button>
        </div>
      </div>
      
      {/* 详情页标签页导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {[
              { id: 'basic', label: '基本信息', icon: <Database size={18} /> },
              { id: 'toxicity', label: '毒性释放数据', icon: <AlertTriangle size={18} /> },
              { id: 'references', label: '文献参考', icon: <BookOpen size={18} /> },
              { id: 'similar', label: '相似案例', icon: <FileCheck size={18} /> },
              { id: 'history', label: '处理历史', icon: <History size={18} /> }
            ].map(tab => (
              <button 
                key={tab.id} 
                className={`px-6 py-2.5 text-sm font-medium flex items-center space-x-2 transition-all rounded-xl whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm' : 'hover:bg-slate-50 hover:text-emerald-600 border border-transparent'}`}
                onClick={() => scrollToTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 详情页内容 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="space-y-12">
          {/* 基本信息 */}
          <div ref={tabRefs.basic} className="space-y-6">
            {/* 核心属性指标 */}
            <div className="flex items-center space-x-3">
              <Database size={20} className="text-emerald-600" />
              <h4 className="text-xl font-semibold text-slate-800">核心属性指标</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 固废基本信息 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h5 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  固废基本信息
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">类型</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === '尾矿' ? 'bg-stone-100 text-stone-700' : item.type === '污泥' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">学科分类</span>
                    <span className="text-sm font-medium text-slate-800">{item.discipline}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">来源行业</span>
                    <span className="text-sm font-medium text-slate-800">{item.source}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">采样时间</span>
                    <span className="text-sm font-medium text-slate-800">{item.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">毒性等级</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.toxicityLevel === '低' ? 'bg-green-50 text-green-700' : item.toxicityLevel === '中' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                      {item.toxicityLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 理化性质 */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h5 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  理化性质
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">pH值</span>
                    <span className="text-sm font-medium text-slate-800">{item.ph}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">有机质含量</span>
                    <span className="text-sm font-medium text-slate-800">{item.organicMatter}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">含水率</span>
                    <span className="text-sm font-medium text-slate-800">{item.moisture}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">数据来源</span>
                    <span className="text-sm font-medium text-slate-800">{item.dataSource}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">地理坐标</span>
                    <span className="text-sm font-medium text-slate-800">{item.location || '未知'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 重金属含量 */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h5 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                重金属含量 (mg/kg)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(item.heavyMetals).map(([metal, value]) => (
                  <div key={metal} className="text-center p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-all">
                    <div className="text-sm font-semibold text-slate-700 capitalize">{metal}</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">{value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">mg/kg</div>
                    {/* 添加安全阈值参考线 */}
                    <div className="mt-2">
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>安全阈值: 100 mg/kg</span>
                        <span>{value <= 100 ? '达标' : '超标'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 数据来源详情 */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h5 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                数据来源详情
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">数据验证状态</div>
                    <div className="text-sm font-medium text-emerald-700">已验证</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">来源机构</div>
                    <div className="text-sm font-medium text-slate-800">环境科学研究所</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Clock size={16} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">数据更新时间</div>
                    <div className="text-sm font-medium text-slate-800">{item.timestamp}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 地理空间信息 */}
            {item.location && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h5 className="text-sm font-medium text-slate-700 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  地理空间信息
                </h5>
                <div className="h-40 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <Globe size={32} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-500">地图功能开发中</p>
                    <p className="text-xs text-slate-400 mt-1">坐标: {item.location}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 毒性释放数据 */}
          <div ref={tabRefs.toxicity} className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-emerald-600" />
              <h4 className="text-xl font-semibold text-slate-800">毒性释放模拟数据</h4>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="h-80">
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
    </div>
  );
};

export default WasteDatabaseDetail;