---
name: copywriting
description: >-
  Use when writing, rewriting, or reviewing copy for a product or its interface:
  homepages, landing pages, pricing, feature pages, onboarding, forms, buttons,
  empty states, errors, confirmations, notifications, settings, and lifecycle
  messages. Also use for UX writing, microcopy, product copy, voice and tone, CTA,
  or messaging consistency. Choose surface:marketing, product, or both. Keep
  conversion tactics out of security, consent, payment, and error states unless
  the product context supports them.
argument-hint: "[surface:marketing|product|both] [mode:write|review|voice] [page-or-flow]"
---

# Copywriting

Write and review the words that shape the whole product experience, from the first
marketing promise to the last recovery message. Start with the user's goal and the
product's truth. Make the next action clear without hiding trade-offs or inventing
behavior.

This is one unified skill with guarded surfaces:

- `surface:marketing`: public pages and messages that explain value and motivate a
  considered action.
- `surface:product`: in-product flows, interface copy, lifecycle messages, and
  states that help users complete tasks and recover from problems.
- `surface:both`: align the promise, terminology, voice, and experience across the
  marketing site and product. Use this when the user says “all product copy” or
  needs a complete copy system.

Modes:

- `mode:write` (default): create implementation-ready copy for the requested
  surface.
- `mode:review`: inspect existing copy and recommend prioritized improvements; do
  not edit files unless explicitly asked.
- `mode:voice`: derive or refine the voice and tone system, then demonstrate it on
  representative marketing and/or product copy.

If no surface is supplied, infer it from the request and state the inference. If a
request includes both page copy and UI flow copy, use `surface:both` rather than
applying one set of rules to every string.

## Non-negotiable principles

- Clarity beats cleverness. Specificity beats vague benefits and buzzwords.
- Use customer language when evidence exists; do not manufacture testimonials,
  metrics, urgency, or product capabilities.
- Active voice, familiar words, concise structure, and one clear idea at a time.
- A CTA names the result or next action. Avoid generic `Submit`, `OK`, `Learn more`,
  `Click here`, and `Get started` when the actual outcome is known.
- Marketing copy may persuade; product copy must orient, inform, and restore control.
- Never use confirmshaming, forced consent, disguised ads, false urgency,
  manipulative defaults, or copy that hides material consequences.
- Brand personality never outranks truth, informed consent, accessibility, or the
  user's ability to understand a consequential action.
- Preserve legal meaning, pricing, permissions, and error semantics. Flag decisions
  that require product, legal, design, engineering, or localization input.

## Workflow

### 1. Establish product and audience context

Inspect the repository or supplied product material before asking questions. Read
project instructions, README files, product/brand docs, routes, screens, copy
constants, translation files, support language, and relevant tests when available.
For a live product, use the supplied URL, screenshots, recordings, or specification.

Separate evidence into:

- **Verified:** directly observed in the product, code, supplied artifact, or source
  material.
- **Inferred:** a reasonable conclusion that must be labeled as an inference.
- **Needs evidence:** a possible issue that cannot yet be confirmed.

Gather only what the requested surface needs:

- Who is the audience and what job are they trying to complete?
- What does the product promise, and what must it never imply?
- What should the user feel before and after this page or flow?
- What is the primary action or outcome, and what alternatives matter?
- Which moments are high-stakes, irreversible, private, regulated, paid, or
  difficult to recover from?
- Which terminology, capitalization, person, formality, locale, and accessibility
  rules already exist?

Ask one focused question at a time when a missing answer would materially change the
copy. Start with the desired action or emotion. If the user does not know, propose
two or three labeled options and continue with a stated assumption rather than
blocking the work.

### 2. Derive the shared voice and tone

Before writing more than a few strings, define three to five voice attributes as
observable behavior. For each, include a product-specific `Do`, `Avoid`, and the
contexts where it becomes stronger or softer.

Then define tone by moment. Headlines can be bolder than supporting body copy;
onboarding can be welcoming; success can be warm; payment, privacy, security, and
failure states should become calm, direct, and precise. Humor is optional and never
an excuse to obscure a consequence or make an anxious user feel foolish.

Keep a shared terminology list across surfaces. A marketing promise must not use a
different name for the same object or action in the product unless the distinction
is intentional and documented.

### 3. Write or review the requested surface

#### Marketing surface

Establish the page purpose and one primary action. Then map:

- audience, problem, desired outcome, objections, and customer language
- offer, differentiator, proof, constraints, and traffic/source context
- message hierarchy: value proposition, benefits, evidence, objections, action
- page structure: headline, subheadline, primary CTA, sections, secondary CTAs,
  FAQs, and relevant metadata

