import Anthropic from "@anthropic-ai/sdk";
import { ModuleOutputSchema, type ModuleOutput } from "../schemas/module";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fast model for structured JSON extraction in pipeline modules
const MODULE_MODEL = "claude-haiku-4-5-20251001";
// Full model for prose generation (memo, business plan, form fill)
const PROSE_MODEL = "claude-sonnet-4-6";

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options: { model?: string; maxTokens?: number; timeoutMs?: number } = {}
): Promise<string> {
  const timeoutMs = options.timeoutMs ?? 30_000;
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeoutMs);

  let message: Awaited<ReturnType<typeof client.messages.create>>;
  try {
    message = await client.messages.create(
      {
        model: options.model ?? PROSE_MODEL,
        max_tokens: options.maxTokens ?? 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      },
      { signal: abort.signal }
    );
  } finally {
    clearTimeout(timer);
  }

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected non-text response from LLM");
  }
  return content.text;
}

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    return text.slice(jsonStart, jsonEnd + 1);
  }

  return text.trim();
}

export async function callModuleWithRetry(
  systemPrompt: string,
  userPrompt: string,
  maxRetries = 1
): Promise<ModuleOutput> {
  let lastError: Error | null = null;
  let lastResponse = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const prompt =
        attempt === 0
          ? userPrompt
          : `${userPrompt}\n\nYour previous output failed validation: ${lastError?.message}. Return valid JSON matching the exact schema. Previous response was: ${lastResponse.slice(0, 500)}`;

      // Use Haiku for speed — modules only need structured JSON extraction
      const response = await callLLM(systemPrompt, prompt, {
        model: MODULE_MODEL,
        maxTokens: 800,
      });
      lastResponse = response;

      const jsonStr = extractJSON(response);
      const parsed = JSON.parse(jsonStr);
      const validated = ModuleOutputSchema.parse(parsed);
      return validated;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt === maxRetries) {
        throw new Error(
          `Module failed after ${maxRetries + 1} attempts: ${lastError.message}`
        );
      }
    }
  }

  throw new Error("Unreachable");
}
