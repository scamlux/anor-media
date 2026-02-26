import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/role-guard.js";
import { validateBody } from "../../middleware/validate-request.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { approvalDecisionController } from "./approvals.controller.js";
import { approvalDecisionSchema } from "./approvals.schemas.js";

const router = Router();

router.use(authMiddleware);
router.post(
  "/posts/:id/approval",
  roleGuard(["admin"]),
  validateBody(approvalDecisionSchema),
  asyncHandler(approvalDecisionController)
);

export { router as approvalRoutes };
