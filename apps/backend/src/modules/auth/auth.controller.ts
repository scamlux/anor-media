import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { signToken } from "../../services/jwt.js";
import { createAuditLog } from "../../services/audit-log.service.js";
import { login } from "./auth.service.js";

export async function loginController(req: Request, res: Response): Promise<void> {
  const user = await login(req.body.email, req.body.password);
  const token = signToken(user);

  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60 * 1000
  });

  await createAuditLog({
    actorId: user.id,
    action: "auth.login",
    entityType: "user",
    entityId: user.id
  });

  res.json({ user });
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  if (req.user) {
    await createAuditLog({
      actorId: req.user.id,
      action: "auth.logout",
      entityType: "user",
      entityId: req.user.id
    });
  }

  res.clearCookie(env.COOKIE_NAME);
  res.status(204).send();
}

export async function meController(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({ user: req.user });
}
