# AI x Manufacturing Interactive Landscape

A single self-contained HTML presentation mapping how AI impacts manufacturing across two MECE dimensions: the dimensionality ladder of AI technology and the manufacturing value chain.

## Quick start

Open offline — no build step, no network requests:

```
ai-manufacturing-landscape/index.html
```

Double-click the file or open it from a browser via `file://`.

## Features

- **47 use cases** across 32 grid cells (8 stages x 4 technology rungs), with 2 deliberate empty cells
- **Dual navigation**: value chain rail (left) + technology rail (top) with agentic band
- **Three entry paths**: value chain, technology, or full landscape
- **Guided story** (12 steps) and **free explore** with search and filters
- **Cross-cutting views**: prioritisation 2x2, maturity horizon, autonomy ladder, shortlist export
- **Hash-based routing** for deep-linking and shareable URLs (including filters)

## Content editing

Use cases live in the `DATA` object at the top of the script block in `index.html`. The companion `generate.py` script contains the source use-case records and runs a MECE audit:

```bash
python3 ai-manufacturing-landscape/generate.py
```

## Verification

- Opens from filesystem with zero console errors and zero network requests
- MECE audit passes on load (see browser console)
- All views reachable via hash routes
