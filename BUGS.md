# Proposal Generator v2 — bug tracker

v2 lives on the `v2` branch and is **not live**. The live site (`main`) runs the
Sept 10 build. Every bug found in v2 goes here, whoever finds it.

**Status:** `open` · `fixed` (on `v2`, not live) · `live` (merged to `main`) · `wontfix`
**Source:** who found it (Meire / Claudia / Fabiana / Amanda / QA = found while testing)

**Mirrored in Notion:** "Gerador de Propostas: Feedback da versão de teste" (https://app.notion.com/p/58227b48524a4872bf684da19e929596). Every row here has a matching Notion row with the same ID in `Ref`. The team reports there.

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
| B26 | Oct 7 | Amanda | Greeting | With no A/C the letter said "Prezados," even when the client is a person | fixed | No A/C + a person in "Sociedade / cliente": "Prezado(a) Amanda," (N/M/F buttons pick Prezado / Prezada). A company name (Ltd, LLC, Inc, Holdings, Foundation, Trust, Ltda…) still gets "Prezados,". Email uses the same greeting |
| B27 | Oct 7 | QA | Names | Names typed in lower case printed that way ("para amanda") | fixed | A name typed all lower case prints capitalised ("Joao da Silva"); anything typed with capitals is left as typed |
| B28 | Oct 7 | QA | Phone layout | On a phone the sidebar fills the screen and the proposal is cut off on the right. Same in the current live version | open | Needs a phone layout (switch between form and document). Ask Amanda |
| B29 | Oct 7 | QA | PDF | Save PDF exported a proposal with copper ⟦blanks⟧ still in it (every proposal type tested had 1 to 6 left) | fixed | Save PDF lists the unfilled blanks and asks before exporting; with none left it exports straight away |
| B30 | Oct 7 | QA | Notion log | The "services" field in the Notion log listed two settings that aren't services ("fsIncludeAFR, maintPayTiming"). Also on the current live version | fixed (v2) | Only selected services are sent |
| B31 | Oct 20 | Meire | Letter | Several services (e.g. BVI formation + dissolution): the opening note mentions only the first. Wants it generic, since Escopo lists everything | fixed | Letter is generic ("…dos serviços solicitados"); Escopo lists the services. Maintenance paragraph only with maintenance |
| B32 | Oct 20 | Meire | Seção 02 | Mixed services: title says "Constituição e Transferência" but the section also holds Dissolução; groups formatted differently (PIC/US labels, subtotal in the middle); item numbers out of order (6, 8, 7) and one-off "anos anteriores" mixed with annual accounting | fixed | Seção 02 title names every kind of work ("Constituição, Transferência e Dissolução"; 4+ = "Serviços"); cover matches. Every group: label, PIC/US, table, subtotal. Numbers follow display order. Prior-year accounting (one-off) moved to Seção 02, recurring stays in Seção 03 |
| B33 | Oct 20 | Meire | Sidebar | "Linha adicional (opcional)" field is missing (removed Sept 18). Wants it back | fixed | Field back; prints under the client on the cover; saved/loaded with drafts and autosave (it never was, even in the current version) |
| B34 | Oct 20 | Meire | Wording | Is "Registrar of Corporate Affairs" correct? Appears in many places | fixed | "Registry of Corporate Affairs" (the office; FGC's own clauses already used it). Meire to confirm |
| B35 | Oct 20 | Meire | Transfer | Standard transfer = local RA + administrator. Some cases transfer only the administrator and the local RA stays; then the transfer fee can be a courtesy. Text must reflect which case | fixed | Standard transfer scope: "Transferência do agente registrado local e da administração…". Admin-only (courtesy) scope: "…o agente registrado local permanece o mesmo". Objetivo says which (or both, mixed) |
| B36 | Oct 20 | Meire | Seção 03 | "Manutenção anual (ano corrente)" row has no item number and the totals are unclear; compare with current system (1º ano vs a partir do 2º ano) | fixed | Current-year row carries its item number; totals read "Valor no 1º ano (na aceitação)" and "Valor anual a partir do 2º ano" |
| B37 | Oct 20 | Meire | Notarization | Notarization-only proposal includes clauses outside its scope (Compliance, Representação, Alterações). "Serviços de courier/postagem" missing from "O que não está incluído" (also in current system) | fixed | Courier back in "O que não está incluído"; notarization-only keeps Pagamentos, Prazos and the reputational-risk Compliance line only. Meire to confirm |
| B38 | Oct 20 | Meire | Pagamentos | "A FGC não garante a submissão… Demonstrações Financeiras, AFR e Tax Return" is the same on every proposal. Should name only what applies: AFR only BVI; Tax Return only US; FS not for US | fixed | Payment clause names only what applies: FS (offshore), AFR (BVI), Tax Return (US); dropped when none |
| B39 | Oct 20 | Meire | Dissolution | US dissolutions: "Tax Return Final" exists only for Florida and "FS Final" only for Delaware. Needs both for every state (or one separate option) | fixed | Tax Return Final and FS Final (LLC) available for every US dissolution; FL/DE still pre-tick theirs; listed after the dissolutions |
| B40 | Oct 20 | Meire | Prices | Thinks prices can't be changed (BVI dissolution went down from 5,500). The price box does work (checked: 4,000 applied), but it looks read-only. Table price also needs updating | fixed | Price box shows a pencil, dashed edge and tooltip; clicking it fills the table price, selected, ready to type over. No price changes (Amanda: none changed) |
| B41 | Oct 20 | Meire | FS/TR only | Objetivo/Escopo for FS or TR alone imply FGC does the client's bookkeeping. Must state the real scope and list "bookkeeping" under "O que não está incluído"; Escopo lines duplicate | fixed | Objetivo states what FGC prepares, from client-provided statements; Escopo names each service; "Bookkeeping (escrituração contábil)" listed as not included. Meire to confirm wording |
| B42 | Oct 20 | Meire | Seção 02 | Second sentence of the intro ("Custos de terceiros: taxas governamentais, agente registrado e cartório…") doesn't fit accounting and other services | fixed | Third-party list built from the services: government fees (formation/transfer/dissolution), registered agent (formation/transfer), notary (notarization); none for accounting |
| B43 | Oct 21 | QA | Seção 01 | With two jurisdictions "O que entendemos" said "de BVI e Flórida" | fixed | "das Ilhas Virgens Britânicas e da Flórida" |
| B44 | Oct 21 | QA (re-check of Meire's B34 screenshot) | Letter | A dissolution letter ended "o cuidado que a continuidade da sua estrutura … exige" | fixed | Dissolution-only: "o cuidado que ele exige" (pt/es/en) |
| B45 | Oct 21 | QA (re-check of Meire's item 11) | Seção 01 | FS/TR-only "O que entendemos" still described a company status (5 blanks that don't apply) | fixed | "X precisa das demonstrações financeiras anuais [e do Tax Return] referentes ao exercício de ⟦ano⟧. A contabilidade (bookkeeping) é mantida pelo cliente…" Meire to confirm |
| B46 | Oct 21 | QA (re-check of Meire's item 8) | Pagamentos/Prazos | Proposals without maintenance still said "Os honorários de manutenção anual passam a ser devidos…" and the good-standing line; Prazos said only "Esses prazos…" with no deadline | fixed | No-maintenance payment text; maintenance lines dropped; Prazos hidden when it has no deadline |
| B47 | Oct 21 | QA (re-check of Meire's item 5) | Transfer | Administrator-only transfer was locked to "Cortesia"; Meire said it *can* be a courtesy | fixed | Price box added: empty = Cortesia, a typed amount is charged |

## Test copy

v2 runs at **https://amandaposthuma.github.io/FGC-proposal-generator/teste/** (Oct 7).
`IS_TEST` (path contains `/teste/`) shows a copper "VERSÃO DE TESTE" bar (no mention of
Notion: the team doesn't use it), logs to Notion with "[TESTE]" before the client name,
and keeps its own autosave key. Drafts are shared with the live tool (same
site): deleting one in the test copy deletes it on live too. To refresh the test copy
after fixing something on `v2`: copy `index.html` from `v2` to `teste/index.html` on
`main` and push.

## Open questions

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
