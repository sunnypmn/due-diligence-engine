"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import ResultsView from "../components/ResultsView";
import type { UserInput } from "../lib/schemas/input";
import type { FinalOutput } from "../lib/schemas/module";

type AppState = "idle" | "loading" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<FinalOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UserInput) => {
    setState("loading");
    setError(null);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || `Server error ${response.status}`);
      }

      setResult(json);
      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Due Diligence Engine
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered early-stage startup analysis. Paste your idea and get a
            scored investment memo in under 2 minutes.
          </p>
        </div>

        {/* State machine */}
        {(state === "idle" || state === "loading" || state === "error") && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <InputForm onSubmit={handleSubmit} loading={state === "loading"} />
            {state === "error" && error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-sm text-red-700 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {state === "results" && result && (
          <ResultsView result={result} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
