import type { FinalOutput } from "../lib/schemas/module";
import ScoreCard from "./ScoreCard";
import ModuleCard from "./ModuleCard";
import MemoView from "./MemoView";

interface ResultsViewProps {
  result: FinalOutput;
  onReset: () => void;
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Diligence Report</h1>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Analyze another idea
        </button>
      </div>

      <ScoreCard score={result.score} ideaName={result.input.idea_name} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Module Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.modules.map((module, i) => (
            <ModuleCard key={i} module={module} />
          ))}
        </div>
      </div>

      <MemoView memo={result.memo} />

      <div className="text-xs text-gray-400 text-center">
        Generated {new Date(result.generated_at).toLocaleString()} by Due
        Diligence Engine
      </div>
    </div>
  );
}
