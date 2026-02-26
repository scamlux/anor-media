import { HttpError } from "../../utils/http-error.js";
import { createAuditLog } from "../../services/audit-log.service.js";
import { getPostCurrentVersion, insertApproval, updatePostStatus } from "./approvals.repository.js";

export async function decideApproval(input: {
  actorId: string;
  postId: string;
  decision: "approved" | "rejected";
  comment?: string;
}): Promise<void> {
  const post = await getPostCurrentVersion(input.postId);
  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  if (post.current_version === 0) {
    throw new HttpError(400, "Post has no generated version");
  }

  if (input.decision === "rejected" && !input.comment?.trim()) {
    throw new HttpError(400, "Rejection comment is required");
  }

  await insertApproval({
    postId: input.postId,
    version: post.current_version,
    decision: input.decision,
    comment: input.comment,
    actorId: input.actorId
  });

  await updatePostStatus({ postId: input.postId, status: input.decision });

  await createAuditLog({
    actorId: input.actorId,
    action: `post.${input.decision}`,
    entityType: "post",
    entityId: input.postId,
    metadata: { version: post.current_version, comment: input.comment ?? null }
  });
}
