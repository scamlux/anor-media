import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { z } from "zod";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../../.env")
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("8h"),
  COOKIE_NAME: z.string().default("anor_token"),
  AI_ORCHESTRATOR_URL: z.string().url(),
  AI_ORCHESTRATOR_API_KEY: z.string().min(1),
  LOG_LEVEL: z.string().default("info"),
  PLAN_PERIOD_MAX_DAYS: z.coerce.number().default(90),
  POST_GENERATION_DAILY_LIMIT: z.coerce.number().default(20),
  PROJECT_COST_MONTHLY_LIMIT: z.coerce.number().default(1000),
  PROMETHEUS_ENABLED: z.string().default("true")
});

export const env = envSchema.parse(process.env);
