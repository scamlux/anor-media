import fs from "node:fs/promises";
import path from "node:path";
import { db } from "./pool.js";
import { logger } from "../services/logger.js";

async function run(): Promise<void> {
  const migrationsDir = path.resolve(process.cwd(), "src/db/migrations");
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  for (const file of files) {
    const exists = await db.query("SELECT 1 FROM schema_migrations WHERE filename = $1", [file]);
    if (exists.rowCount) {
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    logger.info({ file }, "applying migration");
    await db.query("BEGIN");
    try {
      await db.query(sql);
      await db.query("INSERT INTO schema_migrations(filename) VALUES ($1)", [file]);
      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }

  await db.end();
  logger.info("migrations complete");
}

run().catch((error) => {
  logger.error({ err: error }, "migration failed");
  process.exit(1);
});
