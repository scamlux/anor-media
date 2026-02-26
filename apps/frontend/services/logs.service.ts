import { api } from "./api";

export async function getProjectLogs(projectId: string): Promise<{ generationLogs: any[]; auditLogs: any[] }> {
  const response = await api.get<{ generationLogs: any[]; auditLogs: any[] }>(`/projects/${projectId}/logs`);
  return response.data;
}
