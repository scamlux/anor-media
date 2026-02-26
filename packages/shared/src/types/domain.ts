export type UserRole = "admin" | "editor" | "viewer";
export type PlanStatus = "draft" | "confirmed";
export type PostStatus = "draft" | "pending_approval" | "approved" | "rejected";
export type MediaType = "image" | "video";
export type TopicFormat = "text" | "image" | "video";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface ContentPlanTopic {
  id: string;
  date: string;
  topic: string;
  goal: string;
  format: TopicFormat;
  status: "pending" | "generated";
}

export interface GeneratedPostContent {
  hook: string;
  main_text: string;
  cta: string;
  hashtags: string[];
  visual_prompt: string;
}
