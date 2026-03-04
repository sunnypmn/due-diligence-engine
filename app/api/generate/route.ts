import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "../../../lib/llm";

const SYSTEM_PROMPT = `You are a startup analyst. Given a brief description of a startup idea, extract structured information and return ONLY valid JSON with no other text.

Return this exact schema:
{
  "idea_name": "<short descriptive name, max 80 chars>",
  "description": "<2-3 sentence product description explaining what it does and how>",
  "target_customer": "<specific customer segment with size/role context>",
  "customer_pain": "<specific pain point with context on severity and frequency>",
  "business_model": "<one of: SaaS | Marketplace | D2C | B2B Services | Hardware | API/Infrastructure | Consumer App | Other>",
  "target_geo": "<primary target geography>",
  "planned_pricing": "<realistic pricing estimate based on model and customer>",
  "timeline_months": <realistic number 6-36>,
  "budget_range": "<realistic seed budget estimate>"
}

Be specific and concrete. Infer reasonable details from the description.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

    const response = await callLLM(
      SYSTEM_PROMPT,
      `Extract startup details from this idea:\n\n"${prompt.trim()}"`
    );

    // Extract JSON
    const fenced = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = fenced
      ? fenced[1].trim()
      : response.slice(response.indexOf("{"), response.lastIndexOf("}") + 1);

    const data = JSON.parse(jsonStr);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
