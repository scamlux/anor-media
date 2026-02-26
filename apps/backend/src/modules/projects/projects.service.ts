import { HttpError } from "../../utils/http-error.js";
import { createAuditLog } from "../../services/audit-log.service.js";
import {
  getBrandContextByProjectId,
  getProjectById,
  insertBrandContext,
  insertProject,
  listProjects,
  updateBrandContext
} from "./projects.repository.js";

export async function createProject(input: {
  name: string;
  description?: string;
  campaignGoal: string;
  ownerId: string;
  brandContext: {
    tone: string;
    audience: string;
    complianceNotes: string;
    allowedEmojis: boolean;
  };
}): Promise<{ project: unknown; brandContext: unknown }> {
  const project = await insertProject({
    name: input.name,
    description: input.description,
    campaignGoal: input.campaignGoal,
    ownerId: input.ownerId
  });

  const brandContext = await insertBrandContext({
    projectId: project.id,
    tone: input.brandContext.tone,
    audience: input.brandContext.audience,
    complianceNotes: input.brandContext.complianceNotes,
    allowedEmojis: input.brandContext.allowedEmojis
  });

  await createAuditLog({
    actorId: input.ownerId,
    action: "project.create",
    entityType: "project",
    entityId: project.id
  });

  return { project, brandContext };
}

export async function getProject(projectId: string): Promise<{ project: unknown; brandContext: unknown }> {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  const brandContext = await getBrandContextByProjectId(projectId);
  if (!brandContext) {
    throw new HttpError(404, "Brand context not found");
  }

  return { project, brandContext };
}

export async function getProjects(): Promise<unknown[]> {
  return listProjects();
}

export async function updateProjectBrandContext(input: {
  actorId: string;
  projectId: string;
  tone: string;
  audience: string;
  complianceNotes: string;
  allowedEmojis: boolean;
}): Promise<unknown> {
  const updated = await updateBrandContext({
    projectId: input.projectId,
    tone: input.tone,
    audience: input.audience,
    complianceNotes: input.complianceNotes,
    allowedEmojis: input.allowedEmojis
  });

  if (!updated) {
    throw new HttpError(404, "Brand context not found");
  }

  await createAuditLog({
    actorId: input.actorId,
    action: "brand_context.update",
    entityType: "brand_context",
    entityId: updated.id,
    metadata: { projectId: input.projectId }
  });

  return updated;
}
