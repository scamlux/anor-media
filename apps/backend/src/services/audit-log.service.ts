import { db } from "../db/pool.js";

interface AuditLogInput {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
  await db.query(
    `
      INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [input.actorId, input.action, input.entityType, input.entityId ?? null, JSON.stringify(input.metadata ?? {})]
  );
}
