import type { Request, Response } from "express";
import { getProjectLogs } from "./logs.service.js";

export async function projectLogsController(req: Request, res: Response): Promise<void> {
  const projectId = String(req.params.projectId);
  const logs = await getProjectLogs(projectId);
  res.json(logs);
}
