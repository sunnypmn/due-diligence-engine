import { callLLM } from "../llm";
import type { UserInput } from "../schemas/input";
import type { FinalScore } from "../schemas/module";

const SYSTEM_PROMPT = `You are a senior business consultant writing a comprehensive, investor-ready business plan.
Be specific, quantitative, and actionable. Use realistic numbers based on the business model and market.
Write in clear markdown with ## section headers. Do not use em dashes.
Tables are encouraged for financial projections and SWOT.`;

export async function generateBusinessPlan(
  input: UserInput,
  score: FinalScore
): Promise<string> {
  const userPrompt = `Generate a full business plan for this startup:

**IDEA:** ${input.idea_name}
**DESCRIPTION:** ${input.description}
**TARGET CUSTOMER:** ${input.target_customer}
**CUSTOMER PAIN:** ${input.customer_pain}
**BUSINESS MODEL:** ${input.business_model}
**GEOGRAPHY:** ${input.target_geo}
**PRICING:** ${input.planned_pricing || "TBD"}
**TIMELINE:** ${input.timeline_months} months
**BUDGET:** ${input.budget_range || "TBD"}
**VALIDATION SCORE:** ${score.weighted_score}/100 (${score.grade})

Write the following sections in full detail:

## Executive Summary
2-3 paragraphs covering the opportunity, solution, target market, business model, and ask.

## SWOT Analysis
A markdown table with 4 rows (Strengths, Weaknesses, Opportunities, Threats), each with 3-4 specific bullet points.

## Go-To-Market Strategy
Phased GTM plan (Phase 1: 0-3 months, Phase 2: 3-9 months, Phase 3: 9-18 months). Include specific channels, tactics, and success metrics per phase.

## Marketing Strategy
Positioning statement, target ICP, messaging pillars, channel mix (organic/paid/partnerships), content strategy, and estimated budget allocation by channel.

## Financial Plan
- 3-year revenue projections table (Year 1, Year 2, Year 3) with rows for: Customers, ARR/Revenue, COGS, Gross Margin, OpEx, Net Income
- Key assumptions listed below the table
- Unit economics: CAC, LTV, LTV:CAC ratio, payback period
- Break-even analysis

## 90-Day Action Plan
Prioritized table of milestones with columns: Week, Milestone, Owner, Success Metric`;

  return callLLM(SYSTEM_PROMPT, userPrompt);
}
