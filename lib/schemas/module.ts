import { z } from "zod";

export const ConfidenceEnum = z.enum(["Low", "Medium", "High"]);

export const EvidenceItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
});

export const ModuleOutputSchema = z.object({
  module_name: z.string(),
  score: z.number().min(0),
  max_score: z.number().positive(),
  confidence: ConfidenceEnum,
  summary: z.string(),
  evidence: z.array(EvidenceItemSchema),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
});

export const FinalScoreSchema = z.object({
  weighted_score: z.number().min(0).max(100),
  grade: z.enum(["Tier 1", "Strong", "Promising", "Marginal", "Pass"]),
  confidence: ConfidenceEnum,
  risk_deduction: z.number().min(0).max(10),
  top_reasons: z.array(z.string()),
  top_risks: z.array(z.string()),
});

export const FinalOutputSchema = z.object({
  input: z.object({
    idea_name: z.string(),
    description: z.string(),
    target_customer: z.string(),
    customer_pain: z.string(),
    business_model: z.string(),
    target_geo: z.string(),
    planned_pricing: z.string().optional(),
    timeline_months: z.number(),
    budget_range: z.string().optional(),
  }),
  modules: z.array(ModuleOutputSchema),
  score: FinalScoreSchema,
  memo: z.string(),
  generated_at: z.string(),
});

export type Confidence = z.infer<typeof ConfidenceEnum>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type ModuleOutput = z.infer<typeof ModuleOutputSchema>;
export type FinalScore = z.infer<typeof FinalScoreSchema>;
export type FinalOutput = z.infer<typeof FinalOutputSchema>;
