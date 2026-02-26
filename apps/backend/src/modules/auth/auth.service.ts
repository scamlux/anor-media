import bcrypt from "bcryptjs";
import type { AuthUser } from "@anor/shared";
import { HttpError } from "../../utils/http-error.js";
import { findUserByEmail } from "./auth.repository.js";

export async function login(email: string, password: string): Promise<AuthUser> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new HttpError(401, "Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role
  };
}
