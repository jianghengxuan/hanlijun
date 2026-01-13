import { WasteProperty, WasteType } from '../types';
import { EnhancedWasteProperty, DataSource } from '../views/WasteDatabase/FilterPanel';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 初始数据
const INITIAL_DATA: WasteProperty[] = [
  { id: '1', name: '德兴铜矿4号尾矿库', type: WasteType.Tailings, ph: 5.2, organicMatter: 0.5, heavyMetals: { cd: 1.2, hg: 0.05, as: 25.4, pb: 45.0, cr: 30.2 }, moisture: 15.0, source: '江西铜业', timestamp: '2023-10-15' },
  { id: '2', name: '市政污泥(厌氧消化)', type: WasteType.Sludge, ph: 7.8, organicMatter: 45.2, heavyMetals: { cd: 0.8, hg: 0.1, as: 12.0, pb: 20.4, cr: 15.6 }, moisture: 80.0, source: '某市污水处理厂', timestamp: '2023-10-20' },
  { id: '3', name: '小麦秸秆(粉碎料)', type: WasteType.Straw, ph: 6.5, organicMatter: 88.5, heavyMetals: { cd: 0.05, hg: 0.01, as: 0.5, pb: 1.2, cr: 2.5 }, moisture: 12.5, source: '农业合作社', timestamp: '2023-11-01' },
  { id: '4', name: '钢铁厂高炉渣', type: WasteType.Slag, ph: 11.2, organicMatter: 0.2, heavyMetals: { cd: 0.1, hg: 0.02, as: 8.5, pb: 12.0, cr: 22.5 }, moisture: 8.0, source: '某钢铁集团', timestamp: '2023-11-05' },
  { id: '5', name: '铝土矿赤泥', type: WasteType.RedMud, ph: 13.0, organicMatter: 0.1, heavyMetals: { cd: 0.3, hg: 0.01, as: 15.2, pb: 8.5, cr: 18.0 }, moisture: 25.0, source: '某铝业公司', timestamp: '2023-11-10' }
];

// 增强数据
export const ENHANCED_DATA: EnhancedWasteProperty[] = INITIAL_DATA.map(item => ({
  ...item,
  discipline: '资源与环境',
  toxicityLevel: item.type === WasteType.Tailings || item.type === WasteType.RedMud ? '中' : '低',
  dataSource: '现场监测',
  location: item.name.includes('德兴') ? '江西' : item.name.includes('市政') ? '江苏' : item.name.includes('小麦') ? '山东' : item.name.includes('钢铁厂') ? '河北' : '河南'
}));

// 环境监测数据类型定义
export interface DashboardItem {
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
}

export interface VideoCamera {
  id: number;
  name: string;
  location: string;
  status: 'online' | 'offline';
  time: string;
}

export interface AlertItem {
  id: number;
  time: string;
  location: string;
  device: string;
  level: 'normal' | 'info' | 'warning' | 'danger';
  value: string;
  threshold: string;
  status: '待处理' | '已确认' | '已处理' | '已关闭';
}

export interface TrendDataItem {
  time: string;
  pH: number;
  电导率: number;
  溶解氧: number;
  温度: number;
}

export interface DeviceStatus {
  id: number;
  name: string;
  type: string;
  status: 'online' | 'warning' | 'offline';
  battery: number;
  signal: number;
  lastComm: string;
}

export interface RiskSource {
  name: string;
  value: number;
}

// 生成随机数据的辅助函数
const getRandomValue = (min: number, max: number, decimals: number = 1): number => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

// 环境监测模拟数据
export const getMockDashboardData = (): DashboardItem[] => [
  { name: 'pH值', value: getRandomValue(6.8, 7.5, 1), min: 6.5, max: 8.5, unit: 'pH', status: 'normal' },
  { name: '电导率', value: getRandomValue(200, 300, 0), min: 0, max: 500, unit: 'μS/cm', status: 'normal' },
  { name: '溶解氧', value: getRandomValue(6.0, 7.5, 1), min: 5, max: 10, unit: 'mg/L', status: 'normal' },
  { name: '温度', value: getRandomValue(20, 25, 1), min: 15, max: 30, unit: '°C', status: 'normal' },
  { name: '镉 (Cd)', value: getRandomValue(0.6, 0.9, 1), min: 0, max: 1, unit: 'mg/kg', status: 'warning' },
  { name: '铅 (Pb)', value: getRandomValue(30, 40, 0), min: 0, max: 50, unit: 'mg/kg', status: 'normal' },
  { name: '植被指数', value: getRandomValue(0.7, 0.85, 2), min: 0, max: 1, unit: '', status: 'normal' },
  { name: '氧化还原电位', value: getRandomValue(300, 350, 0), min: 200, max: 400, unit: 'mV', status: 'normal' }
];

export const getMockVideoCameras = (): VideoCamera[] => [
  { id: 1, name: '监测点1', location: '东南边坡', status: 'online', time: new Date().toLocaleTimeString('zh-CN', { hour12: false }) },
  { id: 2, name: '监测点2', location: '西北入口', status: 'online', time: new Date().toLocaleTimeString('zh-CN', { hour12: false }) },
  { id: 3, name: '监测点3', location: '中央区域', status: 'online', time: new Date().toLocaleTimeString('zh-CN', { hour12: false }) },
  { id: 4, name: '监测点4', location: '出水口水', status: 'online', time: new Date().toLocaleTimeString('zh-CN', { hour12: false }) }
];

