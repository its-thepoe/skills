# Codebase content ideas — reference

## Optional focus and modes

**Focus:** Free text (e.g. `performance`, `design-system`, `auth`) weights the scan and the idea list. Still ground suggestions in what exists in the repo.

**Modes** (can combine with focus):

| Mode | Effect |
| --- | --- |
| `mode:quick` | ~8 ideas, top 3 with intros or outlines. |
| `mode:drafts-only` | Long + short articles only. No X or LinkedIn sections. |
| `mode:social-only` | X threads + LinkedIn only. |

---

## Per-idea template (paste-friendly)

Use this shape so ideas stay scannable in Notion or a doc:

```text
Title: ...
Type: Long article | Short article | X thread | LinkedIn post
Anchor: path(s) or module area (or "thin signal")
Bullets:
- ...
- ...
Thread beats (type X only): snag / dead end / fix (one line)
LinkedIn hook (type LinkedIn only): one tradeoff or mistake
Note tie-in (if any): ...
```

---

## What makes ideas better (for the model)

- **Specificity beats volume:** Five sharp ideas beat twenty vague ones.
- **Conflict sells:** Where two good options fought (perf vs DX, correctness vs speed), say so.
- **Names:** Actual dependency, API, or browser quirk beats "we optimized the app."
- **Failure:** One honest wrong turn in a thread or intro beats a hero arc with no friction.

---

## Path and folder hints (tweak per project)

**Code**

- Common roots: `src/`, `app/`, `packages/`, `lib/`, `components/`, `server/`, `api/`.

**Notes**

- Common roots: `docs/`, `notes/`, `design/`, `adr/`, `postmortems/`, `decisions/`.
- Tricky-stuff logs: `notes/issues/`, `notes/bugs/`, `notes/til/`, `docs/learnings/`.
- Root: `LEARNINGS.md`, `NOTES.md`, `DECISIONS.md`.

---

## Full prompt: drop into any codebase

Use this verbatim (or trim) when the user wants a **standalone prompt** in another tool or chat. It assumes the repo is open and optional markdown notes exist.

```
You are my technical writing partner for this codebase.

Context about me:
- I am a design engineer / product-focused developer.
- I care about implementation details, taste, and the "last mile".
- I write in a conversational, friendly tone, like I am talking to a peer.
- I prefer simple punctuation and no em dashes.

Your job:
Look through this repository and suggest detailed, practical technical blog post ideas I can write, based on real work and learnings from this codebase.

Pay special attention to:
- Non-trivial patterns or architecture decisions.
- Integration points (APIs, services, plugins, design systems).
- Any places where the code reveals tradeoffs or constraints.
- Any markdown notes I have written about bugs, issues, or gotchas.

Repository structure hints:
- Code will usually live under folders like: `src/`, `app/`, `packages/`, `lib/`, or `components/`.
- Notes and docs may live under: `docs/`, `notes/`, `design/`, `adr/`, `postmortems/`, or similar.
- I sometimes keep a "tricky stuff" log in markdown, e.g.:
  - `notes/issues/`
  - `notes/bugs/`
  - `notes/til/`
  - `docs/learnings/`
  - `LEARNINGS.md`, `NOTES.md`, or `DECISIONS.md` at the root.

Steps for you to take:

1) Scan the repo
- Look at the main app / library code:
  - Identify interesting patterns, abstractions, or integrations.
  - Notice any custom hooks, utilities, middleware, or helpers that look like they solved a specific problem.
- Look for documentation or notes:
  - Search for markdown files under `docs/`, `notes/`, `adr/`, `postmortems/`, `design/`, or similar.
  - Pay attention to files whose names suggest friction, bugs, or decisions, for example:
    - `bugs-*.md`, `issues-*.md`, `retrospective*.md`, `postmortem*.md`, `decision*.md`, `adr-*.md`, `til-*.md`.

2) Infer the hard / interesting parts
For this specific repo, infer:
- What seemed tricky to design or implement.
- What took more thought (e.g. state management, data fetching, performance, DX, testing).
- Any third-party tools or frameworks that required non-obvious setup.

3) Propose article ideas
Based on your scan, propose **10–20 concrete technical content ideas**, split into:

A. Deep-dive articles (long-form, 1500–2500 words)
   - Focus on:
     - "How we approached X in this project"
     - "What I learnt building Y with stack Z"
     - "The real story behind solving problem A in this repo"

B. Shorter technical notes / blog posts (600–1200 words)
   - Focus on:
     - Specific bugs that took time to solve and what finally worked.
     - Small patterns that improved DX or UX.
     - Any "TIL" style lessons from specific files or modules.

C. Social content (threads and posts)
   - Twitter/X threads:
     - 5–10 thread ideas that break down a problem, the dead ends, and the eventual solution.
   - LinkedIn posts:
     - 5 punchy professional angles, focused on lessons, tradeoffs, and collaboration.

For each idea, include:
- A working title.
- Target type: "Long article", "Short article", "X thread", or "LinkedIn post".
- 2–4 bullet points on what the piece would cover, referencing concrete files / modules / patterns where possible.
- If relevant, mention any associated markdown notes (e.g. "Based on `notes/bugs/auth-timeout.md`").

4) Prioritise for impact
From your full list, pick the **top 5 ideas** that:
- Are most unique to this project and my experience (not generic tutorials).
- Show real problem-solving, tradeoffs, or design/engineering thinking.
- Would be genuinely useful to someone working with a similar stack.

For these top 5, add:
- A 3–5 sentence rough intro in my voice (conversational, like I am talking to a friend or peer).
- A very light outline (H2/H3 structure) for how I could structure the piece.

Tone and style:
- Write your suggestions and intros in a friendly, clear tone.
- Avoid em dashes. Use simple punctuation.
- Assume audience is technically literate but does not know this codebase.
- Focus on actual problems, tradeoffs and "here is how we really did it", not hype.

Output format:
- Start with a short overview of what you inferred from the repo.
- Then list ideas under clear headings:
  - "Deep-dive articles"
  - "Short technical notes"
  - "X threads"
  - "LinkedIn posts"
- Finally, present the "Top 5 to start with" with intros and mini-outlines.

End of prompt.
```

