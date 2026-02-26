import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/role-guard.js";
import { validateBody } from "../../middleware/validate-request.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  createProjectController,
  getProjectController,
  listProjectsController,
  updateBrandContextController
} from "./projects.controller.js";
import { createProjectSchema, updateBrandContextSchema } from "./projects.schemas.js";

const router = Router();

router.use(authMiddleware);
router.get("/", asyncHandler(listProjectsController));
router.post("/", roleGuard(["admin", "editor"]), validateBody(createProjectSchema), asyncHandler(createProjectController));
router.get("/:id", asyncHandler(getProjectController));
router.put(
  "/:id/brand-context",
  roleGuard(["admin", "editor"]),
  validateBody(updateBrandContextSchema),
  asyncHandler(updateBrandContextController)
);

export { router as projectRoutes };
