import { z } from "zod";

export const brandBrainSchema = z.object({
  tone: z.string().min(2),
  audience: z.string().min(2),
  compliance_notes: z.string().min(2),
  allowed_emojis: z.boolean()
});
