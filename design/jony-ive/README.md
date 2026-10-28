# Jony Ive

A practical design partner grounded in Ive's documented thinking: critique an
existing product, compare concepts, reframe a brief, develop alternatives, or
improve a team's review practice. It applies principles to the actual context and
produces concrete recommendations, trade-offs, and prototype tests.

## Use

Invoke `$jony-ive` in Codex, `/jony-ive` in agents supporting slash skills, or ask
for an Ive-informed critique after installing the skill.

Examples:

- “Use jony-ive to critique this onboarding flow. What is the underlying problem?”
- “Compare these two product concepts. Which better serves the intended use?”
- “This feels wrong, but I don't know why. What would an Ive-informed approach change?”
- “Help us reframe the brief before drawing another version.”

## Install from this repository

Copy this **entire folder**, including `references/` and `agents/`, into your
agent's skill location. For a Codex project, from the clone's root:

```bash
mkdir -p /path/to/project/.agents/skills
cp -R design/jony-ive /path/to/project/.agents/skills/jony-ive
```

Personal paths include `~/.agents/skills/jony-ive` (Codex),
`~/.cursor/skills/jony-ive` (Cursor), and `~/.claude/skills/jony-ive` (Claude Code).
Reload your agent if the new skill does not appear. The package and CLI manifests
are prepared in this repo; pushing to GitHub does not itself publish to npm.

## What is inside

- [SKILL.md](SKILL.md): routing, workflow, output quality, and attribution rules.
- [Principles](references/principles.md): synthesis and counterweights.
- [Cases](references/cases.md): decisions across Apple and LoveFrom, with practical transfer.
- [Practice](references/practice.md): critique, comparison, reframing, development, and studio exercises.
- [Sources](references/sources.md): all 84 supplied bibliography entries, access status, and research notes.
- [Examples](examples.md): worked critiques across software, hardware, AI, and services.
- [Evaluations](evaluations.md): behavioural acceptance scenarios for future testing.

## Research coverage

Research snapshot: **28 October 2026**. The supplied bibliography is the starting
map, not evidence that every item was read. The source ledger distinguishes
consulted text, partial text, located material, unresolved entries, and repeated
recordings. Full books and unavailable films are not represented as ingested.
The working model uses consulted evidence and clearly identified applications.
It works offline; online checks can deepen an attribution when needed.

This is an independent interpretation of public sources, not an official skill,
an endorsement, or a simulation of Ive's private thoughts. Full copyrighted
articles, books, recordings, fonts, and images are not redistributed here.
