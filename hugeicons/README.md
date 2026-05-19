# @its-thepoe/hugeicons

**Agent Skill** — installs and uses **Hugeicons Free** correctly in React, Next.js, Vite, and TypeScript projects without hallucinated package names, JSX usage, or icon exports.

## What it does

Guides agents through the correct Hugeicons Free setup: install both `@hugeicons/react` and `@hugeicons/core-free-icons`, import `HugeiconsIcon`, import exact free icon exports, and render icons through `<HugeiconsIcon icon={SomeIcon} />`.

It also includes a resolver script that reads the installed Hugeicons package and searches real icon names so agents stop guessing names like `UserPlusIcon` when the actual export is different.

## Why it’s useful

- Prevents wrong package names and fake icon imports.
- Finds exact icon export names from `@hugeicons/core-free-icons`.
- Keeps icon buttons accessible with `aria-label`.
- Encourages `currentColor` so icons follow app theme styles.
- Avoids wildcard icon imports that can hurt bundles.

## Use when

- You want to add Hugeicons Free to a React, Next.js, Vite, or TypeScript project.
- An agent is failing with missing Hugeicons imports.
- You need the correct icon name for a concept like `search`, `user plus`, or `arrow right`.
- You want a small local wrapper around Hugeicons defaults.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install hugeicons
```

Or install [all skills](https://www.npmjs.com/package/@its-thepoe/skills).

## Icon name resolver

Run this from inside a project that has `@hugeicons/core-free-icons` installed:

```bash
node ~/.agents/skills/hugeicons/scripts/find-free-icons.mjs search
node ~/.agents/skills/hugeicons/scripts/find-free-icons.mjs user plus
node ~/.agents/skills/hugeicons/scripts/find-free-icons.mjs arrow right
```

## Contents

- `SKILL.md` — workflow, import patterns, accessibility rules, common fixes
- `scripts/find-free-icons.mjs` — searches exact free icon exports from the installed Hugeicons package

## Docs

- [Hugeicons](https://hugeicons.com/)
- [Hugeicons React Quick Start](https://hugeicons.com/docs/integrations/react/quick-start)
- [Hugeicons React Best Practices](https://hugeicons.com/docs/integrations/react/best-practices)
- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
