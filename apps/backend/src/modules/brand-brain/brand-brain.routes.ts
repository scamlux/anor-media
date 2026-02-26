import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/role-guard.js";
import { validateBody } from "../../middleware/validate-request.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { brandBrainSchema } from "./brand-brain.schemas.js";
import { getBrandBrainController, updateBrandBrainController } from "./brand-brain.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/projects/:projectId/brand-brain", asyncHandler(getBrandBrainController));
router.put(
  "/projects/:projectId/brand-brain",
  roleGuard(["admin", "editor"]),
  validateBody(brandBrainSchema),
  asyncHandler(updateBrandBrainController)
);

export { router as brandBrainRoutes };
