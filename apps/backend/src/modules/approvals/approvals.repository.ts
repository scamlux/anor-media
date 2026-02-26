import { db } from "../../db/pool.js";

export async function getPostCurrentVersion(postId: string): Promise<{ id: string; current_version: number } | null> {
  const result = await db.query<{ id: string; current_version: number }>(
    "SELECT id, current_version FROM posts WHERE id = $1",
    [postId]
  );

  return result.rows[0] ?? null;
}

export async function insertApproval(input: {
  postId: string;
  version: number;
  decision: "approved" | "rejected";
  comment?: string;
  actorId: string;
}): Promise<void> {
  await db.query(
    `
      INSERT INTO approvals(post_id, version, decision, comment, decided_by)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [input.postId, input.version, input.decision, input.comment ?? null, input.actorId]
  );
}

export async function updatePostStatus(input: {
  postId: string;
  status: "approved" | "rejected";
}): Promise<void> {
  await db.query("UPDATE posts SET status = $2 WHERE id = $1", [input.postId, input.status]);
}
