
import React, { useState, Suspense, Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// 性能监控工具
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number> = {};

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 开始计时
  start(name: string): void {
    this.metrics[name] = performance.now();
  }

  // 结束计时并返回结果
  end(name: string): number {
    if (!this.metrics[name]) {
      console.warn(`Performance metric ${name} not started`);
      return 0;
    }
    const duration = performance.now() - this.metrics[name];
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }

  // 跟踪页面加载性能
  trackPageLoad(): void {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page load time: ${pageLoadTime}ms`);
    });
  }

  // 跟踪组件渲染时间
  trackComponentRender(name: string, renderTime: number): void {
    console.log(`Component ${name} rendered in ${renderTime.toFixed(2)}ms`);
  }
}

// 使用单例模式获取性能监控实例
const perfMonitor = PerformanceMonitor.getInstance();

// 全局错误边界组件
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('全局错误:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">应用出错了</h2>
            <p className="text-slate-600 mb-6">{this.state.error?.message || '发生了未知错误'}</p>
            <button 
              onClick={this.handleRetry}
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
            >
              重新加载
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
import { 
  LayoutDashboard, 
  Database, 
  ShieldAlert, 
  TrendingUp, 
  Settings, 
  Menu, 
  X,
  Zap,
  Leaf,
  Info
} from 'lucide-react';
// 使用懒加载优化初始加载速度
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const WasteDatabase = React.lazy(() => import('./views/WasteDatabase'));
const WasteDatabaseDetail = React.lazy(() => import('./views/WasteDatabaseDetail'));
const Assessment = React.lazy(() => import('./views/Assessment'));
const EnvironmentalRisk = React.lazy(() => import('./views/EnvironmentalRisk'));
const CostBenefit = React.lazy(() => import('./views/CostBenefit'));
const CostPotentialAssessment = React.lazy(() => import('./views/CostPotentialAssessment'));

// Fix: Use React.FC to define the component type, which allows standard React props like 'key' to be passed during list rendering
const SidebarItem: React.FC<{ icon: any, label: string, to: string, active: boolean }> = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: '概览工作台', to: '/' },
    { icon: Database, label: '固废属性库', to: '/database' },
    { icon: Zap, label: '成土潜力评估', to: '/assessment' },
    { icon: ShieldAlert, label: '环境安全预警', to: '/risk' },
    { icon: TrendingUp, label: '成本效益分析', to: '/cost' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-slate-900 text-white p-6 shadow-2xl`}
        role="navigation"
        aria-label="主导航"
        tabIndex={isOpen ? 0 : -1}
        onBlur={() => isOpen && setIsOpen(false)}
      >
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="p-2 bg-emerald-500 rounded-lg" aria-hidden="true">
            <Leaf className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">固废资源化平台</h1>
        </div>

        <nav className="space-y-2" aria-label="导航菜单">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              icon={item.icon} 
              label={item.label} 
              to={item.to} 
              active={location.pathname === item.to}
            />
          ))}
          <SidebarItem 
            key="/cost-potential"
            icon={TrendingUp} 
            label="成本潜力评估" 
            to="/cost-potential" 
            active={location.pathname === "/cost-potential"}
          />
        </nav>

        <div className="absolute bottom-10 left-6 right-6 p-4 bg-slate-800 rounded-xl border border-slate-700" role="complementary">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Info size={16} aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">系统版本</span>
          </div>
          <p className="text-sm text-slate-300">V1.0.2 Stable</p>
          <p className="text-[10px] text-slate-500 mt-1">管理员: Root</p>
        </div>
      </div>
    </>
  );
};

export default function App() {
  // 初始化性能监控
  useEffect(() => {
    // 跟踪页面加载性能
    perfMonitor.trackPageLoad();
    
    // 开始监控 App 组件渲染
    perfMonitor.start('App_render');
    
    // 组件卸载时清理
    return () => {
      perfMonitor.end('App_render');
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-lg text-slate-600">加载中...</span>
          </div>
        }>
          <Routes>
            {/* 科研者首页 - 直接渲染完整的三栏式布局 */}
            <Route path="/" element={<Dashboard />} />
            
            {/* 其他页面 - 使用默认的侧边栏布局 */}
            <Route path="/*" element={
              <div className="flex min-h-screen bg-slate-50 font-sans">
                <Navigation />
                <main className="flex-1 lg:ml-64 p-6 lg:p-10">
                  <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 hidden sm:block">智能评估系统</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-600 font-medium">服务正常连接</span>
                      </div>
                      <img 
                        src="https://picsum.photos/40/40" 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                      />
                    </div>
                  </header>

                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/database" element={<WasteDatabase />} />
                      <Route path="/database/:id" element={<WasteDatabaseDetail />} />
                      <Route path="/assessment" element={<Assessment />} />
                      <Route path="/risk" element={<EnvironmentalRisk />} />
                      <Route path="/cost" element={<CostBenefit />} />
                      <Route path="/cost-potential" element={<CostPotentialAssessment />} />
                    </Routes>
                  </div>
                </main>
              </div>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}