export const getMockAlertsData = (): AlertItem[] => [
  { id: 1, time: '14:30:22', location: '监测点1', device: '镉传感器', level: 'warning', value: '0.8 mg/kg', threshold: '1.0 mg/kg', status: '待处理' },
  { id: 2, time: '14:28:15', location: '监测点3', device: 'pH传感器', level: 'info', value: '7.2 pH', threshold: '6.5-8.5 pH', status: '已确认' },
  { id: 3, time: '14:25:40', location: '监测点2', device: '温度传感器', level: 'normal', value: '22.5 °C', threshold: '15-30 °C', status: '正常' },
  { id: 4, time: '14:20:18', location: '监测点4', device: '溶解氧传感器', level: 'info', value: '6.8 mg/L', threshold: '5-10 mg/L', status: '已确认' },
  { id: 5, time: '14:15:33', location: '监测点1', device: '电导率传感器', level: 'normal', value: '235 μS/cm', threshold: '0-500 μS/cm', status: '正常' }
];

export const getMockTrendData = (): TrendDataItem[] => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    pH: getRandomValue(6.8, 7.5, 1),
    电导率: getRandomValue(200, 300, 0),
    溶解氧: getRandomValue(6.0, 7.5, 1),
    温度: getRandomValue(20, 25, 1)
  }));
};

export const getMockDeviceStatusData = (): DeviceStatus[] => [
  { id: 1, name: '传感器组1', type: '土壤监测', status: 'online', battery: 95, signal: 4, lastComm: '14:32:15' },
  { id: 2, name: '传感器组2', type: '水质监测', status: 'online', battery: 88, signal: 4, lastComm: '14:32:10' },
  { id: 3, name: '传感器组3', type: '气象监测', status: 'online', battery: 76, signal: 3, lastComm: '14:32:05' },
  { id: 4, name: '传感器组4', type: '植被监测', status: 'warning', battery: 45, signal: 2, lastComm: '14:31:55' },
  { id: 5, name: '摄像头1', type: '视频监控', status: 'online', battery: 100, signal: 5, lastComm: '14:32:15' },
  { id: 6, name: '摄像头2', type: '视频监控', status: 'online', battery: 100, signal: 5, lastComm: '14:32:15' },
  { id: 7, name: '摄像头3', type: '视频监控', status: 'online', battery: 100, signal: 4, lastComm: '14:32:15' },
  { id: 8, name: '摄像头4', type: '视频监控', status: 'offline', battery: 0, signal: 0, lastComm: '14:25:30' }
];

export const getMockRiskSources = (): RiskSource[] => [
  { name: '镉 (Cd)', value: 35 },
  { name: '铅 (Pb)', value: 25 },
  { name: 'pH值波动', value: 20 },
  { name: '溶解氧', value: 15 },
  { name: '其他', value: 5 }
];

// 模拟API服务
export const api = {
  // 获取固废数据列表
  async getWasteData(): Promise<EnhancedWasteProperty[]> {
    await delay(500); // 模拟网络延迟
    return ENHANCED_DATA;
  },

  // 获取单个固废数据详情
  async getWasteDataById(id: string): Promise<EnhancedWasteProperty | null> {
    await delay(300);
    return ENHANCED_DATA.find(item => item.id === id) || null;
  },

  // 创建新的固废数据
  async createWasteData(data: Omit<EnhancedWasteProperty, 'id'>): Promise<EnhancedWasteProperty> {
    await delay(400);
    const newItem: EnhancedWasteProperty = {
      ...data,
      id: `new-${Date.now()}`
    };
    return newItem;
  },

  // 更新固废数据
  async updateWasteData(id: string, data: Partial<EnhancedWasteProperty>): Promise<EnhancedWasteProperty> {
    await delay(300);
    const existingItem = ENHANCED_DATA.find(item => item.id === id);
    if (!existingItem) {
      throw new Error('数据不存在');
    }
    return {
      ...existingItem,
      ...data
    };
  },

  // 删除固废数据
  async deleteWasteData(id: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  // 环境监测相关API
  async getDashboardData(): Promise<DashboardItem[]> {
    await delay(300);
    return getMockDashboardData();
  },

  async getVideoCameras(): Promise<VideoCamera[]> {
    await delay(200);
    return getMockVideoCameras();
  },

  async getAlertsData(): Promise<AlertItem[]> {
    await delay(400);
    return getMockAlertsData();
  },

  async getTrendData(days: number = 1): Promise<TrendDataItem[]> {
    await delay(500);
    return getMockTrendData();
  },

  async getDeviceStatus(): Promise<DeviceStatus[]> {
    await delay(300);
    return getMockDeviceStatusData();
  },

  async getRiskSources(): Promise<RiskSource[]> {
    await delay(200);
    return getMockRiskSources();
  },

  async updateAlertStatus(id: number, status: AlertItem['status']): Promise<AlertItem> {
    await delay(200);
    const alerts = getMockAlertsData();
    const alert = alerts.find(a => a.id === id) || alerts[0];
    return {
      ...alert,
      status
    };
  },

  async refreshData(): Promise<{
    dashboard: DashboardItem[];
    trends: TrendDataItem[];
    alerts: AlertItem[];
  }> {
    await delay(500);
    return {
      dashboard: getMockDashboardData(),
      trends: getMockTrendData(),
      alerts: getMockAlertsData()
    };
  }
};

