import { search } from "../serp";
import { callModuleWithRetry } from "../llm";
import type { UserInput } from "../schemas/input";
import type { ModuleOutput } from "../schemas/module";

const SYSTEM_PROMPT = `You are an execution risk analyst performing early-stage startup due diligence.
Your task is to identify execution risks from search results about regulatory, technical, and market barriers.

You MUST return ONLY valid JSON with no other text. The JSON must match this exact schema:
{
  "module_name": "Execution Risk",
  "score": <number 0-15>,
  "max_score": 15,
  "confidence": <"Low" | "Medium" | "High">,
  "summary": "<2-3 sentence summary of execution complexity, regulatory barriers, and key risks>",
  "evidence": [
    { "title": "<result title>", "url": "<url>", "snippet": "<relevant excerpt>" }
  ],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"]
}

Scoring guide (inverse of complexity - more risks = lower score):
- Low execution risk (no regulatory hurdles, simple tech, short sales cycle): 12-15
- Medium risk (some regulatory, moderate tech, medium sales cycle): 7-11
- High risk (heavy regulatory, complex tech or platform deps, long enterprise cycle): 3-6
- Very high risk (multiple major barriers): 0-2

Assess: regulatory/compliance requirements, technical complexity, platform dependencies, sales cycle length, key-person risk.
Include up to 5 evidence items.`;

export async function runExecutionRisk(input: UserInput): Promise<ModuleOutput> {
  const query = `${input.idea_name} regulatory compliance technical complexity ${input.target_geo}`;
  const results = await search(query);

  const serpContext = results
    .slice(0, 8)
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet}`)
    .join("\n\n");

  const userPrompt = `Assess execution risk for this startup:

IDEA: ${input.idea_name}
DESCRIPTION: ${input.description}
TARGET CUSTOMER: ${input.target_customer}
CUSTOMER PAIN: ${input.customer_pain}
BUSINESS MODEL: ${input.business_model}
TARGET GEOGRAPHY: ${input.target_geo}
TIMELINE: ${input.timeline_months} months
BUDGET: ${input.budget_range || "Not specified"}

SEARCH RESULTS (query: "${query}"):
${serpContext || "No results found. Assess risks based on business model and industry type."}

Identify: regulatory/compliance requirements, technical complexity, platform dependencies (e.g., reliance on a single API/marketplace), sales cycle length for target customer, execution barriers within given timeline and budget.
Return your analysis as valid JSON only.`;

  return callModuleWithRetry(SYSTEM_PROMPT, userPrompt);
}
