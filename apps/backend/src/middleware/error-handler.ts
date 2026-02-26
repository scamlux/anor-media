import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { logger } from "../services/logger.js";
import { HttpError } from "../utils/http-error.js";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.flatten(),
      requestId: req.requestId
    });
    return;
  }

  if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ message: "Unauthorized", requestId: req.requestId });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
      requestId: req.requestId
    });
    return;
  }

  logger.error({ err: error, requestId: req.requestId }, "unhandled error");
  res.status(500).json({ message: "Internal server error", requestId: req.requestId });
}
