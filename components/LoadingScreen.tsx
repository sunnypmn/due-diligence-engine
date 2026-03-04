"use client";

import { useEffect, useState } from "react";
import LogoMark from "./LogoMark";

const MODULES = [
  { label: "Scanning competitors",       icon: "🔍" },
  { label: "Measuring demand signals",   icon: "📊" },
  { label: "Estimating market size",     icon: "🌍" },
  { label: "Validating monetization",    icon: "💰" },
  { label: "Assessing execution risk",   icon: "⚡" },
];

const HEADLINES = [
  "Researching your market…",
  "Scanning the web for signals…",
  "Sizing up the competition…",
  "Crunching the numbers…",
  "Building your report…",
];

interface LoadingScreenProps {
  completedModules: number;
}

export default function LoadingScreen({ completedModules }: LoadingScreenProps) {
  const [headlineIdx, setHeadlineIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % HEADLINES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden px-8 py-12 text-center"
      style={{ background: "linear-gradient(145deg, #18072e 0%, #2e0d5e 55%, #1a0838 100%)" }}
    >
      {/* Floating background blobs */}
      <div
        className="float-blob absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
      />
      <div
        className="float-blob absolute -bottom-20 -right-10 w-72 h-72 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", animationDelay: "2s" }}
      />

      {/* Logo + orbiting rings */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer dashed ring */}
        <div
          className="orbit-ring-cw absolute w-32 h-32 rounded-full border border-dashed opacity-30"
          style={{ borderColor: "#a855f7" }}
        />
        {/* Middle ring with dot */}
        <div
          className="orbit-ring-ccw absolute w-20 h-20 rounded-full"
          style={{ border: "1.5px solid rgba(168,85,247,0.5)" }}
        >
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ background: "#c084fc" }}
          />
        </div>

        {/* Logo mark */}
        <div className="relative z-10 shadow-2xl">
          <LogoMark size={56} className="rounded-2xl" />
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-50 blur-xl -z-10"
            style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)" }}
          />
        </div>
      </div>

      {/* Rotating headline */}
      <h2
        key={headlineIdx}
        className="fade-up text-xl font-bold text-white mb-2"
      >
        {HEADLINES[headlineIdx]}
      </h2>
      <p className="text-sm text-purple-300 mb-10">
        5 AI modules running in parallel
      </p>

      {/* Module rows */}
      <div className="space-y-3 text-left">
        {MODULES.map((mod, i) => {
          const done = i < completedModules;
          const active = i === completedModules;

          return (
            <div
              key={mod.label}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500 ${
                done ? "opacity-100" : active ? "opacity-90" : "opacity-40"
              }`}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Shimmer on active row */}
              {active && (
                <div className="shimmer-row absolute inset-0 rounded-xl pointer-events-none" />
              )}

              {/* Icon */}
              <span className="text-base flex-shrink-0">{mod.icon}</span>

              {/* Label */}
              <span className={`text-sm flex-1 font-medium ${done ? "text-purple-200" : "text-purple-300"}`}>
                {mod.label}
              </span>

              {/* Status indicator */}
              {done ? (
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(74,222,128,0.2)" }}>
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              ) : active ? (
                /* Scanning bar */
                <div className="flex-shrink-0 flex gap-0.5 items-center">
                  {[0, 1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="w-1 rounded-full"
                      style={{
                        height: `${8 + (j % 3) * 4}px`,
                        background: "#a855f7",
                        animation: `scan-pulse 1.2s ease-in-out ${j * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-shrink-0 w-5 h-5 rounded-full"
                  style={{ border: "1.5px solid rgba(168,85,247,0.3)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-purple-500">
        Powered by Claude AI + live web research · typically 20–40 seconds
      </p>
    </div>
  );
}
