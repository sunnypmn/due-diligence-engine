import { search } from "../serp";
import { callModuleWithRetry } from "../llm";
import type { UserInput } from "../schemas/input";
import type { ModuleOutput } from "../schemas/module";

const SYSTEM_PROMPT = `You are a revenue model analyst performing early-stage startup due diligence.
Your task is to assess monetization viability from search results about pricing and willingness to pay.

You MUST return ONLY valid JSON with no other text. The JSON must match this exact schema:
{
  "module_name": "Monetization Viability",
  "score": <number 0-15>,
  "max_score": 15,
  "confidence": <"Low" | "Medium" | "High">,
  "summary": "<2-3 sentence summary covering pricing sanity, CAC proxy, and revenue model viability>",
  "evidence": [
    { "title": "<result title>", "url": "<url>", "snippet": "<relevant excerpt>" }
  ],
  "risks": ["<risk 1>", "<risk 2>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"]
}

Scoring guide:
- Clear willingness to pay, proven pricing model, low CAC proxy: 12-15
- Some pricing evidence, reasonable model, moderate CAC: 8-11
- Unclear willingness to pay, unproven model, high CAC concerns: 4-7
- No evidence of monetization viability or very high CAC/LTV issues: 0-3

Assess: pricing sanity (is the price realistic?), CAC proxy (how hard to acquire customers qualitatively?), revenue model viability (SaaS, marketplace cut, etc.).
Include up to 5 evidence items.`;

export async function runMonetizationViability(input: UserInput): Promise<ModuleOutput> {
  const query = `${input.business_model} pricing ${input.target_customer} willingness to pay`;
  const results = await search(query);

  const serpContext = results
    .slice(0, 5)
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet}`)
    .join("\n\n");

  const userPrompt = `Assess monetization viability for this startup:

IDEA: ${input.idea_name}
DESCRIPTION: ${input.description}
TARGET CUSTOMER: ${input.target_customer}
CUSTOMER PAIN: ${input.customer_pain}
BUSINESS MODEL: ${input.business_model}
TARGET GEOGRAPHY: ${input.target_geo}
PLANNED PRICING: ${input.planned_pricing || "Not specified"}
BUDGET RANGE: ${input.budget_range || "Not specified"}
TIMELINE: ${input.timeline_months} months

SEARCH RESULTS (query: "${query}"):
${serpContext || "No results found. Assess based on business model type and typical market rates."}

Evaluate: pricing sanity, qualitative CAC proxy (B2B enterprise vs SMB vs consumer), revenue model strength.
Return your analysis as valid JSON only.`;

  return callModuleWithRetry(SYSTEM_PROMPT, userPrompt);
}
