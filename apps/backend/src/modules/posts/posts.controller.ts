import type { Request, Response } from "express";
import {
  getPostVersions,
  getProjectCalendar,
  requestPostGeneration,
  submitPostForApproval
} from "./posts.service.js";

export async function generatePostController(req: Request, res: Response): Promise<void> {
  const planItemId = String(req.params.id);
  const result = await requestPostGeneration({
    actorId: req.user!.id,
    planItemId,
    formatType: req.body.format_type,
    additionalComments: req.body.additional_comments,
    strictNumbersMode: req.body.strict_numbers_mode,
    complianceMode: req.body.compliance_mode
  });

  res.status(202).json({
    post_id: result.postId,
    status: result.status,
    queue_job_id: result.queueJobId
  });
}

export async function submitApprovalController(req: Request, res: Response): Promise<void> {
  const postId = String(req.params.id);
  await submitPostForApproval({
    actorId: req.user!.id,
    postId
  });

  res.status(204).send();
}

export async function postVersionsController(req: Request, res: Response): Promise<void> {
  const postId = String(req.params.id);
  const versions = await getPostVersions(postId);
  res.json({ versions });
}

export async function calendarController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.projectId);
  const items = await getProjectCalendar(projectId);
  res.json({ items });
}
