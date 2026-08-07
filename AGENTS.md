# AGENTS.md

## Cursor Cloud specific instructions

This repository is a single, fully self-contained static web app plus a Python audit script — there are **no dependencies to install** (no `package.json`, no `requirements.txt`; `generate.py` uses only the Python 3 standard library). Python 3 and a headless `google-chrome` are preinstalled in the environment.

Services / entry points:

- **The app** — `ai-manufacturing-landscape/index.html`. It is entirely self-contained (inline CSS/JS/data) and makes zero network requests. It can be opened directly via `file://`, but for development prefer a static server from the project directory:

```bash
cd ai-manufacturing-landscape && python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

- **Tests / lint** — there is no test framework or linter configured. The closest thing to a test is the MECE audit in `generate.py`, which validates the use-case dataset and exits non-zero on data errors:

```bash
python3 ai-manufacturing-landscape/generate.py
```

Non-obvious notes:

- `index.html` and `generate.py` hold **two independent copies** of the use-case data. `generate.py` is the source-of-truth/audit script; edits to content must be mirrored into the `DATA.useCases` array inside `index.html` for the app to reflect them. Run `generate.py` after editing to confirm the MECE audit still passes.
- The app runs its MECE audit in the **browser console** on load (look for `MECE audit PASSED`). Zero console errors is a stated correctness bar — the only expected network 404 when served over HTTP is the browser's automatic `/favicon.ico` request (the app itself requests nothing).
- Routing is **hash-based** (`#/`, `#/landscape`, `#/stage/<stage>`, `#/tech/<tech>`, `#/case/<id>`, `#/shortlist`, `#/story/<n>`, etc.), so every view is deep-linkable by URL. The shortlist feature persists to `localStorage` under the key `ai-mfg-shortlist`.
