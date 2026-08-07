# EV Manufacturing AI Demo

A bilingual (English / 中文) web demo for integrated AI use cases across EV car manufacturing: market intelligence → production planning → suppliers → MES → TQM → knowledge & chatbot.

## Deploy

### Vercel (recommended)

1. Import this repository in [Vercel](https://vercel.com/new)
2. Framework preset: **Next.js**
3. Deploy — no environment variables required for the demo

### GitHub Pages

This app is a Next.js server app; use **Vercel** or `npm run build && npm start` on Node hosting. The previous static landscape lives in `backup/`.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the **中文 / EN** button in the header to switch language.

## Demo modules

| Module | Flow |
|--------|------|
| **Market & Demand** | News → ontology → demand forecast → marketing messages |
| **Production Plan** | Demand-triggered APS, 5 EV models on one line, changeovers, staffing, holidays |
| **Suppliers** | OTIF + auto-flagged quantity issues |
| **MES** | Live OEE, FTT, VPH; editable overrides; station status; 7-day history; report export |
| **TQM** | Defects → root cause → supplier linkage |
| **Knowledge** | Training articles + rule-based assistant |

## Synthetic data

All data is in `src/data/*.json`, grounded in typical automotive benchmarks:

- **OEE** ~78% (A×P×Q)
- **FTT** ~95%
- **VPH** ~28 jobs/hour (target 30)
- **Changeover** 20–32 min by model
- **5 EV models** on a single mixed line

See `docs/DATA-PLAN.md` for the full data dictionary.

## Previous work

The AI × Manufacturing landscape HTML presentation was moved to `backup/ai-manufacturing-landscape/`.
