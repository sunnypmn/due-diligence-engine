"use client";

import { useState } from "react";
import MemoView from "./MemoView";
import { usePurchase } from "./BusinessPlanUpsell";
import type { UserInput } from "../lib/schemas/input";
import type { FinalScore } from "../lib/schemas/module";

interface MemoTeaserProps {
  memo: string;
  input: UserInput;
  score: FinalScore;
}

export default function MemoTeaser({ memo, input, score }: MemoTeaserProps) {
  const [open, setOpen] = useState(false);
  const { email, setEmail, loading, error, handlePurchase } = usePurchase(input, score);

  return (
    <>
      {/* Teaser card */}
      <div className="relative">
        <div className="card p-6 sm:p-8" style={{ maxHeight: "340px", overflow: "hidden" }}>
          <MemoView memo={memo} />
        </div>

        {/* Gradient fade + lock CTA */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 flex flex-col items-center justify-end pb-6 rounded-b-2xl"
          style={{ background: "linear-gradient(to bottom, transparent 0%, #f8f9fc 60%)" }}
        >
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)" }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-purple-700 group-hover:text-purple-900">
              Unlock full memo
            </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(145deg, #18072e 0%, #2e0d5e 60%, #1a0838 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-purple-400 hover:text-purple-200 z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="px-6 pt-6 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Unlock your report</span>
            </div>

            <div className="px-6 pb-7">
              <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
                Get the full investment memo{" "}
                <span style={{ background: "linear-gradient(90deg, #c084fc, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  + business plan
                </span>
              </h2>
              <p className="text-sm text-purple-200 mb-5 leading-relaxed">
                Claude AI uses your validation data to generate a 6-section investor-ready
                plan — emailed to you in under 60 seconds.
              </p>

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
              <p className="text-xs text-purple-400">One-time payment · Stripe · Delivered instantly</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
