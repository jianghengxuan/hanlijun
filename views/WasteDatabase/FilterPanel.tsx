import React, { useState } from 'react';
import { WasteType } from '../../types';

// 定义学科分类
export type Discipline = '土木工程' | '资源与环境' | '土壤学' | '化学工程' | '生态学';

// 定义毒性等级
export type ToxicityLevel = '低' | '中' | '高' | '极高';

// 定义数据来源
export type DataSource = '实验室' | '现场监测' | '文献' | '其他';

// 定义生物特性指数类型
export interface BiologicalProperties {
  aceIndex: number; // ACE指数，用于估计物种丰富度
  chaoIndex: number; // Chao指数，用于估计物种丰富度
  shannonIndex: number; // Shannon-Wiener指数，用于评估多样性
  simpsonIndex: number; // Simpson指数，用于评估多样性
  microbialDiversity: number; // 微生物多样性指数
  functionalGroups: number; // 功能群数量
}

// 扩展WasteProperty接口
export interface EnhancedWasteProperty {
  id: string;
  name: string;
  type: WasteType;
  ph: number;
  organicMatter: number;
  heavyMetals: {
    cd: number;
    hg: number;
    as: number;
    pb: number;
    cr: number;
  };
  moisture: number;
  source: string;
  timestamp: string;
  discipline: Discipline;
  toxicityLevel: ToxicityLevel;
  dataSource: DataSource;
  location?: string;
  biologicalProperties?: BiologicalProperties; // 生物特性
}

// 定义筛选条件类型
export interface FilterCriteria {
  disciplines: Discipline[];
  wasteTypes: WasteType[];
  phRange: [number, number];
  organicMatterRange: [number, number];
  heavyMetalRange: {
    cd: [number, number];
    hg: [number, number];
    as: [number, number];
    pb: [number, number];
    cr: [number, number];
  };
  biologicalPropertiesRange: {
    aceIndex: [number, number];
    chaoIndex: [number, number];
    shannonIndex: [number, number];
    simpsonIndex: [number, number];
    microbialDiversity: [number, number];
    functionalGroups: [number, number];
  };
  toxicityLevels: ToxicityLevel[];
  startDate: string;
  endDate: string;
  dataSources: DataSource[];
}

