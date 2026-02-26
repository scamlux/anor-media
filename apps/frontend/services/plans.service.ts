import { api } from "./api";
import type { GeneratePlanResponse, PlanWithItems } from "@/types/api";

export async function generatePlan(
  projectId: string,
  payload: { period_days: number; campaign_type: string; compliance_mode: boolean }
): Promise<GeneratePlanResponse> {
  const response = await api.post<GeneratePlanResponse>(`/projects/${projectId}/generate-plan`, payload);
  return response.data;
}

export async function confirmPlan(projectId: string, planId: string): Promise<void> {
  await api.post(`/projects/${projectId}/confirm-plan`, { plan_id: planId });
}

export async function listPlans(projectId: string): Promise<PlanWithItems[]> {
  const response = await api.get<{ plans: PlanWithItems[] }>(`/projects/${projectId}/plans`);
  return response.data.plans;
}
