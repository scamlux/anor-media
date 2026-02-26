import { db } from "../../db/pool.js";

export async function listGenerationLogs(projectId: string): Promise<unknown[]> {
  const result = await db.query(
    `
      SELECT id, action_type, provider, attempts, success, latency_ms, cost_usd::text,
             error_message, created_by, created_at, plan_id, plan_item_id, post_id
      FROM generation_logs
      WHERE project_id = $1
      ORDER BY created_at DESC
      LIMIT 200
    `,
    [projectId]
  );
  return result.rows;
}

export async function listAuditLogs(projectId: string): Promise<unknown[]> {
  const result = await db.query(
    `
      SELECT a.*
      FROM audit_logs a
      LEFT JOIN projects p ON p.id = a.entity_id
      WHERE p.id = $1 OR (a.metadata ? 'projectId' AND a.metadata->>'projectId' = $1::text)
      ORDER BY a.created_at DESC
      LIMIT 300
    `,
    [projectId]
  );

  return result.rows;
}
