
import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Info, Loader2 } from 'lucide-react';
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
