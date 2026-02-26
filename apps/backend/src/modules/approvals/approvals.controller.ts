import type { Request, Response } from "express";
import { decideApproval } from "./approvals.service.js";

export async function approvalDecisionController(req: Request, res: Response): Promise<void> {
  const postId = String(req.params.id);
  await decideApproval({
    actorId: req.user!.id,
    postId,
    decision: req.body.decision,
    comment: req.body.comment
  });

  res.status(204).send();
}
