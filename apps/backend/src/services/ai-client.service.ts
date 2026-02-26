import axios from "axios";
import { env } from "../config/env.js";

const aiClient = axios.create({
  baseURL: env.AI_ORCHESTRATOR_URL,
  timeout: 120000,
  headers: {
    "x-api-key": env.AI_ORCHESTRATOR_API_KEY,
    "content-type": "application/json"
  }
});

export interface GeneratePlanOrchestratorRequest {
  project_id: string;
  period_days: number;
  campaign_type: string;
  compliance_mode: boolean;
  brand_context: {
    tone: string;
    audience: string;
    compliance_notes: string;
    allowed_emojis: boolean;
  };
}

export interface GeneratePostOrchestratorRequest {
  project_id: string;
  topic: {
    date: string;
    topic: string;
    goal: string;
    format: "text" | "image" | "video";
  };
  format_type: string;
  additional_comments: string;
  strict_numbers_mode: boolean;
  compliance_mode: boolean;
  brand_context: {
    tone: string;
    audience: string;
    compliance_notes: string;
    allowed_emojis: boolean;
  };
}

export async function requestPlanGeneration(payload: GeneratePlanOrchestratorRequest): Promise<{
  provider: string;
  attempts: number;
  latency_ms: number;
  cost_usd: number;
  topics: Array<{ date: string; topic: string; goal: string; format: "text" | "image" | "video" }>;
}> {
  const response = await aiClient.post("/generate-plan", payload);
  return response.data;
}

export async function requestPostGeneration(payload: GeneratePostOrchestratorRequest): Promise<{
  provider: string;
  attempts: number;
  latency_ms: number;
  cost_usd: number;
  content: {
    hook: string;
    main_text: string;
    cta: string;
    hashtags: string[];
    visual_prompt: string;
  };
  media: Array<{ type: "image" | "video"; url: string }>;
}> {
  const response = await aiClient.post("/generate-post", payload);
  return response.data;
}
