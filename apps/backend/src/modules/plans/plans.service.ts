import { env } from "../../config/env.js";
import { HttpError } from "../../utils/http-error.js";
import { createAuditLog } from "../../services/audit-log.service.js";
import { enqueuePlanGeneration } from "../../queues/producer.js";
import { getProjectById, getBrandContextByProjectId } from "../projects/projects.repository.js";
import {
  confirmContentPlan,
  createContentPlan,
  getPlanById,
  listPlanItems,
  listProjectPlans
} from "./plans.repository.js";

export async function requestPlanGeneration(input: {
  actorId: string;
  projectId: string;
  periodDays: number;
  campaignType: string;
  complianceMode: boolean;
}): Promise<{ planId: string; status: string; queueJobId: string }> {
  if (input.periodDays > env.PLAN_PERIOD_MAX_DAYS) {
    throw new HttpError(400, `period_days exceeds max limit ${env.PLAN_PERIOD_MAX_DAYS}`);
  }

  const project = await getProjectById(input.projectId);
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  const brandContext = await getBrandContextByProjectId(input.projectId);
  if (!brandContext) {
    throw new HttpError(404, "Brand context not found");
  }

  const plan = await createContentPlan({
    projectId: input.projectId,
    periodDays: input.periodDays,
    campaignType: input.campaignType
  });

  const queueJobId = await enqueuePlanGeneration({
    jobType: "generate-plan",
    actorId: input.actorId,
    projectId: input.projectId,
    planId: plan.id,
    periodDays: input.periodDays,
    campaignType: input.campaignType,
    complianceMode: input.complianceMode
  });

  await createAuditLog({
    actorId: input.actorId,
    action: "plan.generate.requested",
    entityType: "content_plan",
    entityId: plan.id,
    metadata: { queueJobId, brandContextId: brandContext.id }
  });

  return {
    planId: plan.id,
    status: plan.status,
    queueJobId
  };
}

export async function confirmPlan(input: {
  actorId: string;
  planId: string;
}): Promise<{ plan: unknown; items: unknown[] }> {
  const plan = await getPlanById(input.planId);
  if (!plan) {
    throw new HttpError(404, "Plan not found");
  }

  const items = await listPlanItems(plan.id);
  if (!items.length) {
    throw new HttpError(400, "Plan has no topics to confirm");
  }

  const confirmedPlan = await confirmContentPlan({ planId: input.planId, actorId: input.actorId });
  if (!confirmedPlan) {
    throw new HttpError(404, "Plan not found");
  }

  await createAuditLog({
    actorId: input.actorId,
    action: "plan.confirmed",
    entityType: "content_plan",
    entityId: input.planId
  });

  return {
    plan: confirmedPlan,
    items
  };
}

export async function getProjectPlans(projectId: string): Promise<Array<{ plan: unknown; items: unknown[] }>> {
  const plans = await listProjectPlans(projectId);
  const response: Array<{ plan: unknown; items: unknown[] }> = [];

  for (const plan of plans) {
    const items = await listPlanItems(plan.id);
    response.push({ plan, items });
  }

  return response;
}
