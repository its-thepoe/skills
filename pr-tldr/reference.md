# PR TLDR Reference

Use this file when the PR is large, cross-cutting, or needs a more complete review handoff.

## Full Template

```markdown
## TL;DR

A [N]-commit branch that:

- [What changed + why it matters.]
- [What changed + why it matters.]
- [What changed + why it matters.]

## What Changed, Grouped

### [Area]

- [Concrete change.]
- [Concrete change.]

### [Area]

- [Concrete change.]

## Bug / Fix Matrix

| Bug | Fix |
| --- | --- |
| [Observed issue.] | [Implemented fix.] |

## Surface Impact

| Surface | Impact |
| --- | --- |
| [Surface] | [Direct / transitive / external dependency.] |

## Visual / Behavior Changes Worth Knowing

- [User-visible behavior change.]
- [Workflow-visible behavior change.]

## Honest Open Items

- [Follow-up.]
- [Known risk.]
- [Decision pending.]

## Test Plan

- [Automated test result.]
- [Manual QA check.]
```

## Evidence Checklist

Before summarizing, inspect as much of this as is available:

- PR title and description.
- Linked issues or companion PRs.
- Commit count and commit messages.
- Changed file list and diff stats.
- Meaningful diffs in touched modules.
- Test, typecheck, build, CI, and manual QA evidence.
- Review comments when summarizing a re-review.

## Good TLDR Bullets

Good bullets explain the change and the consequence:

- "Migrates the map renderer from Mapbox to MapLibre/OpenFreeMap, removing the paid map-token dependency for tiles."
- "Replaces separate desktop/mobile search surfaces with one responsive dock, reducing duplicated UI state."
- "Adds a backend fallback path so the frontend can ship before the new nearby endpoint is deployed."

Weak bullets only name files or implementation:

- "Changed MapContainer.tsx."
- "Updated components."
- "Fixed bugs."

## Group Names

Pick names that match the PR:

- Frontend shell / navigation
- Map engine + tiles
- Search / geocoding
- Markers / clustering
- Add/edit flow
- API integration
- Auth / permissions
- Data model / migrations
- Tests / safety
- Visual polish
- Cleanup / deletions

## Honest Language

Use:

- "Appears to..."
- "The diff suggests..."
- "No evidence found that..."
- "Not visibly updated in this PR..."
- "Pending companion PR..."

Avoid:

- "Definitely" when based only on filenames.
- "Fully fixed" without tests or direct evidence.
- "No risk" for broad/shared changes.

## Re-review Add-on

Use when the user asks for a re-review summary or when prior review state is available:

```markdown
## Review State

- Review iteration: [First review / Re-review], [N] commits since last review.
- Delta since last review: [What changed since the last review.]
- Active unresolved threads: [Count and theme, or "None visible".]
- Prior feedback status: [No prior feedback / appears addressed / partially addressed / not visibly addressed / unknown.]
```

## Surface Impact Add-on

Use when the repo has a surface catalog or the PR clearly touches shared systems:

```markdown
## Surface Impact

This is best-effort and may miss indirect dependencies.

| Surface | Evidence | Impact |
| --- | --- | --- |
| [Surface] | [Changed file or dependency path.] | [Direct / likely transitive / unaccounted.] |
```

## Short Mode

If the user asks for a very short summary, keep only:

```markdown
## TL;DR

- [3-5 bullets.]

## Open Items

- [Only if important.]

## Verification

- [Tests/CI/manual checks known.]
```
