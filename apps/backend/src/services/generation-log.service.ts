import { db } from "../db/pool.js";

export async function createGenerationLog(input: {
  projectId: string;
  planId?: string;
  planItemId?: string;
  postId?: string;
  actionType: "plan_generation" | "post_generation";
  provider?: string;
  attempts: number;
  success: boolean;
  latencyMs: number;
  costUsd: number;
  errorMessage?: string;
  createdBy: string;
}): Promise<void> {
  await db.query(
    `
      INSERT INTO generation_logs (
        project_id, plan_id, plan_item_id, post_id, action_type,
        provider, attempts, success, latency_ms, cost_usd,
        error_message, created_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `,
    [
      input.projectId,
      input.planId ?? null,
      input.planItemId ?? null,
      input.postId ?? null,
      input.actionType,
      input.provider ?? null,
      input.attempts,
      input.success,
      input.latencyMs,
      input.costUsd,
      input.errorMessage ?? null,
      input.createdBy
    ]
  );
}
