# Agentic Design Engineering Reference

This reference keeps the daily skill small while preserving the contracts needed for
multi-agent work.

## Role Contracts

| Role | Owns | May do | Must not do |
| --- | --- | --- | --- |
| Specifier | Problem understanding | Inspect context, clarify, define scope and acceptance criteria | Implement or silently decide material product behavior |
| Planner/Designer | Solution structure | Define flows, states, architecture, sequencing, and verification plan | Widen the contract or write production code without approval |
| Builder | Implementation | Edit code, reuse patterns, run local checks, record deviations | Redefine requirements or approve its own work |
| Critic | Adversarial review | Inspect the diff and experience against the contract; produce findings | Rewrite by default or accept claims without evidence |
| Fixer | Remediation | Address accepted findings and rerun targeted checks | Hide disagreements or change scope silently |
| Verifier | Independent evidence | Run tests, inspect the app, exercise flows, and report gaps | Treat compilation or the Builder's confidence as proof |

One agent may hold more than one role on a small task, but the Critique and Verify
passes must still be explicit. On medium and large tasks, use separate native agents
when available, especially for Critic and Verifier.

## Classification Worksheet

```text
Task:
Surface: UI | product | engineering | mixed
Scope points: __ / 6
High-risk trigger: none | auth | payment | privacy | destructive | data-loss | security | other
Uncertainty: low | medium | high
Chosen class: small | medium | large/high-risk
Workflow: ...
Why this level is enough:
```

If any high-risk trigger is present, use the large/high-risk workflow even when the
diff is small. If the task grows, re-run this worksheet rather than stretching a
small workflow past its design.

## Handoff Example

```text
Task: Add saved filters to the orders list
Role: Specifier -> Planner/Designer
Objective: Let an authenticated user save, rename, apply, and delete a filter.
Context/evidence: Existing filters live in OrdersToolbar; user settings use the
  existing preferences API; no saved-filter UI exists.
Decisions: Saved filters are private to the current account. Delete is reversible
  during the current session only if the existing toast undo pattern supports it.
Constraints: Reuse the existing menu, keyboard behavior, and mobile toolbar.
Artifacts: Acceptance criteria AC-1 through AC-7; state matrix; open API question.
Acceptance criteria for next role: Every action has loading, success, failure, and
  empty states; keyboard users can reach and operate saved filters.
Open questions: Does the API support ordering and a maximum count?
Known deviations: None.
```

Keep handoffs short enough that a receiving agent can act without reading a whole
conversation. Link to files, screenshots, test output, or commits rather than
copying large bodies of code.

## Shared Constitution

Apply this to every role:

1. The approved specification is a contract, not a suggestion.
2. Product intent, interaction quality, and implementation quality all matter.
3. Existing project instructions, patterns, and tests are evidence.
4. Assumptions are labeled and material uncertainty is escalated.
5. The simplest solution that satisfies the contract is preferred.
6. Unrelated cleanup does not belong in the task.
7. UI work accounts for loading, empty, error, success, disabled, responsive,
   keyboard, focus, and reduced-motion states when relevant.
8. Builders do not approve their own work.
9. No role declares success without evidence.
10. User-controlled, security-sensitive, privacy-sensitive, paid, and destructive
    behavior must be explicit.

Project-specific `AGENTS.md` rules may specialize these principles. They may not be
used as a reason to skip independent review or falsify verification.

## Parallelism Decision Table

| Work | Parallel? | Condition |
| --- | --- | --- |
| Two independent UI components | Yes | Separate ownership and shared contract already approved |
| UI implementation and test drafting | Sometimes | Test author does not need unresolved implementation details |
| Shared API and client integration | No | Contract must settle first |
| Database migration and dependent feature | No | Migration/schema is an upstream dependency |
| Independent read-only Critic reviews | Yes | Each receives the same approved contract and inspected artifact |
| Auth, payment, permission, or destructive behavior | Usually no | Keep decisions and verification sequential unless boundaries are proven |

