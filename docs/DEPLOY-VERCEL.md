# Deploying the EV Manufacturing AI Demo on Vercel

This guide walks through deploying the Next.js demo to [Vercel](https://vercel.com) — from first import through optional ChatGPT mode and demo presentation tips.

## Prerequisites

- A GitHub (or GitLab/Bitbucket) repository containing this project
- A [Vercel account](https://vercel.com/signup) (Hobby tier is sufficient for demos)
- Node.js 20+ locally if you want to verify builds before deploy

## Quick deploy (GitHub import)

1. Push this repo to GitHub (or use the existing remote).
2. Open [vercel.com/new](https://vercel.com/new) and **Import** the repository.
3. Vercel auto-detects **Next.js**. Leave defaults:
   - **Build command:** `npm run build`
   - **Output directory:** (leave empty — Next.js default)
   - **Install command:** `npm install`
4. Click **Deploy**.

No environment variables are required for the default demo (rule-based chat, synthetic JSON data).

Your production URL will look like `https://your-project.vercel.app`.

## Optional: ChatGPT mode

To enable real OpenAI responses on **Knowledge & Chat**:

1. In the Vercel project → **Settings** → **Environment Variables**, add:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `OPENAI_API_KEY` | `sk-...` | Production, Preview |
   | `OPENAI_MODEL` | `gpt-4o-mini` | Production, Preview (optional) |

2. **Redeploy** (Deployments → ⋯ → Redeploy) so server routes pick up the new vars.

Locally, copy `.env.example` to `.env.local` with the same keys.

## CLI deploy (alternative)

```bash
npm install -g vercel   # or: npx vercel
vercel login
vercel link             # link to existing project, or create new
vercel                  # preview deploy
vercel --prod           # production deploy
```

Set env vars via CLI:

```bash
vercel env add OPENAI_API_KEY
vercel env add OPENAI_MODEL
```

## What gets deployed

| Route | Purpose |
|-------|---------|
| `/` | E2E cover — 4 advantages, clickable pipeline, platform layer reveal |
| `/market` … `/knowledge` | Six operational modules |
| `/ontology` | Semantic layer — raw → canonical entity graph |
| `/agents` | Agent orchestration (“HR for agents”) |
| `/ops` | Compute, tokens, cost, human review, alarms |

All module data is static JSON under `src/data/` — no external database required.

## Demo flow (recommended)

1. Start on **`/`** — walk through the four platform advantages and the E2E pipeline.
2. Click into **Market**, **Planning**, etc. — highlight **无感 AI**: AI-set badges inline, no separate “AI app.”
3. **Double-click the hero logo** (or click **View platform layer**) to reveal Ontology / Agents / Ops.
4. Show **`/ontology`** — unstructured news → extractions → canonical graph.
5. Show **`/agents`** — ML vs LLM agents, shadow/retired lifecycle, team groupings.
6. Show **`/ops`** — GPU util, token cost, pending human reviews, open alarms.

The header **status dot** (green/amber/red) gives ambient ops awareness without leaving the current module.

## Custom domain

1. Vercel project → **Settings** → **Domains**
2. Add your domain and follow DNS instructions (CNAME to `cname.vercel-dns.com` or Vercel nameservers).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on ESLint | Run `npm run build` locally; fix reported files |
| ChatGPT mode 500 | Confirm `OPENAI_API_KEY` is set for the deployment environment and redeploy |
| Platform nav hidden | Click **View platform layer** in header or double-click cover hero |
| Wrong Node version | Vercel uses Node 20.x by default; set `"engines": { "node": ">=20" }` in `package.json` if needed |

## CI / preview deployments

Every pull request automatically gets a **Preview Deployment** URL when the repo is linked to Vercel. Use preview URLs for stakeholder review before merging to `main` (production).

## Security notes for production demos

- Do not commit `.env.local` or real API keys.
- Use Vercel **Environment Variables** only; restrict `OPENAI_API_KEY` to Production/Preview as needed.
- This app is a **demo** — synthetic data, simulated exports, no real MES integration.

## Related docs

- `README.md` — local dev and module overview
- `docs/DATA-PLAN.md` — synthetic data dictionary
- `docs/SPIN-UP-PROMPT.md` — prompt to recreate this demo in another repo
