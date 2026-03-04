import { z } from "zod";

export const BusinessModelEnum = z.enum([
  "SaaS",
  "Marketplace",
  "D2C",
  "B2B Services",
  "Hardware",
  "API/Infrastructure",
  "Consumer App",
  "Other",
]);

export const UserInputSchema = z.object({
  idea_name: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  target_customer: z.string().min(1).max(500),
  customer_pain: z.string().min(10).max(1000),
  business_model: BusinessModelEnum,
  target_geo: z.string().min(1).max(200),
  planned_pricing: z.string().max(500).optional(),
  timeline_months: z.number().int().min(1).max(120),
  budget_range: z.string().max(200).optional(),
});

export type UserInput = z.infer<typeof UserInputSchema>;
export type BusinessModel = z.infer<typeof BusinessModelEnum>;
