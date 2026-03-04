# Due Diligence Engine

AI-powered early-stage startup due diligence. Enter a startup idea and get a scored investment memo powered by web search + Claude.

## What it does

Runs a 5-module analysis pipeline in parallel:

| Module | Max Score | What it analyzes |
|--------|-----------|-----------------|
| Competitor Scan | 15 | Competitive density (inverse score) |
| Demand Signals | 30 | Pain evidence (20) + momentum (10) |
| TAM Lite | 15 | Market size attractiveness |
| Monetization Viability | 15 | Pricing sanity, CAC proxy, revenue model |
| Execution Risk | 15 | Regulatory, technical, sales cycle complexity |

Total: 90 base points + up to 10 from low risk = 100 effective max.

Grade bands: Tier 1 (90+), Strong (75+), Promising (55+), Marginal (35+), Pass (<35).

## Setup

```bash
git clone <repo>
cd due-diligence-engine
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `SERPAPI_KEY` | No | If set, uses SerpAPI (Google). Otherwise uses DuckDuckGo HTML scraping. |

## Demo Input

**Idea**: AI-powered lease negotiation tool for small business tenants

**Description**: A SaaS platform that uses AI to analyze commercial lease agreements, benchmark terms against market data, and generate negotiation strategies and counter-proposals for small business owners renewing or signing new leases.

**Target Customer**: Small business owners (1-50 employees) signing or renewing commercial leases

**Customer Pain**: Small business tenants lack negotiating leverage and expertise when dealing with commercial landlords, often overpaying by 15-30% on lease terms due to information asymmetry.

**Business Model**: SaaS | **Geography**: United States | **Pricing**: $199/month | **Timeline**: 18 months

Click "Fill demo input" in the UI to auto-populate these fields.

## Architecture

```
app/
  page.tsx              # Client state machine: idle -> loading -> results/error
  api/run/route.ts      # POST endpoint: validate -> pipeline -> score -> memo
components/
  InputForm.tsx         # Controlled form with demo fill
  ResultsView.tsx       # Container for all result components
  ScoreCard.tsx         # Score, grade, confidence, top reasons/risks
  ModuleCard.tsx        # Per-module score bar, evidence links, risks/opportunities
  MemoView.tsx          # Rendered markdown memo
lib/
  schemas/              # Zod schemas for input validation and output typing
  llm/                  # Claude abstraction with JSON retry logic
  serp/                 # DuckDuckGo scraper + SerpAPI client
  pipeline/             # 5 analysis modules + orchestrator
  scoring/              # Deterministic scoring function
  memo/                 # LLM-based memo generator
```

## Notes

- Pipeline modules run in parallel via `Promise.all` to minimize latency (typically 45-90 seconds total)
- Scoring is deterministic given fixed module outputs
- DuckDuckGo scraping uses POST to `html.duckduckgo.com/html/` with standard browser headers
- Memo generation uses Claude with all module summaries as context
