
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Info, Loader2, Upload, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getPedogenesisScheme } from '../services/geminiService';
import { WasteProperty, WasteType } from '../types';

export default function Assessment() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState<Partial<WasteProperty>>({
    name: '混合矿山固废A',
    type: WasteType.Tailings,
    ph: 6.2,
    organicMatter: 2.5,
    heavyMetals: { cd: 0.5, hg: 0.02, as: 10.5, pb: 15.0, cr: 20.0 }
  });
  
  // 文件上传相关状态
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [parsingResult, setParsingResult] = useState<any>(null);
  const [missingParams, setMissingParams] = useState<string[]>([]);
  const [matchedParams, setMatchedParams] = useState<{ [key: string]: any }>({});

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    setUploadedFile(file);
    
    // 模拟文件解析和参数匹配过程
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟解析结果
      const parsedData = {
        name: file.name.replace(/\.[^/.]+$/, ""),
        type: WasteType.Tailings,
        ph: 6.5,
        organicMatter: 3.2,
        heavyMetals: {
          cd: 0.6,
          hg: 0.03,
          as: 12.0,
          pb: 18.0,
          // 缺少cr参数
        }
      };
      
      // 检查缺失的参数
      const requiredParams = ['name', 'type', 'ph', 'organicMatter', 'heavyMetals.cd', 'heavyMetals.hg', 'heavyMetals.as', 'heavyMetals.pb', 'heavyMetals.cr'];
      const missing: string[] = [];
      const matched: { [key: string]: any } = {};
      
      requiredParams.forEach(param => {
        const value = param.split('.').reduce((obj: any, key) => obj && obj[key], parsedData as any);
        if (value === undefined || value === null) {
          missing.push(param);
        } else {
          matched[param] = value;
        }
      });
      
      setMissingParams(missing);
      setMatchedParams(matched);
      setParsingResult(parsedData);
      
      // 更新表单数据
      setForm(prev => ({
        ...prev,
        ...parsedData
      }));
      
    } catch (error) {
      console.error('文件解析失败:', error);
    } finally {
      setFileUploading(false);
    }
  };

  // 处理手动匹配参数
  const handleMatchParams = () => {
    if (parsingResult) {
      setForm(prev => ({
        ...prev,
        ...parsingResult
      }));
    }
  };

  const handleAssess = async () => {
    setLoading(true);
    try {
      const aiResponse = await getPedogenesisScheme(form as WasteProperty);
      setResult(aiResponse);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Zap className="text-emerald-500" size={20} />
            <span>输入评估参数</span>
          </h3>
          
          {/* 文件上传区域 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
              <FileText size={16} className="text-blue-500" />
              <span>上传检测报告</span>
            </h4>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="report-upload"
                accept=".pdf,.docx,.xlsx,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="report-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">点击上传或拖拽文件到此处</p>
                  <p className="text-xs text-slate-400 mt-1">支持 PDF, DOCX, XLSX, CSV 格式</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  选择文件
                </button>
              </label>
            </div>
            
            {/* 文件上传状态和结果 */}
            {fileUploading && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={16} />
                <span className="text-sm text-slate-600">正在解析文件...</span>
              </div>
            )}
            
            {uploadedFile && !fileUploading && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText size={16} className="text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                      <p className="text-xs text-green-600">{uploadedFile.size / 1024 / 1024.toFixed(2)} MB</p>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
                
                {/* 参数匹配结果 */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-slate-700 uppercase">参数匹配结果</h5>
                  
                  {/* 匹配成功的参数 */}
                  {Object.keys(matchedParams).length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs font-medium text-green-700 mb-2 flex items-center space-x-1">
                        <CheckCircle2 size={14} />
                        <span>匹配成功 ({Object.keys(matchedParams).length})</span>
                      </p>
                      <ul className="text-xs text-green-800 space-y-1">
                        {Object.entries(matchedParams).map(([param, value]) => (
                          <li key={param} className="flex justify-between">
                            <span>{param}</span>
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* 缺失的参数 */}
                  {missingParams.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs font-medium text-amber-700 mb-2 flex items-center space-x-1">
                        <AlertTriangle size={14} />
                        <span>缺失参数 ({missingParams.length})</span>
                      </p>
                      <ul className="text-xs text-amber-800 space-y-1">
                        {missingParams.map((param, index) => (
                          <li key={index}>{param}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* 确认匹配按钮 */}
                  <button
                    onClick={handleMatchParams}
                    disabled={!parsingResult}
                    className="w-full px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    确认匹配参数
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">固废名称</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">类型</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value as WasteType})}
              >
                {Object.values(WasteType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">pH值</label>
                <input 
                  type="number" step="0.1"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={form.ph}
                  onChange={e => setForm({...form, ph: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">有机质 (%)</label>
                <input 
                  type="number" step="0.1"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={form.organicMatter}
                  onChange={e => setForm({...form, organicMatter: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">重金属指标 (mg/kg)</p>
              <div className="grid grid-cols-2 gap-4">
                {['cd', 'pb', 'as'].map((metal) => (
                  <div key={metal}>
                    <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">{metal}</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={(form.heavyMetals as any)[metal]}
                      onChange={e => setForm({
                        ...form, 
                        heavyMetals: {...form.heavyMetals!, [metal]: parseFloat(e.target.value)}
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAssess}
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="text-emerald-400" />}
              <span className="font-semibold">执行 AI 智能评估</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8">
                <div className={`w-24 h-24 rounded-full border-8 flex items-center justify-center ${
                   result.score > 80 ? 'border-emerald-100' : result.score > 60 ? 'border-blue-100' : 'border-amber-100'
                }`}>
                  <span className="text-3xl font-black text-slate-800">{result.score}</span>
                </div>
                <p className="text-[10px] text-center font-bold text-slate-400 mt-2 uppercase">潜力评分</p>
              </div>

              <div className="max-w-md">
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    result.riskLevel === '低' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {result.riskLevel}风险级别
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">资源化潜力评估报告</h2>
                <p className="text-slate-500">基于多源数据融合算法及Gemini专家知识库生成的深度评估建议</p>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">优化改良方案</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{result.suggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">安全预警点</h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{result.warning}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2">预期成土效果</h4>
                <p className="text-sm text-slate-600 italic">“{result.outcome}”</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <div className="text-xs text-slate-400">报告生成ID: REP-{Math.floor(Math.random()*100000)}</div>
                <button className="flex items-center space-x-2 text-emerald-600 font-bold text-sm hover:underline">
                  <span>导出完整 PDF 方案</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
              <Zap className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">等待评估数据输入</h3>
            <p className="text-slate-400 max-w-sm">请在左侧填写固废属性参数，点击“执行AI智能评估”按钮获取成土化改良建议方案。</p>
          </div>
        )}
      </div>
    </div>
  );
}
