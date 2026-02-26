import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/role-guard.js";
import { validateBody } from "../../middleware/validate-request.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  calendarController,
  generatePostController,
  postVersionsController,
  submitApprovalController
} from "./posts.controller.js";
import { generatePostSchema, submitForApprovalSchema } from "./posts.schemas.js";

const router = Router();

router.use(authMiddleware);
router.get("/projects/:projectId/calendar", asyncHandler(calendarController));
router.post(
  "/plan-items/:id/generate",
  roleGuard(["admin", "editor"]),
  validateBody(generatePostSchema),
  asyncHandler(generatePostController)
);
router.post(
  "/posts/:id/submit-approval",
  roleGuard(["admin", "editor"]),
  validateBody(submitForApprovalSchema),
  asyncHandler(submitApprovalController)
);
router.get("/posts/:id/versions", asyncHandler(postVersionsController));

export { router as postRoutes };
