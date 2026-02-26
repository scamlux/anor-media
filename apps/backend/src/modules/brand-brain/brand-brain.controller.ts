import type { Request, Response } from "express";
import { getBrandBrain, updateBrandBrain } from "./brand-brain.service.js";

export async function getBrandBrainController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.projectId);
  const brandBrain = await getBrandBrain(projectId);
  res.json({ brandBrain });
}

export async function updateBrandBrainController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.projectId);
  const brandBrain = await updateBrandBrain({
    actorId: req.user!.id,
    projectId,
    tone: req.body.tone,
    audience: req.body.audience,
    complianceNotes: req.body.compliance_notes,
    allowedEmojis: req.body.allowed_emojis
  });

  res.json({ brandBrain });
}
