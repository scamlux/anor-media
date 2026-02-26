import { api } from "./api";
import type { Project, ProjectDetailsResponse } from "@/types/api";

export async function listProjects(): Promise<Project[]> {
  const response = await api.get<{ projects: Project[] }>("/projects");
  return response.data.projects;
}

export async function createProject(payload: {
  name: string;
  description?: string;
  campaign_goal: string;
  brand_context: {
    tone: string;
    audience: string;
    compliance_notes: string;
    allowed_emojis: boolean;
  };
}): Promise<ProjectDetailsResponse> {
  const response = await api.post<ProjectDetailsResponse>("/projects", payload);
  return response.data;
}

export async function getProject(id: string): Promise<ProjectDetailsResponse> {
  const response = await api.get<ProjectDetailsResponse>(`/projects/${id}`);
  return response.data;
}

export async function updateBrandContext(
  projectId: string,
  payload: {
    tone: string;
    audience: string;
    compliance_notes: string;
    allowed_emojis: boolean;
  }
): Promise<ProjectDetailsResponse["brandContext"]> {
  const response = await api.put<{ brandContext: ProjectDetailsResponse["brandContext"] }>(
    `/projects/${projectId}/brand-context`,
    payload
  );
  return response.data.brandContext;
}
