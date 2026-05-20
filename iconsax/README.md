# @its-thepoe/iconsax

**Agent Skill** — installs and uses Iconsax correctly in React, React Native, and TypeScript projects without hallucinated package names, JSX usage, or icon exports.

## What it does

Guides agents through the correct Iconsax setup: install `iconsax-react` for React projects, use the React Native package only for React Native projects, import exact named icon components, and render icons as direct components.

It also includes a resolver script that reads the installed Iconsax package and searches real icon names so agents stop guessing names like `SearchIcon` when the actual export is `SearchNormal`.

## Why it’s useful

- Prevents wrong package names and fake icon imports.
- Finds exact icon component names from the installed Iconsax package.
- Keeps icon-only buttons accessible with `aria-label`.
- Encourages `currentColor` so icons follow app theme styles.
- Avoids wildcard icon imports that can hurt bundles.

## Use when

- You want to add Iconsax to a React, Next.js, Vite, React Native, or TypeScript project.
- An agent is failing with missing Iconsax imports.
- You need the correct icon name for a concept like `search`, `user add`, or `arrow right`.
- You want a small local wrapper around Iconsax defaults.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install iconsax
```

Or install [all skills](https://www.npmjs.com/package/@its-thepoe/skills).

## Icon name resolver

Run this from inside a project that has `iconsax-react` installed:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs user add
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs arrow right
```

Print import-ready output:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search --import
```

Print JSX-ready output:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search --jsx
```

Add `--all` if you want every match instead of the single best match.

For React Native:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs --package iconsax-react-nativejs search
```

## Contents

- `SKILL.md` — workflow, import patterns, accessibility rules, common fixes
- `scripts/find-iconsax-icons.mjs` — searches exact icon exports from the installed Iconsax package

## Docs

- [Iconsax React docs](https://iconsax-react.pages.dev/)
- [Iconsax official site](https://iconsax.io/)
- [Iconsax React GitHub](https://github.com/premier213/iconsax-react)
- [Repository](https://github.com/its-thepoe/skills)

## License

MIT
