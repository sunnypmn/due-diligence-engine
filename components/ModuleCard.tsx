"use client";

import { useState } from "react";
import type { ModuleOutput } from "../lib/schemas/module";

const CONFIDENCE_COLORS: Record<string, string> = {
  High:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50  text-amber-700  border-amber-200",
  Low:    "bg-red-50    text-red-600    border-red-200",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

interface ModuleCardProps {
  module: ModuleOutput;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const pct = Math.round((module.score / module.max_score) * 100);
  const barColor =
    pct >= 70 ? "bg-emerald-500" : pct >= 45 ? "bg-amber-400" : "bg-red-400";

  const hasDetails = module.risks.length > 0 || module.opportunities.length > 0;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{module.module_name}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 border ${
            CONFIDENCE_COLORS[module.confidence] ?? "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {module.confidence}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">Score</span>
          <span className="font-semibold text-gray-700">
            {module.score} / {module.max_score}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${pct}%`, transition: "width 0.6s ease" }}
          />
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-600 leading-relaxed mb-3">{module.summary}</p>

      {/* Risks + Opportunities — collapsible */}
      {hasDetails && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 mb-0"
          >
            <ChevronIcon open={showDetails} />
            Risks &amp; Upsides
          </button>

          {showDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {module.risks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Risks</p>
                  <ul className="space-y-1.5">
                    {module.risks.map((r, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                        <span className="text-red-400 flex-shrink-0 font-bold">!</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {module.opportunities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Upside</p>
                  <ul className="space-y-1.5">
                    {module.opportunities.map((o, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                        <span className="text-emerald-500 flex-shrink-0 font-bold">+</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Evidence toggle */}
      {module.evidence.length > 0 && (
        <div className={`${hasDetails ? "mt-3" : "border-t border-gray-100 pt-3"}`}>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
          >
            <ChevronIcon open={showEvidence} />
            {module.evidence.length} source{module.evidence.length !== 1 ? "s" : ""}
          </button>

          {showEvidence && (
            <div className="mt-2.5 space-y-2">
              {module.evidence.map((ev, i) => (
                <div key={i} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-purple-600 hover:underline block truncate"
                  >
                    {ev.title || ev.url}
                  </a>
                  {ev.snippet && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ev.snippet}</p>
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
