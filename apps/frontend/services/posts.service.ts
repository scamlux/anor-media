import { api } from "./api";
import type { GeneratePostResponse, PostVersion } from "@/types/api";

export async function generatePost(
  planItemId: string,
  payload: {
    format_type: string;
    additional_comments: string;
    strict_numbers_mode: boolean;
    compliance_mode: boolean;
  }
): Promise<GeneratePostResponse> {
  const response = await api.post<GeneratePostResponse>(`/plan-items/${planItemId}/generate`, payload);
  return response.data;
}

export async function submitForApproval(postId: string): Promise<void> {
  await api.post(`/posts/${postId}/submit-approval`, { status: "pending_approval" });
}

export async function decideApproval(postId: string, payload: { decision: "approved" | "rejected"; comment?: string }): Promise<void> {
  await api.post(`/posts/${postId}/approval`, payload);
}

export async function getPostVersions(postId: string): Promise<PostVersion[]> {
  const response = await api.get<{ versions: PostVersion[] }>(`/posts/${postId}/versions`);
  return response.data.versions;
}

export async function getCalendar(projectId: string): Promise<any[]> {
  const response = await api.get<{ items: any[] }>(`/projects/${projectId}/calendar`);
  return response.data.items;
}
