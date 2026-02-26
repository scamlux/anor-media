import { db } from "../../db/pool.js";

export interface PlanItemWithContextRow {
  id: string;
  plan_id: string;
  project_id: string;
  plan_status: "draft" | "confirmed";
  schedule_date: string;
  topic: string;
  goal: string;
  format: "text" | "image" | "video";
}

export interface PostRow {
  id: string;
  plan_item_id: string;
  project_id: string;
  status: "draft" | "pending_approval" | "approved" | "rejected";
  current_version: number;
}

export async function getPlanItemWithPlanContext(planItemId: string): Promise<PlanItemWithContextRow | null> {
  const result = await db.query<PlanItemWithContextRow>(
    `
      SELECT
        i.id,
        i.plan_id,
        p.project_id,
        p.status AS plan_status,
        i.schedule_date,
        i.topic,
        i.goal,
        i.format
      FROM content_plan_items i
      JOIN content_plans p ON p.id = i.plan_id
      WHERE i.id = $1
    `,
    [planItemId]
  );

  return result.rows[0] ?? null;
}

export async function getOrCreatePost(input: {
  planItemId: string;
  projectId: string;
  actorId: string;
}): Promise<PostRow> {
  const existing = await db.query<PostRow>("SELECT * FROM posts WHERE plan_item_id = $1", [input.planItemId]);
  if (existing.rowCount) {
    return existing.rows[0];
  }

  const created = await db.query<PostRow>(
    `
      INSERT INTO posts(plan_item_id, project_id, created_by, status, current_version)
      VALUES ($1, $2, $3, 'draft', 0)
      RETURNING *
    `,
    [input.planItemId, input.projectId, input.actorId]
  );

  return created.rows[0];
}

export async function listPostVersions(postId: string): Promise<Array<{ version: number; content: unknown; media: unknown; cost_usd: string; created_at: string }>> {
  const result = await db.query<Array<{ version: number; content: unknown; media: unknown; cost_usd: string; created_at: string }>[number]>(
    `
      SELECT version, content, media, cost_usd::text, created_at
      FROM post_versions
      WHERE post_id = $1
      ORDER BY version DESC
    `,
    [postId]
  );

  return result.rows;
}

export async function listCalendarByProject(projectId: string): Promise<unknown[]> {
  const result = await db.query(
    `
      SELECT
        i.id AS plan_item_id,
        i.schedule_date,
        i.topic,
        i.goal,
        i.format,
        p.status AS plan_status,
        ps.id AS post_id,
        ps.status AS post_status,
        ps.current_version
      FROM content_plan_items i
      JOIN content_plans p ON p.id = i.plan_id
      LEFT JOIN posts ps ON ps.plan_item_id = i.id
      WHERE p.project_id = $1
      ORDER BY i.schedule_date ASC
    `,
    [projectId]
  );

  return result.rows;
}

export async function updatePostStatus(input: { postId: string; status: PostRow["status"] }): Promise<void> {
  await db.query("UPDATE posts SET status = $2 WHERE id = $1", [input.postId, input.status]);
}

export async function countDailyPostGenerations(projectId: string): Promise<number> {
  const result = await db.query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM generation_logs
      WHERE project_id = $1
      AND action_type = 'post_generation'
      AND created_at::date = NOW()::date
      AND success = true
    `,
    [projectId]
  );

  return Number(result.rows[0]?.count ?? "0");
}

export async function getMonthlyProjectCost(projectId: string): Promise<number> {
  const result = await db.query<{ total_cost: string }>(
    `
      SELECT COALESCE(SUM(cost_usd), 0)::text AS total_cost
      FROM generation_logs
      WHERE project_id = $1
      AND created_at >= date_trunc('month', NOW())
    `,
    [projectId]
  );

  return Number(result.rows[0]?.total_cost ?? "0");
}

export async function findPostById(postId: string): Promise<PostRow | null> {
  const result = await db.query<PostRow>("SELECT * FROM posts WHERE id = $1", [postId]);
  return result.rows[0] ?? null;
}

export async function markPlanItemGenerated(planItemId: string): Promise<void> {
  await db.query("UPDATE content_plan_items SET status = 'generated' WHERE id = $1", [planItemId]);
}

export async function appendPostVersion(input: {
  postId: string;
  additionalComments: string;
  strictNumbersMode: boolean;
  complianceMode: boolean;
  provider: string;
  costUsd: number;
  content: {
    hook: string;
    main_text: string;
    cta: string;
    hashtags: string[];
    visual_prompt: string;
  };
  media: Array<{ type: "image" | "video"; url: string }>;
}): Promise<number> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query<{ current_version: number }>(
      "SELECT current_version FROM posts WHERE id = $1 FOR UPDATE",
      [input.postId]
    );

    if (!current.rowCount) {
      throw new Error("Post not found while appending version");
    }

    const nextVersion = current.rows[0].current_version + 1;

    await client.query(
      `
        INSERT INTO post_versions (
          post_id, version, content, media, additional_comments,
          strict_numbers_mode, compliance_mode, generation_provider, cost_usd
        )
        VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7,$8,$9)
      `,
      [
        input.postId,
        nextVersion,
        JSON.stringify(input.content),
        JSON.stringify(input.media),
        input.additionalComments,
        input.strictNumbersMode,
        input.complianceMode,
        input.provider,
        input.costUsd
      ]
    );

    await client.query(
      "UPDATE posts SET current_version = $2, status = 'draft' WHERE id = $1",
      [input.postId, nextVersion]
    );

    await client.query("COMMIT");
    return nextVersion;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
