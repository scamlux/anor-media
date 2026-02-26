import { HttpError } from "../../utils/http-error.js";
import { createAuditLog } from "../../services/audit-log.service.js";
import {
  getBrandContextByProjectId,
  updateBrandContext
} from "../projects/projects.repository.js";

export async function getBrandBrain(projectId: string): Promise<unknown> {
  const context = await getBrandContextByProjectId(projectId);
  if (!context) {
    throw new HttpError(404, "Brand context not found");
  }
  return context;
}

export async function updateBrandBrain(input: {
  actorId: string;
  projectId: string;
  tone: string;
  audience: string;
  complianceNotes: string;
  allowedEmojis: boolean;
}): Promise<unknown> {
  const context = await updateBrandContext({
    projectId: input.projectId,
    tone: input.tone,
    audience: input.audience,
    complianceNotes: input.complianceNotes,
    allowedEmojis: input.allowedEmojis
  });

  if (!context) {
    throw new HttpError(404, "Brand context not found");
  }

  await createAuditLog({
    actorId: input.actorId,
    action: "brand_brain.updated",
    entityType: "brand_context",
    entityId: context.id,
    metadata: { projectId: input.projectId }
  });

  return context;
}
