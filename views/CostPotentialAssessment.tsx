import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, ChevronRight, Download, Share2, Save, Edit3, PlusCircle, Trash2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Line, LineChart } from 'recharts';
import { CostPotentialAssessment as CostPotentialAssessmentType, WasteSelection, TargetSetting, ModelSelection, AnalysisProcess, Scheme } from '../types';

// Mock data for waste selection
const mockWastes = [
  {
    id: '1',
    name: '德兴铜矿4号尾矿库',
    type: '尾矿',
    amount: 1000,
    source: '江西铜业',
    parameters: {
      ph: 5.2,
      organicMatter: 0.5,
      heavyMetals: { cd: 1.2, hg: 0.05, as: 25.4, pb: 45.0, cr: 30.2 }
    }
  },
  {
    id: '2',
    name: '市政污泥(厌氧消化)',
    type: '污泥',
    amount: 500,
    source: '某市污水处理厂',
    parameters: {
      ph: 7.8,
      organicMatter: 45.2,
      heavyMetals: { cd: 0.8, hg: 0.1, as: 12.0, pb: 20.4, cr: 15.6 }
    }
  },
  {
    id: '3',
    name: '小麦秸秆(粉碎料)',
    type: '秸秆',
    amount: 800,
    source: '农业合作社',
    parameters: {
      ph: 6.5,
      organicMatter: 88.5,
      heavyMetals: { cd: 0.05, hg: 0.01, as: 0.5, pb: 1.2, cr: 2.5 }
    }
  }
];

// Mock data for generated schemes
const mockSchemes: Scheme[] = [
  {
    id: '1',
    name: '尾矿基土壤改良方案',
    comprehensiveScore: 4.5,
    expectedEffect: {
      soilType: '农业土壤',
      useScenario: '农业',
      expectedResults: [{ name: 'pH调整', value: 6.5 }, { name: '有机质提升', value: 2.5 }, { name: '重金属固化率', value: 85 }]
    },
    costBenefitRatio: 1.8,
    processSteps: [
      {
        id: 'step1',
        name: '固废预处理',
        description: '对尾矿进行破碎、筛分和磁选，去除杂质',
        materials: [{ name: '破碎机', amount: 1, unit: '台' }, { name: '筛分机', amount: 1, unit: '台' }],
        timeEstimate: 2
      },
      {
        id: 'step2',
        name: '添加剂混合',
        description: '将尾矿与改良剂、有机物料混合均匀',
        materials: [{ name: '改良剂', amount: 100, unit: 'kg' }, { name: '有机物料', amount: 200, unit: 'kg' }],
        timeEstimate: 1
      },
      {
        id: 'step3',
        name: '堆肥熟化',
        description: '在堆肥场进行堆肥熟化处理',
        materials: [{ name: '堆肥场', amount: 1, unit: '处' }],
        timeEstimate: 15
      },
      {
        id: 'step4',
        name: '土壤应用',
        description: '将熟化后的产品应用于目标土壤',
        materials: [{ name: '撒施机', amount: 1, unit: '台' }],
        timeEstimate: 3
      }
    ],
    riskAnalysis: {
    toxicityRisk: 0.2,
    environmentalRiskLevel: '低',
    mitigationMeasures: ['定期监测土壤重金属含量', '设置土壤缓冲带', '控制施用量']
  },
    costDetails: {
      totalCost: 120000,
      breakdown: {
        collection: 20000,
        transport: 30000,
        treatment: 50000,
        additive: 15000,
        other: 5000
      }
    }
  },
  {
    id: '2',
    name: '污泥基基质生产方案',
    comprehensiveScore: 4.8,
    expectedEffect: {
      soilType: '园艺基质',
      useScenario: '绿化',
      expectedResults: [{ name: 'pH调整', value: 7.2 }, { name: '有机质提升', value: 45.0 }, { name: '水分保持率', value: 65 }]
    },
    costBenefitRatio: 2.1,
    processSteps: [
      {
        id: 'step1',
        name: '污泥脱水',
        description: '对污泥进行机械脱水，降低含水率',
        materials: [{ name: '脱水机', amount: 1, unit: '台' }],
        timeEstimate: 1
      },
      {
        id: 'step2',
        name: '添加调理剂',
        description: '添加调理剂改善污泥性质',
        materials: [{ name: '调理剂', amount: 50, unit: 'kg' }],
        timeEstimate: 0.5
      },
      {
        id: 'step3',
        name: '高温堆肥',
        description: '进行高温好氧堆肥处理',
        materials: [{ name: '堆肥反应器', amount: 1, unit: '台' }],
        timeEstimate: 7
      },
      {
        id: 'step4',
        name: '包装销售',
        description: '将成品基质进行包装，准备销售',
        materials: [{ name: '包装机', amount: 1, unit: '台' }],
        timeEstimate: 2
      }
    ],
    riskAnalysis: {
    toxicityRisk: 0.15,
    environmentalRiskLevel: '低',
    mitigationMeasures: ['严格控制堆肥温度', '监测重金属和病原体', '确保完全腐熟']
  },
    costDetails: {
      totalCost: 150000,
      breakdown: {
        collection: 15000,
        transport: 25000,
        treatment: 80000,
        additive: 20000,
        other: 10000
      }
    }
  }
];

// Mock data for analysis process
const mockAnalysisProcess: AnalysisProcess = {
  currentStep: 'resultGeneration',
  status: 'completed',
  featureImportance: [
    { feature: '有机质含量', importance: 0.35 },
    { feature: 'pH值', importance: 0.25 },
    { feature: '重金属含量', importance: 0.2 },
    { feature: '成本预算', importance: 0.15 },
    { feature: '时间要求', importance: 0.05 }
  ],
  modelReasoning: '基于输入的固废特性和目标设定，系统选择了随机森林模型，该模型在类似固废资源化案例中表现出较高的预测准确性，尤其是在成本效益预测方面。',
  keyMetrics: [
    { name: '预测准确率', value: 89.5, unit: '%' },
    { name: '置信区间', value: 95, unit: '%' },
    { name: '处理效率', value: 92.3, unit: '%' }
  ],
  confidence: 0.92,
  uncertainty: 0.08
};

