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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const fillDemo = () => {
    setForm({
      idea_name: "AI-powered lease negotiation tool for small business tenants",
      description:
        "A SaaS platform that uses AI to analyze commercial lease agreements, benchmark terms against market data, and generate negotiation strategies and counter-proposals for small business owners renewing or signing new leases.",
      target_customer: "Small business owners (1-50 employees) signing or renewing commercial leases",
      customer_pain:
        "Small business tenants lack negotiating leverage and expertise when dealing with commercial landlords, often overpaying by 15-30% on lease terms due to information asymmetry.",
      business_model: "SaaS",
      target_geo: "United States",
      planned_pricing: "$199/month or $999 per lease negotiation",
      timeline_months: 18,
      budget_range: "$500k-$1M seed",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Startup Details</h2>
        <button
          type="button"
          onClick={fillDemo}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Fill demo input
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idea Name *
          </label>
          <input
            type="text"
            name="idea_name"
            value={form.idea_name}
            onChange={handleChange}
            required
            placeholder="e.g. AI-powered lease negotiation tool"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe what the product does and how it works..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Customer *
          </label>
          <input
            type="text"
            name="target_customer"
            value={form.target_customer}
            onChange={handleChange}
            required
            placeholder="e.g. SMB owners, enterprise CTOs"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Model *
          </label>
          <select
            name="business_model"
            value={form.business_model}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BUSINESS_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Pain *
          </label>
          <textarea
            name="customer_pain"
            value={form.customer_pain}
            onChange={handleChange}
            required
            rows={2}
            placeholder="What specific problem does this solve? Be specific about the pain..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Geography *
          </label>
          <input
            type="text"
            name="target_geo"
            value={form.target_geo}
            onChange={handleChange}
            required
            placeholder="e.g. United States, Global, EU"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planned Pricing
          </label>
          <input
            type="text"
            name="planned_pricing"
            value={form.planned_pricing || ""}
            onChange={handleChange}
            placeholder="e.g. $99/month, $5k/year enterprise"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timeline (months) *
          </label>
          <input
            type="number"
            name="timeline_months"
            value={form.timeline_months}
            onChange={handleChange}
            required
            min={1}
            max={120}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <input
            type="text"
            name="budget_range"
            value={form.budget_range || ""}
            onChange={handleChange}
            placeholder="e.g. $100k-$500k, bootstrapped"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Running diligence pipeline... (60-90 seconds)
          </span>
        ) : (
          "Run Diligence"
        )}
      </button>
    </form>
  );
}
