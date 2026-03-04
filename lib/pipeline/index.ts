import { runCompetitorScan } from "./competitorScan";
import { runDemandSignals } from "./demandSignals";
import { runTamLite } from "./tamLite";
import { runMonetizationViability } from "./monetizationViability";
import { runExecutionRisk } from "./executionRisk";
import type { UserInput } from "../schemas/input";
import type { ModuleOutput } from "../schemas/module";

export async function runPipeline(input: UserInput): Promise<ModuleOutput[]> {
  // Run all 5 modules in parallel
  const [competitorScan, demandSignals, tamLite, monetization, executionRisk] =
    await Promise.all([
      runCompetitorScan(input),
      runDemandSignals(input),
      runTamLite(input),
      runMonetizationViability(input),
      runExecutionRisk(input),
    ]);

  return [competitorScan, demandSignals, tamLite, monetization, executionRisk];
}
