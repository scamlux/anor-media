import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  campaign_goal: z.string().min(3),
  brand_context: z.object({
    tone: z.string().min(2),
    audience: z.string().min(2),
    compliance_notes: z.string().min(2),
    allowed_emojis: z.boolean().default(false)
  })
});

export const updateBrandContextSchema = z.object({
  tone: z.string().min(2),
  audience: z.string().min(2),
  compliance_notes: z.string().min(2),
  allowed_emojis: z.boolean()
});
