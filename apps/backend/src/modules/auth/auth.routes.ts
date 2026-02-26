import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validateBody } from "../../middleware/validate-request.js";
import { authMiddleware } from "../../middleware/auth.js";
import { loginSchema } from "./auth.schemas.js";
import { loginController, logoutController, meController } from "./auth.controller.js";

const router = Router();

router.post("/login", validateBody(loginSchema), asyncHandler(loginController));
router.post("/logout", authMiddleware, asyncHandler(logoutController));
router.get("/me", authMiddleware, asyncHandler(meController));

export { router as authRoutes };
