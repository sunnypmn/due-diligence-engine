"use client";

import { useState } from "react";
import type { UserInput } from "../lib/schemas/input";
import type { FinalScore } from "../lib/schemas/module";

const SECTIONS = [
  { icon: "📣", title: "Marketing Strategy", desc: "Positioning, channels, budget" },
  { icon: "💰", title: "Financial Plan", desc: "3-yr projections, unit economics" },
  { icon: "🚀", title: "Go-To-Market", desc: "Phased launch with metrics" },
  { icon: "⚡", title: "SWOT Analysis", desc: "Strengths, gaps, threats" },
  { icon: "📋", title: "90-Day Action Plan", desc: "Prioritized milestones" },
  { icon: "📄", title: "Executive Summary", desc: "Investor-ready overview" },
];

interface BusinessPlanUpsellProps {
  input: UserInput;
  score: FinalScore;
  variant?: "inline" | "sticky";
  onDismiss?: () => void;
}

export function usePurchase(input: UserInput, score: FinalScore) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!email || !email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, input, score }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return { email, setEmail, loading, error, handlePurchase };
}

// Main inline upsell — shown right after score card
export default function BusinessPlanUpsell({ input, score }: BusinessPlanUpsellProps) {
  const { email, setEmail, loading, error, handlePurchase } = usePurchase(input, score);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(145deg, #18072e 0%, #2e0d5e 60%, #1a0838 100%)" }}>

      {/* Top label */}
      <div className="px-6 pt-5 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
          Your next step
        </span>
      </div>

      <div className="px-6 pb-6 pt-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-8">

          {/* Left: headline + CTA */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
              Turn this report into a<br />
              <span style={{ background: "linear-gradient(90deg, #c084fc, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                full business plan
              </span>
            </h2>
            <p className="text-sm text-purple-200 mb-6 leading-relaxed">
              Claude AI uses your validation data to generate a 6-section investor-ready
              plan — emailed to you in under 60 seconds.
            </p>

            {/* Email + CTA */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePurchase()}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/15"
              />
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shadow-lg"
                style={{ background: "linear-gradient(135deg, #a855f7, #9333ea)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting...
                  </span>
                ) : (
                  "Get Business Plan — $99"
                )}
              </button>
            </div>
            {error && <p className="text-xs text-red-300 mb-2">{error}</p>}
            <p className="text-xs text-purple-400">
              One-time payment · Stripe · Delivered instantly
            </p>
          </div>

          {/* Right: locked section grid */}
          <div className="sm:w-64 flex-shrink-0">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">
              What's included
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <div key={s.title}
                  className="rounded-xl p-3 flex flex-col gap-1"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs font-semibold text-white leading-tight">{s.title}</span>
                  <span className="text-xs text-purple-300 leading-tight">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sticky bottom bar — follows user as they scroll
export function StickyUpsellBar({ input, score }: { input: UserInput; score: FinalScore }) {
  const { email, setEmail, loading, error, handlePurchase } = usePurchase(input, score);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div
        className="max-w-3xl mx-auto rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        style={{ background: "linear-gradient(135deg, #1a0838, #2e0d5e)", border: "1px solid rgba(168,85,247,0.3)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
            style={{ background: "rgba(168,85,247,0.2)" }}>
            📄
          </div>

          {/* Label */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Full Business Plan</p>
            <p className="text-xs text-purple-300 truncate hidden sm:block">
              Marketing · Financial · GTM · SWOT · 90-Day Plan
            </p>
          </div>

          {/* Email + CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePurchase()}
              placeholder="your@email.com"
              className="hidden sm:block w-44 px-3 py-2 rounded-lg text-xs bg-white/10 border border-white/20 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-shrink-0 px-4 py-2 rounded-lg font-bold text-xs text-white disabled:opacity-60 whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #a855f7, #9333ea)" }}
            >
              {loading ? "..." : "Get Plan — $99"}
            </button>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-purple-400 hover:text-purple-200 ml-1"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-300 px-4 pb-2">{error}</p>
        )}
      </div>
    </div>
  );
}