export default function CostPotentialAssessment() {
  // State management for the wizard
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSchemes, setShowSchemes] = useState<boolean>(false);
  const [selectedWaste, setSelectedWaste] = useState<WasteSelection | null>(null);
  const [inputMethod, setInputMethod] = useState<'database' | 'manual' | 'upload' | 'photo'>('database');
  const [manualWasteInput, setManualWasteInput] = useState<{
    name: string;
    type: string;
    amount: number;
    parameters: {
      ph: number;
      organicMatter: number;
      heavyMetals: {
        cd: number;
        hg: number;
        as: number;
        pb: number;
        cr: number;
      };
    };
  }>({
    name: '',
    type: '',
    amount: 0,
    parameters: {
      ph: 7.0,
      organicMatter: 0,
      heavyMetals: {
        cd: 0,
        hg: 0,
        as: 0,
        pb: 0,
        cr: 0
      }
    }
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [targetSetting, setTargetSetting] = useState<{
    applicationScenario: string;
    coreObjectives: {
      costControl: number;
      processingSpeed: number;
      processingEffect: number;
      longTermStability: number;
    };
    constraints: {
      budgetLimit: number;
      timeRequirement: number;
      siteConditions: string;
      regulatoryCompliance: boolean;
    };
  }>({
    applicationScenario: '',
    coreObjectives: {
      costControl: 25,
      processingSpeed: 25,
      processingEffect: 25,
      longTermStability: 25
    },
    constraints: {
      budgetLimit: 0,
      timeRequirement: 0,
      siteConditions: '',
      regulatoryCompliance: true
    }
  });
  const [modelSelection, setModelSelection] = useState<ModelSelection>({
    modelType: 'randomForest',
    autoRecommended: true
  });
  const [analysisProcess, setAnalysisProcess] = useState<AnalysisProcess>(mockAnalysisProcess);
  const [generatedSchemes, setGeneratedSchemes] = useState<Scheme[]>(mockSchemes);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(mockSchemes[0]);
  const [schemeVersions, setSchemeVersions] = useState<Scheme[]>([]);
  const [activeVersion, setActiveVersion] = useState<string>('');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState<string>('');
  const [costAdjustment, setCostAdjustment] = useState<number>(0);
  const [timeAdjustment, setTimeAdjustment] = useState<number>(0);
  const [adjustedScheme, setAdjustedScheme] = useState<Scheme | null>(null);
  const [reportTemplate, setReportTemplate] = useState<string>('1');
  const [selectedReportContents, setSelectedReportContents] = useState<string[]>([
    '技术路线图',
    '成本效益分析',
    '风险评估报告',
    '实施时间表',
    '材料清单',
    '预期效果预测'
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1');
  const [selectedOutputFormat, setSelectedOutputFormat] = useState<string>('PDF');
  const [shareLink, setShareLink] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);

  // Handle natural language input
  const handleNaturalLanguageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNaturalLanguageInput(e.target.value);
  };

  // Handle natural language input submission
  const handleNaturalLanguageSubmit = () => {
    if (naturalLanguageInput.trim()) {
      // Simulate AI processing
      console.log('处理自然语言输入:', naturalLanguageInput);
      // Here you would typically call an AI service to interpret the input and adjust the scheme
      setNaturalLanguageInput('');
    }
  };

  // Handle cost adjustment slider change
  const handleCostAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCostAdjustment(value);
    // Simulate scheme adjustment based on cost change
    if (selectedScheme) {
      const adjusted = {
        ...selectedScheme,
        costBenefitRatio: value < 0 
          ? selectedScheme.costBenefitRatio + (Math.abs(value) / 100) 
          : selectedScheme.costBenefitRatio - (value / 100)
      };
      setAdjustedScheme(adjusted);
    }
  };

  // Handle time adjustment slider change
  const handleTimeAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTimeAdjustment(value);
    // Simulate scheme adjustment based on time change
    if (selectedScheme) {
      const adjusted = {
        ...selectedScheme,
        processSteps: selectedScheme.processSteps.map(step => ({
          ...step,
          timeEstimate: Math.max(0.5, step.timeEstimate * (1 + value / 100))
        }))
      };
      setAdjustedScheme(adjusted);
    }
  };

  // Handle saving current scheme version
  const saveSchemeVersion = () => {
    if (selectedScheme) {
      const newVersion = {
        ...selectedScheme,
        id: `version-${Date.now()}`,
        name: `${selectedScheme.name} - 版本 ${schemeVersions.length + 1}`
      };
      setSchemeVersions(prev => [...prev, newVersion]);
      setActiveVersion(newVersion.id);
    }
  };

  // Handle report template selection
  const handleReportTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportTemplate(e.target.id);
  };

  // Handle report content selection
  const handleReportContentChange = (content: string) => {
    setSelectedReportContents(prev => 
      prev.includes(content) 
        ? prev.filter(item => item !== content) 
        : [...prev, content]
    );
  };

  // Handle report generation
  const generateReport = () => {
    console.log('生成报告:', {
      template: reportTemplate,
      contents: selectedReportContents,
      scheme: selectedScheme
    });
    // Here you would typically call a report generation service
  };

  // Handle scheme sharing
  const shareScheme = () => {
    console.log('分享方案:', selectedScheme);
    // Here you would typically implement sharing functionality
  };

  // Validate waste parameters in real-time
  const validateWasteParameters = (params: typeof manualWasteInput.parameters) => {
    const errors: Record<string, string> = {};
    
    // Validate pH range (0-14)
    if (params.ph < 0 || params.ph > 14) {
      errors.ph = 'pH值应在0-14之间';
    }
    
    // Validate organic matter (0-100%)
    if (params.organicMatter < 0 || params.organicMatter > 100) {
      errors.organicMatter = '有机质含量应在0-100%之间';
    }
    
    // Validate heavy metals (non-negative)
    Object.entries(params.heavyMetals).forEach(([metal, value]) => {
      if (value < 0) {
        errors[metal] = `${metal.toUpperCase()}含量不能为负数`;
      }
      // Additional validation based on common limits
      const limits: Record<string, number> = {
        cd: 10,
        hg: 1,
        as: 30,
        pb: 100,
        cr: 150
      };
      if (limits[metal] && value > limits[metal]) {
        errors[metal] = `${metal.toUpperCase()}含量超过常见阈值(${limits[metal]} mg/kg)`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle manual waste input changes
  const handleManualWasteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    const isNumber = ['amount', 'ph', 'organicMatter', 'cd', 'hg', 'as', 'pb', 'cr'].includes(name);
    const numValue = isNumber ? parseFloat(value) || 0 : value;
    
    if (dataset.parameterType === 'metal') {
      setManualWasteInput(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          heavyMetals: {
            ...prev.parameters.heavyMetals,
            [name]: numValue
          }
        }
      }));
    } else if (dataset.parameterType === 'general') {
      setManualWasteInput(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [name]: numValue
        }
      }));
    } else {
      setManualWasteInput(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
    
    // Validate in real-time
    const updatedParams = dataset.parameterType ? 
      (dataset.parameterType === 'metal' ? {
        ...manualWasteInput.parameters,
        heavyMetals: {
          ...manualWasteInput.parameters.heavyMetals,
          [name]: numValue
        }
      } : {
        ...manualWasteInput.parameters,
        [name]: numValue
      }) : 
      manualWasteInput.parameters;
    
    validateWasteParameters(updatedParams);
  };

  // Handle manual waste confirmation
  const confirmManualWaste = () => {
    if (manualWasteInput.name && manualWasteInput.type && manualWasteInput.amount > 0) {
      const isValid = validateWasteParameters(manualWasteInput.parameters);
      if (isValid) {
        const newWaste: WasteSelection = {
          id: `manual-${Date.now()}`,
          name: manualWasteInput.name,
          type: manualWasteInput.type,
          amount: manualWasteInput.amount,
          parameters: manualWasteInput.parameters,
          source: '手动输入'
        };
        setSelectedWaste(newWaste);
      }
    }
  };

  // Total steps in the wizard
  const totalSteps = 5;

  // Function to handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete wizard and show schemes
      startAnalysis();
    }
  };

  // Handle target objective slider changes
  const handleObjectiveChange = (objective: keyof typeof targetSetting.coreObjectives, value: number) => {
    const currentTotal = Object.values(targetSetting.coreObjectives).reduce((sum, val) => sum + val, 0);
    const delta = value - targetSetting.coreObjectives[objective];
    const remaining = 100 - value;
    const otherObjectives = Object.keys(targetSetting.coreObjectives).filter(key => key !== objective) as Array<keyof typeof targetSetting.coreObjectives>;
    const adjustment = remaining / otherObjectives.length;
    
    setTargetSetting(prev => ({
      ...prev,
      coreObjectives: {
        ...prev.coreObjectives,
        [objective]: value,
        ...Object.fromEntries(otherObjectives.map(key => [key, Math.round(adjustment)]))
      }
    }));
  };

  // Handle application scenario changes
  const handleScenarioChange = (scenario: string) => {
    setTargetSetting(prev => ({
      ...prev,
      applicationScenario: scenario
    }));
  };

  // Handle constraint changes
  const handleConstraintChange = (constraint: keyof typeof targetSetting.constraints, value: any) => {
    setTargetSetting(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        [constraint]: value
      }
    }));
  };

  // Apply preset template
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'economic':
        setTargetSetting(prev => ({
          ...prev,
          coreObjectives: {
            costControl: 60,
            processingSpeed: 15,
            processingEffect: 15,
            longTermStability: 10
          }
        }));
        break;
      case 'fast':
        setTargetSetting(prev => ({
          ...prev,
          coreObjectives: {
            costControl: 15,
            processingSpeed: 60,
            processingEffect: 15,
            longTermStability: 10
          }
        }));
        break;
      case 'effective':
        setTargetSetting(prev => ({
          ...prev,
          coreObjectives: {
            costControl: 10,
            processingSpeed: 10,
            processingEffect: 60,
            longTermStability: 20
          }
        }));
        break;
      default:
        break;
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate file parsing
      console.log('Uploaded file:', file.name);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate file parsing
      console.log('Dropped file:', file.name);
    }
  };

  // Handle auto optimization
  const handleAutoOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    setTimeout(() => {
      const result = {
        curingAgent: '磷酸盐基',
        additionRatio: 12,
        curingTime: 10,
        moistureContent: 22,
        mixingTime: 35,
        costReduction: 15,
        effectImprovement: 10
      };
      
      setOptimizationResult(result);
      setIsOptimizing(false);
    }, 2000);
  };

  // Handle report generation
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation process
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportGenerated(true);
    }, 2500);
  };

  // Handle save scheme
  const handleSaveScheme = () => {
    if (selectedScheme) {
      const newScheme = {
        ...selectedScheme,
        id: `saved-${Date.now()}`,
        name: `${selectedScheme.name} (保存版)`,
        savedAt: new Date().toISOString()
      };
      
      setSavedSchemes(prev => [...prev, newScheme]);
      alert('方案保存成功！');
    }
  };

  // Handle start new scheme
  const handleStartNewScheme = () => {
    setCurrentStep(1);
    setSelectedWaste(null);
    setInputMethod('database');
    setManualWasteInput({
      name: '',
      type: '',
      amount: 0,
      parameters: {
        ph: 7.0,
        organicMatter: 0,
        heavyMetals: {
          cd: 0,
          hg: 0,
          as: 0,
          pb: 0,
          cr: 0
        }
      }
    });
    setValidationErrors({});
    setOptimizationResult(null);
    setReportGenerated(false);
    setShareLink('');
    alert('已重置为新方案！');
  };

  // Function to handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to handle waste selection
  const handleWasteSelect = (waste: typeof mockWastes[0]) => {
    setSelectedWaste(waste as WasteSelection);
  };

  // Function to handle target setting change
  const handleTargetSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTargetSetting(prev => ({
      ...prev,
      [name]: name === 'costBudget' || name === 'timeRequirement' ? parseFloat(value) : value
    }));
  };

  // Function to handle model selection change
  const handleModelSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === 'autoRecommended') {
      setModelSelection(prev => ({
        ...prev,
        autoRecommended: checked
      }));
    } else {
      setModelSelection(prev => ({
        ...prev,
        modelType: value as any,
        autoRecommended: false
      }));
    }
  };

  // Function to start analysis process
  const startAnalysis = () => {
    // Simulate analysis process
    setAnalysisProcess(prev => ({ ...prev, status: 'processing' }));
    // After analysis complete, show schemes
    setTimeout(() => {
      setAnalysisProcess(prev => ({ ...prev, status: 'completed' }));
      setShowSchemes(true);
    }, 2000);
  };

  // Function to select scheme
  const handleSchemeSelect = (scheme: Scheme) => {
    setSelectedScheme(scheme);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">成本潜力评估</h2>
        <p className="text-slate-500 text-sm mt-1">基于固废特性和目标设定，生成最优的资源化利用方案</p>
      </div>

      {/* Scheme Generation Wizard or Scheme Display */}
      {!showSchemes ? (
        /* Scheme Generation Wizard */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step Indicator */}
          <div className="p-6 bg-blue-800 text-white border-b border-blue-700">
            <div className="flex justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;
                const isNext = step === currentStep + 1;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-all duration-300 ${isCompleted ? 'bg-blue-600 text-white shadow-lg' : isCurrent ? 'bg-white text-blue-800 border-2 border-blue-600 shadow-xl ring-4 ring-blue-500/20 scale-110' : isNext ? 'bg-blue-300 text-white' : 'bg-blue-700 text-blue-400'}`}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <span className="font-semibold text-lg">{step}</span>}
                    </div>
                    <p className={`text-sm font-medium transition-all duration-300 ${isCompleted ? 'text-blue-300' : isCurrent ? 'text-white font-bold' : isNext ? 'text-blue-300' : 'text-blue-400'}`}>
                      {step === 1 && '固废识别与目标设定'}
                      {step === 2 && '技术路线筛选'}
                      {step === 3 && '参数优化与模拟'}
                      {step === 4 && '方案整合与可视化'}
                      {step === 5 && '报告生成与输出'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {/* Step 1: Waste Identification and Target Setting */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">步骤1：固废识别与目标设定</h3>
                <p className="text-slate-500">请选择固废输入方式并设定处理目标</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Waste Input Area (60%) */}
                  <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">固废输入区</h4>
                    
                    {/* Input Method Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { method: 'database', label: '从数据库选择', icon: '📊' },
                        { method: 'manual', label: '手动输入参数', icon: '✍️' },
                        { method: 'upload', label: '上传检测报告', icon: '📁' },
                        { method: 'photo', label: '拍照识别', icon: '📷' }
                      ].map(({ method, label, icon }) => (
                        <button
                          key={method}
                          className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border transition-all ${inputMethod === method ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
                          onClick={() => setInputMethod(method as any)}
                        >
                          <div className="text-3xl mb-2">{icon}</div>
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Input Method Content */}
                    <div className="space-y-4">
                      {/* Database Selection */}
                      {inputMethod === 'database' && (
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="搜索固废名称、类型或来源..."
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="bg-slate-50 rounded-xl p-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-3">推荐固废</h5>
                            <div className="space-y-3">
                              {mockWastes.map(waste => (
                                <div 
                                  key={waste.id}
                                  className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedWaste?.id === waste.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-100'}`}
                                  onClick={() => handleWasteSelect(waste)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h6 className="font-semibold text-slate-800">{waste.name}</h6>
                                      <p className="text-sm text-slate-500">{waste.type} | 数量: {waste.amount} 吨</p>
                                    </div>
                                    {selectedWaste?.id === waste.id && (
                                      <CheckCircle2 size={20} className="text-blue-600" />
                                    )}
                                  </div>
                                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-slate-600">pH: {waste.parameters.ph}</div>
                                    <div className="text-slate-600">有机质: {waste.parameters.organicMatter}%</div>
                                    <div className="text-slate-600">Cd: {waste.parameters.heavyMetals.cd} mg/kg</div>
                                    <div className="text-slate-600">Pb: {waste.parameters.heavyMetals.pb} mg/kg</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Manual Input */}
                      {inputMethod === 'manual' && (
                        <div className="space-y-4">
                          {/* Basic Information */}
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium text-slate-700">基本信息</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">固废名称</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                  placeholder="例如：铜矿尾矿"
                                  value={manualWasteInput.name}
                                  onChange={handleManualWasteInputChange}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">固废类型</label>
                                <input
                                  type="text"
                                  name="type"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                  placeholder="例如：尾矿"
                                  value={manualWasteInput.type}
                                  onChange={handleManualWasteInputChange}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">产生量 (吨)</label>
                                <input
                                  type="number"
                                  name="amount"
                                  min="0"
                                  step="1"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                  placeholder="例如：1000"
                                  value={manualWasteInput.amount}
                                  onChange={handleManualWasteInputChange}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Basic Parameters */}
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium text-slate-700">基本参数</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">pH值</label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    name="ph"
                                    min="0"
                                    max="14"
                                    step="0.1"
                                    data-parameter-type="general"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                    placeholder="0-14"
                                    value={manualWasteInput.parameters.ph}
                                    onChange={handleManualWasteInputChange}
                                  />
                                  {validationErrors.ph && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.ph}</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">有机质含量 (%)</label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    name="organicMatter"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    data-parameter-type="general"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                    placeholder="0-100"
                                    value={manualWasteInput.parameters.organicMatter}
                                    onChange={handleManualWasteInputChange}
                                  />
                                  {validationErrors.organicMatter && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.organicMatter}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Heavy Metals */}
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium text-slate-700">重金属含量 (mg/kg)</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                { name: 'cd', label: 'Cd' },
                                { name: 'hg', label: 'Hg' },
                                { name: 'as', label: 'As' },
                                { name: 'pb', label: 'Pb' },
                                { name: 'cr', label: 'Cr' }
                              ].map(metal => (
                                <div key={metal.name}>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">{metal.label}</label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      name={metal.name}
                                      min="0"
                                      step="0.1"
                                      data-parameter-type="metal"
                                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                      placeholder="0.0"
                                      value={manualWasteInput.parameters.heavyMetals[metal.name as keyof typeof manualWasteInput.parameters.heavyMetals]}
                                      onChange={handleManualWasteInputChange}
                                    />
                                    {validationErrors[metal.name] && (
                                      <p className="text-xs text-red-500 mt-1">{validationErrors[metal.name]}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Confirm Button */}
                          <button
                            type="button"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm font-medium"
                            onClick={confirmManualWaste}
                          >
                            确认输入
                          </button>
                        </div>
                      )}
                      
                      {/* Upload Report */}
                      {inputMethod === 'upload' && (
                        <div>
                          <div 
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <div className="text-4xl mb-3">📄</div>
                            <h5 className="text-lg font-medium text-slate-700 mb-2">拖拽上传检测报告</h5>
                            <p className="text-sm text-slate-500 mb-4">支持 PDF、Word、Excel 或图片格式</p>
                            <div className="flex justify-center">
                              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm font-medium cursor-pointer">
                                选择文件
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={handleFileUpload}
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                />
                              </label>
                            </div>
                          </div>
                          
                          {uploadedFile && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="text-xl mr-3">📄</div>
                                  <div>
                                    <h6 className="font-medium text-blue-700">{uploadedFile.name}</h6>
                                    <p className="text-xs text-blue-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="mt-3">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">正在解析报告... 75%</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Photo Recognition */}
                      {inputMethod === 'photo' && (
                        <div className="space-y-4">
                          <div className="bg-slate-50 rounded-xl p-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-3">拍照识别</h5>
                            <div className="border border-slate-300 rounded-lg overflow-hidden">
                              <div className="aspect-video bg-slate-200 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-4xl mb-2">📷</div>
                                  <p className="text-slate-500 mb-3">点击下方按钮拍照或上传照片</p>
                                  <div className="flex justify-center space-x-3">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm font-medium">
                                      拍照
                                    </button>
                                    <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all text-sm font-medium">
                                      上传照片
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h6 className="font-medium text-blue-700 text-sm mb-2">AI 识别结果</h6>
                            <p className="text-sm text-blue-600">系统将自动识别固废类型和估计参数，请稍候...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column: Target Setting Area (40%) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">目标设定区</h4>
                    
                    {/* Application Scenario Selection */}
                    <div className="space-y-3 mb-6">
                      <h5 className="text-sm font-medium text-slate-700">应用场景选择</h5>
                      <div className="grid grid-cols-2 gap-3">
                        {['矿山修复', '农业用地', '绿化工程', '路基填料', '其他'].map(scenario => (
                          <button
                            key={scenario}
                            className={`py-2 px-3 rounded-lg border transition-all text-left ${targetSetting.applicationScenario === scenario ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-700'}`}
                            onClick={() => handleScenarioChange(scenario)}
                          >
                            <div className="text-sm font-medium">{scenario}</div>
                            <div className="text-xs text-slate-500 mt-1">{scenario === '矿山修复' ? '修复废弃矿山，恢复生态' : scenario === '农业用地' ? '用于农业生产，提高产量' : scenario === '绿化工程' ? '用于城市绿化，美化环境' : scenario === '路基填料' ? '用于道路建设，降低成本' : '其他特殊用途'}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Core Objectives Setting */}
                    <div className="space-y-4 mb-6">
                      <h5 className="text-sm font-medium text-slate-700">核心目标设定</h5>
                      <p className="text-xs text-slate-500">通过滑块设定优先级，总和必须为100%</p>
                      
                      <div className="space-y-4">
                        {[
                          { objective: 'costControl', label: '成本控制', color: 'bg-blue-500' },
                          { objective: 'processingSpeed', label: '处理速度', color: 'bg-green-500' },
                          { objective: 'processingEffect', label: '处理效果', color: 'bg-purple-500' },
                          { objective: 'longTermStability', label: '长期稳定性', color: 'bg-yellow-500' }
                        ].map(({ objective, label, color }) => (
                          <div key={objective}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-slate-700">{label}</span>
                              <span className="text-sm font-bold text-slate-800">{targetSetting.coreObjectives[objective as keyof typeof targetSetting.coreObjectives]}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={targetSetting.coreObjectives[objective as keyof typeof targetSetting.coreObjectives]}
                              onChange={(e) => handleObjectiveChange(objective as keyof typeof targetSetting.coreObjectives, parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Constraints */}
                    <div className="space-y-3 mb-6">
                      <h5 className="text-sm font-medium text-slate-700">约束条件</h5>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">预算上限 (元)</label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                            placeholder="例如：100000"
                            value={targetSetting.constraints.budgetLimit}
                            onChange={(e) => handleConstraintChange('budgetLimit', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">时间要求 (天)</label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                            placeholder="例如：30"
                            value={targetSetting.constraints.timeRequirement}
                            onChange={(e) => handleConstraintChange('timeRequirement', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">场地条件</label>
                          <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                            value={targetSetting.constraints.siteConditions}
                            onChange={(e) => handleConstraintChange('siteConditions', e.target.value)}
                          >
                            <option value="">请选择</option>
                            <option value="室内">室内</option>
                            <option value="室外">室外</option>
                            <option value="半室内">半室内</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="regulatoryCompliance"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/20 border-slate-300"
                            checked={targetSetting.constraints.regulatoryCompliance}
                            onChange={(e) => handleConstraintChange('regulatoryCompliance', e.target.checked)}
                          />
                          <label htmlFor="regulatoryCompliance" className="ml-2 block text-sm font-medium text-slate-700">
                            法规符合性要求
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Smart Presets */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-slate-700">智能预设</h5>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { preset: 'economic', label: '经济优先型', description: '成本控制为主' },
                          { preset: 'fast', label: '快速见效型', description: '处理速度为主' },
                          { preset: 'effective', label: '最优效果型', description: '处理效果为主' }
                        ].map(({ preset, label, description }) => (
                          <button
                            key={preset}
                            className="py-2 px-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
                            onClick={() => applyPreset(preset)}
                          >
                            <div className="text-sm font-medium text-slate-700">{label}</div>
                            <div className="text-xs text-slate-500 mt-1">{description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Technical Route Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">步骤2：技术路线筛选</h3>
                <p className="text-slate-500">系统正在智能分析，为您筛选最优的技术路线</p>
                
                {/* AI Thinking Animation */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-6xl mb-4 animate-pulse">🤖</div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">AI 思考中...</h4>
                    <p className="text-slate-500 mb-4">基于您的固废特性和目标设定，系统正在分析最优技术路线</p>
                    <div className="w-full max-w-md">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Technical Route Map */}
                  <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">技术路线地图</h4>
                    
                    {/* Mind Map */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="text-center mb-4">
                        <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
                          {selectedWaste?.name || '固废'}
                        </div>
                      </div>
                      
                      {/* Preprocessing Technologies */}
                      <div className="space-y-4">
                        <div className="ml-4">
                          <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            预处理技术
                          </div>
                          <div className="space-y-3 ml-4">
                            {['物理法', '化学法', '生物法'].map(tech => (
                              <div key={tech} className="border-l-2 border-blue-300 pl-4">
                                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {tech}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Specific Technologies */}
                        <div className="ml-4">
                          <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            具体技术
                          </div>
                          <div className="space-y-3 ml-4">
                            {['固化稳定化', '热解', '堆肥', '生物修复'].map(tech => (
                              <div key={tech} className="border-l-2 border-blue-300 pl-4">
                                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {tech}
                                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">92分</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Application Directions */}
                        <div className="ml-4">
                          <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                            应用方向
                          </div>
                          <div className="space-y-3 ml-4">
                            {['矿山修复', '农业用地', '绿化工程', '路基填料'].map(direction => (
                              <div key={direction} className="border-l-2 border-blue-300 pl-4">
                                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {direction}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle Column: Route Comparison Matrix */}
                  <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">路线对比矩阵</h4>
                    
                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">技术路线</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">成熟度</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">成本估算</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">处理周期</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">效果预测</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">风险等级</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">综合评分</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {[
                            { route: '固化稳定化+农业应用', maturity: 95, cost: '中', period: '短', effect: 88, risk: '低', score: 92 },
                            { route: '热解+能源回收', maturity: 85, cost: '高', period: '中', effect: 92, risk: '中', score: 88 },
                            { route: '堆肥+绿化应用', maturity: 90, cost: '低', period: '长', effect: 85, risk: '低', score: 87 },
                            { route: '生物修复+矿山修复', maturity: 75, cost: '中', period: '长', effect: 90, risk: '低', score: 83 }
                          ].map((route, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800">{route.route}</td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center">
                                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden mr-2">
                                    <div className="h-full bg-blue-500" style={{ width: `${route.maturity}%` }}></div>
                                  </div>
                                  <span>{route.maturity}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${route.cost === '低' ? 'bg-green-100 text-green-700' : route.cost === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                  {route.cost}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${route.period === '短' ? 'bg-green-100 text-green-700' : route.period === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                  {route.period}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">{route.effect}%</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${route.risk === '低' ? 'bg-green-100 text-green-700' : route.risk === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                  {route.risk}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-bold text-blue-700">{route.score}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Right Column: Route Details and Selection */}
                  <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">路线详情与选择</h4>
                    
                    {/* Selected Route Details */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-800 mb-2">固化稳定化+农业应用</h5>
                        <p className="text-sm text-slate-600 mb-3">
                          该路线采用固化稳定化技术处理固废，将其转化为适合农业应用的土壤改良剂，具有成熟度高、风险低、成本中等的特点。
                        </p>
                        
                        {/* Why Recommend */}
                        <div className="mb-3">
                          <h6 className="font-medium text-slate-700 text-sm mb-2">为什么推荐？</h6>
                          <ul className="space-y-1 text-sm text-slate-600">
                            <li className="flex items-start">
                              <span className="mr-2 mt-0.5">•</span>
                              <span>符合您设定的成本控制和处理效果目标</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-0.5">•</span>
                              <span>在类似固废处理案例中表现优异</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-0.5">•</span>
                              <span>技术成熟，实施风险低</span>
                            </li>
                          </ul>
                        </div>
                        
                        {/* Key Parameters */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">固化剂添加比例:</span>
                            <span className="font-medium">10-15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">养护时间:</span>
                            <span className="font-medium">7-14天</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">处理能力:</span>
                            <span className="font-medium">100-200吨/天</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">重金属固化率:</span>
                            <span className="font-medium">85-95%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Success Cases */}
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2">成功案例</h5>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-sm">
                            <div className="font-medium text-slate-700">铜矿尾矿农业应用案例</div>
                            <div className="text-slate-500 mt-1">
                              某铜矿尾矿采用固化稳定化技术处理后，成功应用于农业土壤改良，pH值从5.2调整至6.5，有机质提升2.5%。
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-xs mt-1">查看详情 →</button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection Button */}
                      <button 
                        className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm font-medium"
                        onClick={handleNextStep}
                      >
                        选择该技术路线
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Parameter Optimization and Simulation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">步骤3：参数优化与模拟</h3>
                <p className="text-slate-500">针对选定的技术路线，优化关键参数并进行模拟验证</p>
                
                {/* Tabs */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="border-b border-slate-200">
                    <div className="flex">
                      {[
                        { id: 'key-parameters', label: '关键参数优化' },
                        { id: 'lab-simulation', label: '实验室模拟' },
                        { id: 'risk-assessment', label: '风险评估预测' },
                        { id: 'economic-analysis', label: '经济性分析' }
                      ].map((tab, index) => (
                        <button
                          key={tab.id}
                          className={`py-4 px-6 text-sm font-medium transition-all border-b-2 ${index === 0 ? 'border-blue-600 text-blue-800' : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-blue-300'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-6">
                    {/* Key Parameters Optimization */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">关键参数优化</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Parameter Sliders */}
                        <div className="space-y-6">
                          {[
                            { name: '固化剂种类', type: 'select', options: ['水泥基', '石灰基', '磷酸盐基', '有机聚合物基'] },
                            { name: '添加比例', type: 'slider', min: 0, max: 30, value: 15, unit: '%' },
                            { name: '养护时间', type: 'slider', min: 0, max: 30, value: 14, unit: '天' },
                            { name: '含水率', type: 'slider', min: 0, max: 50, value: 25, unit: '%' },
                            { name: '混合时间', type: 'slider', min: 0, max: 120, value: 30, unit: '分钟' }
                          ].map((param, index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700">{param.name}</label>
                                <span className="text-sm font-bold text-slate-800">
                                  {param.type === 'slider' ? `${param.value}${param.unit}` : '水泥基'}
                                </span>
                              </div>
                              
                              {param.type === 'slider' ? (
                                <div className="space-y-1">
                                  <input
                                    type="range"
                                    min={param.min}
                                    max={param.max}
                                    value={param.value}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    onChange={(e) => {
                                      // 这里可以添加参数变化的处理逻辑
                                      console.log(`${param.name} 变化为: ${e.target.value}${param.unit}`);
                                    }}
                                  />
                                  <div className="flex justify-between text-xs text-slate-500">
                                    <span>{param.min} {param.unit}</span>
                                    <span>{param.max} {param.unit}</span>
                                  </div>
                                </div>
                              ) : (
                                <select 
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                  onChange={(e) => {
                                    console.log(`固化剂种类变化为: ${e.target.value}`);
                                  }}
                                >
                                  {param.options?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              )}
                              
                              {/* Impact Curve */}
                              <div className="h-24 mt-3">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={[
                                    { x: 0, cost: 100, effect: 50 },
                                    { x: 5, cost: 95, effect: 60 },
                                    { x: 10, cost: 90, effect: 70 },
                                    { x: 15, cost: 85, effect: 85 },
                                    { x: 20, cost: 80, effect: 90 },
                                    { x: 25, cost: 75, effect: 92 },
                                    { x: 30, cost: 70, effect: 93 }
                                  ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="x" tick={{ fontSize: 10 }} stroke="#64748b" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                                    <Tooltip 
                                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} dot={false} name="成本影响" />
                                    <Line type="monotone" dataKey="effect" stroke="#10b981" strokeWidth={2} dot={false} name="效果影响" />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          ))}
                          
                          {/* Auto Optimization Button */}
                          <div className="mt-4">
                            <button 
                              className={`w-full py-3 rounded-lg shadow-sm transition-all text-sm font-medium ${isOptimizing ? 'bg-blue-500 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                              onClick={handleAutoOptimize}
                              disabled={isOptimizing}
                            >
                              {isOptimizing ? '优化中...' : '自动优化参数'}
                            </button>
                          </div>
                          
                          {/* Optimization Result */}
                          {optimizationResult && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                              <h6 className="font-medium text-green-800 text-sm mb-2">优化结果</h6>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-green-600">固化剂种类:</span>
                                  <span className="font-medium">{optimizationResult.curingAgent}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-600">添加比例:</span>
                                  <span className="font-medium">{optimizationResult.additionRatio}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-600">养护时间:</span>
                                  <span className="font-medium">{optimizationResult.curingTime}天</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-600">含水率:</span>
                                  <span className="font-medium">{optimizationResult.moistureContent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-600">混合时间:</span>
                                  <span className="font-medium">{optimizationResult.mixingTime}分钟</span>
                                </div>
                                <div className="mt-3 p-2 bg-green-100 rounded">
                                  <span className="text-green-700 text-sm">
                                    优化目标: 成本降低 {optimizationResult.costReduction}%, 效果提升 {optimizationResult.effectImprovement}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Expert Suggestions */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                          <h5 className="text-lg font-semibold text-slate-800 mb-4">专家建议</h5>
                          
                          <div className="space-y-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="text-blue-600 mr-3">💡</div>
                                <div>
                                  <h6 className="font-medium text-slate-800 text-sm">固化剂添加比例建议</h6>
                                  <p className="text-sm text-slate-600 mt-1">
                                    根据类似案例经验，固化剂添加比例在10-15%之间时，成本与效果达到最佳平衡。
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="text-blue-600 mr-3">⚠️</div>
                                <div>
                                  <h6 className="font-medium text-slate-800 text-sm">养护时间注意事项</h6>
                                  <p className="text-sm text-slate-600 mt-1">
                                    养护时间不足会导致固化效果不佳，建议至少养护14天以上，以确保重金属固化率达到85%以上。
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="text-blue-600 mr-3">📊</div>
                                <div>
                                  <h6 className="font-medium text-slate-800 text-sm">含水率优化建议</h6>
                                  <p className="text-sm text-slate-600 mt-1">
                                    含水率控制在20-30%之间时，混合效果最佳，过高或过低都会影响固化剂的反应效率。
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Scheme Integration and Visualization */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">步骤4：方案整合与可视化</h3>
                <p className="text-slate-500">将前几步的结果整合为完整的实施方案，并进行可视化展示</p>
                
                {/* Top Section: Scheme Overview Dashboard */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">方案总览看板</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Process Flow Chart */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 text-sm mb-3">工艺流程图</h5>
                      <div className="aspect-video bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🔄</div>
                          <div className="text-sm text-slate-500">工艺流程图</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Material Balance */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 text-sm mb-3">物料平衡图</h5>
                      <div className="aspect-video bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">⚖️</div>
                          <div className="text-sm text-slate-500">物料平衡图</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Energy Flow */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 text-sm mb-3">能量流图</h5>
                      <div className="aspect-video bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">⚡</div>
                          <div className="text-sm text-slate-500">能量流图</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cost Composition */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 text-sm mb-3">成本构成饼图</h5>
                      <div className="aspect-video bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">💰</div>
                          <div className="text-sm text-slate-500">成本构成饼图</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Plan */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 text-sm mb-3">时间计划</h5>
                      <div className="aspect-video bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📅</div>
                          <div className="text-sm text-slate-500">甘特图</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk Radar */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-800 text-sm mb-3">风险雷达图</h5>
                      <div className="aspect-video bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🎯</div>
                          <div className="text-sm text-slate-500">风险雷达图</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Section: Scheme Component Editing */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">方案组件编辑</h4>
                  
                  {/* Collapsible Panels */}
                  <div className="space-y-4">
                    {[
                      { id: 'process-steps', title: '工艺步骤详述', icon: '🔧' },
                      { id: 'material-list', title: '物料清单', icon: '📋' },
                      { id: 'monitoring-plan', title: '监测方案', icon: '📊' },
                      { id: 'safety-measures', title: '安全环保措施', icon: '⚠️' },
                      { id: 'document-templates', title: '文档模板', icon: '📄' }
                    ].map((panel, index) => (
                      <div key={panel.id} className="border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-center p-4 bg-slate-50 cursor-pointer">
                          <div className="flex items-center">
                            <div className="text-xl mr-3">{panel.icon}</div>
                            <h5 className="font-medium text-slate-800">{panel.title}</h5>
                          </div>
                          <ChevronDown size={20} className="text-slate-500" />
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-slate-600">
                            {panel.title} 内容将在这里展示...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Report Generation and Output */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">步骤5：报告生成与输出</h3>
                <p className="text-slate-500">生成专业报告并进行输出与分享</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Report Template Library */}
                  <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">报告模板库</h4>
                    
                    <div className="space-y-4">
                      {[
                        { id: '1', name: '科研论文模板', preview: '📄', description: '适合学术研究和发表' },
                        { id: '2', name: '项目申报书模板', preview: '📋', description: '适合项目申报和审批' },
                        { id: '3', name: '工程设计方案模板', preview: '🔧', description: '适合工程实施和施工' },
                        { id: '4', name: '企业可研报告模板', preview: '📊', description: '适合企业决策和投资' },
                        { id: '5', name: '政府验收报告模板', preview: '✅', description: '适合政府验收和评估' },
                        { id: '6', name: '施工图设计模板', preview: '🗺️', description: '适合施工图纸设计' }
                      ].map((template) => (
                        <div key={template.id} className={`border rounded-lg overflow-hidden transition-colors ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-500'}`}>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="text-2xl mr-3">{template.preview}</div>
                                <h5 className="font-medium text-slate-800">{template.name}</h5>
                              </div>
                              <button 
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedTemplate === template.id ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                onClick={() => setSelectedTemplate(template.id)}
                              >
                                {selectedTemplate === template.id ? '已选择' : '选择'}
                              </button>
                            </div>
                            <p className="text-sm text-slate-600">{template.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Middle Column: Report Editing and Customization */}
                  <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">报告编辑与定制</h4>
                    
                    <div className="space-y-4">
                      {/* Report Content Selection */}
                      <div>
                        <h5 className="font-medium text-slate-800 text-sm mb-3">选择报告内容</h5>
                        <div className="space-y-2">
                          {[
                            '技术路线图', '成本效益分析', '风险评估报告', '实施时间表',
                            '材料清单', '预期效果预测', '工艺流程图', '物料平衡图'
                          ].map((content, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`content-${index}`}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/20 border-slate-300"
                                checked={selectedReportContents.includes(content)}
                                onChange={() => handleReportContentChange(content)}
                              />
                              <label htmlFor={`content-${index}`} className="ml-2 block text-sm font-medium text-slate-700">
                                {content}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Report Editor */}
                      <div>
                        <h5 className="font-medium text-slate-800 text-sm mb-3">报告编辑</h5>
                        <div className="bg-slate-50 rounded-lg p-4 min-h-[200px] border border-slate-200">
                          <div className="text-center text-slate-500">
                            <div className="text-2xl mb-2">📝</div>
                            <div>所见即所得的报告编辑界面</div>
                            <div className="text-sm mt-1">选择模板后，报告内容将在这里显示，您可以进行编辑和调整</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Smart Layout Assistant */}
                      <div className="flex justify-center">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm font-medium">
                          智能排版助手
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Output and Sharing Settings */}
                  <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">输出与分享设置</h4>
                    
                    <div className="space-y-4">
                      {/* Output Format Selection */}
                      <div>
                        <h5 className="font-medium text-slate-800 text-sm mb-3">输出格式选择</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {['Word', 'PDF', 'PPT', 'Excel', 'HTML网页', 'Markdown'].map((format, index) => (
                            <button 
                              key={index} 
                              className={`py-2 px-3 rounded-lg border transition-all text-center ${selectedOutputFormat === format ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'}`}
                              onClick={() => setSelectedOutputFormat(format)}
                            >
                              {format}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Quality Settings */}
                      <div>
                        <h5 className="font-medium text-slate-800 text-sm mb-3">质量设置</h5>
                        <div className="grid grid-cols-3 gap-3">
                          {['标准版', '印刷版', '演示版'].map((quality, index) => (
                            <button key={index} className="py-2 px-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                              {quality}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sharing Settings */}
                      <div>
                        <h5 className="font-medium text-slate-800 text-sm mb-3">分享设置</h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">生成分享链接</label>
                            <div className="flex">
                              <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-l-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                placeholder="分享链接将在这里生成..."
                                value={shareLink}
                                readOnly
                              />
                              <button 
                                className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all"
                                onClick={() => {
                                  // 模拟生成分享链接
                                  setShareLink(`https://example.com/share/${Math.random().toString(36).substring(2, 15)}`);
                                  alert('分享链接已生成！');
                                }}
                              >
                                生成
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">设置密码</label>
                              <input
                                type="password"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                placeholder="可选"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">设置有效期</label>
                              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
                                <option value="7">7天</option>
                                <option value="30">30天</option>
                                <option value="90">90天</option>
                                <option value="permanent">永久有效</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Final Action Buttons */}
                      <div className="space-y-3">
                        <button 
                          className={`w-full py-3 rounded-lg shadow-sm transition-all text-sm font-medium ${isGeneratingReport ? 'bg-blue-500 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                          onClick={handleGenerateReport}
                          disabled={isGeneratingReport}
                        >
                          {isGeneratingReport ? '生成中...' : '生成报告'}
                        </button>
                        <button 
                          className="w-full py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all text-sm font-medium"
                          onClick={handleSaveScheme}
                        >
                          保存方案
                        </button>
                        <button 
                          className="w-full py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all text-sm font-medium"
                          onClick={handleStartNewScheme}
                        >
                          开始新方案
                        </button>
                      </div>
                      
                      {/* Report Generation Result */}
                      {reportGenerated && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                          <h6 className="font-medium text-green-800 text-sm mb-2">报告生成成功</h6>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-green-600">模板:</span>
                              <span className="font-medium">{selectedTemplate === '1' ? '科研论文模板' : '项目申报书模板'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-green-600">格式:</span>
                              <span className="font-medium">{selectedOutputFormat}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-green-600">大小:</span>
                              <span className="font-medium">2.5 MB</span>
                            </div>
                            <div className="flex space-x-3">
                              <button className="flex-1 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all text-sm font-medium">
                                下载报告
                              </button>
                              <button className="flex-1 py-2 bg-white text-green-600 border border-green-600 rounded-lg shadow-sm hover:bg-green-50 transition-all text-sm font-medium">
                                分享报告
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-sm transition-all ${currentStep === 1 ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft size={18} />
                <span>上一步</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm transition-all hover:bg-blue-700"
                onClick={currentStep === totalSteps ? startAnalysis : handleNextStep}
              >
                <span>{currentStep === totalSteps ? '生成报告' : '下一步'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Scheme Display Interface */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">生成的方案</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedSchemes.map(scheme => (
                <div 
                  key={scheme.id}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${selectedScheme?.id === scheme.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}`}
                  onClick={() => handleSchemeSelect(scheme)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-800">{scheme.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(scheme.comprehensiveScore) ? 'text-yellow-400' : 'text-slate-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-slate-500">{scheme.comprehensiveScore.toFixed(1)}/5.0</span>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-emerald-700 border border-emerald-200">
                      成本效益比: {scheme.costBenefitRatio.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-600">总投资: ¥{scheme.costDetails.totalCost.toLocaleString()}</div>
                    <div className="text-slate-600">时间预估: {scheme.processSteps.reduce((sum, step) => sum + step.timeEstimate, 0)} 天</div>
                    <div className="text-slate-600">环境风险: {scheme.riskAnalysis.environmentalRiskLevel}</div>
                    <div className="text-slate-600">工艺步骤: {scheme.processSteps.length} 步</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheme Details */}
          {selectedScheme && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Technical Route Details */}
              <div className="lg:col-span-1 space-y-6">
                {/* Technical Route Details */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">技术路线详情</h3>
                  <div className="space-y-5">
                    {/* Scheme Overview */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">方案概览</h4>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-600">方案名称</span>
                          <span className="font-medium">{selectedScheme.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-600">综合评分</span>
                          <div className="flex items-center">
                            <div className="flex mr-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${i < Math.floor(selectedScheme.comprehensiveScore) ? 'text-yellow-400' : 'text-slate-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs">{selectedScheme.comprehensiveScore.toFixed(1)}/5.0</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">成本效益比</span>
                          <span className="font-medium text-emerald-700">{selectedScheme.costBenefitRatio.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Expected Effect Radar Chart */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">预期效果</h4>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius="80%" data={selectedScheme.expectedEffect.expectedResults}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#64748b" />
                              <Radar name="预期效果" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                              <Tooltip formatter={(value) => [value, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    {/* Process Steps */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">工艺步骤</h4>
                      <div className="space-y-3">
                        {selectedScheme.processSteps.map((step, index) => (
                          <div key={step.id} className="bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-slate-700">{index + 1}. {step.name}</h5>
                              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                {step.timeEstimate} 天
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                            <div className="mt-2">
                              <p className="text-xs text-slate-500 mb-1">所需材料:</p>
                              <div className="flex flex-wrap gap-2">
                                {step.materials.map((material, matIndex) => (
                                  <span key={matIndex} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600">
                                    {material.name} × {material.amount}{material.unit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Risk Analysis */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">风险分析</h3>
                  <div className="space-y-5">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-600">环境风险等级</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedScheme.riskAnalysis.environmentalRiskLevel === '低' ? 'bg-green-50 text-green-700' : selectedScheme.riskAnalysis.environmentalRiskLevel === '中' ? 'bg-yellow-50 text-yellow-700' : selectedScheme.riskAnalysis.environmentalRiskLevel === '高' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                          {selectedScheme.riskAnalysis.environmentalRiskLevel}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-2">毒性释放风险指数</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">风险指数</span>
                            <span className="font-medium">{(selectedScheme.riskAnalysis.toxicityRisk * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${selectedScheme.riskAnalysis.toxicityRisk * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Toxicity Release Risk Curve */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">毒性释放风险曲线</h4>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { time: 0, risk: 0.3 },
                              { time: 1, risk: 0.25 },
                              { time: 3, risk: 0.2 },
                              { time: 6, risk: 0.15 },
                              { time: 12, risk: 0.1 },
                              { time: 24, risk: 0.05 },
                              { time: 36, risk: 0.03 }
                            ]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="time" 
                                stroke="#64748b" 
                                tick={{ fontSize: 12 }}
                                label={{ value: '时间 (月)', position: 'insideBottomRight', offset: -10, fontSize: 12, fill: '#64748b' }}
                              />
                              <YAxis 
                                stroke="#64748b" 
                                tick={{ fontSize: 12 }}
                                domain={[0, 0.35]}
                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                label={{ value: '风险水平', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
                              />
                              <Tooltip 
                                formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, '风险水平']}
                                labelFormatter={(label) => `${label}个月后`}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="risk" 
                                stroke="#ef4444" 
                                strokeWidth={2} 
                                dot={{ fill: '#ef4444', r: 4 }} 
                                activeDot={{ r: 6, fill: '#dc2626' }}
                              />
                              {/* Safety threshold line */}
                              <Line 
                                type="monotone" 
                                data={[{ time: 0, risk: 0.1 }, { time: 36, risk: 0.1 }]} 
                                dataKey="risk" 
                                stroke="#10b981" 
                                strokeWidth={1} 
                                strokeDasharray="5 5"
                                dot={false}
                                name="安全阈值"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-3 text-sm text-slate-600">
                          <p>• 风险水平随时间逐渐降低，12个月后降至安全阈值以下</p>
                          <p>• 初期风险较高，建议加强监测和防护措施</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">缓解措施建议</h4>
                      <ul className="space-y-2">
                        {selectedScheme.riskAnalysis.mitigationMeasures.map((measure, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mt-1 mr-2 text-emerald-600">•</div>
                            <p className="text-sm text-slate-600">{measure}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Middle Column: Comparison Analysis */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">对比分析</h3>
                  <div className="space-y-6">
                    {/* Multi-Scheme Comparison Table */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">多方案对比</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                指标
                              </th>
                              {generatedSchemes.map(scheme => (
                                <th key={scheme.id} scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                  {scheme.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">综合评分</td>
                              {generatedSchemes.map(scheme => (
                                <td key={scheme.id} className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={`text-xs ${i < Math.floor(scheme.comprehensiveScore) ? 'text-yellow-400' : 'text-slate-300'}`}>
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">总投资 (万元)</td>
                              {generatedSchemes.map(scheme => (
                                <td key={scheme.id} className="px-4 py-3 whitespace-nowrap">
                                  <span className="text-sm text-slate-600">
                                    ¥{(scheme.costDetails.totalCost / 10000).toFixed(1)}
                                  </span>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">时间预估 (天)</td>
                              {generatedSchemes.map(scheme => (
                                <td key={scheme.id} className="px-4 py-3 whitespace-nowrap">
                                  <span className="text-sm text-slate-600">
                                    {scheme.processSteps.reduce((sum, step) => sum + step.timeEstimate, 0)} 天
                                  </span>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">成本效益比</td>
                              {generatedSchemes.map(scheme => (
                                <td key={scheme.id} className="px-4 py-3 whitespace-nowrap">
                                  <span className={`text-sm font-medium ${scheme.costBenefitRatio > 1.5 ? 'text-emerald-700' : 'text-slate-600'}`}>
                                    {scheme.costBenefitRatio.toFixed(2)}
                                  </span>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">环境风险等级</td>
                              {generatedSchemes.map(scheme => (
                                <td key={scheme.id} className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${scheme.riskAnalysis.environmentalRiskLevel === '低' ? 'bg-green-50 text-green-700' : scheme.riskAnalysis.environmentalRiskLevel === '中' ? 'bg-yellow-50 text-yellow-700' : scheme.riskAnalysis.environmentalRiskLevel === '高' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                                    {scheme.riskAnalysis.environmentalRiskLevel}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Dimension Score Comparison Chart */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">维度评分对比图</h4>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={[
                                { dimension: '成本效益', '尾矿基土壤改良方案': 85, '污泥基基质生产方案': 90 },
                                { dimension: '环境风险', '尾矿基土壤改良方案': 80, '污泥基基质生产方案': 85 },
                                { dimension: '技术可行性', '尾矿基土壤改良方案': 88, '污泥基基质生产方案': 92 },
                                { dimension: '实施难度', '尾矿基土壤改良方案': 75, '污泥基基质生产方案': 80 },
                                { dimension: '资源利用率', '尾矿基土壤改良方案': 90, '污泥基基质生产方案': 85 }
                              ]} 
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="dimension" 
                                stroke="#64748b" 
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                stroke="#64748b" 
                                tick={{ fontSize: 12 }}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                              />
                              <Tooltip 
                                formatter={(value) => [`${value}%`, '评分']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              />
                              <Legend />
                              <Bar dataKey="尾矿基土壤改良方案" fill="#10b981" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="污泥基基质生产方案" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    {/* Model Result Consistency Check */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">模型结果一致性检查</h4>
                      <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-slate-700 mb-2">不同模型对方案的评估一致性</h5>
                          <div className="space-y-3">
                            {generatedSchemes.map(scheme => (
                              <div key={scheme.id}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <span className="text-slate-600">{scheme.name}</span>
                                  <span className="font-medium text-emerald-700">92% 一致性</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-emerald-600 h-2.5 rounded-full" 
                                    style={{ width: '92%' }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                  <span>随机森林</span>
                                  <span>神经网络</span>
                                  <span>支持向量机</span>
                                  <span>集成学习</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">一致性分析说明：</span>
                            所有模型对方案的评估结果一致性均在90%以上，表明模型预测结果可靠，方案具有较高的可信度。
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Comparison Chart */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">维度评分对比</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: '成本效益',
                                方案1: 90,
                                方案2: 85
                              },
                              {
                                name: '实施难度',
                                方案1: 75,
                                方案2: 80
                              },
                              {
                                name: '环境友好',
                                方案1: 85,
                                方案2: 90
                              },
                              {
                                name: '预期效果',
                                方案1: 80,
                                方案2: 85
                              },
                              {
                                name: '技术成熟度',
                                方案1: 90,
                                方案2: 85
                              }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            <Legend />
                            <Bar dataKey="方案1" fill="#3b82f6" name={generatedSchemes[0].name} />
                            <Bar dataKey="方案2" fill="#10b981" name={generatedSchemes[1].name} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Column: Interaction and Output */}
              <div className="lg:col-span-1 space-y-6">
                {/* Interaction Panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">交互与输出</h3>
                  <div className="space-y-5">
                    {/* Natural Language Input */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">调整方案参数</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">自然语言输入</label>
                          <div className="relative flex">
                            <input
                              type="text"
                              className="flex-1 pl-10 pr-4 py-2 border border-slate-200 rounded-l-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                              placeholder="例如：我希望成本降低20%"
                              value={naturalLanguageInput}
                              onChange={handleNaturalLanguageInput}
                              onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageSubmit()}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              💬
                            </div>
                            <button
                              className="px-4 py-2 bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-700 transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                              onClick={handleNaturalLanguageSubmit}
                            >
                              提交
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">成本预算调整</label>
                            <span className={`text-sm ${costAdjustment < 0 ? 'text-emerald-700' : costAdjustment > 0 ? 'text-red-700' : 'text-slate-600'}`}>
                              {costAdjustment < 0 ? `降低 ${Math.abs(costAdjustment)}%` : costAdjustment > 0 ? `增加 ${costAdjustment}%` : '无调整'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-30"
                            max="30"
                            value={costAdjustment}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            onChange={handleCostAdjustmentChange}
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>-30%</span>
                            <span>0%</span>
                            <span>+30%</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">时间要求调整</label>
                            <span className={`text-sm ${timeAdjustment < 0 ? 'text-emerald-700' : timeAdjustment > 0 ? 'text-red-700' : 'text-slate-600'}`}>
                              {timeAdjustment < 0 ? `缩短 ${Math.abs(timeAdjustment)} 天` : timeAdjustment > 0 ? `延长 ${timeAdjustment} 天` : '无调整'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-10"
                            max="20"
                            value={timeAdjustment}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            onChange={handleTimeAdjustmentChange}
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>-10天</span>
                            <span>0天</span>
                            <span>+20天</span>
                          </div>
                        </div>
                        
                        {/* Adjusted Scheme Preview */}
                        {adjustedScheme && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="font-medium text-blue-700 text-sm mb-2">调整后方案预览</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-600">成本效益比</span>
                                <span className="font-medium">{adjustedScheme.costBenefitRatio.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-600">总时间</span>
                                <span className="font-medium">{adjustedScheme.processSteps.reduce((sum, step) => sum + step.timeEstimate, 0)} 天</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Version Management */}
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">版本管理</h4>
                      <div className="space-y-3">
                        <button 
                          className="w-full flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                          onClick={saveSchemeVersion}
                        >
                          <Save size={18} />
                          <span>保存当前版本</span>
                        </button>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs text-slate-500 mb-2">已保存的版本</p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {schemeVersions.length > 0 ? (
                              schemeVersions.map((version, index) => (
                                <div key={version.id} className={`flex items-center justify-between bg-white p-2 rounded border transition-all ${activeVersion === version.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                                  <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${activeVersion === version.id ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                    <span className="text-sm text-slate-700">{version.name}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                                      <Edit3 size={16} />
                                    </button>
                                    <button className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-sm text-slate-500">
                                暂无保存的版本
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Report Generator */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">报告生成器</h3>
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">报告模板选择</h4>
                      <div className="space-y-3">
                        {[
                          { id: '1', name: '详细技术报告', description: '包含完整的技术参数、实施步骤和风险分析' },
                          { id: '2', name: '简明方案报告', description: '重点介绍方案优势和实施要点' },
                          { id: '3', name: '经济分析报告', description: '详细的成本效益分析和投资回报预测' }
                        ].map(template => (
                          <div key={template.id} className="flex items-center p-3 rounded-lg border transition-all cursor-pointer hover:border-emerald-300">
                            <input
                              type="radio"
                              id={template.id}
                              name="reportTemplate"
                              className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500/20 cursor-pointer"
                              checked={reportTemplate === template.id}
                              onChange={handleReportTemplateChange}
                            />
                            <div className="ml-3">
                              <label htmlFor={template.id} className="block text-sm font-medium text-slate-700 cursor-pointer">
                                {template.name}
                              </label>
                              <p className="text-xs text-slate-500">{template.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">自定义内容</h4>
                      <div className="space-y-3">
                        {[
                          '技术路线图',
                          '成本效益分析',
                          '风险评估报告',
                          '实施时间表',
                          '材料清单',
                          '预期效果预测'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`content-${index}`}
                              name="reportContent"
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500/20 cursor-pointer"
                              checked={selectedReportContents.includes(item)}
                              onChange={() => handleReportContentChange(item)}
                            />
                            <label htmlFor={`content-${index}`} className="ml-2 block text-sm text-slate-700">
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button 
                        className="w-full flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm"
                        onClick={generateReport}
                      >
                        <Download size={18} />
                        <span>一键生成PDF报告</span>
                      </button>
                      <button 
                        className="w-full flex items-center space-x-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                        onClick={shareScheme}
                      >
                        <Share2 size={18} />
                        <span>分享方案</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}