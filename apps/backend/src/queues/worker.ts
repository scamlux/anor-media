import { Job, Worker } from "bullmq";
import { QUEUE_NAMES, JOB_NAMES } from "../constants/queues.js";
import { redisConnection } from "./connection.js";
import type { GeneratePlanJobPayload, GeneratePostJobPayload } from "./types.js";
import { logger } from "../services/logger.js";
import { requestPlanGeneration, requestPostGeneration } from "../services/ai-client.service.js";
import { getBrandContextByProjectId } from "../modules/projects/projects.repository.js";
import { createGenerationLog } from "../services/generation-log.service.js";
import { insertPlanItems } from "../modules/plans/plans.repository.js";
import {
  appendPostVersion,
  getOrCreatePost,
  getPlanItemWithPlanContext,
  markPlanItemGenerated
} from "../modules/posts/posts.repository.js";

async function handlePlanJob(job: Job<GeneratePlanJobPayload>): Promise<void> {
  const data = job.data;
  const startedAt = Date.now();

  try {
    const brandContext = await getBrandContextByProjectId(data.projectId);
    if (!brandContext) {
      throw new Error("Brand context missing");
    }

    const response = await requestPlanGeneration({
      project_id: data.projectId,
      period_days: data.periodDays,
      campaign_type: data.campaignType,
      compliance_mode: data.complianceMode,
      brand_context: {
        tone: brandContext.tone,
        audience: brandContext.audience,
        compliance_notes: brandContext.compliance_notes,
        allowed_emojis: brandContext.allowed_emojis
      }
    });

    await insertPlanItems({
      planId: data.planId,
      topics: response.topics
    });

    await createGenerationLog({
      projectId: data.projectId,
      planId: data.planId,
      actionType: "plan_generation",
      provider: response.provider,
      attempts: response.attempts,
      success: true,
      latencyMs: response.latency_ms,
      costUsd: response.cost_usd,
      createdBy: data.actorId
    });

    logger.info({ jobId: job.id, planId: data.planId }, "plan generation job completed");
  } catch (error) {
    await createGenerationLog({
      projectId: data.projectId,
      planId: data.planId,
      actionType: "plan_generation",
      attempts: job.attemptsMade + 1,
      success: false,
      latencyMs: Date.now() - startedAt,
      costUsd: 0,
      errorMessage: error instanceof Error ? error.message : "unknown error",
      createdBy: data.actorId
    });

    throw error;
  }
}

async function handlePostJob(job: Job<GeneratePostJobPayload>): Promise<void> {
  const data = job.data;
  const startedAt = Date.now();

  try {
    const planItem = await getPlanItemWithPlanContext(data.planItemId);
    if (!planItem) {
      throw new Error("Plan item missing");
    }

    const brandContext = await getBrandContextByProjectId(data.projectId);
    if (!brandContext) {
      throw new Error("Brand context missing");
    }

    const response = await requestPostGeneration({
      project_id: data.projectId,
      topic: {
        date: planItem.schedule_date,
        topic: planItem.topic,
        goal: planItem.goal,
        format: planItem.format
      },
      format_type: data.formatType,
      additional_comments: data.additionalComments,
      strict_numbers_mode: data.strictNumbersMode,
      compliance_mode: data.complianceMode,
      brand_context: {
        tone: brandContext.tone,
        audience: brandContext.audience,
        compliance_notes: brandContext.compliance_notes,
        allowed_emojis: brandContext.allowed_emojis
      }
    });

    const post = await getOrCreatePost({
      planItemId: data.planItemId,
      projectId: data.projectId,
      actorId: data.actorId
    });

    const version = await appendPostVersion({
      postId: post.id,
      additionalComments: data.additionalComments,
      strictNumbersMode: data.strictNumbersMode,
      complianceMode: data.complianceMode,
      provider: response.provider,
      costUsd: response.cost_usd,
      content: response.content,
      media: response.media
    });

    await markPlanItemGenerated(data.planItemId);

    await createGenerationLog({
      projectId: data.projectId,
      planId: data.planId,
      planItemId: data.planItemId,
      postId: post.id,
      actionType: "post_generation",
      provider: response.provider,
      attempts: response.attempts,
      success: true,
      latencyMs: response.latency_ms,
      costUsd: response.cost_usd,
      createdBy: data.actorId
    });

    logger.info(
      { jobId: job.id, postId: post.id, version },
      "post generation job completed"
    );
  } catch (error) {
    await createGenerationLog({
      projectId: data.projectId,
      planId: data.planId,
      planItemId: data.planItemId,
      actionType: "post_generation",
      attempts: job.attemptsMade + 1,
      success: false,
      latencyMs: Date.now() - startedAt,
      costUsd: 0,
      errorMessage: error instanceof Error ? error.message : "unknown error",
      createdBy: data.actorId
    });

    throw error;
  }
}

const planWorker = new Worker(
  QUEUE_NAMES.PLAN_GENERATION,
  async (job) => {
    if (job.name !== JOB_NAMES.GENERATE_PLAN) {
      return;
    }
    await handlePlanJob(job as Job<GeneratePlanJobPayload>);
  },
  { connection: redisConnection, concurrency: 4 }
);

const postWorker = new Worker(
  QUEUE_NAMES.POST_GENERATION,
  async (job) => {
    if (job.name !== JOB_NAMES.GENERATE_POST) {
      return;
    }
    await handlePostJob(job as Job<GeneratePostJobPayload>);
  },
  { connection: redisConnection, concurrency: 8 }
);

planWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, err: error }, "plan worker job failed");
});

postWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, err: error }, "post worker job failed");
});

logger.info("queue workers started");
