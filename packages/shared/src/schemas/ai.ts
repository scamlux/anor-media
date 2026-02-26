import { z } from "zod";

export const contentPlanTopicSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  topic: z.string().min(1),
  goal: z.string().min(1),
  format: z.enum(["text", "image", "video"])
});

export const contentPlanSchema = z.object({
  topics: z.array(contentPlanTopicSchema).min(1)
});

export const postJsonSchema = z.object({
  hook: z.string().min(1),
  main_text: z.string().min(1),
  cta: z.string().min(1),
  hashtags: z.array(z.string().min(1)).min(1),
  visual_prompt: z.string().min(1)
});

export const generatePlanRequestSchema = z.object({
  period_days: z.number().int().min(1).max(90),
  campaign_type: z.string().min(1),
  compliance_mode: z.boolean().default(true)
});

export const generatePostRequestSchema = z.object({
  format_type: z.string().min(1),
  additional_comments: z.string().min(1),
  strict_numbers_mode: z.boolean(),
  compliance_mode: z.boolean().default(true)
});
