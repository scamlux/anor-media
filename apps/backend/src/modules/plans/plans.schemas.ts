import { z } from "zod";
import { generatePlanRequestSchema } from "@anor/shared";

export const generatePlanSchema = generatePlanRequestSchema;

export const confirmPlanSchema = z.object({
  plan_id: z.string().uuid()
});
