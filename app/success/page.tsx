"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type State = "loading" | "success" | "error";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setError("No session ID found.");
      return;
    }

    const controller = new AbortController();

    fetch("/api/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEmail(data.email || "your inbox");
        setState("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong.");
        setState("error");
      });

    return () => controller.abort();
  }, [sessionId]);

  if (state === "loading") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating your business plan...</h1>
        <p className="text-gray-500">This takes about 30 seconds. Please keep this tab open.</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-3xl">!</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <p className="text-sm text-gray-400">Your payment was captured. Please email us to get your business plan.</p>
        <Link href="/" className="mt-6 inline-block text-purple-600 hover:text-purple-800 underline text-sm">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Checkmark */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)" }}>
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Your business plan is on its way!</h1>
      <p className="text-gray-500 mb-2">
        We just sent it to <span className="font-semibold text-gray-700">{email}</span>
      </p>
      <p className="text-sm text-gray-400 mb-10">Check your inbox (and spam folder) for an email from Validate.ai</p>

      <div className="card p-6 max-w-sm mx-auto text-left mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Your plan includes</p>
        {[
          "Executive Summary",
          "SWOT Analysis",
          "Go-To-Market Strategy",
          "Marketing Strategy",
          "3-Year Financial Plan",
          "90-Day Action Plan",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2.5 py-1.5">
            <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Validate another idea
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)" }}>
              V
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              Validate<span className="brand-gradient font-bold">.ai</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-20">
        <Suspense fallback={
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-6" />
            <p className="text-gray-500">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
