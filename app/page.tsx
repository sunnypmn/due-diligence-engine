"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import ResultsView from "../components/ResultsView";
import LoadingScreen from "../components/LoadingScreen";
import LogoMark from "../components/LogoMark";
import type { UserInput } from "../lib/schemas/input";
import type { FinalScore, ModuleOutput } from "../lib/schemas/module";

type AppState = "idle" | "streaming" | "done" | "error";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={32} />
      <span className="text-lg font-semibold text-gray-900 tracking-tight">
        Validate<span className="brand-gradient font-bold">.ai</span>
      </span>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Progressive stream state
  const [streamInput, setStreamInput] = useState<UserInput | null>(null);
  const [streamModules, setStreamModules] = useState<ModuleOutput[]>([]);
  const [streamScore, setStreamScore] = useState<FinalScore | null>(null);
  const [streamMemo, setStreamMemo] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const handleSubmit = async (data: UserInput) => {
    // Reset progressive state
    setStreamInput(data);
    setStreamModules([]);
    setStreamScore(null);
    setStreamMemo(null);
    setGeneratedAt(null);
    setError(null);
    setState("streaming");

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 120_000); // 2-min hard timeout

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: abort.signal,
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || `Server error ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            switch (event.type) {
              case "module":
                setStreamModules((prev) => [...prev, event.module]);
                break;
              case "score":
                setStreamScore(event.score);
                break;
              case "memo":
                setStreamMemo(event.memo);
                break;
              case "done":
                receivedDone = true;
                setGeneratedAt(event.generated_at);
                setState("done");
                break;
              case "error":
                throw new Error(event.message);
            }
          } catch (parseErr) {
            if (parseErr instanceof SyntaxError) continue;
            throw parseErr;
          }
        }
      }

      // Stream closed without a done event — surface an error
      if (!receivedDone) {
        throw new Error("Analysis incomplete — the server closed early. Please try again.");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Analysis timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
      setState("error");
    } finally {
      clearTimeout(timeout);
    }
  };

  const handleReset = () => {
    setState("idle");
    setStreamInput(null);
    setStreamModules([]);
    setStreamScore(null);
    setStreamMemo(null);
    setError(null);
  };

  const showResults = state === "streaming" || state === "done";

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo />
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
            Early Access
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {(state === "idle" || state === "error") && (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                Powered by Claude AI + live web research
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                Due diligence in{" "}
                <span className="brand-gradient">under 60 seconds</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Paste your startup idea. Get a scored investment memo with
                competitor analysis, TAM estimate, and execution risk, backed by
                real search data.
              </p>

              <div className="flex items-center justify-center gap-8 mt-8 mb-2">
                {[
                  { label: "Analysis modules", value: "5" },
                  { label: "Max score", value: "100" },
                  { label: "Avg runtime", value: "~30s" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="card p-8 max-w-3xl mx-auto">
              <InputForm onSubmit={handleSubmit} loading={false} />
              {state === "error" && error && (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-700">Something went wrong</p>
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
          </>
        )}

        {/* Full-screen loader until first module arrives */}
        {state === "streaming" && streamInput && streamModules.length === 0 && (
          <div className="max-w-2xl mx-auto py-8">
            <LoadingScreen completedModules={0} onCancel={handleReset} />
          </div>
        )}

        {/* Switch to results as soon as any module arrives — don't wait for done */}
        {streamInput && streamModules.length > 0 && (
          <ResultsView
            ideaName={streamInput.idea_name}
            input={streamInput}
            modules={streamModules}
            score={streamScore}
            memo={streamMemo}
            generatedAt={generatedAt}
            isStreaming={state === "streaming"}
            onReset={handleReset}
          />
        )}
      </div>

      {!showResults && (
        <footer className="mt-16 pb-8 text-center text-xs text-gray-400 space-y-1">
          <p>Validate.ai · AI-powered startup due diligence</p>
          <p>
            <a href="/privacy" className="hover:text-purple-600 underline underline-offset-2 transition-colors">
              Privacy Policy
            </a>
          </p>
        </footer>
      )}
    </div>
  );
}
