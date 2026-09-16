---
name: fgc-understanding-scope
description: Draft the "Entendimento e escopo" (Seção 01) block for an FGC proposal from raw notes — a client situation, a call summary, an email thread. Produces the four fields the Proposal Generator expects: O que entendemos, Objetivo, Escopo, Sugestão · recomendação. Use whenever someone is writing or revising the understanding/scope section of an FGC proposal.
---

# Entendimento e escopo — FGC proposals

Turn raw input (situation notes, a call recap, an email thread, a client's own
description) into the four blocks that open every FGC proposal.

## Output format

Return exactly four labelled blocks, ready to paste into the generator sidebar.
No preamble, no commentary after.

```
O QUE ENTENDEMOS
<1–3 paragraphs, one per line>

OBJETIVO
<one sentence>

ESCOPO
<one item per line, no bullet characters>

SUGESTÃO · RECOMENDAÇÃO
<one sentence, or omit this block entirely if there is nothing genuine to recommend>
```

Write in the proposal's language — Portuguese unless the notes or the request
say otherwise (also supports Spanish and English).

## What each block does

**O que entendemos** — restates the client's situation back to them, in plain
language, so they can see FGC understood it. This is the block that earns trust,
so it carries the specifics: entity name, jurisdiction, dates, the legal status
and what that status actually means in practice.

Explain jargon inline the first time it appears. The house pattern:

> A S&W Investment Company encontra-se "struck-off" do registro pelo Registrar of
> Companies de Cayman desde 30 de abril de 2024. O struck off significa que a
> sociedade perdeu sua existência legal, ou seja, não pode operar, assinar
> contratos ou movimentar contas até ser restaurada junto ao Registrar.

One paragraph per distinct fact. If there are two problems (struck off *and* a
resigned registered agent), that is two paragraphs, and the second says how it
compounds the first.

**Objetivo** — one sentence naming the end state, as a list of verbs:
"Restaurar a sociedade junto ao Registrar, nomear um novo agente registrado e
regularizar compliance, KYC e as taxas governamentais em aberto."

**Escopo** — the work itself, grouped by workstream, one line each. Keep them
short. Recurring work says so ("Manutenção anual", "Contabilidade anual").
Do not put prices here — the fee tables handle that.

**Sugestão · recomendação** — one forward-looking suggestion, conditional on the
work landing: "Concluído o reinstatement, sugerimos uma análise de planejamento
sucessório da estrutura em Cayman." Omit the block rather than invent one.

## Register

Short sentences. Specific over vague — real names, real dates, real
jurisdictions. Explain the technical term, then use it. Never sell inside this
section: no "parceria estratégica", no "soluções sob medida", no adjectives
doing work a fact should do.

## Facts

Use only what the notes contain. When something material is missing — the
struck-off date, the jurisdiction, who the shareholder is — write the block
without it and list what you need at the end under `FALTA CONFIRMAR:`. Never
fill a gap with a plausible guess; these paragraphs go to a client over FGC's
name.

## Where the output goes

The four blocks map one-to-one onto the sidebar fields in the Proposal Generator
(`index.html`): *O que entendemos*, *Objetivo*, *Escopo* (one item per line),
*Sugestão · recomendação*. They render as Seção 01 of the proposal.
