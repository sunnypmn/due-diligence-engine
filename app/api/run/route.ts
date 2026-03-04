import { NextRequest, NextResponse } from "next/server";
import { UserInputSchema } from "../../../lib/schemas/input";
import { FinalOutputSchema } from "../../../lib/schemas/module";
import { runPipeline } from "../../../lib/pipeline";
import { computeScore } from "../../../lib/scoring";
import { generateMemo } from "../../../lib/memo";

export const maxDuration = 120; // 2 minutes for Vercel

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parseResult = UserInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    // Run all 5 pipeline modules in parallel
    const modules = await runPipeline(input);

    // Compute deterministic score
    const score = computeScore(modules);

    // Generate memo
    const memo = await generateMemo(input, modules, score);

    // Build final output
    const output = FinalOutputSchema.parse({
      input,
      modules,
      score,
      memo,
      generated_at: new Date().toISOString(),
    });

    return NextResponse.json(output);
  } catch (err) {
    console.error("Pipeline error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
