import { search } from "../serp";
import { callModuleWithRetry } from "../llm";
import type { UserInput } from "../schemas/input";
import type { ModuleOutput } from "../schemas/module";

const SYSTEM_PROMPT = `You are a market sizing analyst performing early-stage startup due diligence.
Your task is to estimate TAM/SAM/SOM from search results and score market attractiveness.

You MUST return ONLY valid JSON with no other text. The JSON must match this exact schema:
{
  "module_name": "TAM Lite",
  "score": <number 0-15>,
  "max_score": 15,
  "confidence": <"Low" | "Medium" | "High">,
  "summary": "<2-3 sentence summary with explicit TAM/SAM/SOM estimates and assumptions>",
  "evidence": [
    { "title": "<result title>", "url": "<url>", "snippet": "<relevant excerpt>" }
  ],
  "risks": ["<risk 1>", "<risk 2>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"]
}

Scoring guide:
- Large TAM (>$10B), accessible SAM: 12-15
- Medium TAM ($1B-$10B), clear SAM: 8-11
- Small TAM ($100M-$1B), niche market: 4-7
- Tiny TAM (<$100M) or unclear market: 0-3

Include explicit assumptions in your summary. State confidence based on data quality.
Include up to 5 evidence items.`;

export async function runTamLite(input: UserInput): Promise<ModuleOutput> {
  const query = `${input.target_geo} ${input.target_customer} market size ${input.business_model}`;
  const results = await search(query);

  const serpContext = results
    .slice(0, 5)
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet}`)
    .join("\n\n");

  const userPrompt = `Estimate the market size for this startup opportunity:

IDEA: ${input.idea_name}
DESCRIPTION: ${input.description}
TARGET CUSTOMER: ${input.target_customer}
CUSTOMER PAIN: ${input.customer_pain}
BUSINESS MODEL: ${input.business_model}
TARGET GEOGRAPHY: ${input.target_geo}
PLANNED PRICING: ${input.planned_pricing || "Not specified"}
TIMELINE: ${input.timeline_months} months

SEARCH RESULTS (query: "${query}"):
${serpContext || "No results found. Make reasonable estimates based on the business model."}

Provide TAM, SAM, and SOM estimates with explicit assumptions.
Return your analysis as valid JSON only.`;

  return callModuleWithRetry(SYSTEM_PROMPT, userPrompt);
}
