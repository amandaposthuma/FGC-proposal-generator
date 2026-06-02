# FGC Proposal Generator v2 — CLAUDE.md

## Overview
Static single-page HTML tool hosted on GitHub Pages. No backend. All persistence via localStorage.

**Live URL:** https://amandaposthuma.github.io/FGC-proposal-generator/
**Repo:** https://github.com/amandaposthuma/FGC-proposal-generator
**File:** `index.html` (single file, ~6700 lines, all HTML/CSS/JS inline)

---

## Stack
- Pure HTML/CSS/JS — no frameworks, no build step
- GitHub Pages — auto-deploys on push to `main`
- localStorage — drafts, device name, user session
- Make.com webhook → Notion API — audit log of every proposal generated

---

## Features

### 1. Per-user login
Each user has their own email + password. Stored in `FGC_CONFIG.users` in `index.html`.

Current users:
| Name | Email | Password |
|------|-------|----------|
| Claudia | claudia@fgcadvisors.com | Miami.25! |
| Fabiana | fabiana@fgcadvisors.com | Biscay.25! |
| Meire | meire@fgcadvisors.com | Coral.25! |

To add a user: find `FGC_CONFIG.users` array and add `{ username: "email", password: "pass", display: "Name" }`.

### 2. Device nickname
On first login from a new device, the user is prompted to name it (e.g. "iPhone de Claudia", "Windows de Meire"). Saved to `localStorage` key `fgc_device`. **Never appears on proposals** — internal audit use only. Only set once per device/browser.

### 3. Save drafts
- **Save Draft** button saves the full form state to `localStorage` key `fgc_drafts`
- **Drafts** panel shows all saved drafts with:
  - **Reload** — repopulates form with saved data
  - **Delete** — removes after sending
- Drafts are per-browser (localStorage, not synced across devices)

### 4. Notion audit log
Every generated proposal fires a Make.com webhook → Notion database "FGC Proposal Log".

**Make.com webhook:** `https://hook.us2.make.com/8cx5wkgvxkqp5iqijupqs5ttyos8lxy5`
**Notion DB ID:** `95b1febf3f1d49d184f1e2d83365714e`

Payload fields: `client`, `user`, `device`, `services`, `language`, `brand`, `generatedAt`

**Local fallback:** if the webhook fails, the entry saves to `localStorage` key `fgc_failed_logs` so nothing is lost.

`_proposalLogged` flag prevents duplicate entries on re-generate. Reset on `resetProposal()`.

---

## Make.com scenario setup (for reference)
- Scenario name: "FGC Proposal Log" (was "New scenario")
- Trigger: Custom webhook (module 1)
- Action: Notion → Create a Data Source Item (module 2)
- Error handler: **Skip** on Notion module (so scenario never self-deactivates)
- Client field uses `ifempty` fallback: `{{ifempty(1.client; "Unnamed Proposal")}}`
- Schedule: Immediately as data arrives, 100 max runs/min

---

## Key localStorage keys
| Key | Contents |
|-----|----------|
| `fgc_user` | Logged-in user display name |
| `fgc_device` | Device nickname (set once) |
| `fgc_drafts` | Array of saved draft objects |
| `fgc_failed_logs` | Array of proposals that failed to log to Notion |

---

## Deployment
```bash
cd "/Users/amandaposthumacoelho/Desktop/Clients/FGC/Tools/Proposal Generator v2"
git add index.html
git commit -m "feat: description"
git push origin main
# GitHub Pages auto-deploys in ~1 min
```

Always validate before pushing — copy JS blocks into a `.js` file and run `node --check` if there's any doubt about syntax.

---

## Version history
- **Version June 1** — per-user login, device nickname, draft saving, Notion audit log, local fallback logging, Make.com unbreakable setup
