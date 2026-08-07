# Spin-up prompt — EV Manufacturing AI Demo (new repo)

Copy the block below into a new Cursor/Cloud Agent session to recreate this demo in a **different repository**.

---

## Prompt

Build a **bilingual (EN / 中文) Next.js 15** web demo for **integrated AI across EV car manufacturing**. The demo must be deployable on **Vercel**, use **synthetic JSON data** (no real backend), and follow a **Feishu-style UI** (blue `#3370FF`, left sidebar, top bar, brand-agnostic logo slot).

### Four platform advantages (must be visible on cover page)

1. **无感 AI (Seamless AI)** — AI improves productivity *inside* existing workflows. No floating chatbot sitewide; inline **AI-set** badges on adjusted values with one-line rationale popovers; human approve/reject on drafts where they already work (e.g. marketing messages). Ambient ops status dot in header only.

2. **Semantic layer & ontology** — Separate route **`/ontology`** showing behind-the-scenes mapping: **raw news snippets → NER extractions → canonical entity graph** with relations. Link from Market module and from cover. Cover supports **double-click hero logo** OR **“View platform layer”** button to reveal platform dashboards (session-persisted).

3. **Agent orchestration** — Separate route **`/agents`**: registry of agents with lifecycle (invent / promote / shadow / retire), team groupings, **traditional ML vs LLM vs hybrid** model types, performance (accept rate, human overrides, cost, drift). Cross-link agents to artifacts they produced (demand adjustments, supplier flags, marketing drafts). Described as **“HR for agents.”**

4. **Ops & governance** — Separate route **`/ops`**: GPU/CPU utilisation, token usage & cost (by agent), human-in-the-loop counts, alarms/risks with severity, 7-day trend table. Linked to pipeline events and agent guardrail breaches.

### E2E operational modules (clickable from cover pipeline diagram)

| Stage | Route | Flow |
|-------|-------|------|
| 1 | `/market` | Unstructured news → ontology → demand forecast → marketing messages |
| 2 | `/planning` | Demand-triggered APS; 5 EV models on one mixed line; changeovers, staffing, holidays |
| 3 | `/suppliers` | Auto-flag historical quantity / OTIF issues |
| 4 | `/mes` | OEE, FTT, VPH; editable metric overrides; stations; 7-day history; report export |
| 5 | `/quality` | Defects → root cause → supplier linkage |
| 6 | `/knowledge` | Training articles + chatbot |

Cover page layout:
- Hero with title, subtitle, badges
- **Four advantages** card grid (advantages 2–4 link to platform routes)
- Visual E2E flow: Market → (Planning ∥ Suppliers) → MES → Quality → Knowledge
- Module grid + live pipeline event feed (include `agentId`, `humanReviewed` on events)

Platform navigation:
- Business routes always visible in sidebar
- **Platform layer** routes (`/ontology`, `/agents`, `/ops`) hidden until revealed (cover double-click, header toggle, or when already on a platform route)
- Header: locale toggle, platform toggle, ambient ops status dot popover

### Technical requirements

- **Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS 4, no chart library (tables + MetricCard + CSS only)
- **i18n:** `src/lib/i18n/` with EN + ZH; persist locale in `localStorage`
- **Data:** `src/data/*.json` — models, news, ontology, ontology-sources (raw extractions), demand (with `agentId`, `confidence`, `aiRationale`), marketing, suppliers, production plan, holidays, MES metrics/stations/history, quality issues, knowledge, pipeline-events, **agents.json**, **ops-metrics.json**, **ops-history.json**
- **Chat:** `src/lib/chat/` with switchable **demo mode** (rule-based) vs **OpenAI** when `OPENAI_API_KEY` set; toggle on Knowledge page only
- **Components:** `AppShell`, `BrandLogo` (logo slot), `Card`, `Badge`, `MetricCard`, `AiBadge`, `PlatformRevealPanel`, `OpsStatusDot`
- **Context:** `PlatformLayerProvider` (sessionStorage for reveal state), `ChatProvider`, `I18nProvider`
- **Build:** must pass `npm run build`
- **Docs:** `docs/DATA-PLAN.md`, `docs/DEPLOY-VERCEL.md`, `README.md`, `.env.example`

### Synthetic data benchmarks (automotive-realistic)

- OEE ~78%, FTT ~95%, VPH ~28 (target 30)
- Changeover 20–32 min by model; 5 EV models on single line
- At least **8 agents** across modules: mix of ML (forecast, anomaly) and LLM (copy, orchestrator); one **retired** agent with drift rationale; one **shadow** agent
- Ops alarms: at least one **warn** (agent confidence drift) and one **critical** (MES station alarm)
- Token costs reconcile between ops dashboard and agent 30-day costs

### UI conventions

- Feishu-inspired: `--primary: #3370FF`, sidebar 240px, header 56px
- Platform pages use breadcrumb prefix **“PLATFORM” / “平台层”**
- Platform reveal panel: dark slate panel distinct from business cards
- AI badges: dashed violet pill, click for rationale

### Out of scope

- Real MES/ERP integration
- GitHub Pages (use Vercel)
- Sitewide floating chat widget

### Deliverables checklist

- [ ] Cover with 4 advantages + E2E flow + platform reveal
- [ ] 6 operational modules with synthetic data
- [ ] 3 platform dashboards (ontology, agents, ops)
- [ ] EN/ZH throughout
- [ ] `npm run build` green
- [ ] Deploy docs for Vercel

---

## Reference implementation

This prompt was generated from: **deanwang-bain/temp-cursor** (branch `cursor/ev-manufacturing-demo-b183`, PR #3).

Key paths in the reference repo:

```
src/app/HomeClient.tsx          # Cover + advantages + platform reveal
src/app/ontology/               # Semantic layer page
src/app/agents/                 # Agent orchestration
src/app/ops/                    # Ops & governance
src/data/agents.json
src/data/ops-metrics.json
src/data/ontology-sources.json
src/components/AiBadge.tsx
src/lib/platform-layer-context.tsx
docs/DEPLOY-VERCEL.md
```

## Customisation hints

- Replace `BrandLogo` slot with customer logo SVG
- Extend `agents.json` for your industry’s agent roster
- Add `OPENAI_API_KEY` in Vercel for live ChatGPT demos
- Adjust `translations.ts` for additional locales
