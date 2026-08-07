# Data plan — EV Manufacturing AI Demo

## Design intent

Synthetic data supports an **end-to-end narrative**:

1. Unprocessed news arrives → ontology links entities → demand forecast adjusts → marketing copy drafted
2. Demand signal triggers APS refresh on **Line 1** (5 EV models, single mixed line)
3. Supplier flags fire on quantity patterns (linked to quality issues later)
4. MES streams OEE / FTT / VPH with one editable source of truth
5. Quality issues trace to root cause and suppliers (TQM)
6. Knowledge base feeds training + chatbot

## Real-world anchors (not company-specific)

| Metric | Demo value | Industry reference |
|--------|------------|-------------------|
| OEE | 78.4% | Automotive assembly often 65–85%; world-class ~85%+ |
| FTT | 94.8% | First Time Through typically 92–97% in auto |
| VPH | 27.6 (target 30) | Mixed EV lines often mid-20s to low-30s jobs/hour |
| Changeover | 20–32 min | Flexible single-line EV mix common range |
| OTIF flag threshold | <92% or 3 qty issues / 90d | Typical supplier scorecard patterns |

## Files

| File | Contents |
|------|----------|
| `models.json` | 5 EV models, cycle & changeover times |
| `news.json` | 5 news articles (EN/ZH), entity tags |
| `ontology.json` | Policy, market, competitor, model entities |
| `demand.json` | Weekly baseline vs AI-adjusted units |
| `marketing.json` | Triggered messages by channel |
| `production-plan.json` | Shift schedule with changeovers & staff |
| `holidays.json` | Plant calendar impacts |
| `suppliers.json` | 5 suppliers, 2 flagged |
| `mes-metrics.json` | Live dashboard snapshot |
| `mes-stations.json` | 6 stations, 1 alarm |
| `mes-history.json` | 7-day trend |
| `quality-issues.json` | 4 issues, supplier links |
| `knowledge.json` | 5 SOP / training articles |
| `pipeline-events.json` | Cross-module event log for overview |

## EV model lineup (fictional)

- Nova SUV — mid-size, 28 min changeover
- Pulse Sedan — compact sedan, 22 min
- Spark Hatch — city hatch, 20 min
- Ridge Cross — crossover, 25 min
- Apex Coupe — performance low volume, 32 min