Connect feature -> benefit -> outcome. Prefer concrete claims over “streamline,”
“innovative,” “powerful,” or “seamless.” Use rhetorical questions, analogy, or humor
only when they clarify the customer's situation and fit the voice.

CTA pattern: `[specific action] + [what the user gets]`, such as `Create your first
project` or `See the demo`. Keep alternatives purposeful, not a list of synonyms.

#### Product surface

Review copy inside the user's task, not as isolated prose. Inventory relevant flows:

- discovery and first-run onboarding
- signup, login, verification, password reset, and account recovery
- primary happy path and alternate paths
- forms, field help, validation, submission, retry, and disabled states
- loading, empty, partial, offline, timeout, success, and failure states
- permissions, privacy, security, consent, billing, cancellation, and deletion
- notifications, exports, sharing, integrations, support, and settings

For each flow, map the user goal, entry point, steps, decisions, copy surfaces,
possible failure, recovery action, and evidence location. Mark missing states `Not
observed` or `Needs evidence`; do not invent them.

Evaluate:

1. **Action clarity:** specific verb, clear result, label matches the outcome.
2. **State completeness:** initial, loading, empty, validation, error, success,
   offline, permission, expired, retry, and destructive confirmation where relevant.
3. **Emotional fit:** acknowledges the user's situation without blame, patronizing
   reassurance, or inappropriate cheerfulness.
4. **Plain language and accessibility:** familiar words, active voice, scannability,
   no double negatives, explain audience-specific jargon, support screen readers and
   text expansion, and never rely on color alone.
5. **Consistency:** same terms, person, capitalization, punctuation, dates, units,
   and action names across the product.
6. **Truth and recovery:** say what happened, what it means when useful, what to do
   next, and where to get help. Never expose an implementation code as the only
   explanation.

For errors, use only the parts that help recovery:

`[What happened]. [What it means, if needed]. [What to do next]. [Recovery action or
support path].`

For a non-actionable failure, explain what the product is doing and when to try
again instead of promising a fix that does not exist.

#### Both surfaces

Compare the promise users see before signup with the experience after signup. Check
that the same concept, benefit, action, and emotional expectation survive the handoff
from marketing to product. Do not force marketing energy into every product state;
the correct tone may become quieter when the user is completing a consequential task.

### 4. Prioritize and produce copy

In review mode, rank findings by user harm and reach:

- **P0:** blocks or misleads a critical, paid, security, privacy, or irreversible
  action; creates a serious trust or accessibility risk.
- **P1:** causes repeated confusion, preventable errors, dead ends, or inconsistent
  behavior in a common path.
- **P2:** improves clarity, tone, consistency, or polish without blocking the task.

Every recommendation includes location/evidence, current copy when available, the
problem, impact, recommended copy, rationale, and the next implementation or testing
step. Give one recommendation and up to two alternatives only when the trade-off is
useful.

In write mode, provide final copy grouped by page section, screen, component, or
translation key. Do not silently change product behavior. In voice mode, apply the
voice system to representative examples from every requested surface.

## Output

Return the sections relevant to the requested surface:

1. **Context:** audience, user goal, surface, scope, and primary outcome.
2. **Assumptions and questions:** verified, inferred, needs evidence, and decisions
   required.
3. **Voice and tone system:** attributes, do/avoid examples, state modulation, and
   terminology rules.
4. **Content or flow map:** page hierarchy for marketing; flow/state coverage for
   product; both when `surface:both`.
5. **Copy:** clean implementation-ready text grouped by location.
6. **Review findings:** priority, evidence, current copy, issue, impact,
   recommendation, rationale, and test/handoff note.
7. **Alternatives:** only for meaningful strategic or tonal choices.
8. **Copy system:** approved terms, CTA and error patterns, capitalization,
   punctuation, dates/numbers, localization, and length guidance.
9. **Handoff:** exact files, keys, screens, product/design/legal decisions, and
   regression or usability checks.

## Quality gate

Before finishing, verify that:

- every claim and recommendation is tied to evidence or labeled as an assumption;
- the primary action and its result are clear;
- product failures explain what happened and what the user can do next;
- marketing persuasion has not obscured product consequences or consent;
- voice is consistent without flattening important state differences;
- copy is concise because the interaction is clear, not because essential context
  was removed;
- localization, accessibility, text length, and testing risks are called out;
- unresolved product, legal, design, engineering, or content decisions are visible.

For detailed tables, patterns, and source synthesis, read [reference.md](reference.md).

## Related skills

- `design-engineering`: interaction feel and motion implementation
- `seo-audit`: search-focused review of page metadata and discoverability
- `pr-tldr`: concise handoff for a completed implementation or review
