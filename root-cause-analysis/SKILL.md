---
name: root-cause-analysis
version: "1.1"
description: Engineering-grade RCA—mechanism chain, one violated invariant, evidence split from inference—with optional Fishbone (Ishikawa) buckets and 5 Whys depth when the problem warrants structure. Use when debugging, incidents, postmortems, systematic root cause, CAPA, fishbone, Ishikawa, or five whys. Diagnosis first; corrective actions only when asked or when using CAPA mode.
argument-hint: "[optional repro, incident id, template: default|fishbone|5whys|combined|capa]"
---

# Root cause analysis (diagnosis)

Treat **“why?”** and **“root cause”** as one job: get from what people see to a **defensible** explanation of what actually failed.

Structured methods (**Fishbone**, **5 Whys**, **combined**) are **tools for hypotheses and coverage**—not substitutes for mechanism, invariant, and evidence. Every candidate cause from a brainstorm must still be **validated** against facts (see [reference.md](reference.md)).

## Default contract

1. **Diagnosis first** — mechanism + invariant + evidence. Do **not** lead with a patch list unless the user asked to **diagnose and fix** in the same turn.
2. **Honesty** — if logs or code do not support a strong claim, say **Insufficient evidence** and list the smallest next observations to collect.
3. **No blame** — components, contracts, and invariants; not people.

## Definitions (use these words consistently)

| Term | Meaning |
|------|--------|
| **Symptom** | Observable failure (UI, error string, wrong output, crash). |
| **Mechanism** | The chain of events or logic that produced the symptom. |
| **Invariant** | A rule the system should uphold (e.g. “cache key includes route + user”). |
| **Root cause (primary)** | The earliest/simplest broken link that would stop recurrence under the same inputs—not merely the last edit. |

## Pick a mode (then still obey the contract)

| Mode | When | What you produce |
|------|------|------------------|
| **Default** | Single bug, stack trace, PR review, “why is this wrong?” | Symptom → evidence → mechanism → invariant → falsifiability (this file’s template). |
| **Fishbone** | Many plausible buckets (people, process, env, data, infra) | Categories filled with **evidence-backed** candidates → prioritize → validate top items to mechanism + invariant. |
| **5 Whys** | Linear cause chain suspected | Each answer is a **testable** fact or labeled **Hypothesis**; stop at system boundary; parallel chains if needed. |
| **Combined** | Major incident, recurring class, unclear scope | Fishbone to enumerate → 5 Whys on high-likelihood branches → single or multi-root summary + validation table. |
| **CAPA** | User explicitly wants corrective / preventive plan **after** RC | Only after validated causes: containment, corrective, preventive, systemic actions with owners and verification (see [reference.md](reference.md#corrective-action-planning-capa)). |

If the user names a template (`fishbone`, `5whys`, `combined`, `capa`), follow that structure from [reference.md](reference.md) while keeping **facts vs inferences** explicit.

## Core workflow (all modes)

### 1. Anchor on evidence

- Restate the symptom in neutral, measurable terms where possible.
- Gather the **minimum** evidence: repro, stack frame, assertion, state transition, request/response—before brainstorming.

### 2. Build the mechanism chain

Work **inward**: surface → UI/component state → data or side effects → I/O or platform. Each link: **testable** (“When X, path Y runs before Z completes”).

### 3. Name one violated invariant (per failure thread)

One invariant per independent failure. If two threads, label **Issue A** / **Issue B**.

### 4. Depth-limited “why”

“Why?” means **deeper mechanism**, not five guesses. Stop when the next layer is outside what you can verify.

### 5. Contributing factors

**Primary mechanism** + **secondary contributors** when the evidence supports it—no forced monocausality.

### 6. Falsifiability

**If we change [X], [Y] should stop under [Z].** — or mark **Hypothesis** and what would confirm or falsify.

### 7. Fixes and CAPA (only if asked)

- No fix section unless the user asked—or you are in **CAPA** mode after confirmed causes.
- Tie every action back to a **validated** root cause and a verification method.

## Output shape — default (markdown)

```markdown
## Symptom
…

## Evidence (facts)
- …

## Mechanism
1. …
2. …

## Root cause (primary)
One paragraph: broken link + **violated invariant**.

## Contributing factors (if any)
- …

## Confidence / falsifiability
Confirmed | Likely | Hypothesis — and what would change the verdict.

## Next evidence (if insufficient)
…
```

Fishbone, 5 Whys, combined, and CAPA output shells: [reference.md](reference.md).

## Anti-patterns

- **Last-change fallacy** — recent edit ≠ root cause without a mechanism.
- **Label as RC** — “timing issue”, “React”, “cache” without chain + invariant.
- **Story time** — long narrative with no repro, log, or code anchor.
- **Diagnosis-as-refactor** — big redesign smuggled in as “the root cause.”
- **Fishbone without validation** — brainstormed causes never checked against data or code.
- **5 Whys as five guesses** — each “why” not grounded in observable fact or explicit hypothesis.

## More detail

Methods, category sets (6M / 8P / 5S), full templates, Mermaid starters, YAML shape, external links: [reference.md](reference.md).
