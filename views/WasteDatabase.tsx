import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus, Import, Download, Trash2, X, Filter, BrainCircuit, Search,
  List, Grid, MapPin, Star, Heart, GitCompare, ChevronDown,
  Database, Calendar, BookOpen, Zap, Wrench, Users, Eye,
  RefreshCw, MessageSquare, AlertTriangle, BarChart3, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WasteProperty, WasteType } from '../types';
import { FilterPanel, EnhancedWasteProperty, FilterCriteria } from './WasteDatabase/FilterPanel';
import { DataTable } from './WasteDatabase/DataTable';
import { VisualizationPanel } from './WasteDatabase/VisualizationPanel';
import { api } from '../services/api';

export default function WasteDatabase() {
  const navigate = useNavigate();
  // 核心状态管理
  const [data, setData] = useState<EnhancedWasteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState<{ key: keyof EnhancedWasteProperty | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [searchProgress, setSearchProgress] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  // 搜索功能相关状态
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'pH大于7的工业污泥',
    '重金属含量低的尾矿',
    '近三年的固废处理案例'
  ]);
  const [hotSearches, setHotSearches] = useState<string[]>([
    '工业污泥',
    '尾矿处理',
    '秸秆资源化',
    '重金属污染',
    '土壤改良'
  ]);
  // 快捷操作相关状态
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  // 排序相关状态
  const [sortBy, setSortBy] = useState('relevance');
  const [sortDirection, setSortDirection] = useState('descending');
  
  // 筛选条件状态
  const [filters, setFilters] = useState<FilterCriteria>({
    disciplines: [],
    wasteTypes: [],
    phRange: [0, 14],
    organicMatterRange: [0, 100],
    heavyMetalRange: { cd: [0, 100], hg: [0, 10], as: [0, 100], pb: [0, 1000], cr: [0, 1000] },
    biologicalPropertiesRange: {
      aceIndex: [0, 500],
      chaoIndex: [0, 500],
      shannonIndex: [0, 10],
      simpsonIndex: [0, 1],
      microbialDiversity: [0, 100],
      functionalGroups: [0, 20]
    },
    toxicityLevels: [],
    startDate: '',
    endDate: '',
    dataSources: []
  });

  // 从API加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await api.getWasteData();
        setData(result);
      } catch (err) {
        setError('加载数据失败，请重试');
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 计算过滤后的数据
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 关键词搜索
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 学科筛选
      const matchesDiscipline = filters.disciplines.length === 0 || filters.disciplines.includes(item.discipline);
      
      // 固废类型筛选
      const matchesWasteType = filters.wasteTypes.length === 0 || filters.wasteTypes.includes(item.type);
      
      // pH 值范围筛选
      const matchesPh = item.ph >= filters.phRange[0] && item.ph <= filters.phRange[1];
      
      // 有机质范围筛选
      const matchesOrganic = item.organicMatter >= filters.organicMatterRange[0] && item.organicMatter <= filters.organicMatterRange[1];
      
      // 重金属范围筛选
      const matchesHeavyMetals = 
        item.heavyMetals.cd <= filters.heavyMetalRange.cd[1] &&
        item.heavyMetals.hg <= filters.heavyMetalRange.hg[1] &&
        item.heavyMetals.as <= filters.heavyMetalRange.as[1] &&
        item.heavyMetals.pb <= filters.heavyMetalRange.pb[1] &&
        item.heavyMetals.cr <= filters.heavyMetalRange.cr[1];
      
      // 毒性等级筛选
      const matchesToxicity = filters.toxicityLevels.length === 0 || filters.toxicityLevels.includes(item.toxicityLevel);
      
      // 数据来源筛选
      const matchesDataSource = filters.dataSources.length === 0 || filters.dataSources.includes(item.dataSource);
      
      // 生物特性筛选
      const matchesBiological = item.biologicalProperties ? (
        item.biologicalProperties.aceIndex >= filters.biologicalPropertiesRange.aceIndex[0] &&
        item.biologicalProperties.aceIndex <= filters.biologicalPropertiesRange.aceIndex[1] &&
        item.biologicalProperties.chaoIndex >= filters.biologicalPropertiesRange.chaoIndex[0] &&
        item.biologicalProperties.chaoIndex <= filters.biologicalPropertiesRange.chaoIndex[1] &&
        item.biologicalProperties.shannonIndex >= filters.biologicalPropertiesRange.shannonIndex[0] &&
        item.biologicalProperties.shannonIndex <= filters.biologicalPropertiesRange.shannonIndex[1] &&
        item.biologicalProperties.simpsonIndex >= filters.biologicalPropertiesRange.simpsonIndex[0] &&
        item.biologicalProperties.simpsonIndex <= filters.biologicalPropertiesRange.simpsonIndex[1] &&
        item.biologicalProperties.microbialDiversity >= filters.biologicalPropertiesRange.microbialDiversity[0] &&
        item.biologicalProperties.microbialDiversity <= filters.biologicalPropertiesRange.microbialDiversity[1] &&
        item.biologicalProperties.functionalGroups >= filters.biologicalPropertiesRange.functionalGroups[0] &&
        item.biologicalProperties.functionalGroups <= filters.biologicalPropertiesRange.functionalGroups[1]
      ) : true; // 如果没有生物特性数据，默认通过筛选
      
      // 时间筛选（简化实现）
      const matchesDate = true;
      
      return matchesSearch && matchesDiscipline && matchesWasteType && matchesPh && 
             matchesOrganic && matchesHeavyMetals && matchesToxicity && matchesDataSource && 
             matchesBiological && matchesDate;
    });
  }, [data, searchTerm, filters]);
  
  // 排序处理
  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);
  
  // 计算总页数
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // 处理批量选择
  const handleSelectAll = () => {
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(item => item.id));
    }
  };
  
  // 处理单个选择
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };
  
  // 处理排序
  const handleSort = (key: keyof EnhancedWasteProperty) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // 处理搜索输入变化，生成智能提示
  const onSearchChange = (term: string) => {
    setSearchTerm(term);
    
    if (term.length > 1) {
      // 模拟智能提示生成
      const suggestions = [
        ...searchHistory.filter(item => item.includes(term)),
        ...hotSearches.filter(item => item.includes(term)),
        ...['工业污泥', '尾矿', '秸秆', '重金属', '土壤改良'].filter(item => item.includes(term))
      ];
      setSearchSuggestions([...new Set(suggestions)].slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // 处理搜索执行
  const handleSearch = (term?: string) => {
    const searchTermToUse = term || searchTerm;
    if (!searchTermToUse.trim()) return;
    
    // 开始搜索动画
    setIsSearching(true);
    setSearchProgress(0);
    
    // 模拟搜索过程
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSearching(false);
          // 添加到搜索历史
          if (!searchHistory.includes(searchTermToUse)) {
            setSearchHistory(prev => [searchTermToUse, ...prev.slice(0, 4)]);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    
    setShowSuggestions(false);
  };
  
  // 处理AI智能检索
  const handleAISearch = () => {
    if (!searchTerm.trim()) return;
    
    // 模拟AI处理
    setIsSearching(true);
    setSearchProgress(0);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsSearching(false);
          alert(`AI智能检索已处理查询: "${searchTerm}"\n\nAI理解: 正在搜索与您的查询相关的固废数据、文献和案例...`);
          return 100;
        }
        return prev + 8;
      });
    }, 150);
    
    setShowSuggestions(false);
  };
  
  // 处理选择搜索建议
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };
  
  // 处理重置筛选条件
  const handleResetFilters = () => {
    setFilters({
      disciplines: [],
      wasteTypes: [],
      phRange: [0, 14],
      organicMatterRange: [0, 100],
      heavyMetalRange: { cd: [0, 100], hg: [0, 10], as: [0, 100], pb: [0, 1000], cr: [0, 1000] },
      biologicalPropertiesRange: {
        aceIndex: [0, 500],
        chaoIndex: [0, 500],
        shannonIndex: [0, 10],
        simpsonIndex: [0, 1],
        microbialDiversity: [0, 100],
        functionalGroups: [0, 20]
      },
      toxicityLevels: [],
      startDate: '',
      endDate: '',
      dataSources: []
    });
    setSearchTerm('');
    setShowSuggestions(false);
  };
  
  // 处理收藏功能
  const handleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  // 处理对比功能
  const handleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 3) {
          alert('最多只能同时对比3条数据');
          return prev;
        }
        return [...prev, id];
      }
    });
  };
  
  // 处理下载功能
  const handleDownload = (id: string) => {
    const item = data.find(item => item.id === id);
    if (item) {
      alert(`正在下载数据: ${item.name}`);
      // 模拟下载过程
      setTimeout(() => {
        alert(`数据 ${item.name} 下载完成!`);
      }, 1500);
    }
  };
  
  // 处理查看详情
  const handleViewDetail = (item: EnhancedWasteProperty) => {
    navigate(`/database/${item.id}`);
  };
  
  // 处理排序变化
  const handleSortChange = (sortKey: string) => {
    if (sortBy === sortKey) {
      setSortDirection(prev => prev === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortBy(sortKey);
      setSortDirection('descending');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* 超级搜索栏（顶部通栏） */}
      <div className="bg-gradient-to-r from-white to-slate-50 py-6 px-4 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">智能搜索引擎</h1>
          <div className="flex flex-col gap-4">
            {/* 搜索输入框和核心按钮 */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={20} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="搜索固废数据、文献、案例、标准..." 
                  className="w-full py-3 pl-12 pr-12 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden text-base"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors p-1 rounded-lg"
                    onClick={() => onSearchChange('')}
                    title="清除搜索"
                  >
                    <X size={18} />
                  </button>
                )}
                
                {/* 搜索智能提示下拉菜单 - 移到搜索框直接父容器内 */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="p-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <Search size={16} className="inline mr-2 text-slate-400" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 搜索按钮 */}
              <button 
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl transition-all hover:bg-emerald-700 shadow-sm"
                onClick={() => handleSearch()}
                title="搜索"
              >
                <Search size={20} className="inline mr-2" />
                搜索
              </button>
              
              {/* 高级搜索切换按钮 */}
              <button 
                className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                title="高级搜索"
              >
                <Filter size={20} className="inline mr-1" />
                高级
              </button>
              
              {/* AI智能检索按钮 */}
              <button 
                className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl shadow-sm hover:bg-blue-100 transition-colors"
                onClick={() => handleAISearch()}
                title="AI智能检索"
              >
                <BrainCircuit size={20} className="inline mr-1" />
                AI
              </button>
            </div>
            
            {/* 快速过滤标签 */}
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                只看已验证数据
              </button>
              <button className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                只看免费数据
              </button>
              <button className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                只看近三年
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要内容区 - 三栏布局 */}
      <div className="flex">
        {/* 左侧高级筛选面板（固定宽度300px，可折叠） */}
        {isFilterSidebarOpen && (
          <aside className="w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto h-[calc(100vh-150px)]">
            <div className="sticky top-0 bg-white pb-4 border-b border-slate-100 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-slate-800">高级筛选</h3>
                <button 
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                  onClick={() => setIsFilterSidebarOpen(false)}
                  title="关闭筛选面板"
                >
                  <X size={18} />
                </button>
              </div>
              <button 
                className="w-full px-3 py-2 bg-slate-50 text-slate-600 text-sm rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
                onClick={handleResetFilters}
              >
                <RefreshCw size={14} className="mr-1" />
                重置筛选条件
              </button>
            </div>
            
            {/* 筛选内容将由FilterPanel组件提供 */}
            <FilterPanel 
              filters={filters}
              onFilterChange={setFilters}
              totalResults={filteredData.length}
            />
          </aside>
        )}
        
        {/* 中央搜索结果区（自适应宽度） */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-150px)] w-full">
          {/* 搜索结果摘要栏 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-slate-600">
                找到 <span className="font-semibold text-emerald-600">{filteredData.length}</span> 条结果，用时 <span className="font-semibold text-emerald-600">0.23</span> 秒
              </div>
              
              <div className="flex items-center space-x-3">
                {/* 排序选择器 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">排序:</span>
                  <select 
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="relevance">按相关性</option>
                    <option value="time">按时间</option>
                    <option value="popularity">按热度</option>
                    <option value="credibility">按可信度</option>
                    <option value="cost">按成本</option>
                  </select>
                  <button 
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    onClick={() => setSortDirection(prev => prev === 'ascending' ? 'descending' : 'ascending')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
                
                {/* 视图切换按钮 */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 bg-white border border-slate-200 rounded-l-lg hover:bg-slate-50 transition-colors">
                    <List size={18} className="text-slate-600" />
                  </button>
                  <button className="p-2 bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 transition-colors">
                    <Grid size={18} />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-r-lg hover:bg-slate-50 transition-colors">
                    <MapPin size={18} className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 搜索进度可视化 */}
          {isSearching && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">搜索进度</span>
                  <span className="text-sm font-semibold text-emerald-600">{searchProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${searchProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>数据检索</span>
                  <span>相关性计算</span>
                  <span>排序呈现</span>
                </div>
              </div>
            </div>
          )}
          
          {/* 数据加载状态 */}
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-slate-600">正在加载数据...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-slate-600 mb-4">{error}</p>
                <button 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
                  onClick={() => {
                    const loadData = async () => {
                      try {
                        setLoading(true);
                        setError(null);
                        const result = await api.getWasteData();
                        setData(result);
                      } catch (err) {
                        setError('加载数据失败，请重试');
                        console.error('Failed to load data:', err);
                      } finally {
                        setLoading(false);
                      }
                    };
                    loadData();
                  }}
                >
                  重试
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 数据结果卡片列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedData.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                    onClick={() => handleViewDetail(item)}
                  >
                    {/* 卡片头部 */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                      {/* 数据质量徽章 */}
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-slate-200"} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-slate-500">可信度 85%</span>
                      </div>
                      
                      {/* 快捷操作区 */}
                      <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                        <button 
                          className={`p-1.5 rounded-lg transition-colors ${favorites.includes(item.id) ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(item.id);
                          }}
                          title={favorites.includes(item.id) ? '取消收藏' : '收藏'}
                        >
                          <Heart size={16} />
                        </button>
                        <button 
                          className={`p-1.5 rounded-lg transition-colors ${compareList.includes(item.id) ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompare(item.id);
                          }}
                          title={compareList.includes(item.id) ? '取消对比' : '添加到对比'}
                        >
                          <GitCompare size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.id);
                          }}
                          title="下载数据"
                        >
                          <Download size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* 卡片内容 */}
                    <div className="p-4">
                      {/* 标题行 */}
                      <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-emerald-600 transition-colors" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(item);
                      }}>
                        {item.name}
                      </h3>
                      
                      {/* 核心属性摘要 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">pH: {item.ph}</span>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">有机质: {item.organicMatter}%</span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">重金属: 低</span>
                        <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs rounded-full">{item.type}</span>
                      </div>
                      
                      {/* 简短描述 */}
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        这是一条关于{item.name}的详细描述，包含其主要特性和应用场景。数据来源于{item.dataSource}，采集于{item.timestamp}。
                      </p>
                      
                      {/* 数据来源行 */}
                      <div className="flex items-center text-xs text-slate-500 mb-3">
                        <Database size={12} className="mr-1" />
                        <span>{item.dataSource}</span>
                        <span className="mx-1">•</span>
                        <Calendar size={12} className="mr-1" />
                        <span>{item.timestamp}</span>
                      </div>
                      
                      {/* 相似度指示 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-slate-600">匹配度:</span>
                          <div className="ml-2 w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                          </div>
                          <span className="ml-1 text-xs font-semibold text-emerald-600">92%</span>
                        </div>
                        
                        {/* 使用情况 */}
                        <div className="text-xs text-slate-500 flex items-center">
                          <BookOpen size={12} className="mr-1" />
                          <span>15次引用</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 数据对比面板 */}
              {compareList.length > 0 && (
                <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-50 w-80">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-slate-800">对比列表 ({compareList.length}/3)</h4>
                    <button 
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg p-1 transition-colors"
                      onClick={() => setCompareList([])}
                      title="清空对比列表"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {compareList.map((id, index) => {
                      const item = data.find(item => item.id === id);
                      return item ? (
                        <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                          <div className="text-xs text-slate-700 truncate">{item.name}</div>
                          <button 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-1 transition-colors"
                            onClick={() => handleCompare(id)}
                            title="移除" 
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <button 
                    className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      alert(`正在对比 ${compareList.length} 条数据...\n\n对比功能正在开发中，敬请期待！`);
                    }}
                  >
                    开始对比
                  </button>
                </div>
              )}
              
              {/* 分页器 */}
              {totalPages > 1 && (
                <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      显示第 {((currentPage - 1) * itemsPerPage) + 1} 到 {Math.min(currentPage * itemsPerPage, sortedData.length)} 条，共 {sortedData.length} 条记录
                    </div>
                    <div className="flex items-center space-x-2">
                      <select 
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      >
                        <option value={10}>10条/页</option>
                        <option value={20}>20条/页</option>
                        <option value={50}>50条/页</option>
                        <option value={100}>100条/页</option>
                      </select>
                      <div className="flex items-center space-x-1">
                        <button 
                          className="px-3 py-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          上一页
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum = i + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 3 + i;
                            if (pageNum > totalPages) pageNum = totalPages;
                          }
                          return pageNum;
                        }).map(page => (
                          <button 
                            key={page}
                            className={`px-3 py-1 text-sm rounded-lg shadow-sm transition-all ${currentPage === page ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                        <button 
                          className="px-3 py-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        

      </div>
    </div>
  );
}
