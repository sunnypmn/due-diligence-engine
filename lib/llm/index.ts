import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ModuleOutputSchema, type ModuleOutput } from "../schemas/module";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected non-text response from LLM");
  }
  return content.text;
}

function extractJSON(text: string): string {
  // Try to find JSON block in markdown code fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  // Try to find raw JSON object
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
  maxRetries = 2
): Promise<ModuleOutput> {
  let lastError: Error | null = null;
  let lastResponse = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const prompt =
        attempt === 0
          ? userPrompt
          : `${userPrompt}\n\nYour previous output failed validation: ${lastError?.message}. Return valid JSON matching the exact schema. Previous response was: ${lastResponse.slice(0, 500)}`;

      const response = await callLLM(systemPrompt, prompt);
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
