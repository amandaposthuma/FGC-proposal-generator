# Proposal Generator v2 — bug tracker

v2 lives on the `v2` branch and is **not live**. The live site (`main`) runs the
Sept 10 build. Every bug found in v2 goes here, whoever finds it.

**Status:** `open` · `fixed` (on `v2`, not live) · `live` (merged to `main`) · `wontfix`
**Source:** who found it (Meire / Claudia / Fabiana / Amanda / QA = found while testing)

| ID | Found | Source | Area | Problem | Status | Fix |
|----|-------|--------|------|---------|--------|-----|
| B01 | Sep 22 | Meire | Cover | Title read "Proposta, Joao Maria". The client already appears under "Preparado para" | fixed | Title now names the work: "Constituição de sociedade nas Ilhas Virgens Britânicas", "Notarização e apostilamento" |
| B02 | Sep 22 | Meire | Letter | "Prezado(a) Dr.," with A/C "Dr. Leone": the salutation took only the first word | fixed | A title (Dr./Dra./Sr./Sra./Mr./Mrs./Ms.) keeps the surname and sets gender: "Prezado Dr. Leone," |
| B03 | Sep 22 | Meire | Letter, Seção 02 | "a constituição da Joao Maria": a person's name read as the thing being formed | fixed | Formation reads "a constituição de uma sociedade para Joao Maria junto ao …". Seção 01 drops the article ("Joao Maria pretende constituir…") |
| B04 | Sep 22 | Meire | Seção 02/03 | Contábil e Fiscal sat in Seção 02; in the previous version it came after Manutenção anual | fixed | Moves into Seção 03 whenever there is annual maintenance (fees and scope, item numbers follow). Accounting-only proposals keep it in Seção 02 |
| B05 | Sep 22 | Meire | Vencimento | "Primeira em 2027": would it change by itself? | fixed | It was computed from today's date; now from the proposal's Data field (a 2027 proposal says 2028). Month lower-case mid-sentence |
| B06 | Sep 22 | Meire | Documentos | "Aplicável a" column filled with the A/C contact's name | fixed | Generic "Cada acionista e diretor" (es/en too). Old drafts holding the token resolve to the same text |
| B07 | Sep 22 | Meire | Condições | Validity defaulted to 10 days, was 30 | fixed | Default 30. Drafts saved before this fix with 10 move to 30 |
| B08 | Sep 22 | Meire | Notarization-only | Titled "Transferência", "a transferência da Joao Maria", annual-maintenance paragraph, unfilled ⟦as frentes envolvidas⟧ and ⟦jurisdição⟧ | fixed | Own section title, letter, Seção 01 (what/objective), no maintenance paragraph, no jurisdiction blanks, no recommendation |
| B09 | Sep 22 | Meire | Drafts | "Perdi todas as propostas salvas" | fixed (live) | Nothing was deleted: v2 regenerated drafts saved before v2 instead of replaying them, so manual edits looked lost. Live is back on the Sept 10 build, which replays them. v2 drafts open on live in the old layout |
| B10 | Sep 22 | Meire | Process | Asked for a test environment so changes don't affect daily work | fixed | v2 moved to its own branch; live untouched. A test URL for the team is still to be decided (see open question) |
| B11 | Sep 23 | QA | Timeline | Every proposal said "5 a 15 dias úteis para constituição ou transferência", including notarization and dissolution | fixed | Uses the same service-specific text as the Prazos clause; hidden when there is nothing specific |
| B12 | Sep 23 | QA | Seção 01 | Changing services left the old generated text (a notarization kept "Constituir a sociedade…") | fixed | Generated text that no longer applies is replaced; anything the advisor typed is still never touched |
| B13 | Sep 23 | QA | Seção 01 | Formation with no situation picked printed "encontra-se ⟦situação atual⟧" | fixed | Formation defaults to "A constituir" |
| B14 | Sep 23 | QA | Wording | "de BVI", "em BVI" in letter, Seção 01 and Seção 03 intro | fixed | "das/nas Ilhas Virgens Britânicas"; es/en get "de las Islas Vírgenes Británicas" / "of the British Virgin Islands" |
| B15 | Sep 23 | QA | Objetivo | Formation said "regularizar" (nothing to regularise yet); dissolution said "Dissolver … e regularizar compliance" | fixed | Formation: "já em conformidade com…". Dissolution: "Encerrar formalmente a sociedade…". Accounting-only and restructuring get their own objective |
| B16 | Sep 23 | QA | Recomendação | Recommended succession planning after a dissolution, a notarization, or when a Will was already selected | fixed | Only after a formation or transfer without a Will |
| B17 | Sep 23 | QA | EN/ES | "the transfer for S&W"; Portuguese blank ⟦desde quando⟧ in ES/EN documents | fixed | "the transfer of"; ⟦desde cuándo⟧ / ⟦since when⟧ |
| B18 | Sep 23 | QA | Dashes | Em/en dashes in client text (Will add-on note, "Financial Statements – Prior Years") | fixed | Colon / parentheses |
| B19 | Sep 23 | QA | Title | Formation + notarization titled "de sociedades" (counted the notarization as a company) | fixed | Counts companies only |
| B20 | Sep 23 | QA | Letter | Letter didn't follow the services: "(one-off e anual)" and the maintenance paragraph printed with no maintenance | fixed | Letter generated from the services, like the other auto fields; an edited letter is never overwritten |
| B21 | Sep 24 | Meire | Print | PDF carried Chrome's header and footer (date, page title, URL, page number) on every page. Found on the live Sept 10 build; v2 had it on every page after the cover | fixed (live + v2) | `@page` margin 0, so Chrome has nowhere to print them. The margin is rebuilt as padding repeated on every page (`box-decoration-break: clone`). Live: on `#print-wrap`. v2: on a new `.doc-flow` wrapper after the cover, so the cover stays full-bleed. `DOC_FORMAT` 5 |
| B22 | Sep 25 | QA | Email | Email greeted "Prezado(a) Joao Maria," (the Sociedade field) while the letter greeted the A/C person; signature used a hyphen as a separator ("Meire - FGC Client Relations") | fixed | Email uses the letter's greeting when there is an A/C ("Prezado Dr. Leone,"); otherwise unchanged. Signature "Meire, FGC Client Relations" |
| B23 | Sep 25 | QA | Letter | If the letter text was ever emptied, the fallback greeting used the company's first word ("Prezado Joao,"), the bug CLAUDE.md already warns about | fixed | Fallback uses the same greeting as everywhere else |
| B24 | Sep 25 | QA | Custom entity | A custom formation (e.g. "Panama Foundation") printed the template objective with 4 blanks, title just "Constituição" | fixed | "Constituir a sociedade, já em conformidade…", title "Constituição de sociedade" |
| B25 | Sep 25 | QA | EN/ES | English formations kept the template objective (the check only knew "constitu…"); EN/ES titles lacked "de sociedad" / "Company"; two EN clauses still had em dashes (written as `\u2014`, so text searches missed them) | fixed | Checked 30 proposals (10 combinations × 3 languages): no dashes, no errors |

## Open questions

- **Test URL for the team.** Meire wants to test before anything goes live. Options:
  a `/teste/` copy on the same site (shares drafts with live, so testers use real
  drafts, but test proposals would also log to Notion unless disabled there), or a
  separate host. Waiting for Amanda.
- **Transfer with a person's name** in "Sociedade / cliente" still reads "a
  transferência da Joao Maria". For a transfer the field should hold the company
  name, so this is left as is.

## How v2 is tested (before every "fixed")

1. Meire's two cases: BVI formation + Contábil e Fiscal for "Joao Maria a/c Dr. Leone";
   notarization only.
2. Switch services on the same open proposal (stale text).
3. PT, ES, EN.
4. Save → reload → load, with another draft open first; plus a draft saved before
   the fix (docFormat 3) and one from before v2 (no `cover` key).
5. Sweep: US LLC, dissolution, Will, multi-jurisdiction, accounting-only,
   restructuring, transfer without agent change. Zero JS errors, no dashes.
6. Print to PDF (headless Chrome) and read the pages.
