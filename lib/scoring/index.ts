import type { ModuleOutput, FinalScore, Confidence } from "../schemas/module";

function getGrade(score: number): FinalScore["grade"] {
  if (score >= 75) return "Strong Opportunity";
  if (score >= 45) return "Worth Exploring";
  return "High Risk";
}

function confidenceToNumber(c: Confidence): number {
  if (c === "High") return 3;
  if (c === "Medium") return 2;
  return 1;
}

function numberToConfidence(n: number): Confidence {
  if (n >= 2.5) return "High";
  if (n >= 1.5) return "Medium";
  return "Low";
}

export function computeScore(modules: ModuleOutput[]): FinalScore {
  // Sum raw scores
  const rawSum = modules.reduce((acc, m) => acc + m.score, 0);
  const maxSum = modules.reduce((acc, m) => acc + m.max_score, 0); // 90

  // Normalize to 100
  const normalized = (rawSum / maxSum) * 90;

  // Risk deduction: count all risks across modules, cap at -10
  const totalRisks = modules.reduce((acc, m) => acc + m.risks.length, 0);
  const riskDeduction = Math.min(10, totalRisks * 1.5);

  const weighted = Math.max(0, Math.round(normalized - riskDeduction));

  // Confidence: use the lowest confidence across all modules
  const confidenceNums = modules.map((m) => confidenceToNumber(m.confidence));
  const avgConfidence = confidenceNums.reduce((a, b) => a + b, 0) / confidenceNums.length;
  const confidence = numberToConfidence(avgConfidence);

  // Top reasons: best scoring opportunities
  const allOpportunities: string[] = modules.flatMap((m) => m.opportunities);
  const top_reasons = allOpportunities.slice(0, 3);

  // Top risks: from highest-risk modules
  const allRisks: string[] = modules.flatMap((m) => m.risks);
  const top_risks = allRisks.slice(0, 3);

  return {
    weighted_score: weighted,
    grade: getGrade(weighted),
    confidence,
    risk_deduction: Math.round(riskDeduction * 10) / 10,
    top_reasons,
    top_risks,
  };
}
