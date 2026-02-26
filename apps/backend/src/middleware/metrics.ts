import client from "prom-client";
import type { NextFunction, Request, Response } from "express";
import { Queue } from "bullmq";
import { redisConnection } from "../queues/connection.js";
import { QUEUE_NAMES } from "../constants/queues.js";
import { db } from "../db/pool.js";

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const requestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status"] as const,
  buckets: [50, 100, 200, 500, 1000, 2000, 5000]
});

registry.registerMetric(requestDuration);

const queueBacklogGauge = new client.Gauge({
  name: "queue_backlog_count",
  help: "Queue backlog size by queue name",
  labelNames: ["queue_name"] as const
});

const generationCostGauge = new client.Gauge({
  name: "generation_cost_total_usd",
  help: "Total generation cost in USD"
});

registry.registerMetric(queueBacklogGauge);
registry.registerMetric(generationCostGauge);

const planQueue = new Queue(QUEUE_NAMES.PLAN_GENERATION, { connection: redisConnection });
const postQueue = new Queue(QUEUE_NAMES.POST_GENERATION, { connection: redisConnection });

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - start;
    requestDuration
      .labels(req.method, req.route?.path ?? req.path, String(res.statusCode))
      .observe(duration);
  });

  next();
}

export async function getMetrics(): Promise<string> {
  const [planCounts, postCounts, costResult] = await Promise.all([
    planQueue.getJobCounts("waiting", "active", "delayed"),
    postQueue.getJobCounts("waiting", "active", "delayed"),
    db.query<{ total: string }>("SELECT COALESCE(SUM(cost_usd), 0)::text AS total FROM generation_logs")
  ]);

  queueBacklogGauge.set(
    { queue_name: QUEUE_NAMES.PLAN_GENERATION },
    (planCounts.waiting ?? 0) + (planCounts.active ?? 0) + (planCounts.delayed ?? 0)
  );
  queueBacklogGauge.set(
    { queue_name: QUEUE_NAMES.POST_GENERATION },
    (postCounts.waiting ?? 0) + (postCounts.active ?? 0) + (postCounts.delayed ?? 0)
  );
  generationCostGauge.set(Number(costResult.rows[0]?.total ?? "0"));

  return registry.metrics();
}
