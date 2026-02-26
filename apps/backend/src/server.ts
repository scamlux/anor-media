import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { projectRoutes } from "./modules/projects/projects.routes.js";
import { planRoutes } from "./modules/plans/plans.routes.js";
import { postRoutes } from "./modules/posts/posts.routes.js";
import { approvalRoutes } from "./modules/approvals/approvals.routes.js";
import { logRoutes } from "./modules/logs/logs.routes.js";
import { brandBrainRoutes } from "./modules/brand-brain/brand-brain.routes.js";
import { logger } from "./services/logger.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { errorHandler } from "./middleware/error-handler.js";
import { env } from "./config/env.js";
import { getHealthStatus } from "./services/health.service.js";
import { getMetrics, metricsMiddleware } from "./middleware/metrics.js";

export function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.requestId ?? "unknown"
    })
  );
  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(metricsMiddleware);

  app.get("/health", async (_req, res) => {
    const status = await getHealthStatus();
    res.json(status);
  });

  app.get("/metrics", async (_req, res) => {
    if (env.PROMETHEUS_ENABLED !== "true") {
      res.status(404).send("Metrics disabled");
      return;
    }

    res.setHeader("Content-Type", "text/plain");
    res.send(await getMetrics());
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api", planRoutes);
  app.use("/api", postRoutes);
  app.use("/api", approvalRoutes);
  app.use("/api", brandBrainRoutes);
  app.use("/api", logRoutes);

  app.use(errorHandler);

  return app;
}
