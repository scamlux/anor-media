import jwt from "jsonwebtoken";
import type { AuthUser } from "@anor/shared";
import { env } from "../config/env.js";

interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  role: AuthUser["role"];
}

export function signToken(user: AuthUser): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
}

export function verifyToken(token: string): AuthUser {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  return {
    id: decoded.sub,
    email: decoded.email,
    fullName: decoded.fullName,
    role: decoded.role
  };
}
