
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { WasteProperty } from "../types";

// 环境变量验证
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

// 初始化 GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 定义 Gemini API 响应类型
export interface PedogenesisResponse {
  score: number; // 0-100
  riskLevel: '低' | '中' | '高' | '极高';
  suggestion: string;
  warning: string;
  outcome: string;
}

export interface ExpertConsultationResponse {
  text: string;
}

// Gemini 服务配置常量
const GEMINI_CONFIG = {
  MODEL_NAME: 'gemini-3-pro-preview',
  RESPONSE_MIME_TYPE: "application/json" as const,
  SYSTEM_INSTRUCTION: "你是一个资深的固废资源化利用专家，能够提供关于尾矿修复、污泥堆肥、秸秆还田等领域的技术咨询。"
};

/**
 * 获取成土化方案
 * @param waste 固废属性
 * @returns 成土化评估结果
 */
export const getPedogenesisScheme = async (waste: WasteProperty): Promise<PedogenesisResponse | null> => {
  const prompt = `
    你是一个环保工程与土壤修复专家。请基于以下固废属性，评估其“成土化（Pedogenesis）”潜力并提供一份优化改良方案。
    固废名称: ${waste.name}
    类型: ${waste.type}
    pH值: ${waste.ph}
    有机质: ${waste.organicMatter}%
    重金属含量 (mg/kg): Cd:${waste.heavyMetals.cd}, Hg:${waste.heavyMetals.hg}, As:${waste.heavyMetals.as}, Pb:${waste.heavyMetals.pb}, Cr:${waste.heavyMetals.cr}
    
    请输出JSON格式的建议，包含：
    1. 潜力评分 (0-100)
    2. 风险等级 (低/中/高/极高)
    3. 改良建议 (添加什么改良剂，比例多少)
    4. 环境安全预警要点
    5. 预期成土效果
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_CONFIG.MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: GEMINI_CONFIG.RESPONSE_MIME_TYPE,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            warning: { type: Type.STRING },
            outcome: { type: Type.STRING }
          },
          required: ["score", "riskLevel", "suggestion", "warning", "outcome"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      console.error("Gemini returned empty response");
      return null;
    }

    const result: PedogenesisResponse = JSON.parse(text.trim());
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Gemini API error:", error.message);
    } else {
      console.error("Unexpected error in getPedogenesisScheme:", error);
    }
    return null;
  }
};

/**
 * 获取专家咨询
 * @param query 咨询问题
 * @returns 专家咨询响应
 */
export const getExpertConsultation = async (query: string): Promise<string | null> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_CONFIG.MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: GEMINI_CONFIG.SYSTEM_INSTRUCTION
      }
    });

    return response.text || null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Gemini API error:", error.message);
    } else {
      console.error("Unexpected error in getExpertConsultation:", error);
    }
    return null;
  }
}
