---
name: agentic-design-engineering
description: >-
  Use when a product or engineering task needs structured multi-agent reasoning,
  independent review, explicit handoffs, or design-and-build coordination; when
  the user asks for specifier, planner, builder, critic, verifier, swarm, agent
  workflow, or Specify -> Plan -> Build -> Critique -> Fix -> Verify. Scales the
  process to the task instead of adding ceremony to small changes. Prefer the
  existing design-engineering skill for UI polish only and never invent product
  requirements.
argument-hint: "[task] [mode:auto|small|medium|large] [surface:ui|product|engineering]"
---

# Agentic Design Engineering

Turn a product or engineering request into a small, evidence-driven workflow that
separates understanding, design, implementation, criticism, fixing, and verification.
The goal is not to create more agents. The goal is to stop one agent from defining
the problem, building the solution, and approving its own work.

This is a Codex-native workflow. Use available native subagents, task delegation,
parallel execution, and isolated worktrees when they genuinely help. Do not create
tmux sessions, dashboards, daemons, queue files, or custom swarm infrastructure to
imitate another tool. If native delegation is unavailable, run the roles as separate
explicit passes in the current task and preserve the same independence rules.

## Non-negotiable rules

- The original request, approved specification, and acceptance criteria are the
  source of truth.
- Mark assumptions. Never silently convert an inference into a requirement.
- Read project instructions such as `AGENTS.md` before assigning work. They override
  generic preferences when they do not violate this workflow's integrity.
- Inspect existing components, patterns, tests, and architecture before introducing
  new ones.
- Keep role authority bounded. A Critic finds problems; a Builder fixes them; a
  Verifier collects evidence. No Builder approves its own work.
- Review both dimensions: are we building the thing correctly, and are we building
  the correct thing for the user's goal?
- Preserve existing behavior unless the approved specification requires a change.
- Never declare completion from compilation alone.
- Stop and surface material product, security, privacy, payment, destructive-action,
  or legal decisions that cannot be resolved from project context.

## Workflow

### 1. Classify before orchestrating

Inspect the request and repository, then score the task. Start at zero and add one
point for each condition:

- more than one meaningful screen, component, service, or data boundary
- interaction, responsive, accessibility, or product-behavior uncertainty
- cross-system coupling, migration, or shared API/contract impact
- high user, security, privacy, payment, destructive-action, or data-loss risk
- unclear requirements, competing interpretations, or a new product decision
- broad regression surface or difficult-to-reproduce state

Use the highest applicable class, not only the score:

- **Small (0-2):** isolated copy/style/bug fix with an obvious intended behavior.
  Run `Build -> Critique/Fix -> Verify`.
- **Medium (3-4):** contained component, interaction, or feature with meaningful
  acceptance criteria. Run `Specify -> Build -> Critique -> Fix -> Verify`.
- **Large/high-risk (5+ or any high-risk condition):** new feature, architecture,
  auth, payments, destructive action, complex user flow, or broad refactor. Run
  `Specify -> Plan/Design -> Build -> Critique -> Fix -> Verify`.

These are defaults. Increase the process when uncertainty or risk is real; reduce
it when project evidence makes a stage redundant. State the chosen class and why.

### 2. Specify

The Specifier owns understanding the problem and must not implement it. Inspect the
relevant product and code context, then produce a compact specification containing:

- objective and user/job to be done
- in-scope and out-of-scope behavior
- users, entry points, and affected surfaces
- constraints, existing patterns, and non-functional requirements
- happy path, alternate paths, loading, empty, disabled, error, success, and
  responsive states where relevant
- accessibility, security, privacy, localization, and data considerations
- known requirements versus assumptions
- acceptance criteria and open questions

Ask the user only when the missing decision is material and cannot be safely inferred
from the repo. Ask one focused question at a time. Otherwise choose the safest
reasonable assumption, label it, and continue.

### 3. Plan/Design

For medium tasks, add planning when interaction or architecture is non-trivial. For
large tasks, the Planner/Designer owns the solution structure before implementation:

- user flow and state transitions
- interaction and responsive behavior
- component/data boundaries and reuse points
- accessibility and failure-state strategy
- implementation sequence and dependencies
- safe parallel work slices, if any
- verification plan mapped to acceptance criteria

The Planner may challenge the specification, but must return proposed changes to the
Specifier or user. It must not silently widen scope or write production code.

### 4. Build

The Builder implements only the approved specification and plan. Before editing,
inspect existing patterns and reuse them where they fit. Keep the diff focused, run
relevant checks, and record deviations, blocked work, and unresolved ambiguity in the
handoff. The Builder does not redefine acceptance criteria and does not issue the
final approval.

