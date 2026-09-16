# FGC Proposal Generator v2 — CLAUDE.md

---

## !! VERIFICATION REQUIREMENT — MANDATORY !!

**NEVER report a task as complete without first providing screenshot evidence.**

Before saying "done", "fixed", "working", or any equivalent:
1. Use the `verify` skill (or WebFetch the live URL) to take a screenshot of `https://amandaposthuma.github.io/FGC-proposal-generator/`
2. Show the screenshot proving the specific issue is resolved on the LIVE site
3. Only THEN report completion

This applies to ALL tasks on this project without exception.
The user has been given false "it's fixed" reports multiple times. **Visual proof is required. Your word alone is not accepted.**

**Item 1 specifics (top priority):** Input fields/boxes must NOT be visible in the generated proposal output. The service description must render as plain text with no editable boxes or form controls showing in the printed/generated proposal.

---

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

### 4. Proposal document format (v2 — Sept 2026)
Mirrors `Proposta_template_Reinstatement.docx`. Palette and type are scoped to
`#proposal-doc` so the app chrome is untouched.

| Token | Value | Use |
|-------|-------|-----|
| `--doc-navy` | `#041725` | cover, rules, section underlines |
| `--doc-muted` / `--doc-muted-2` | `#5C6B72` / `#6E8080` | secondary text, eyebrows |
| `--doc-cream` | `#F3F0EB` | subtotal rows, callout background |
| `--doc-accent` | `#B0542F` | recommendation callout, placeholder prompts |

Type: Hanken Grotesk body · **Georgia** section titles · **Roboto Mono** eyebrows and metadata.

Document order: **cover** → Apresentação (opening note + signature) → `Seção 01`
Entendimento e escopo → Honorários → Escopo dos serviços → O que não está incluído
→ Documentos necessários → Termos e Condições → Aceite.

Section numbers are assigned by `nextSecNo()` as the document renders, so an
empty optional section never leaves a gap. `secTCNum` is captured at render time
so the `6.1 / 6.2 …` sub-numbering always tracks its own section.

**Always-on sections.** Entendimento e escopo and Documentos necessários render
on every proposal. When a field is empty the document shows a terracotta dashed
`.doc-placeholder` prompt instead of silently omitting it.

**Reference codes.** `FGC-PROP-{CODE}-{YEAR}`, auto-derived from the selected
services by `computeRefCode()` — jurisdiction first (`CAY`/`BVI`/`BAH`/`NEV`/`US`),
then service type (`SUC`/`RES`/`CTB`/`NOT`/`BOI`), falling back to `GEN`. Typing in
the field switches to manual; ↻ returns to auto.

**Assets.** Client logo uploads per proposal and is stored in the draft. Scanned
signatures upload per advisor into `fgc_signatures` (keyed by advisor slug) and
are NOT stored in drafts — they belong to the advisor, not the proposal. With no
signature on file the Dancing Script cursive rendering is used as a fallback.

**Print.** `@page :first { margin: 0 }` gives the cover a true full-bleed A4
(210×297mm); content pages use `@page { margin: 16mm 12mm }`. The running header
and footer are `position: fixed`, which Chrome repeats on every printed page.

### 5. Notion audit log
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
| `fgc_signatures` | `{ advisorSlug: dataURL }` — scanned signatures, per browser |

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

```bash
node -e "
const fs = require('fs'), html = fs.readFileSync('index.html','utf8');
const s=[]; let i=0;
while(true){const a=html.indexOf('<script>',i); if(a===-1)break; const b=html.indexOf('</script>',a); s.push(html.substring(a+8,b)); i=b+9;}
fs.writeFileSync('/tmp/fgc_check.js',s.join('\n'));
" && node --check /tmp/fgc_check.js && echo "SYNTAX OK"
```

---

## Client-ready checklist — run before every "it's done"

1. **Test the exact client workflow** — fill form → save draft → reload page → load draft → generate
2. **Test with prior session state** — have another draft/custom items open first, then load the target draft
3. **Test with old-format data** — simulate a draft saved before the fix (missing new keys); confirm it loads cleanly

---

## Version history
- **Version June 1** — per-user login, device nickname, draft saving, Notion audit log, local fallback logging, Make.com unbreakable setup
- **Version Sept 15** — v2 proposal aesthetic matching `Proposta_template_Reinstatement.docx`: full-bleed navy cover with metadata grid, Apresentação opening note with scanned-signature slot, always-on Entendimento e escopo (Seção 01), Documentos necessários table, template-matching Aceite block (per-service Yes/No checklist removed), auto-generated `FGC-PROP-*` reference codes, client logo upload, `Seção NN` numbering. Added the `fgc-understanding-scope` Claude skill.
- **Version Sept 16** — template-fidelity pass: cover metadata rebuilt as ruled label/value rows (44%/56%, matching the source table); all document rules taken from the docx (`#041725` 1pt headers, `#D5D8DA` 0.5pt rows, `#DAD5CC` cover); cell shading removed everywhere (the source has none); one square bullet marker across every list; standard house text pre-fills the opening note and Entendimento e escopo, with `⟦tokens⟧` highlighted until filled.
- **Version June 17** — fixed fsAnterior/trAnterior crash; full draft save/load (custom items + overrides); Observações field (section 4.6); hasScope toggle on custom items; print margin CSS; loadDraft stale-data reset; custom transfer group fix (no more "PRIVATE INVESTMENT COMPANY" on non-PIC items); item ordering fix

## Known draft behavior
- Drafts saved **before Sept 15** have no `cover` key. `applyCoverState(null)`
  resets every new field to its default, so they load clean — the new sections
  show their placeholder prompts rather than stale content from the last draft.
- Drafts saved **before June 17** do not have `customTransfers`/`customOffshore`/etc. keys. Loading them now turns those toggles OFF cleanly (no blank forms). Users must re-save to get the new format.
- `"Registrar proposta manualmente"` button = retries failed Notion audit log entries stored in `fgc_failed_logs`. Internal use only, not shown to clients.
