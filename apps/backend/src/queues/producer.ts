import { Queue } from "bullmq";
import { QUEUE_NAMES, JOB_NAMES } from "../constants/queues.js";
import { redisConnection } from "./connection.js";
import type { GeneratePlanJobPayload, GeneratePostJobPayload } from "./types.js";

const planQueue = new Queue<GeneratePlanJobPayload, void, typeof JOB_NAMES.GENERATE_PLAN>(QUEUE_NAMES.PLAN_GENERATION, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: 100
  }
});

const postQueue = new Queue<GeneratePostJobPayload, void, typeof JOB_NAMES.GENERATE_POST>(QUEUE_NAMES.POST_GENERATION, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: 100
  }
});

export async function enqueuePlanGeneration(payload: GeneratePlanJobPayload): Promise<string> {
  const job = await planQueue.add(JOB_NAMES.GENERATE_PLAN, payload);
  return job.id ?? "unknown";
}

export async function enqueuePostGeneration(payload: GeneratePostJobPayload): Promise<string> {
  const job = await postQueue.add(JOB_NAMES.GENERATE_POST, payload);
  return job.id ?? "unknown";
}
