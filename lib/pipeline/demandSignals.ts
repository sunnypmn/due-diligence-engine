import { search } from "../serp";
import { callModuleWithRetry } from "../llm";
import type { UserInput } from "../schemas/input";
import type { ModuleOutput } from "../schemas/module";

const SYSTEM_PROMPT = `You are a market demand analyst performing early-stage startup due diligence.
Your task is to assess pain severity and demand momentum from search results.

You MUST return ONLY valid JSON with no other text. The JSON must match this exact schema:
{
  "module_name": "Demand Signals",
  "score": <number 0-30>,
  "max_score": 30,
  "confidence": <"Low" | "Medium" | "High">,
  "summary": "<2-3 sentence summary covering pain evidence AND momentum signals>",
  "evidence": [
    { "title": "<result title>", "url": "<url>", "snippet": "<relevant excerpt>" }
  ],
  "risks": ["<risk 1>", "<risk 2>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"]
}

This module covers TWO dimensions (total max 30):
1. Market Demand / Pain Evidence (max 20 points):
   - Clear, documented pain with quantified impact: 16-20
   - Pain evidenced by multiple sources but not quantified: 10-15
   - Anecdotal or unclear pain signals: 4-9
   - No meaningful evidence: 0-3

2. Momentum Signals (max 10 points):
   - Recent articles (2023-2025), growing search interest, funded competitors: 8-10
   - Some recent activity, mixed signals: 4-7
   - Old or stale results, declining interest: 0-3

Combine both into a single score (sum of both dimensions). Include up to 3 evidence items.`;

export async function runDemandSignals(input: UserInput): Promise<ModuleOutput> {
  const query = `${input.customer_pain} ${input.target_customer} problem solution`;
  const results = await search(query);

  const serpContext = results
    .slice(0, 5)
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet}`)
    .join("\n\n");

  const userPrompt = `Assess market demand and momentum signals for this startup:

IDEA: ${input.idea_name}
DESCRIPTION: ${input.description}
TARGET CUSTOMER: ${input.target_customer}
CUSTOMER PAIN: ${input.customer_pain}
BUSINESS MODEL: ${input.business_model}
TARGET GEOGRAPHY: ${input.target_geo}

SEARCH RESULTS (query: "${query}"):
${serpContext || "No results found. Assume low data availability."}

Evaluate both:
1. Pain evidence strength (how real and documented is the problem?)
2. Momentum signals (how recent and growing is the interest?)

Return your analysis as valid JSON only.`;

  return callModuleWithRetry(SYSTEM_PROMPT, userPrompt);
}
