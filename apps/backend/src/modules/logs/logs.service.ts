import { listAuditLogs, listGenerationLogs } from "./logs.repository.js";

export async function getProjectLogs(projectId: string): Promise<{ generationLogs: unknown[]; auditLogs: unknown[] }> {
  const [generationLogs, auditLogs] = await Promise.all([
    listGenerationLogs(projectId),
    listAuditLogs(projectId)
  ]);

  return { generationLogs, auditLogs };
}
