---
name: pr-tldr
description: >-
  Always apply when the user asks for a PR TLDR, PR summary, pull request
  summary, branch summary, changelog-style PR brief, or "what changed in this
  PR". Produces concise but high-signal summaries grouped by intent, changed
  surfaces, risks, open items, and test plan.
argument-hint: "[pr-url-or-branch]"
---

# PR TLDR

Use this skill automatically whenever the user asks for a **PR TLDR**, **PR summary**, **pull request summary**, **branch summary**, **what changed in this PR**, **review context**, or a **short PR brief**. The user should not need to name this skill.

The goal is a useful human handoff: enough context for a reviewer, PM, or teammate to understand the shape of the PR quickly, without pretending the analysis is exhaustive.

## Contract

1. Inspect the actual diff, commits, and PR description when available.
2. Separate evidence from inference.
3. Group changes by product/system area, not by commit order.
4. Name risks, behavior changes, and open items honestly.
5. Include test/verification signals when available.
6. Do not invent certainty: say when something is inferred from file names or patterns.

## Gather Context

Use whichever inputs are available:

- PR description / linked issue / branch name.
- Commit list and commit count.
- Changed files and meaningful diffs.
- Existing tests, CI output, typecheck/build results.
- Prior review comments or unresolved threads if the user asks for re-review context.

If you cannot access the PR remote, summarize from the local branch diff and say what baseline you used.

Useful commands:

```bash
git branch --show-current
git status --short
git diff --stat main...HEAD
git log --oneline main..HEAD
```

Adjust `main` to the actual base branch when known.

## Output Shape

Start with this structure by default:

```markdown
## TL;DR

A [N]-commit branch that:

- [High-level change 1 and why it matters.]
- [High-level change 2 and why it matters.]
- [High-level change 3 and why it matters.]

## What Changed, Grouped

### [Area Name]

- [Concrete change with file/module evidence where useful.]
- [Concrete change with behavior impact.]

### [Area Name]

- [Concrete change.]

## Visual / Behavior Changes Worth Knowing

- [User-visible or workflow-visible change.]
- [Changed default, retired surface, new interaction, or migration note.]

## Honest Open Items

- [Thing not done, deferred, risky, or requiring follow-up.]
- [External dependency or companion PR.]

## Test Plan

- [Verification already run, if known.]
- [Manual checks a reviewer should run.]
```

Use headings that match the PR. For example, a backend-only PR may use **API**, **Data Model**, **Background Jobs**, and **Tests** instead of visual sections.

## TLDR Rules

- Keep the top TLDR to 3-7 bullets.
- Each TLDR bullet should combine **what changed** + **why it matters**.
- Prefer plain language over implementation jargon at the top.
- Put noisy details in grouped sections below.
- Do not bury breaking changes, migrations, deleted surfaces, or cost/security implications.
- Mention branch size honestly when it explains scope: "A 46-commit branch that..."

## Grouping Rules

Group by meaningful area:

- Product surface: "MapDock", "Add Pharmacy", "Checkout", "Admin".
- System layer: "Map engine + tiles", "Geocoding", "Markers", "Backend integration".
- Cross-cutting concern: "Tests / safety", "Accessibility", "Performance".

Within each group:

- Lead with the behavior change.
- Include filenames only when they clarify evidence.
- Collapse repeated small edits into one readable bullet.
- Use tables only when they make a bug/fix matrix much clearer.

Bug/fix table pattern:

```markdown
| Bug | Fix |
| --- | --- |
| [Observed problem] | [Specific fix and why it works] |
```

## Open Items

Always include open items when any exist. Good open items include:

- Follow-up phases not included in this PR.
- Companion backend/frontend PRs not deployed yet.
- Known performance tradeoffs.
- Product decisions still unresolved.
- Dead/orphaned code left intentionally.
- Tests not run or manual QA still needed.

If none are visible, say:

```markdown
No obvious open items from the available diff.
```

## Review State

If this is a re-review, include a short review-state block:

```markdown
## Review State

- Review iteration: Re-review, [N] commits since last review.
- Delta since last review: [Brief factual summary.]
- Active unresolved threads: [Count or "None visible".]
- Prior feedback status: [Appears addressed / partially addressed / not visibly addressed / unknown.]
```

Skip this section for a first-pass PR summary unless the user asks for review context.

## Surface Impact

Include this section when the PR touches many product areas, shared modules, APIs, auth, data models, billing, permissions, maps, search, or UI shells.

```markdown
## Surface Impact

| Surface | Impact |
| --- | --- |
| [Surface] | [Directly modified / likely impacted / external dependency.] |
```

If there is a known surface catalog in the repo, use it. Otherwise infer carefully from changed files and label it as best-effort.

## Safety Notes

- Add a short caution if the summary is generated from partial local context.
- Do not overstate test status. "Tests pass" only if evidence says they were run and passed.
- Do not claim a feature is shipped if the PR only prepares code behind a flag or dependency.
- Do not make legal, pricing, or vendor claims unless they are clearly supported by the diff or PR text.

## More Detail

Use [reference.md](reference.md) for the fuller checklist, examples, and optional extended templates.
