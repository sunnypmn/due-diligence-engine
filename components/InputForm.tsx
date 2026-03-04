"use client";

import { useState } from "react";
import type { UserInput } from "../lib/schemas/input";

const BUSINESS_MODELS = [
  "SaaS",
  "Marketplace",
  "D2C",
  "B2B Services",
  "Hardware",
  "API/Infrastructure",
  "Consumer App",
  "Other",
];

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  loading: boolean;
}

export default function InputForm({ onSubmit, loading }: InputFormProps) {
  const [form, setForm] = useState<UserInput>({
    idea_name: "",
    description: "",
    target_customer: "",
    customer_pain: "",
    business_model: "SaaS",
    target_geo: "",
    planned_pricing: "",
    timeline_months: 12,
    budget_range: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "timeline_months" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setForm((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const fillDemo = () => {
    setForm({
      idea_name: "AI-powered lease negotiation tool for small business tenants",
      description:
        "A SaaS platform that uses AI to analyze commercial lease agreements, benchmark terms against market data, and generate negotiation strategies and counter-proposals for small business owners renewing or signing new leases.",
      target_customer:
        "Small business owners (1-50 employees) signing or renewing commercial leases",
      customer_pain:
        "Small business tenants lack negotiating leverage and expertise when dealing with commercial landlords, often overpaying by 15-30% on lease terms due to information asymmetry.",
      business_model: "SaaS",
      target_geo: "United States",
      planned_pricing: "$199/month or $999 per lease negotiation",
      timeline_months: 18,
      budget_range: "$500k-$1M seed",
    });
  };

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Quick Fill */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span className="text-sm font-semibold text-purple-800">AI Form Fill</span>
          <span className="text-xs text-purple-500">Describe your idea in plain English</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. An app that helps solo lawyers manage client intake and billing"
            className="flex-1 border border-purple-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !aiPrompt.trim()}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)" }}
          >
            {generating ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Filling...
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>
        {genError && (
          <p className="text-xs text-red-600 mt-2">{genError}</p>
        )}
      </div>

      {/* Form header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900">Or fill in manually</h2>
        <button
          type="button"
          onClick={fillDemo}
          className="text-xs font-medium text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          Fill demo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Idea Name *</label>
          <input
            type="text"
            name="idea_name"
            value={form.idea_name}
            onChange={handleChange}
            required
            placeholder="e.g. AI-powered lease negotiation tool"
            className="input-field"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe what the product does and how it works..."
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className={labelClass}>Target Customer *</label>
          <input
            type="text"
            name="target_customer"
            value={form.target_customer}
            onChange={handleChange}
            required
            placeholder="e.g. SMB owners, enterprise CTOs"
            className="input-field"
          />
        </div>

        <div>
          <label className={labelClass}>Business Model *</label>
          <select
            name="business_model"
            value={form.business_model}
            onChange={handleChange}
            className="input-field"
          >
            {BUSINESS_MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Customer Pain *</label>
          <textarea
            name="customer_pain"
            value={form.customer_pain}
            onChange={handleChange}
            required
            rows={2}
            placeholder="What specific problem does this solve? Be specific about the pain..."
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className={labelClass}>Target Geography *</label>
          <input
            type="text"
            name="target_geo"
            value={form.target_geo}
            onChange={handleChange}
            required
            placeholder="e.g. United States, Global, EU"
            className="input-field"
          />
        </div>

        <div>
          <label className={labelClass}>Planned Pricing</label>
          <input
            type="text"
            name="planned_pricing"
            value={form.planned_pricing || ""}
            onChange={handleChange}
            placeholder="e.g. $99/month, $5k/year enterprise"
            className="input-field"
          />
        </div>

        <div>
          <label className={labelClass}>Timeline (months) *</label>
          <input
            type="number"
            name="timeline_months"
            value={form.timeline_months}
            onChange={handleChange}
            required
            min={1}
            max={120}
            className="input-field"
          />
        </div>

        <div>
          <label className={labelClass}>Budget Range</label>
          <input
            type="text"
            name="budget_range"
            value={form.budget_range || ""}
            onChange={handleChange}
            placeholder="e.g. $100k-$500k, bootstrapped"
            className="input-field"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-brand w-full text-white py-3.5 px-6 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md shadow-purple-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing... this takes 60-90 seconds
          </span>
        ) : (
          "Validate this idea"
        )}
      </button>
    </form>
  );
}
