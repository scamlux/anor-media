import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/role-guard.js";
import { validateBody } from "../../middleware/validate-request.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { confirmPlanController, generatePlanController, listProjectPlansController } from "./plans.controller.js";
import { confirmPlanSchema, generatePlanSchema } from "./plans.schemas.js";

const router = Router();

router.use(authMiddleware);
router.get("/projects/:id/plans", asyncHandler(listProjectPlansController));
router.post(
  "/projects/:id/generate-plan",
  roleGuard(["admin", "editor"]),
  validateBody(generatePlanSchema),
  asyncHandler(generatePlanController)
);
router.post(
  "/projects/:id/confirm-plan",
  roleGuard(["admin", "editor"]),
  validateBody(confirmPlanSchema),
  asyncHandler(confirmPlanController)
);

export { router as planRoutes };
