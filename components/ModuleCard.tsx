"use client";

import { useState } from "react";
import type { ModuleOutput } from "../lib/schemas/module";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-red-100 text-red-700",
};

interface ModuleCardProps {
  module: ModuleOutput;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const pct = Math.round((module.score / module.max_score) * 100);
  const barColor =
    pct >= 70 ? "bg-emerald-500" : pct >= 45 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900">{module.module_name}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
            CONFIDENCE_COLORS[module.confidence] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {module.confidence}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Score</span>
          <span className="font-medium text-gray-900">
            {module.score} / {module.max_score}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 mb-4">{module.summary}</p>

      {/* Risks + Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {module.risks.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Risks
            </h4>
            <ul className="space-y-1">
              {module.risks.map((r, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-1">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">!</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {module.opportunities.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Opportunities
            </h4>
            <ul className="space-y-1">
              {module.opportunities.map((o, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-1">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">+</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Evidence toggle */}
      {module.evidence.length > 0 && (
        <div>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showEvidence ? "Hide" : "Show"} {module.evidence.length} evidence
            source{module.evidence.length !== 1 ? "s" : ""}
          </button>

          {showEvidence && (
            <div className="mt-2 space-y-2">
              {module.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="p-2 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:underline block truncate"
                  >
                    {ev.title || ev.url}
                  </a>
                  {ev.snippet && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {ev.snippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
