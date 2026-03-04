import { NextRequest } from "next/server";
import { UserInputSchema } from "../../../lib/schemas/input";
import { runCompetitorScan } from "../../../lib/pipeline/competitorScan";
import { runDemandSignals } from "../../../lib/pipeline/demandSignals";
import { runTamLite } from "../../../lib/pipeline/tamLite";
import { runMonetizationViability } from "../../../lib/pipeline/monetizationViability";
import { runExecutionRisk } from "../../../lib/pipeline/executionRisk";
import { computeScore } from "../../../lib/scoring";
import { generateMemo } from "../../../lib/memo";
import type { ModuleOutput } from "../../../lib/schemas/module";

export const maxDuration = 120;

function sseEvent(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parseResult = UserInputSchema.safeParse(body);

  if (!parseResult.success) {
    return new Response(
      JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const input = parseResult.data;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const modules: ModuleOutput[] = [];

        // Each module writes to the stream the moment it finishes
        const wrap = (fn: () => Promise<ModuleOutput>) =>
          fn().then((m) => {
            modules.push(m);
            controller.enqueue(sseEvent({ type: "module", module: m }));
            return m;
          });

        await Promise.all([
          wrap(() => runCompetitorScan(input)),
          wrap(() => runDemandSignals(input)),
          wrap(() => runTamLite(input)),
          wrap(() => runMonetizationViability(input)),
          wrap(() => runExecutionRisk(input)),
        ]);

        const score = computeScore(modules);
        controller.enqueue(sseEvent({ type: "score", score }));

        const memo = await generateMemo(input, modules, score);
        controller.enqueue(sseEvent({ type: "memo", memo }));

        controller.enqueue(
          sseEvent({ type: "done", generated_at: new Date().toISOString() })
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Pipeline failed";
        controller.enqueue(sseEvent({ type: "error", message }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
