"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Scanning competitors...",
  "Measuring demand signals...",
  "Estimating market size...",
  "Validating monetization...",
  "Assessing execution risk...",
  "Crunching the numbers...",
  "Building your report...",
];

interface LoadingScreenProps {
  completedModules: number;
  onCancel?: () => void;
}

export default function LoadingScreen({ onCancel }: LoadingScreenProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Spinner */}
      <svg
        className="w-12 h-12 mb-8"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="25" cy="25" r="20" stroke="#ede9fe" strokeWidth="4" />
        <circle
          cx="25" cy="25" r="20"
          stroke="url(#spin-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 200"
          style={{ animation: "spin 1s linear infinite", transformOrigin: "center" }}
        />
        <defs>
          <linearGradient id="spin-grad" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>

      {/* Cycling action */}
      <p
        key={stepIdx}
        className="fade-up text-base font-medium text-gray-700 mb-2"
      >
        {STEPS[stepIdx]}
      </p>
      <p className="text-sm text-gray-400">Typically 20-40 seconds</p>

      {/* Escape hatch after 45s */}
      {elapsed >= 45 && onCancel && (
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-2">Taking longer than expected...</p>
          <button
            onClick={onCancel}
            className="text-xs font-medium text-purple-600 hover:text-purple-800 underline"
          >
            Cancel and try again
          </button>
        </div>
      )}
    </div>
  );
}
