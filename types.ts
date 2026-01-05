
export enum WasteType {
  Tailings = '尾矿',
  Sludge = '污泥',
  Straw = '秸秆',
  Construction = '建筑垃圾',
  Industrial = '工业固废',
  Slag = '炉渣',
  RedMud = '赤泥'
}

export interface WasteProperty {
  id: string;
  name: string;
  type: WasteType;
  ph: number;
  organicMatter: number; // %
  heavyMetals: {
    cd: number; // mg/kg
    hg: number;
    as: number;
    pb: number;
    cr: number;
  };
  moisture: number; // %
  source: string;
  timestamp: string;
}

export interface AssessmentResult {
  potentialIndex: number; // 0-100
  riskLevel: '低' | '中' | '高' | '极高';
  recommendation: string;
  mixRatio?: string;
  costEstimate: number; // CNY/ton
}

export interface CostAnalysis {
  collection: number;
  transport: number;
  treatment: number;
  additive: number;
  return: number;
}

// 方案生成相关类型

export interface WasteSelection {
  id: string;
  name: string;
  type: string;
  amount: number;
  source: string;
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
}

export interface TargetSetting {
  expectedSoilType: string;
  useScenario: '农业' | '修复' | '绿化' | '其他';
  costBudget: number;
  timeRequirement: number; // 天数
}

export type ModelType = 'randomForest' | 'neuralNetwork' | 'supportVectorMachine' | 'ensembleLearning';

export interface ModelSelection {
  modelType: ModelType;
  autoRecommended: boolean;
}

export interface AnalysisProcess {
  currentStep: 'input' | 'featureExtraction' | 'modelCalculation' | 'resultGeneration';
  status: 'idle' | 'processing' | 'completed' | 'error';
  featureImportance: Array<{ feature: string; importance: number }>;
  modelReasoning: string;
  keyMetrics: Array<{ name: string; value: number; unit: string }>;
  confidence: number;
  uncertainty: number;
}

export interface Scheme {
  id: string;
  name: string;
  comprehensiveScore: number;
  expectedEffect: {
    soilType: string;
    useScenario: string;
    expectedResults: Array<{ name: string; value: number }>;
  };
  costBenefitRatio: number;
  processSteps: Array<{
    id: string;
    name: string;
    description: string;
    materials: Array<{ name: string; amount: number; unit: string }>;
    timeEstimate: number;
  }>;
  riskAnalysis: {
    toxicityRisk: number;
    environmentalRiskLevel: '低' | '中' | '高' | '极高';
    mitigationMeasures: string[];
  };
  costDetails: {
    totalCost: number;
    breakdown: {
      collection: number;
      transport: number;
      treatment: number;
      additive: number;
      other: number;
    };
  };
}

export interface SchemeComparison {
  schemes: Scheme[];
  comparisonDimensions: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

export interface CostPotentialAssessment {
  wasteSelection: WasteSelection;
  targetSetting: TargetSetting;
  modelSelection: ModelSelection;
  analysisProcess: AnalysisProcess;
  generatedSchemes: Scheme[];
  selectedScheme: Scheme | null;
  comparisonResults: SchemeComparison | null;
}
