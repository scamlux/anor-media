import { db } from "../../db/pool.js";

export interface ContentPlanRow {
  id: string;
  project_id: string;
  status: "draft" | "confirmed";
  period_days: number;
  campaign_type: string;
  confirmed_by: string | null;
  confirmed_at: string | null;
}

export interface ContentPlanItemRow {
  id: string;
  plan_id: string;
  date: string;
  topic: string;
  goal: string;
  format: "text" | "image" | "video";
  status: "pending" | "generated";
}

export async function createContentPlan(input: {
  projectId: string;
  periodDays: number;
  campaignType: string;
}): Promise<ContentPlanRow> {
  const result = await db.query<ContentPlanRow>(
    `
      INSERT INTO content_plans(project_id, period_days, campaign_type, status)
      VALUES ($1, $2, $3, 'draft')
      RETURNING *
    `,
    [input.projectId, input.periodDays, input.campaignType]
  );

  return result.rows[0];
}

export async function getPlanById(planId: string): Promise<ContentPlanRow | null> {
  const result = await db.query<ContentPlanRow>("SELECT * FROM content_plans WHERE id = $1", [planId]);
  return result.rows[0] ?? null;
}

export async function listProjectPlans(projectId: string): Promise<ContentPlanRow[]> {
  const result = await db.query<ContentPlanRow>(
    "SELECT * FROM content_plans WHERE project_id = $1 ORDER BY created_at DESC",
    [projectId]
  );
  return result.rows;
}

export async function listPlanItems(planId: string): Promise<ContentPlanItemRow[]> {
  const result = await db.query<ContentPlanItemRow>(
    `
      SELECT
        id,
        plan_id,
        schedule_date::text AS date,
        topic,
        goal,
        format,
        status
      FROM content_plan_items
      WHERE plan_id = $1
      ORDER BY schedule_date ASC
    `,
    [planId]
  );
  return result.rows;
}

export async function insertPlanItems(input: {
  planId: string;
  topics: Array<{ date: string; topic: string; goal: string; format: "text" | "image" | "video" }>;
}): Promise<void> {
  if (!input.topics.length) {
    return;
  }

  const values: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  input.topics.forEach((topic) => {
    values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`);
    params.push(input.planId, topic.date, topic.topic, topic.goal, topic.format);
    paramIndex += 5;
  });

  await db.query(
    `
      INSERT INTO content_plan_items (plan_id, schedule_date, topic, goal, format)
      VALUES ${values.join(",")}
      ON CONFLICT (plan_id, schedule_date) DO UPDATE
      SET topic = EXCLUDED.topic,
          goal = EXCLUDED.goal,
          format = EXCLUDED.format
    `,
    params
  );
}

export async function confirmContentPlan(input: {
  planId: string;
  actorId: string;
}): Promise<ContentPlanRow | null> {
  const result = await db.query<ContentPlanRow>(
    `
      UPDATE content_plans
      SET status = 'confirmed', confirmed_by = $2, confirmed_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [input.planId, input.actorId]
  );

  return result.rows[0] ?? null;
}

export async function getLatestConfirmedPlan(projectId: string): Promise<ContentPlanRow | null> {
  const result = await db.query<ContentPlanRow>(
    `
      SELECT * FROM content_plans
      WHERE project_id = $1 AND status = 'confirmed'
      ORDER BY confirmed_at DESC NULLS LAST
      LIMIT 1
    `,
    [projectId]
  );

  return result.rows[0] ?? null;
}
