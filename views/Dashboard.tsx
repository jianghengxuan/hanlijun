
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  BarChart3, 
  BrainCircuit, 
  PieChart, 
  FlaskConical, 
  FileText, 
  BookOpen, 
  Users, 
  CheckCircle, 
  Bell, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  Clock, 
  TrendingUp, 
  ThumbsUp, 
  Star,
  Leaf
} from 'lucide-react';
import { api } from '../services/api';
import { EnhancedWasteProperty } from './WasteDatabase/FilterPanel';

// 骨架屏组件
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-100 rounded ${className}`}></div>
);

// 项目卡片组件
const ProjectCard = ({ name, date, progress, members }: any) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // 跳转到项目详情或相关评估页面
    navigate('/assessment');
  };
  
  return (
    <div 
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:translate-y-[-2px]"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-800">{name}</h4>
        <div className="relative">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-emerald-500"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress * 2 * Math.PI * 15.9155 / 100} 1000`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="absolute text-sm font-bold text-slate-800">{progress}%</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-slate-500 mb-2">启动时间: {date}</div>
      <div className="flex items-center space-x-1">
        {members.map((member: any, index: number) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs font-bold"
            style={{ marginLeft: index > 0 ? '-8px' : 0 }}
          >
            {member.charAt(0)}
          </div>
        ))}
        {members.length > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-xs font-bold text-white">
            +{members.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};

// 工具按钮组件
const ToolButton = ({ icon: Icon, label }: any) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // 根据不同工具跳转到相应页面
    switch (label) {
      case '高级数据检索':
        navigate('/database');
        break;
      case '统计分析工具':
      case '机器学习建模':
      case '可视化设计':
      case '实验设计助手':
      case '报告生成器':
        navigate('/assessment');
        break;
      default:
        navigate('/assessment');
    }
  };
  
  return (
    <button 
      className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer transform hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-2">
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </button>
  );
};

// 待办事项组件
const TodoItem = ({ text, completed }: any) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
      <button
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
          isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-500'
        }`}
        onClick={() => setIsCompleted(!isCompleted)}
      >
        {isCompleted && <CheckCircle size={12} className="text-white" />}
      </button>
      <span className={`text-sm ${
        isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'
      }`}>
        {text}
      </span>
    </div>
  );
};

// 数据集表格行组件
// 修复后的DatasetRow组件
const DatasetRow = ({ dataset }: any) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/database/${dataset.name.toLowerCase().replace(/\s+/g, '-')}`);
  };
  
  const handleRowClick = () => {
    navigate('/assessment');
  };
  
  return (
    <tr
      className="hover:bg-slate-50 transition-colors cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleRowClick}
    >
      <td className="px-4 py-3 font-medium text-slate-800">{dataset.name}</td>
      <td className="px-4 py-3 text-slate-600">1,000+</td>
      <td className="px-4 py-3 text-slate-600">
        {Object.keys(dataset.heavyMetals || {}).length + 3}
      </td>
      <td className="px-4 py-3 text-slate-500 text-sm">{dataset.timestamp}</td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${dataset.quality}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold">{dataset.quality}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <button 
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          onClick={handleView}
        >
          查看
        </button>
      </td>
      {hovered && (
        <td className="px-4 py-3">
          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
            数据预览
          </div>
        </td>
      )}
    </tr>
  );
};

