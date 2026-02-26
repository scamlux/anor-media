import { z } from "zod";
import { generatePostRequestSchema } from "@anor/shared";

export const generatePostSchema = generatePostRequestSchema;

export const submitForApprovalSchema = z.object({
  status: z.literal("pending_approval")
});
