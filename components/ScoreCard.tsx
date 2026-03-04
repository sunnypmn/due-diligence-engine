import type { FinalScore } from "../lib/schemas/module";

const GRADE_COLORS: Record<string, string> = {
  "Tier 1": "bg-emerald-100 text-emerald-800 border-emerald-200",
  Strong: "bg-blue-100 text-blue-800 border-blue-200",
  Promising: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Marginal: "bg-orange-100 text-orange-800 border-orange-200",
  Pass: "bg-red-100 text-red-800 border-red-200",
};

const SCORE_RING_COLOR: Record<string, string> = {
  "Tier 1": "text-emerald-600",
  Strong: "text-blue-600",
  Promising: "text-yellow-600",
  Marginal: "text-orange-600",
  Pass: "text-red-600",
};

interface ScoreCardProps {
  score: FinalScore;
  ideaName: string;
}

export default function ScoreCard({ score, ideaName }: ScoreCardProps) {
  const gradeColor = GRADE_COLORS[score.grade] ?? GRADE_COLORS["Pass"];
  const ringColor = SCORE_RING_COLOR[score.grade] ?? SCORE_RING_COLOR["Pass"];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score circle */}
        <div className="flex-shrink-0 text-center">
          <div className={`text-6xl font-bold ${ringColor}`}>
            {score.weighted_score}
          </div>
          <div className="text-sm text-gray-500 mt-1">out of 100</div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{ideaName}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${gradeColor}`}
            >
              {score.grade}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {score.confidence} Confidence
            </span>
            {score.risk_deduction > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                -{score.risk_deduction} risk deduction
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {score.top_reasons.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Top Strengths
                </h3>
                <ul className="space-y-1">
                  {score.top_reasons.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-1">
                      <span className="text-emerald-500 flex-shrink-0">+</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {score.top_risks.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Top Risks
                </h3>
                <ul className="space-y-1">
                  {score.top_risks.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-1">
                      <span className="text-red-500 flex-shrink-0">!</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
