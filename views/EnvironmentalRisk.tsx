
import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Video, MapPin, TrendingUp, 
  Bell, Server, AlertCircle, BarChart2, Clock, Wifi, Cloud, ThermometerSun,
  Droplets, Wind, ArrowUpRight, ArrowDownRight, RefreshCw, Fullscreen, 
  Camera, Download, Play, Pause, Settings
} from 'lucide-react';
import { api } from '../services/api';
import type { 
  DashboardItem, VideoCamera, AlertItem, TrendDataItem, DeviceStatus, RiskSource
} from '../services/api';

// 定义颜色主题
const COLORS = {
  background: '#0F1A2B',
  primary: '#1E3A5F',
  secondary: '#162D4A',
  accent: '#0EA5E9',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155'
};

export default function EnvironmentalRisk() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('实时预警');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartDays, setChartDays] = useState(1);
  const [videoLayout, setVideoLayout] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // API数据状态
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);
  const [videoCameras, setVideoCameras] = useState<VideoCamera[]>([]);
  const [alertsData, setAlertsData] = useState<AlertItem[]>([]);
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);
  const [deviceStatusData, setDeviceStatusData] = useState<DeviceStatus[]>([]);
  const [riskSources, setRiskSources] = useState<RiskSource[]>([]);
  const [loading, setLoading] = useState(true);

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 加载初始数据
  useEffect(() => {
    loadAllData();
  }, [chartDays]);

  // 自动刷新数据（每30秒）
  useEffect(() => {
    const autoRefresh = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(autoRefresh);
  }, []);

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false });
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      weekday: 'long'
    });
  };

  // 加载所有数据
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [dashboard, cameras, alerts, trends, devices, risks] = await Promise.all([
        api.getDashboardData(),
        api.getVideoCameras(),
        api.getAlertsData(),
        api.getTrendData(chartDays),
        api.getDeviceStatus(),
        api.getRiskSources()
      ]);
      
      setDashboardData(dashboard);
      setVideoCameras(cameras);
      setAlertsData(alerts);
      setTrendData(trends);
      setDeviceStatusData(devices);
      setRiskSources(risks);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadAllData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // 更新预警状态
  const updateAlertStatus = async (id: number, status: AlertItem['status']) => {
    try {
      const updatedAlert = await api.updateAlertStatus(id, status);
      setAlertsData(prev => 
        prev.map(alert => 
          alert.id === id ? updatedAlert : alert
        )
      );
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
  };

  // 处理视频布局切换
  const handleVideoLayoutChange = (layout: number) => {
    setVideoLayout(layout);
  };

  // 处理趋势图时间范围切换
  const handleChartDaysChange = (days: number) => {
    setChartDays(days);
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#0F1A2B] text-white">
      {/* 顶部状态栏 */}
      <div className="h-15 bg-gradient-to-r from-[#1E3A5F] to-[#162D4A] border-b border-[#334155] flex items-center justify-between px-6">
        {/* 左侧项目信息 */}
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-lg font-bold">XX尾矿库生态修复工程</h1>
            <div className="flex items-center space-x-4 mt-1 text-sm text-[#94A3B8]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                <span>运行中</span>
              </div>
              <span>第128天</span>
            </div>
          </div>
        </div>

        {/* 中部实时时间 */}
        <div className="text-center">
          <div className="text-3xl font-bold tracking-wider">{formatTime(currentTime)}</div>
          <div className="text-xs text-[#94A3B8] mt-1">{formatDate(currentTime)}</div>
        </div>

        {/* 右侧系统状态 */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wifi size={16} className="text-[#10B981]" />
              <span className="text-sm">在线</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cloud size={16} className="text-[#0EA5E9]" />
              <span className="text-sm">同步中</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-[#94A3B8]" />
              <span className="text-sm">{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell size={16} className="text-[#F59E0B] animate-pulse" />
              <span className="text-sm font-bold">{alertsData.filter(a => a.status === '待处理').length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 bg-[#162D4A] rounded-lg hover:bg-[#0EA5E9] transition-colors" 
              onClick={refreshData}
              disabled={isRefreshing}
              title="刷新数据"
            >
              <RefreshCw 
                size={16} 
                className={`${isRefreshing ? 'animate-spin' : ''} text-[#94A3B8] hover:text-white`}
              />
            </button>
            <button 
              className="p-2 bg-[#162D4A] rounded-lg hover:bg-[#0EA5E9] transition-colors" 
              onClick={toggleFullscreen}
              title="全屏"
            >
              <Fullscreen size={16} className="text-[#94A3B8] hover:text-white" />
            </button>
            <div className="flex items-center space-x-3 bg-[#162D4A] px-3 py-1 rounded-lg">
              <ThermometerSun size={16} className="text-[#F59E0B]" />
              <span className="text-sm">22°C</span>
              <Droplets size={16} className="text-[#0EA5E9]" />
              <span className="text-sm">65%</span>
              <Wind size={16} className="text-[#94A3B8]" />
              <span className="text-sm">3.2m/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主体监控区 */}
      <div className="p-4 grid grid-cols-12 gap-4">
        {/* 核心指标仪表盘 */}
        <div className="col-span-12 lg:col-span-4 row-span-3 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <BarChart2 size={18} className="mr-2 text-[#0EA5E9]" />
              核心指标仪表盘
            </h3>
            <button className="text-sm px-3 py-1 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors flex items-center">
              <Settings size={14} className="mr-1" />
              配置指标
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] animate-pulse">
                  <div className="h-4 bg-[#334155] rounded w-2/3 mb-2"></div>
                  <div className="h-8 bg-[#334155] rounded w-1/2 mb-3"></div>
                  <div className="h-1 bg-[#334155] rounded-full mb-1"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-[#334155] rounded w-1/4"></div>
                    <div className="h-3 bg-[#334155] rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {dashboardData.map((item, index) => {
                const getStatusColor = () => {
                  switch (item.status) {
                    case 'normal': return '#10B981';
                    case 'warning': return '#F59E0B';
                    case 'danger': return '#EF4444';
                    default: return '#0EA5E9';
                  }
                };

                return (
                  <div 
                    key={index} 
                    className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] hover:border-[#0EA5E9] transition-all cursor-pointer"
                    title="点击查看详情"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-[#94A3B8]">{item.name}</div>
                        <div className="text-2xl font-bold mt-1" style={{ color: getStatusColor() }}>
                          {item.value}
                          <span className="text-sm ml-1">{item.unit}</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: getStatusColor() }}></div>
                    </div>
                    <div className="mt-3 h-1 bg-[#334155] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300" 
                        style={{
                          width: `${((item.value - item.min) / (item.max - item.min)) * 100}%`,
                          backgroundColor: getStatusColor()
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-[#94A3B8]">
                      <span>{item.min}{item.unit}</span>
                      <span>{item.max}{item.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 多视频监控窗口 */}
        <div className="col-span-12 lg:col-span-8 row-span-3 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Video size={18} className="mr-2 text-[#0EA5E9]" />
              多视频监控窗口
            </h3>
            <div className="flex items-center space-x-3">
              <button 
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${videoLayout === 4 ? 'bg-[#0EA5E9] text-white' : 'bg-[#1E3A5F] border-[#334155] hover:bg-[#0EA5E9]'}`}
                onClick={() => handleVideoLayoutChange(4)}
              >
                4画面
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${videoLayout === 9 ? 'bg-[#0EA5E9] text-white' : 'bg-[#1E3A5F] border-[#334155] hover:bg-[#0EA5E9]'}`}
                onClick={() => handleVideoLayoutChange(9)}
              >
                9画面
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${videoLayout === 16 ? 'bg-[#0EA5E9] text-white' : 'bg-[#1E3A5F] border-[#334155] hover:bg-[#0EA5E9]'}`}
                onClick={() => handleVideoLayoutChange(16)}
              >
                16画面
              </button>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? '暂停轮巡' : '开始轮巡'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button 
                  className="p-2 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors"
                  title="截图"
                >
                  <Camera size={16} />
                </button>
                <button 
                  className="p-2 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors"
                  title="下载视频"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className={`grid ${videoLayout === 4 ? 'grid-cols-2' : videoLayout === 9 ? 'grid-cols-3' : 'grid-cols-4'} gap-3`}>
              {Array.from({ length: videoLayout }).map((_, index) => (
                <div key={index} className="relative bg-black rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gradient-to-br from-[#1E3A5F] to-[#162D4A]"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid ${videoLayout === 4 ? 'grid-cols-2' : videoLayout === 9 ? 'grid-cols-3' : 'grid-cols-4'} gap-3`}>
              {videoCameras.slice(0, videoLayout).map((camera) => (
                <div key={camera.id} className="relative bg-black rounded-lg overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-[#1E3A5F] to-[#162D4A] flex items-center justify-center">
                    <Video size={48} className="text-[#64748B]" />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                    {camera.name} - {camera.location}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                    {formatTime(currentTime)}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-1 ${camera.status === 'online' ? 'bg-[#10B981] animate-pulse' : 'bg-[#EF4444]'}`}></span>
                    {camera.status === 'online' ? '在线' : '离线'}
                  </div>
                  {/* 悬停控制按钮 */}
                  <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-black/70 rounded hover:bg-[#0EA5E9] transition-colors" title="全屏">
                      <Fullscreen size={14} />
                    </button>
                    <button className="p-1.5 bg-black/70 rounded hover:bg-[#0EA5E9] transition-colors" title="截图">
                      <Camera size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 地理信息与监测点地图 */}
        <div className="col-span-12 lg:col-span-4 row-span-4 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <MapPin size={18} className="mr-2 text-[#0EA5E9]" />
              地理信息与监测点地图
            </h3>
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1 bg-[#1E3A5F] text-sm rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors">
                卫星图
              </button>
              <button className="px-3 py-1 bg-[#1E3A5F] text-sm rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors">
                地形图
              </button>
            </div>
          </div>
          <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#1E3A5F] to-[#162D4A] rounded-lg flex items-center justify-center">
            <MapPin size={64} className="text-[#64748B]" />
            <div className="absolute text-center text-[#94A3B8]">
              GIS地图组件
              <div className="text-xs mt-1">显示项目区域地图和监测点分布</div>
            </div>
          </div>
        </div>

        {/* 实时数据趋势图 */}
        <div className="col-span-12 lg:col-span-8 row-span-4 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <TrendingUp size={18} className="mr-2 text-[#0EA5E9]" />
              实时数据趋势图
            </h3>
            <div className="flex items-center space-x-3">
              {[1, 7, 30].map((days) => (
                <button 
                  key={days}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${chartDays === days ? 'bg-[#0EA5E9] text-white' : 'bg-[#1E3A5F] border-[#334155] hover:bg-[#0EA5E9]'}`}
                  onClick={() => handleChartDaysChange(days)}
                >
                  {days === 1 ? '24小时' : `${days}天`}
                </button>
              ))}
              <button className="p-2 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors" title="下载数据">
                <Download size={16} />
              </button>
              <button className="p-2 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors" title="图表设置">
                <Settings size={16} />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="h-[300px] bg-[#1E3A5F] rounded-lg border border-[#334155] animate-pulse flex items-center justify-center">
              <div className="text-[#94A3B8]">加载数据中...</div>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94A3B8" 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E3A5F', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Line type="monotone" dataKey="pH" stroke="#0EA5E9" strokeWidth={2} dot={false} animationDuration={1000} />
                  <Line type="monotone" dataKey="电导率" stroke="#10B981" strokeWidth={2} dot={false} animationDuration={1000} />
                  <Line type="monotone" dataKey="溶解氧" stroke="#F59E0B" strokeWidth={2} dot={false} animationDuration={1000} />
                  <Line type="monotone" dataKey="温度" stroke="#EF4444" strokeWidth={2} dot={false} animationDuration={1000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 预警与事件中心 */}
        <div className="col-span-12 lg:col-span-4 row-span-3 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Bell size={18} className="mr-2 text-[#0EA5E9]" />
              预警与事件中心
            </h3>
            <div className="text-sm text-[#F59E0B] flex items-center">
              <AlertTriangle size={16} className="mr-1" />
              {alertsData.filter(a => a.status === '待处理').length}个未处理预警
            </div>
          </div>
          <div className="mb-3">
            <div className="flex space-x-2">
              {['实时预警', '今日事件', '处理中', '已关闭'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${activeTab === tab ? 'bg-[#0EA5E9] text-white' : 'bg-[#1E3A5F] text-[#94A3B8] hover:bg-[#334155]'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-[#334155] rounded-full"></div>
                      <div>
                        <div className="h-4 bg-[#334155] rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-[#334155] rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-[#334155] rounded w-1/6"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-[#334155] rounded w-1/4"></div>
                    <div className="flex space-x-2">
                      <div className="h-4 bg-[#334155] rounded w-1/6"></div>
                      <div className="h-4 bg-[#334155] rounded w-1/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {alertsData.map((alert) => {
                const getLevelColor = () => {
                  switch (alert.level) {
                    case 'normal': return '#10B981';
                    case 'info': return '#0EA5E9';
                    case 'warning': return '#F59E0B';
                    case 'danger': return '#EF4444';
                    default: return '#94A3B8';
                  }
                };

                return (
                  <div key={alert.id} className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] hover:border-[#0EA5E9] transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${alert.level === 'warning' || alert.level === 'danger' ? 'animate-pulse' : ''}`} style={{ backgroundColor: getLevelColor() }}></div>
                        <div>
                          <div className="font-medium">{alert.device} - {alert.location}</div>
                          <div className="text-xs text-[#94A3B8] mt-1">
                            当前值: <span style={{ color: getLevelColor() }}>{alert.value}</span> | 阈值: {alert.threshold}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-[#94A3B8]">{alert.time}</div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full`} style={{ 
                        backgroundColor: `${getLevelColor()}20`,
                        color: getLevelColor()
                      }}>
                        {alert.status}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className="text-xs px-2 py-1 bg-[#334155] rounded hover:bg-[#0EA5E9] transition-colors"
                          onClick={() => updateAlertStatus(alert.id, '已确认')}
                          title="确认预警"
                        >
                          确认
                        </button>
                        <button 
                          className="text-xs px-2 py-1 bg-[#334155] rounded hover:bg-[#10B981] transition-colors"
                          onClick={() => updateAlertStatus(alert.id, '已处理')}
                          title="处理预警"
                        >
                          处理
                        </button>
                        <button 
                          className="text-xs px-2 py-1 bg-[#334155] rounded hover:bg-[#EF4444] transition-colors"
                          onClick={() => updateAlertStatus(alert.id, '已关闭')}
                          title="关闭预警"
                        >
                          关闭
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 设备状态监控 */}
        <div className="col-span-12 lg:col-span-4 row-span-3 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Server size={18} className="mr-2 text-[#0EA5E9]" />
              设备状态监控
            </h3>
            <div className="text-sm">
              在线率: <span className="font-bold text-[#10B981]">{Math.round((deviceStatusData.filter(d => d.status === 'online').length / deviceStatusData.length) * 100)}%</span>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="h-4 bg-[#334155] rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-[#334155] rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-[#334155] rounded-full px-3"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <div className="h-3 bg-[#334155] rounded w-1/3 mb-1"></div>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-[#334155] rounded-full mr-2"></div>
                        <div className="h-3 bg-[#334155] rounded w-1/4"></div>
                      </div>
                    </div>
                    <div>
                      <div className="h-3 bg-[#334155] rounded w-1/3 mb-1"></div>
                      <div className="flex items-center">
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-2 h-4 bg-[#334155] rounded-full"></div>
                          ))}
                        </div>
                        <div className="h-3 bg-[#334155] rounded w-1/4 ml-2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-[#334155] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {deviceStatusData.map((device) => {
                const getStatusColor = () => {
                  switch (device.status) {
                    case 'online': return '#10B981';
                    case 'warning': return '#F59E0B';
                    case 'offline': return '#EF4444';
                    default: return '#94A3B8';
                  }
                };

                return (
                  <div 
                    key={device.id} 
                    className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] hover:border-[#0EA5E9] transition-all cursor-pointer"
                    title="点击查看设备详情"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-xs text-[#94A3B8] mt-1">{device.type}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full flex items-center`} style={{ 
                        backgroundColor: `${getStatusColor()}20`,
                        color: getStatusColor()
                      }}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${device.status !== 'online' ? 'animate-pulse' : ''}`} style={{ backgroundColor: getStatusColor() }}></span>
                        {device.status === 'online' ? '在线' : device.status === 'warning' ? '警告' : '离线'}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-[#94A3B8]">电池电量</div>
                        <div className="flex items-center mt-1">
                          <div className="w-16 h-2 bg-[#334155] rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full rounded-full transition-all duration-300" 
                              style={{
                                width: `${device.battery}%`,
                                backgroundColor: device.battery > 20 ? '#10B981' : '#EF4444'
                              }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium">{device.battery}%</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#94A3B8]">信号强度</div>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div 
                                key={i}
                                className={`w-2 h-4 mx-0.5 rounded-full transition-all duration-300`}
                                style={{
                                  backgroundColor: i < device.signal ? '#0EA5E9' : '#334155'
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="text-sm font-medium ml-2">{device.signal}/5</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-[#94A3B8]">
                      最后通信: {device.lastComm}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 环境风险评估 */}
        <div className="col-span-12 lg:col-span-4 row-span-3 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <AlertCircle size={18} className="mr-2 text-[#0EA5E9]" />
            环境风险评估
          </h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div>
                <div className="h-4 bg-[#334155] rounded w-1/3 mb-3"></div>
                <div className="w-full h-40 bg-[#1E3A5F] rounded-lg border border-[#334155]"></div>
              </div>
              <div>
                <div className="h-4 bg-[#334155] rounded w-1/3 mb-3"></div>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between mb-1">
                      <div className="h-3 bg-[#334155] rounded w-1/4"></div>
                      <div className="h-3 bg-[#334155] rounded w-1/6"></div>
                    </div>
                    <div className="h-1.5 bg-[#334155] rounded-full"></div>
                  </div>
                ))}
              </div>
              <div className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155]">
                <div className="h-4 bg-[#334155] rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-[#334155] rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-[#334155] rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-3">风险矩阵</div>
                <div className="w-full h-40 bg-[#1E3A5F] rounded-lg border border-[#334155] flex items-center justify-center cursor-pointer hover:border-[#0EA5E9] transition-all">
                  <div className="text-[#94A3B8] text-center">
                    <div className="text-lg mb-1">风险矩阵图</div>
                    <div className="text-xs">点击查看详细风险分析</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-3">主要风险源</div>
                <div className="space-y-2">
                  {riskSources.map((risk, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{risk.name}</span>
                        <span>{risk.value}%</span>
                      </div>
                      <div className="h-1.5 bg-[#334155] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#0EA5E9] transition-all duration-500 ease-out"
                          style={{ width: `${risk.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155]">
                <div className="text-sm font-medium mb-2">当前风险等级</div>
                <div className="text-2xl font-bold text-[#F59E0B]">中等风险</div>
                <div className="flex items-center mt-2 text-xs text-[#94A3B8]">
                  <ArrowUpRight size={14} className="mr-1 text-[#EF4444] animate-pulse" />
                  <span>较昨日上升 5%</span>
                </div>
                <button 
                  className="w-full mt-3 text-xs px-3 py-1 bg-[#162D4A] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors"
                >
                  查看应急预案
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 项目进度与统计 */}
        <div className="col-span-12 row-span-2 bg-[#162D4A] rounded-lg border border-[#334155] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <BarChart2 size={18} className="mr-2 text-[#0EA5E9]" />
              项目进度与统计
            </h3>
            <button className="text-sm px-3 py-1 bg-[#1E3A5F] rounded-lg border border-[#334155] hover:bg-[#0EA5E9] transition-colors">
              查看详细报告
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] animate-pulse">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-[#334155] rounded w-1/2"></div>
                    <div className="h-3 bg-[#334155] rounded w-1/6"></div>
                  </div>
                  <div className="h-8 bg-[#334155] rounded w-1/3 mb-3"></div>
                  <div className="h-1.5 bg-[#334155] rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: '总进度', value: 75, unit: '%', trend: 'up', change: 2 },
                { name: '勘察阶段', value: 100, unit: '%', trend: 'stable', change: 0 },
                { name: '设计阶段', value: 100, unit: '%', trend: 'stable', change: 0 },
                { name: '施工阶段', value: 85, unit: '%', trend: 'up', change: 3 },
                { name: '监测阶段', value: 60, unit: '%', trend: 'up', change: 5 },
                { name: '验收阶段', value: 0, unit: '%', trend: 'stable', change: 0 },
                { name: '人力使用', value: 82, unit: '%', trend: 'up', change: 1 },
                { name: '资金使用', value: 70, unit: '%', trend: 'up', change: 2 }
              ].map((item, index) => (
                <div key={index} className="bg-[#1E3A5F] rounded-lg p-3 border border-[#334155] hover:border-[#0EA5E9] transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-[#94A3B8]">{item.name}</div>
                    <div className={`flex items-center text-xs ${item.trend === 'up' ? 'text-[#EF4444]' : item.trend === 'down' ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                      {item.trend === 'up' ? <ArrowUpRight size={12} /> : item.trend === 'down' ? <ArrowDownRight size={12} /> : null}
                      {item.change !== 0 && <span className="ml-1">{item.change}%</span>}
                    </div>
                  </div>
                  <div className="text-2xl font-bold mt-1">{item.value}{item.unit}</div>
                  <div className="mt-3 h-1.5 bg-[#334155] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#0EA5E9] transition-all duration-500 ease-out"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