// 分析节点组件
const AnalysisNode = ({ title, status }: any) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // 根据不同分析步骤跳转到相应页面
    navigate('/assessment');
  };
  
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={handleClick}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
        status === 'active' 
          ? 'bg-blue-500 text-white shadow-md hover:scale-110' 
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:scale-110'
      }`}>
        {title === '数据探索' && <Database size={20} />}
        {title === '模型实验室' && <BrainCircuit size={20} />}
        {title === '文献中心' && <BookOpen size={20} />}
        {title === '科研协作' && <Users size={20} />}
        {title === '报告生成' && <FileText size={20} />}
        {title === '结果评估' && <BarChart3 size={20} />}
      </div>
      <span className="text-xs font-medium text-slate-700 text-center">{title}</span>
    </div>
  );
};

// 文献推荐卡片
const LiteratureCard = ({ title, journal, impact, match, keywords }: any) => {
  const handleDownload = () => {
    alert(`下载文献: ${title}`);
  };
  
  const handleAddToLibrary = () => {
    alert(`添加到文献库: ${title}`);
  };
  
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm mb-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
      <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2 hover:text-blue-600">{title}</h4>
      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
        <BookOpen size={12} />
        <span>{journal}</span>
        <span>•</span>
        <Star size={12} className="text-yellow-500" />
        <span>{impact}</span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs font-medium text-green-600">匹配度: {match}%</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {keywords.map((keyword: any, index: number) => (
          <span 
            key={index} 
            className="px-2 py-0.5 bg-slate-100 rounded-full text-xs text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
            onClick={() => alert(`搜索关键词: ${keyword}`)}
          >
            {keyword}
          </span>
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <button 
          className="w-full px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all cursor-pointer"
          onClick={handleDownload}
        >
          下载全文
        </button>
        <button 
          className="w-full px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded hover:bg-slate-200 hover:border hover:border-slate-300 transition-all cursor-pointer"
          onClick={handleAddToLibrary}
        >
          加入文献库
        </button>
      </div>
    </div>
  );
};

// 相似研究卡片
const SimilarResearchCard = ({ title, method, conclusion }: any) => {
  const handleViewDetail = () => {
    alert(`查看相似研究: ${title}`);
  };
  
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm mb-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
      <h4 className="text-sm font-semibold text-slate-800 mb-1 hover:text-blue-600">{title}</h4>
      <div className="text-xs text-slate-500 mb-2">
        <span className="font-medium">方法:</span> {method}
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 mb-2">{conclusion}</p>
      <button 
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        onClick={handleViewDetail}
      >
        查看详情
      </button>
    </div>
  );
};

// 协作动态卡片
const CollaborationCard = ({ user, action, time }: any) => {
  const handleClick = () => {
    alert(`查看动态详情: ${user} ${action}`);
  };
  
  return (
    <div 
      className="flex space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:border hover:border-blue-200 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors">
        {user.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-800 hover:text-blue-600">{user}</span>
          <span className="text-sm text-slate-600">{action}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Clock size={12} className="text-slate-400" />
          <span className="text-xs text-slate-500">{time}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // 折叠面板状态
  const [expandedPanels, setExpandedPanels] = useState({
    literature: false,
    research: true,
    collaboration: true
  });
  
  // 加载状态
  const [loading, setLoading] = useState(true);
  
  // 动态数据状态
  const [accuracy, setAccuracy] = useState(80);
  const [featureImportance, setFeatureImportance] = useState([90, 85, 70, 60]);
  
  // 侧边栏状态
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showTodos, setShowTodos] = useState(false);
  
  // 路由导航
  const navigate = useNavigate();
  
  // 切换右侧边栏显示
  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  // 数据集状态
  const [datasets, setDatasets] = useState<EnhancedWasteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 从API获取数据集
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoading(true);
        const data = await api.getWasteData();
        setDatasets(data);
      } catch (error) {
        console.error('获取数据集失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDatasets();
  }, []);

  // 模拟文献数据
  const literature = [
    {
      title: '固废资源化利用的环境效益评估方法研究',
      journal: '环境科学学报',
      impact: 4.5,
      match: 92,
      keywords: ['固废资源化', '环境效益', '评估方法']
    },
    {
      title: '尾矿土壤化过程中的重金属迁移规律',
      journal: '土壤学报',
      impact: 3.8,
      match: 85,
      keywords: ['尾矿', '土壤化', '重金属迁移']
    },
    {
      title: '微生物强化秸秆分解的机制研究',
      journal: '农业工程学报',
      impact: 3.2,
      match: 78,
      keywords: ['微生物', '秸秆分解', '机制']
    }
  ];

  // 模拟相似研究数据
  const similarResearch = [
    {
      title: '城市污泥成土化利用的可行性研究',
      method: '室内模拟试验 + 野外验证',
      conclusion: '城市污泥经过适当处理后可安全用于土壤改良'
    },
    {
      title: '工业固废在矿山生态修复中的应用',
      method: '生态毒理学评价 + 田间试验',
      conclusion: '工业固废可有效改善矿山废弃地的土壤结构'
    },
    {
      title: '秸秆还田对土壤微生物群落的影响',
      method: '高通量测序 + 微生物多样性分析',
      conclusion: '长期秸秆还田可显著提高土壤微生物多样性'
    }
  ];

  // 模拟协作动态数据
  const collaboration = [
    { user: '张博士', action: '上传了新的污泥特性数据集', time: '2小时前' },
    { user: '李研究员', action: '发表了新成果: 尾矿成土化技术进展', time: '5小时前' },
    { user: '王教授', action: '提出了协作请求: 工业固废重金属研究', time: '昨日' }
  ];

  // 切换折叠面板
  const togglePanel = (panel: string) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // 动态更新数据
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机更新准确率
      setAccuracy(prev => Math.min(100, Math.max(70, prev + (Math.random() - 0.5) * 10)));
      
      // 随机更新特征重要性
      setFeatureImportance(prev => 
        prev.map(val => Math.min(100, Math.max(50, val + (Math.random() - 0.5) * 10)))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* 顶部导航栏 */}
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Leaf size={24} />
          </div>
          <h1 className="text-xl font-bold">固废资源化平台</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white font-medium hover:text-emerald-400 transition-colors">我的工作区</Link>
            <Link to="/database" className="text-white font-medium hover:text-emerald-400 transition-colors">数据探索</Link>
            <Link to="/risk" className="text-white font-medium hover:text-emerald-400 transition-colors">环境安全</Link>
            <Link to="/cost-potential" className="text-white font-medium hover:text-emerald-400 transition-colors">成本潜力</Link>
            <Link to="/roi-assessment" className="text-white font-medium hover:text-emerald-400 transition-colors">ROI评估</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-emerald-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-emerald-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
              <div className="font-medium">王教授（环境工程）</div>
              <div className="text-xs text-emerald-400 flex items-center justify-end">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></span>
                在线
              </div>
            </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
                王
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <div className="flex">
        {/* 左侧功能导航区 */}
        <aside className="w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* 快速分析工具 - 突出显示，调整到顶部，与页签对应 */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-3">平台快捷工具</h3>
            <div className="grid grid-cols-2 gap-3">
              <ToolButton icon={Database} label="数据探索" />
              <ToolButton icon={BrainCircuit} label="模型实验室" />
              <ToolButton icon={BookOpen} label="文献中心" />
              <ToolButton icon={FileText} label="报告生成器" />
              <ToolButton icon={Users} label="科研协作" />
              <ToolButton icon={Settings} label="系统设置" />
            </div>
          </div>
          
          {/* 我的研究空间 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">我的研究空间</h3>
            <div className="space-y-3">
              <ProjectCard 
                name="尾矿成土化技术研究" 
                date="2023-10-15" 
                progress={75} 
                members={['张', '李', '王', '赵']}
              />
              <ProjectCard 
                name="污泥资源化利用" 
                date="2023-09-20" 
                progress={45} 
                members={['刘', '陈', '周']}
              />
              <ProjectCard 
                name="秸秆还田效果评估" 
                date="2023-11-05" 
                progress={25} 
                members={['孙', '吴']}
              />
            </div>
          </div>

          {/* 今日待办 - 可切换显示 */}
          <div>
            <div className="flex items-center justify-between cursor-pointer mb-3" onClick={() => setShowTodos(!showTodos)}>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">今日待办</h3>
              {showTodos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {showTodos && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <TodoItem text="处理尾矿数据集" completed={false} />
                <TodoItem text="训练机器学习模型" completed={false} />
                <TodoItem text="撰写论文章节" completed={true} />
                <TodoItem text="参加项目组会议" completed={false} />
                <TodoItem text="回复协作邮件" completed={true} />
              </div>
            )}
          </div>
        </aside>

        {/* 中央工作区 */}
        <main className={`flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)] ${showRightSidebar ? '' : 'mr-0'}`}>
          {/* 数据仪表板内容 */}
          <div>
            {/* 我的数据集概览 - 与研究空间整合 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">数据与研究概览</h3>
                <div className="flex items-center space-x-3">
                  <button 
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all cursor-pointer"
                    onClick={() => alert('上传数据集')}
                  >
                    上传数据集
                  </button>
                  <button 
                    className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded hover:bg-slate-200 hover:border hover:border-slate-300 transition-all cursor-pointer"
                    onClick={() => alert('更多操作')}
                  >
                    更多操作
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">数据集名称</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">样本数量</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">特征变量数</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">最后更新时间</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">数据质量评分</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      // 加载状态
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          加载数据中...
                        </td>
                      </tr>
                    ) : datasets.length > 0 ? (
                      // 数据展示
                      datasets.map((dataset, index) => (
                        <DatasetRow key={dataset.id} dataset={dataset} />
                      ))
                    ) : (
                      // 无数据状态
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          暂无数据集
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 平台操作工作流 - 与页签对应 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">平台操作工作流</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <AnalysisNode title="数据探索" status="active" />
                  <div className="h-1 bg-slate-200 flex-1 mx-4"></div>
                  <AnalysisNode title="模型实验室" status="active" />
                  <div className="h-1 bg-slate-200 flex-1 mx-4"></div>
                  <AnalysisNode title="文献中心" status="active" />
                  <div className="h-1 bg-slate-200 flex-1 mx-4"></div>
                  <AnalysisNode title="科研协作" status="active" />
                  <div className="h-1 bg-slate-200 flex-1 mx-4"></div>
                  <AnalysisNode title="报告生成" status="active" />
                  <div className="h-1 bg-slate-200 flex-1 mx-4"></div>
                  <AnalysisNode title="结果评估" status="active" />
                </div>
              </div>
            </div>

            {/* 临时分析结果 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">临时分析结果</h3>
                <div className="flex items-center space-x-3">
                  <button 
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 hover:border hover:border-blue-300 transition-all cursor-pointer"
                    onClick={() => alert('导出到模型实验室')}
                  >
                    导出到模型实验室
                  </button>
                  {/* 右侧边栏切换按钮 */}
                  <button 
                    className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                    onClick={toggleRightSidebar}
                    title={showRightSidebar ? '隐藏智能推荐' : '显示智能推荐'}
                  >
                    {showRightSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                  </button>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                  // 加载状态
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg animate-pulse">
                      <Skeleton className="w-32 h-4 mb-3" />
                      <Skeleton className="w-24 h-8" />
                    </div>
                  ))
                ) : (
                  // 实际数据
                  <>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">模型准确率</h4>
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-emerald-600 transition-all duration-500">
                          {accuracy.toFixed(1)}%
                        </div>
                        <TrendingUp size={16} className="text-emerald-500" />
                        <span className="text-sm text-emerald-600">+5.2%</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">特征重要性排名</h4>
                      <div className="space-y-2">
                        {['重金属含量', 'pH值', '有机质', '阳离子交换量'].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-slate-600 w-24">{feature}</span>
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                style={{ width: `${featureImportance[index]}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-700">
                              {featureImportance[index].toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">混淆矩阵</h4>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-emerald-50 p-2 rounded">
                          <div className="text-sm font-bold text-emerald-700">124</div>
                          <div className="text-xs text-emerald-600">True Positive</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <div className="text-sm font-bold text-red-700">18</div>
                          <div className="text-xs text-red-600">False Positive</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="text-sm font-bold text-yellow-700">12</div>
                          <div className="text-xs text-yellow-600">False Negative</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-sm font-bold text-blue-700">246</div>
                          <div className="text-xs text-blue-600">True Negative</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* 右侧智能辅助区 - 可切换显示 */}
        {showRightSidebar && (
          <aside className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            {/* 智能文献推荐 */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => togglePanel('literature')}
              >
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">智能文献推荐</h3>
                {expandedPanels.literature ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedPanels.literature && (
                <div>
                  {literature.map((item, index) => (
                    <LiteratureCard key={index} {...item} />
                  ))}
                </div>
              )}
            </div>

            {/* 相似研究分析 */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => togglePanel('research')}
              >
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">相似研究分析</h3>
                {expandedPanels.research ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedPanels.research && (
                <div>
                  {similarResearch.map((item, index) => (
                    <SimilarResearchCard key={index} {...item} />
                  ))}
                </div>
              )}
            </div>

            {/* 科研协作动态 */}
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => togglePanel('collaboration')}
              >
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">科研协作动态</h3>
                {expandedPanels.collaboration ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedPanels.collaboration && (
                <div>
                  {collaboration.map((item, index) => (
                    <CollaborationCard key={index} {...item} />
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
