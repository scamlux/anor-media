import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { projectLogsController } from "./logs.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/projects/:projectId/logs", asyncHandler(projectLogsController));

export { router as logRoutes };