### 5. Critique

Give the Critic the approved specification, acceptance criteria, relevant diff, and
necessary project context. Do not give it the Builder's persuasive narrative unless
that context is itself an artifact under review. The Critic should assume the result
may be wrong until evidence shows otherwise.

Review:

- specification and acceptance-criteria compliance
- product intent, user flow, content, and interaction quality
- loading, empty, error, success, disabled, permission, and responsive states
- keyboard, screen-reader, focus, contrast, reduced-motion, and touch behavior
- code quality, maintainability, architecture, and existing-pattern fit
- security, privacy, data-loss, performance, and regression implications where relevant
- unnecessary complexity and missing tests

Each finding needs severity, exact location, evidence, why it matters, and an
actionable fix. Do not ask the Critic to rewrite the implementation unless it is
explicitly assigned the Fix role.

### 6. Fix

The Fixer addresses accepted Critic findings against the same specification. The
Fixer may reject a finding only with evidence and must record that decision. If a
finding exposes a missing or wrong requirement, return to Specify/Plan instead of
quietly changing the contract. Run targeted checks after each meaningful fix.

### 7. Verify

The Verifier is independent of the Builder wherever the task size or risk justifies
it. Test the result against the original intent, not only the implementation:

- run relevant unit, integration, type, lint, build, and security checks
- exercise the real user flow when possible
- inspect visual, responsive, keyboard, and assistive-technology behavior for UI
- test boundary, failure, permission, retry, and destructive states
- confirm Critic findings are resolved or explicitly accepted
- check for regressions outside the edited files

Report evidence for each acceptance criterion. Say `not verified` when execution was
not possible; do not replace missing evidence with confidence or a passing build.

## Role handoffs

Every handoff is a compact packet, not a narrative transcript. Include:

```text
Task:
Role:
Objective:
Context/evidence:
Decisions:
Constraints:
Artifacts:
Acceptance criteria for next role:
Open questions:
Known deviations:
```

Pass only the context the receiving role needs. The specification and acceptance
criteria persist unchanged through the workflow. For a multi-agent run, the sender
must identify the artifact or commit/worktree the receiver should inspect. For a
single-agent fallback, write the packet before switching roles so the next pass does
not rely on memory of the previous pass.

## Safe parallelism

Parallelize only after Specify and, when needed, Plan are stable. Work is safe to
parallelize when slices have clear contracts, disjoint ownership, and no unresolved
dependency. Good candidates include independent UI surfaces, documentation, and
read-only review or test design.

Keep work sequential when tasks touch the same files, shared schema/API contracts,
authentication or permissions, migrations, shared design tokens, ordering-sensitive
state, or unresolved product decisions. Use isolated native worktrees when parallel
implementation would otherwise contaminate or conflict with the main checkout.

## Failure and escalation

- **Ambiguous:** use repository evidence and label an assumption; ask the user only
  for a material decision.
- **Contradictory:** show the conflict and the affected acceptance criteria; do not
  choose silently.
- **Tests fail:** classify the failure, fix the cause, and rerun the relevant check.
  A failing check is not a completed handoff.
- **Critic rejects:** return to Fix. If the implementation is correct, provide
  evidence and record why the finding is not applicable.
- **Missing requirement discovered:** pause implementation and return upstream to
  Specify/Plan; do not expand scope invisibly.
- **Agent disagreement:** compare artifacts and evidence. Escalate product intent,
  security, privacy, legal, or irreversible decisions to the user.
- **Merge/worktree conflict:** stop the affected integration, preserve both changes,
  resolve against the approved contract, then rerun Critique and Verify.
- **Scope growth:** reclassify the task and add or remove stages deliberately.

## Completion report

For significant tasks, finish with exactly these sections:

**Built**
What changed and where.

**Verified**
Checks, flows, screenshots, or other evidence actually collected.

**Findings**
Remaining concerns, accepted risks, or unverified areas.

**Decisions**
Important assumptions, trade-offs, and user decisions.

For a small task, keep this to a few lines. Never say the task is complete because
the Builder says it is complete.

See [reference.md](reference.md) for the role contract, handoff examples, failure
matrix, and the three workflow pressure scenarios used to review this skill.

## Source note

This workflow preserves SwarmForge's responsibility separation, shared constitution,
explicit handoffs, worktree isolation, and adaptive two/four/six-role idea while
discarding its tmux, dashboard, daemon, and shell-specific implementation. Read the
[SwarmForge repository](https://github.com/unclebob/swarm-forge) when the distinction
needs more context.
