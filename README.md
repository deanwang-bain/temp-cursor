# EV Manufacturing AI Demo

A bilingual (English / 中文) web demo for integrated AI use cases across EV car manufacturing: market intelligence → production planning → suppliers → MES → TQM, with a knowledge and chat assistant available from every screen.

## Deploy

See **`docs/DEPLOY-VERCEL.md`** for step-by-step Vercel deployment, optional ChatGPT env vars, and demo walkthrough.

Quick start: import repo at [vercel.com/new](https://vercel.com/new) → Next.js preset → Deploy.

To recreate this demo in another repo, use **`docs/SPIN-UP-PROMPT.md`**.

## Platform layer (behind the scenes)

| Route | Purpose |
|-------|---------|
| `/ontology` | Semantic layer — raw news → extractions → canonical graph |
| `/agents` | Agent orchestration — promote, invent, retire (“HR for agents”) |
| `/ops` | Compute, tokens, cost, human review, alarms |

Reveal from the cover page (double-click hero or **View platform layer**) or the header toggle.

## Four advantages demonstrated

1. **无感 AI** — inline AI-set badges, minimal workflow disruption
2. **Ontology** — unstructured data mapped to shared semantic layer
3. **Agents** — ML + LLM agents orchestrated across the pipeline
4. **Ops** — parallel governance for compute, cost, and risk

## Analytics interaction

- Every quantitative dashboard includes a dimensional explorer with click-to-drill and breadcrumb roll-up.
- Domain hierarchies include region → model → week, date → shift → model, category → supplier → month, and severity → station → model.
- Time-series charts distinguish observed values from two synthetic prediction periods using dashed lines or faded forecast bars.
- English and Chinese modes select locale-specific labels, statuses, units, product names, and generated report content without mixing UI languages.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the **中文 / EN** button in the header to switch language.

## Demo modules

| Module | Flow |
|--------|------|
| **Market & Demand** | News → ontology → demand forecast → marketing messages; six-week demand visualisation |
| **Production Plan** | Demand-triggered APS, 5 EV models on one line, changeovers, staffing, role/skill/qualification coverage, holidays, plan-attainment history |
| **Suppliers** | OTIF + auto-flagged quantity issues; six-month supplier trends and review actions |
| **MES** | Live OEE, FTT, VPH; editable overrides; station status; 7-day visual history; report export |
| **TQM** | Defects → root cause → supplier linkage; trends, escalation, assignment, closure, and 8D report actions |
| **Global Knowledge & Chat** | Persistent callout with searchable training articles and rule-based/OpenAI assistant |
| **Ontology** | Interactive entity relationship graph plus eight-week graph growth history |

## Synthetic data

All data is in `src/data/*.json`, grounded in typical automotive benchmarks:

- **OEE** ~78% (A×P×Q)
- **FTT** ~95%
- **VPH** ~28 jobs/hour (target 30)
- **Changeover** 20–32 min by model
- **5 EV models** on a single mixed line

See `docs/DATA-PLAN.md` for the full data dictionary.

## Chat assistant modes

Open **Knowledge & Chat** from the floating callout on any page, then switch between:

- **Demo mode** — rule-based answers from the knowledge base (default, no API key)
- **ChatGPT** — calls OpenAI using `OPENAI_API_KEY` on the server

Copy `.env.example` to `.env.local` for local dev, or add env vars in Vercel project settings.

## UI

Feishu-inspired layout: left sidebar navigation, top bar with search and language toggle, brand-agnostic logo slot in `src/components/BrandLogo.tsx`.

The AI × Manufacturing landscape HTML presentation was moved to `backup/ai-manufacturing-landscape/`.
