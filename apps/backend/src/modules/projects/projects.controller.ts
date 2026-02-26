import type { Request, Response } from "express";
import {
  createProject,
  getProject,
  getProjects,
  updateProjectBrandContext
} from "./projects.service.js";

export async function createProjectController(req: Request, res: Response): Promise<void> {
  const result = await createProject({
    name: req.body.name,
    description: req.body.description,
    campaignGoal: req.body.campaign_goal,
    ownerId: req.user!.id,
    brandContext: {
      tone: req.body.brand_context.tone,
      audience: req.body.brand_context.audience,
      complianceNotes: req.body.brand_context.compliance_notes,
      allowedEmojis: req.body.brand_context.allowed_emojis
    }
  });

  res.status(201).json(result);
}

export async function listProjectsController(_req: Request, res: Response): Promise<void> {
  const projects = await getProjects();
  res.json({ projects });
}

export async function getProjectController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.id);
  const result = await getProject(projectId);
  res.json(result);
}

export async function updateBrandContextController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.id);
  const brandContext = await updateProjectBrandContext({
    actorId: req.user!.id,
    projectId,
    tone: req.body.tone,
    audience: req.body.audience,
    complianceNotes: req.body.compliance_notes,
    allowedEmojis: req.body.allowed_emojis
  });

  res.json({ brandContext });
}
