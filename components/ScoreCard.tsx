import type { FinalScore } from "../lib/schemas/module";

const GRADE_META: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Tier 1": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Strong:   { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500" },
  Promising:{ bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500" },
  Marginal: { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-400" },
  Pass:     { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-400" },
};

const SCORE_COLOR: Record<string, string> = {
  "Tier 1": "#10b981",
  Strong:   "#6366f1",
  Promising:"#8b5cf6",
  Marginal: "#f97316",
  Pass:     "#ef4444",
};

const LETTER_COLORS: Record<string, string> = {
  A: "text-emerald-600 bg-emerald-50 border-emerald-200",
  B: "text-blue-600 bg-blue-50 border-blue-200",
  C: "text-violet-600 bg-violet-50 border-violet-200",
  D: "text-orange-600 bg-orange-50 border-orange-200",
  F: "text-red-600 bg-red-50 border-red-200",
};

interface ScoreCardProps {
  score: FinalScore;
  ideaName: string;
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = SCORE_COLOR[grade] ?? "#9333ea";

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f1f8" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{score}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

function LetterGrade({ letter }: { letter: string }) {
  const colors = LETTER_COLORS[letter] ?? LETTER_COLORS["F"];
  return (
    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-3xl ${colors}`}>
      {letter}
    </div>
  );
}

export default function ScoreCard({ score, ideaName }: ScoreCardProps) {
  const meta = GRADE_META[score.grade] ?? GRADE_META["Pass"];

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score ring + letter grade side by side */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ScoreRing score={score.weighted_score} grade={score.grade} />
          <LetterGrade letter={score.letter_grade} />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900 mb-2 truncate">{ideaName}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.text} ${meta.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {score.grade}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {score.confidence} confidence
            </span>
            {score.risk_deduction > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                -{score.risk_deduction} risk deduction
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {score.top_reasons.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Strengths</p>
                <ul className="space-y-1.5">
                  {score.top_reasons.map((r, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                      <span className="text-emerald-500 flex-shrink-0 font-bold mt-0.5">+</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {score.top_risks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Risks</p>
                <ul className="space-y-1.5">
                  {score.top_risks.map((r, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                      <span className="text-red-400 flex-shrink-0 font-bold mt-0.5">!</span>
                      <span>{r}</span>
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