Parallel work should produce separate artifacts or isolated worktrees. Do not merge
conflicting edits by guessing which role was right; return to the contract.

## Failure Matrix

| Failure | Correct response | Do not do |
| --- | --- | --- |
| Requirement is unclear | Use evidence, label assumption, ask one material question | Invent a requirement and present it as fact |
| Plan conflicts with spec | Return proposed change upstream | Let the Builder decide silently |
| Critic finds a blocker | Fix and rerun targeted review | Mark it accepted because the build passes |
| Verifier cannot access a flow | Report `not verified` and name the missing evidence | Claim the flow works from static inspection alone |
| Agents disagree | Compare artifacts and evidence; escalate intent decisions | Vote or merge both behaviors |
| Scope expands | Reclassify and reset acceptance criteria | Continue under a small-task label |
| Worktree merge conflicts | Pause integration and resolve against the contract | Delete a role's work without inspection |

## Pressure Scenarios

These are compact tests of whether the skill adds useful discipline without forcing
the full process onto every task.

### Scenario 1: Small UI fix

**Request:** “Move the close icon 4px inward on the mobile toast.”

Expected result:

- Classify Small: one component, obvious visual intent, low risk.
- Build: inspect the toast and responsive styles; make the smallest change.
- Critique/Fix: check the icon hit area, existing spacing tokens, desktop behavior,
  and reduced-motion/interaction regressions.
- Verify: run the focused UI check or inspect the rendered mobile and desktop states.
- Do not create Specifier, Planner, and six separate agents just to change one token.

### Scenario 2: Medium product feature

**Request:** “Add a saved-filter menu to the orders table.”

Expected result:

- Classify Medium: new interaction and persisted user behavior.
- Specify: define private ownership, add/rename/apply/delete behavior, empty and
  failure states, and acceptance criteria.
- Build only after the contract is clear; use existing menu, toast, and preferences
  patterns.
- Critic reviews keyboard access, mobile layout, duplicate names, loading, failure,
  and unintended cross-account visibility.
- Fix then Verify the actual user flow and persistence, not only component tests.

### Scenario 3: Large or high-risk feature

**Request:** “Add passkey login and let users delete their account.”

Expected result:

- Classify Large/high-risk immediately because auth and destructive behavior are
  involved.
- Specify user identity, recovery, confirmation, data-retention meaning, security,
  legal, accessibility, and failure requirements; escalate unresolved policy choices.
- Plan the server/client boundary, state machine, audit events, recovery path, and
  verification matrix before implementation.
- Keep auth, deletion, and UI work sequential unless contracts and ownership are
  genuinely independent; use isolated worktrees for safe parallel slices only.
- Critic independently reviews threat surface, consent and copy, keyboard/mobile
  behavior, and accidental deletion paths.
- Verifier exercises success, cancellation, expired challenge, unsupported device,
  recovery, and deletion failure; no “complete” without evidence.

## Self-Critique And Revisions

The first design risk was over-orchestration: applying six roles to every request.
The adaptive score and the Small path address that. The second risk was treating
agent separation as sufficient evidence; the completion contract now requires tests,
real-flow inspection, and explicit unverified areas. The third risk was copying
SwarmForge's runtime architecture; the skill now names tmux, dashboards, daemons,
queue files, and custom infrastructure as out of scope. The final risk was letting a
Planner or Critic silently change product intent; both roles must return contract
changes upstream and record decisions in the handoff.

## SwarmForge Distillation

Preserved principles:

- bounded role responsibility and independent quality gates
- explicit durable handoffs and a shared constitution
- isolated worktrees for safe parallel implementation
- configurable workflow size for small, medium, and large work
- completion based on evidence and handoff state

Discarded implementation details:

- tmux sessions and terminal-window management
- dashboard, attention rail, daemon, queue, and shell helper protocol
- branch-specific pack bootstrapping and custom runtime state

Source: https://github.com/unclebob/swarm-forge
