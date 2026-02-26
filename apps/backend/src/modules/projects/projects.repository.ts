import { db } from "../../db/pool.js";

export interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  campaign_goal: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface BrandContextRow {
  id: string;
  project_id: string;
  tone: string;
  audience: string;
  compliance_notes: string;
  allowed_emojis: boolean;
}

export async function insertProject(input: {
  name: string;
  description?: string;
  campaignGoal: string;
  ownerId: string;
}): Promise<ProjectRow> {
  const result = await db.query<ProjectRow>(
    `
      INSERT INTO projects(name, description, campaign_goal, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [input.name, input.description ?? null, input.campaignGoal, input.ownerId]
  );

  return result.rows[0];
}

export async function insertBrandContext(input: {
  projectId: string;
  tone: string;
  audience: string;
  complianceNotes: string;
  allowedEmojis: boolean;
}): Promise<BrandContextRow> {
  const result = await db.query<BrandContextRow>(
    `
      INSERT INTO brand_contexts(project_id, tone, audience, compliance_notes, allowed_emojis)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [input.projectId, input.tone, input.audience, input.complianceNotes, input.allowedEmojis]
  );

  return result.rows[0];
}

export async function updateBrandContext(input: {
  projectId: string;
  tone: string;
  audience: string;
  complianceNotes: string;
  allowedEmojis: boolean;
}): Promise<BrandContextRow> {
  const result = await db.query<BrandContextRow>(
    `
      UPDATE brand_contexts
      SET tone = $2, audience = $3, compliance_notes = $4, allowed_emojis = $5
      WHERE project_id = $1
      RETURNING *
    `,
    [input.projectId, input.tone, input.audience, input.complianceNotes, input.allowedEmojis]
  );

  return result.rows[0];
}

export async function getProjectById(projectId: string): Promise<ProjectRow | null> {
  const result = await db.query<ProjectRow>("SELECT * FROM projects WHERE id = $1", [projectId]);
  return result.rows[0] ?? null;
}

export async function getBrandContextByProjectId(projectId: string): Promise<BrandContextRow | null> {
  const result = await db.query<BrandContextRow>("SELECT * FROM brand_contexts WHERE project_id = $1", [projectId]);
  return result.rows[0] ?? null;
}

export async function listProjects(): Promise<ProjectRow[]> {
  const result = await db.query<ProjectRow>("SELECT * FROM projects ORDER BY created_at DESC");
  return result.rows;
}
