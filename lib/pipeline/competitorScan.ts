import { search } from "../serp";
import { callModuleWithRetry } from "../llm";
import type { UserInput } from "../schemas/input";
import type { ModuleOutput } from "../schemas/module";

const SYSTEM_PROMPT = `You are a competitive intelligence analyst performing early-stage startup due diligence.
Your task is to analyze search results about competitors and return a structured JSON assessment.

You MUST return ONLY valid JSON with no other text. The JSON must match this exact schema:
{
  "module_name": "Competitor Scan",
  "score": <number 0-15>,
  "max_score": 15,
  "confidence": <"Low" | "Medium" | "High">,
  "summary": "<2-3 sentence summary of competitive landscape>",
  "evidence": [
    { "title": "<result title>", "url": "<url>", "snippet": "<relevant excerpt>" }
  ],
  "risks": ["<risk 1>", "<risk 2>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"]
}

Scoring guide (inverse of density - more competitors = lower score):
- High competitor density (5+ direct competitors, established players): score 3-5
- Medium density (2-4 competitors, some gaps): score 7-10
- Low density (0-1 direct competitors, blue ocean): score 11-15

Include up to 5 evidence items from the most relevant search results.`;

export async function runCompetitorScan(input: UserInput): Promise<ModuleOutput> {
  const query = `"${input.idea_name}" competitors alternatives ${input.target_geo}`;
  const results = await search(query);

  const serpContext = results
    .slice(0, 5)
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet}`)
    .join("\n\n");

  const userPrompt = `Analyze the competitive landscape for this startup idea:

IDEA: ${input.idea_name}
DESCRIPTION: ${input.description}
TARGET CUSTOMER: ${input.target_customer}
BUSINESS MODEL: ${input.business_model}
TARGET GEOGRAPHY: ${input.target_geo}

SEARCH RESULTS (query: "${query}"):
${serpContext || "No results found. Assume low data availability."}

Return your analysis as valid JSON only.`;

  return callModuleWithRetry(SYSTEM_PROMPT, userPrompt);
}
