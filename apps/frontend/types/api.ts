import type { AuthUser, ContentPlanTopic, GeneratedPostContent } from "@anor/shared";

export interface LoginResponse {
  user: AuthUser;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  campaign_goal: string;
}

export interface BrandContext {
  id: string;
  project_id: string;
  tone: string;
  audience: string;
  compliance_notes: string;
  allowed_emojis: boolean;
}

export interface ProjectDetailsResponse {
  project: Project;
  brandContext: BrandContext;
}

export interface GeneratePlanResponse {
  plan_id: string;
  status: "draft" | "confirmed";
  queue_job_id: string;
}

export interface PlanWithItems {
  plan: {
    id: string;
    status: "draft" | "confirmed";
    period_days: number;
    campaign_type: string;
  };
  items: ContentPlanTopic[];
}

export interface GeneratePostResponse {
  post_id: string;
  status: "draft" | "pending_approval" | "approved" | "rejected";
  queue_job_id: string;
}

export interface PostVersion {
  version: number;
  content: GeneratedPostContent;
  media: Array<{ type: "image" | "video"; url: string }>;
  cost_usd: string;
  created_at: string;
}
