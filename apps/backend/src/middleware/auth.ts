import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { verifyToken } from "../services/jwt.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.user = verifyToken(token);
  next();
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) {
    next();
    return;
  }

  try {
    req.user = verifyToken(token);
  } catch {
    req.user = undefined;
  }

  next();
}
