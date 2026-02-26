import { db } from "../../db/pool.js";

export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: "admin" | "editor" | "viewer";
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const result = await db.query<DbUser>("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] ?? null;
}