// 手风琴面板组件
const AccordionPanel = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-3">
      <button 
        className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-inner">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterPanelProps {
  filters: FilterCriteria;
  onFilterChange: (filters: FilterCriteria) => void;
  totalResults: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  totalResults
}) => {
  return (
    <div className="space-y-4">
      {/* 实时结果统计 */}
      <div className="text-xs text-slate-500 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
        <span className="font-semibold text-emerald-700">{totalResults}</span> 条数据符合当前筛选条件
      </div>
      
      {/* 手风琴式筛选组 */}
      
      {/* 第一组: 固废基本属性 */}
      <AccordionPanel title="固废基本属性" defaultOpen={true}>
        <div className="space-y-4">
          {/* 固废类型 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">固废类型</h5>
            <div className="space-y-2">
              {Object.values(WasteType).map(type => (
                <label key={type} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                    checked={filters.wasteTypes.includes(type)}
                    onChange={(e) => {
                      onFilterChange({
                        ...filters,
                        wasteTypes: e.target.checked 
                          ? [...filters.wasteTypes, type]
                          : filters.wasteTypes.filter(t => t !== type)
                      });
                    }}
                  />
                  <span>{type}</span>
                  <span className="ml-auto text-xs text-slate-400">({Math.floor(Math.random() * 1000)})</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 学科分类 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">学科分类</h5>
            <div className="space-y-2">
              {(['土木工程', '资源与环境', '土壤学', '化学工程', '生态学'] as Discipline[]).map(discipline => (
                <label key={discipline} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                    checked={filters.disciplines.includes(discipline)}
                    onChange={(e) => {
                      onFilterChange({
                        ...filters,
                        disciplines: e.target.checked 
                          ? [...filters.disciplines, discipline]
                          : filters.disciplines.filter(d => d !== discipline)
                      });
                    }}
                  />
                  <span>{discipline}</span>
                  <span className="ml-auto text-xs text-slate-400">({Math.floor(Math.random() * 800)})</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </AccordionPanel>
      
      {/* 第二组: 化学特性范围 */}
      <AccordionPanel title="化学特性范围" defaultOpen={true}>
        <div className="space-y-4">
          {/* pH值范围 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">pH值范围</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{filters.phRange[0]} - {filters.phRange[1]}</span>
                <span className="text-xs text-slate-400">({Math.floor(Math.random() * 900)})</span>
              </div>
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max="14" 
                  step="0.1"
                  value={filters.phRange[0]}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) => {
                    onFilterChange({
                      ...filters,
                      phRange: [Number(e.target.value), filters.phRange[1]]
                    });
                  }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="14" 
                  step="0.1"
                  value={filters.phRange[1]}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) => {
                    onFilterChange({
                      ...filters,
                      phRange: [filters.phRange[0], Number(e.target.value)]
                    });
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* 有机质范围 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">有机质含量 (%)</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{filters.organicMatterRange[0]} - {filters.organicMatterRange[1]}%</span>
                <span className="text-xs text-slate-400">({Math.floor(Math.random() * 700)})</span>
              </div>
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  value={filters.organicMatterRange[0]}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) => {
                    onFilterChange({
                      ...filters,
                      organicMatterRange: [Number(e.target.value), filters.organicMatterRange[1]]
                    });
                  }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  value={filters.organicMatterRange[1]}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) => {
                    onFilterChange({
                      ...filters,
                      organicMatterRange: [filters.organicMatterRange[0], Number(e.target.value)]
                    });
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* 重金属含量 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">重金属含量 (mg/kg)</h5>
            <div className="space-y-3">
              {[
                { key: 'cd' as const, label: '镉 (Cd)', max: 100 },
                { key: 'hg' as const, label: '汞 (Hg)', max: 10 },
                { key: 'as' as const, label: '砷 (As)', max: 100 },
                { key: 'pb' as const, label: '铅 (Pb)', max: 1000 },
                { key: 'cr' as const, label: '铬 (Cr)', max: 1000 }
              ].map(({ key, label, max }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-600">{label}</label>
                    <span className="text-xs text-slate-400">({Math.floor(Math.random() * 600)})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      min="0" 
                      max={max}
                      step="0.1"
                      className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      value={filters.heavyMetalRange[key][0]}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        onFilterChange({
                          ...filters,
                          heavyMetalRange: {
                            ...filters.heavyMetalRange,
                            [key]: [value, filters.heavyMetalRange[key][1]]
                          }
                        });
                      }}
                    />
                    <span className="text-xs text-slate-400">-</span>
                    <input 
                      type="number" 
                      min="0" 
                      max={max}
                      step="0.1"
                      className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      value={filters.heavyMetalRange[key][1]}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        onFilterChange({
                          ...filters,
                          heavyMetalRange: {
                            ...filters.heavyMetalRange,
                            [key]: [filters.heavyMetalRange[key][0], Math.min(value, max)]
                          }
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionPanel>
      
      {/* 第三组: 处理与应用状态 */}
      <AccordionPanel title="处理与应用状态" defaultOpen={true}>
        <div className="space-y-4">
          {/* 处理技术 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">处理技术</h5>
            <div className="space-y-2">
              {['堆肥', '焚烧', '填埋', '固化稳定化', '热解'].map(tech => (
                <label key={tech} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                    onChange={() => {/* 处理技术筛选逻辑 */}}
                  />
                  <span>{tech}</span>
                  <span className="ml-auto text-xs text-slate-400">({Math.floor(Math.random() * 500)})</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 应用场景 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">应用场景</h5>
            <div className="space-y-2">
              {['土壤改良', '道路建设', '建筑材料', '能源回收', '生态修复'].map(scene => (
                <label key={scene} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                    onChange={() => {/* 应用场景筛选逻辑 */}}
                  />
                  <span>{scene}</span>
                  <span className="ml-auto text-xs text-slate-400">({Math.floor(Math.random() * 400)})</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </AccordionPanel>
      
      {/* 第四组: 数据质量与来源 */}
      <AccordionPanel title="数据质量与来源" defaultOpen={true}>
        <div className="space-y-4">
          {/* 数据来源 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">来源机构类型</h5>
            <div className="space-y-2">
              {(['实验室', '现场监测', '文献', '其他'] as DataSource[]).map(source => (
                <label key={source} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                    checked={filters.dataSources.includes(source)}
                    onChange={(e) => {
                      onFilterChange({
                        ...filters,
                        dataSources: e.target.checked 
                          ? [...filters.dataSources, source]
                          : filters.dataSources.filter(s => s !== source)
                      });
                    }}
                  />
                  <span>{source}</span>
                  <span className="ml-auto text-xs text-slate-400">({Math.floor(Math.random() * 700)})</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 数据验证次数 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">数据验证次数</h5>
            <div className="flex items-center space-x-2">
              <input 
                type="range" 
                min="0" 
                max="10"
                step="1"
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                onChange={() => {/* 验证次数筛选逻辑 */}}
              />
              <span className="text-xs text-slate-600">0-10次</span>
            </div>
          </div>
        </div>
      </AccordionPanel>
      
      {/* 第六组: 生物特性筛选 */}
      <AccordionPanel title="生物特性筛选" defaultOpen={false}>
        <div className="space-y-4">
          {/* 生物多样性指数 */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 mb-2">生物多样性指数</h5>
            <div className="space-y-3">
              {[
                { key: 'aceIndex' as const, label: 'ACE指数', max: 500 },
                { key: 'chaoIndex' as const, label: 'Chao指数', max: 500 },
                { key: 'shannonIndex' as const, label: 'Shannon指数', max: 10 },
                { key: 'simpsonIndex' as const, label: 'Simpson指数', max: 1 },
                { key: 'microbialDiversity' as const, label: '微生物多样性', max: 100 },
                { key: 'functionalGroups' as const, label: '功能群数量', max: 20 }
              ].map(({ key, label, max }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-600">{label}</label>
                    <span className="text-xs text-slate-400">({Math.floor(Math.random() * 500)})</span>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min="0" 
                      max={max}
                      step="0.1"
                      value={filters.biologicalPropertiesRange[key][0]}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      onChange={(e) => {
                        onFilterChange({
                          ...filters,
                          biologicalPropertiesRange: {
                            ...filters.biologicalPropertiesRange,
                            [key]: [Number(e.target.value), filters.biologicalPropertiesRange[key][1]]
                          }
                        });
                      }}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max={max}
                      step="0.1"
                      value={filters.biologicalPropertiesRange[key][1]}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      onChange={(e) => {
                        onFilterChange({
                          ...filters,
                          biologicalPropertiesRange: {
                            ...filters.biologicalPropertiesRange,
                            [key]: [filters.biologicalPropertiesRange[key][0], Number(e.target.value)]
                          }
                        });
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{filters.biologicalPropertiesRange[key][0]} (最小值)</span>
                      <span>{filters.biologicalPropertiesRange[key][1]} (最大值)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionPanel>
      
      {/* 第五组: 地理空间筛选 */}
      <AccordionPanel title="地理空间筛选" defaultOpen={false}>
        <div>
          <div className="text-xs text-slate-600 mb-3">
            选择数据采集地理位置
          </div>
          {/* 简化的地图搜索占位符 */}
          <div className="w-full h-32 bg-slate-100 border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1 text-slate-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="text-xs text-slate-500">地图搜索功能</span>
            </div>
          </div>
          <div className="mt-3">
            <input 
              type="text" 
              placeholder="输入地名搜索..." 
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              onChange={() => {/* 地理搜索逻辑 */}}
            />
          </div>
        </div>
      </AccordionPanel>
      
      {/* 第六组: 智能排序选项 */}
      <AccordionPanel title="智能排序选项" defaultOpen={false}>
        <div className="space-y-3">
          {[
            { value: 'relevance', label: '相关性', count: Math.floor(Math.random() * 1000) },
            { value: 'time', label: '时间', count: Math.floor(Math.random() * 1000) },
            { value: 'popularity', label: '热度', count: Math.floor(Math.random() * 1000) },
            { value: 'credibility', label: '可信度', count: Math.floor(Math.random() * 1000) },
            { value: 'cost', label: '成本', count: Math.floor(Math.random() * 1000) }
          ].map((sortOption) => (
            <label key={sortOption.value} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
              <input 
                type="radio" 
                name="sort" 
                value={sortOption.value}
                className="text-emerald-600 focus:ring-emerald-500"
                onChange={() => {/* 排序逻辑 */}}
              />
              <span>{sortOption.label}</span>
              <span className="ml-auto text-xs text-slate-400">({sortOption.count})</span>
            </label>
          ))}
        </div>
      </AccordionPanel>
      
      {/* 筛选条件之间的逻辑关系设置 */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <h5 className="text-xs font-semibold text-slate-700 mb-2">筛选逻辑关系</h5>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-600">条件关系:</span>
          <select 
            className="text-xs px-2 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            onChange={() => {/* 逻辑关系切换 */}}
          >
            <option value="and">AND (所有条件同时满足)</option>
            <option value="or">OR (满足任一条件)</option>
          </select>
        </div>
      </div>
    </div>
  );
};