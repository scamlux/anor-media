import type { Request, Response } from "express";
import { confirmPlan, getProjectPlans, requestPlanGeneration } from "./plans.service.js";

export async function generatePlanController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.id);
  const result = await requestPlanGeneration({
    actorId: req.user!.id,
    projectId,
    periodDays: req.body.period_days,
    campaignType: req.body.campaign_type,
    complianceMode: req.body.compliance_mode
  });

  res.status(202).json({
    plan_id: result.planId,
    status: result.status,
    queue_job_id: result.queueJobId
  });
}

export async function confirmPlanController(req: Request, res: Response): Promise<void> {
  const result = await confirmPlan({
    actorId: req.user!.id,
    planId: req.body.plan_id
  });

  res.json(result);
}

export async function listProjectPlansController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.id);
  const plans = await getProjectPlans(projectId);
  res.json({ plans });
}
