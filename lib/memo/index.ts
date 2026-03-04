import { callLLM } from "../llm";
import type { ModuleOutput, FinalScore } from "../schemas/module";
import type { UserInput } from "../schemas/input";

const SYSTEM_PROMPT = `You are a senior venture capital analyst writing an investment memo.
Write clear, professional markdown. Use ## for section headers.
Do NOT use em dashes (--) or (---) anywhere.
Do NOT use bullet points for everything - mix in prose paragraphs.
Be specific and reference actual data from the module analyses.
Structure: Executive Summary, Market Analysis, Competitive Landscape, Monetization Assessment, Execution Risk, Score Breakdown, Recommended Next Steps.`;

export async function generateMemo(
  input: UserInput,
  modules: ModuleOutput[],
  score: FinalScore
): Promise<string> {
  const modulesSummary = modules
    .map(
      (m) => `### ${m.module_name} (${m.score}/${m.max_score}, ${m.confidence} confidence)
${m.summary}
Risks: ${m.risks.join("; ")}
Opportunities: ${m.opportunities.join("; ")}`
    )
    .join("\n\n");

  const userPrompt = `Write an investment memo for the following startup idea.

## STARTUP BRIEF
Name: ${input.idea_name}
Description: ${input.description}
Target Customer: ${input.target_customer}
Customer Pain: ${input.customer_pain}
Business Model: ${input.business_model}
Geography: ${input.target_geo}
Pricing: ${input.planned_pricing || "TBD"}
Timeline: ${input.timeline_months} months
Budget: ${input.budget_range || "TBD"}

## ANALYSIS RESULTS
Overall Score: ${score.weighted_score}/100 (${score.grade})
Risk Deduction: -${score.risk_deduction} points
Confidence: ${score.confidence}

${modulesSummary}

## TOP STRENGTHS
${score.top_reasons.join("\n")}

## TOP RISKS
${score.top_risks.join("\n")}

Write the full investment memo now. Use markdown formatting. Do not use em dashes.`;

  const memo = await callLLM(SYSTEM_PROMPT, userPrompt);
  return memo;
}
