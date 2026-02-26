import { db } from "../db/pool.js";

export async function getHealthStatus(): Promise<{ status: string; database: string; timestamp: string }> {
  try {
    await db.query("SELECT 1");
    return { status: "ok", database: "up", timestamp: new Date().toISOString() };
  } catch {
    return { status: "degraded", database: "down", timestamp: new Date().toISOString() };
  }
}
