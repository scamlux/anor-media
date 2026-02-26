import { env } from "../../config/env.js";
import { HttpError } from "../../utils/http-error.js";
import { createAuditLog } from "../../services/audit-log.service.js";
import { enqueuePostGeneration } from "../../queues/producer.js";
import {
  countDailyPostGenerations,
  findPostById,
  getMonthlyProjectCost,
  getOrCreatePost,
  getPlanItemWithPlanContext,
  listCalendarByProject,
  listPostVersions,
  updatePostStatus
} from "./posts.repository.js";

export async function requestPostGeneration(input: {
  actorId: string;
  planItemId: string;
  formatType: string;
  additionalComments: string;
  strictNumbersMode: boolean;
  complianceMode: boolean;
}): Promise<{ postId: string; queueJobId: string; status: string }> {
  const planItem = await getPlanItemWithPlanContext(input.planItemId);
  if (!planItem) {
    throw new HttpError(404, "Plan item not found");
  }

  if (planItem.plan_status !== "confirmed") {
    throw new HttpError(400, "Plan must be confirmed before post generation");
  }

  const dailyCount = await countDailyPostGenerations(planItem.project_id);
  if (dailyCount >= env.POST_GENERATION_DAILY_LIMIT) {
    throw new HttpError(429, "Daily post generation limit exceeded");
  }

  const monthlyCost = await getMonthlyProjectCost(planItem.project_id);
  if (monthlyCost >= env.PROJECT_COST_MONTHLY_LIMIT) {
    throw new HttpError(402, "Project monthly cost limit exceeded");
  }

  const post = await getOrCreatePost({
    planItemId: planItem.id,
    projectId: planItem.project_id,
    actorId: input.actorId
  });

  const queueJobId = await enqueuePostGeneration({
    jobType: "generate-post",
    actorId: input.actorId,
    projectId: planItem.project_id,
    planId: planItem.plan_id,
    planItemId: planItem.id,
    formatType: input.formatType,
    additionalComments: input.additionalComments,
    strictNumbersMode: input.strictNumbersMode,
    complianceMode: input.complianceMode
  });

  await createAuditLog({
    actorId: input.actorId,
    action: "post.generate.requested",
    entityType: "post",
    entityId: post.id,
    metadata: { queueJobId, planItemId: planItem.id, strictNumbersMode: input.strictNumbersMode }
  });

  return {
    postId: post.id,
    queueJobId,
    status: post.status
  };
}

export async function submitPostForApproval(input: { actorId: string; postId: string }): Promise<void> {
  const post = await findPostById(input.postId);
  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  await updatePostStatus({ postId: input.postId, status: "pending_approval" });
  await createAuditLog({
    actorId: input.actorId,
    action: "post.submit_for_approval",
    entityType: "post",
    entityId: input.postId
  });
}

export async function getPostVersions(postId: string): Promise<unknown[]> {
  return listPostVersions(postId);
}

export async function getProjectCalendar(projectId: string): Promise<unknown[]> {
  return listCalendarByProject(projectId);
}
