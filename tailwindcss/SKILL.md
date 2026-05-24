---
name: tailwindcss
description: >-
  Implement Tailwind CSS in an app without guessing version, config, or build
  wiring. Use when adding Tailwind, fixing "classes not applying", setting up
  dark mode, tokens/themes, setting up Tailwind v3 or v4, or migrating a
  project from Tailwind v3 to v4.
argument-hint: "[project-or-component]"
---

# Tailwind CSS

Use this skill when implementing Tailwind CSS (v3 or v4) or debugging why Tailwind utilities are not applying.

## Non-negotiable first step: detect Tailwind major version

1. Read `package.json`.
2. Determine Tailwind major version from the installed dependency:
   - Tailwind v4 rules are not the same as v3.
3. Apply the matching setup below.

If Tailwind is not installed yet, decide up front:

- New project that can follow modern guidance: prefer **Tailwind v4**.
- Existing project already on Tailwind v3: stay on v3 unless explicitly migrating.
- If the user asks for v3 specifically: install v3.

## Quick diagnosis (when styles are not applying)

Before changing anything:

1. Confirm Tailwind is installed (and the version).
2. Find the CSS entry file that should include Tailwind.
3. Confirm that CSS entry is imported by the app entrypoint.
4. Confirm content scanning includes your source files (v3 config) or you are using v4 correctly.
5. Add a visible test element and verify it renders with Tailwind classes.

Example test:

```html
<div class="m-4 rounded-md bg-blue-600 px-3 py-2 text-white">Tailwind OK</div>
```

## Next.js monorepos: the "Tailwind runs but generates no CSS" trap (v3 + sometimes v4)

Symptom pattern:

- Dev server runs, Tailwind appears "installed", but utilities do not apply.
- Tailwind warns it cannot find any classes / content, or the generated CSS is tiny.

Root cause (common in monorepos):

- Tailwind v3 only generates utilities for files it scans via `content` globs in `tailwind.config.*`.
- In a monorepo, Next can run with a different working directory than you think (especially when you run `next dev apps/web`, have multiple lockfiles, or the repo is ESM with `"type": "module"`).
- Relative paths inside `tailwind.config.*` and `postcss.config.*` then resolve from the wrong place, so Tailwind effectively scans nothing.

Hardening rules (do these when Tailwind scanning is flaky):

1. Run Next from the app directory (so all relative config paths line up):

```bash
cd apps/web && next dev -p 3000
```

2. Prefer `.cjs` for config files in ESM repos:

- If repo `package.json` has `"type": "module"`, then `postcss.config.js` / `tailwind.config.js` are treated as ESM and `module.exports` will crash.
- Use `postcss.config.cjs` / `tailwind.config.cjs` when you want CommonJS config.

3. If PostCSS is used, make it load the exact Tailwind config file explicitly (v3):

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: { config: "./tailwind.config.cjs" },
    autoprefixer: {},
  },
};
```

Verification:

- Add the "Tailwind OK" test element to a real page and refresh.
- Re-run `next dev` from inside the app folder.

## Setup selection (pick one)

- Tailwind v4 + Vite plugin (`@tailwindcss/vite`) is the clean default for Vite apps.
- Tailwind v3 often uses PostCSS (`tailwindcss` + `autoprefixer`) and a `tailwind.config.*` file with `content` globs.

## Tailwind v4 setup rules

- CSS entry must include:

```css
@import "tailwindcss";
```

- Do not use `@tailwind base/components/utilities` (those are v3 only).
- PostCSS plugin is `@tailwindcss/postcss` when using PostCSS.

### Vite (v4)

Install:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Vite config:

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

CSS entry:

```css
@import "tailwindcss";
```

## Tailwind v3 setup rules

- CSS entry must include:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- `tailwind.config.*` must exist and include correct `content` globs.
- PostCSS uses `tailwindcss` + `autoprefixer`.

Install (v3):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.cjs` example (safe in ESM repos):

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: { extend: {} },
  plugins: [],
};
```

## Migrate v3 -> v4 (safe workflow)

Do not “half migrate”. Pick one commit where Tailwind is definitely v4 and definitely wired correctly.

1. Confirm current v3 setup works (baseline).
2. Upgrade deps to v4 (and whichever integration you are using).
3. Replace CSS entry directives:

From v3:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

To v4:

```css
@import "tailwindcss";
```

4. Update the build integration:
   - For Vite: add `@tailwindcss/vite` plugin (recommended path for v4 + Vite).
   - For PostCSS: switch to `@tailwindcss/postcss` (only if the project uses PostCSS).
5. Validate `content`/scanning assumptions:
   - If you are still relying on v3-style `tailwind.config.*` `content` globs, keep them correct during the migration.
6. Add a visible test element and confirm Tailwind applies again.
7. Run typecheck/build/tests and fix class-name changes or plugin differences as needed.

If the user says “migrate v4 -> v3”, treat it as a downgrade: do the inverse steps and expect more friction.

## Dark mode

Decide which mode the project wants:

- `media` (system-driven): use `dark:` classes, no toggle required.
- `class` (manual toggle): add/remove `dark` class on `document.documentElement`.

When adding a toggle, persist preference in `localStorage`, and respect system preference on first load.

## Tokens and theming

Prefer built-in tokens over arbitrary values. Use opacity suffixes like `bg-black/10` instead of custom alpha literals.

If v4: prefer `@theme` in CSS for tokens.

If v3: prefer `theme.extend` in `tailwind.config.*` or CSS variables referenced by utilities.

## Common gotchas (don’t let the agent hallucinate)

- If Tailwind is installed but nothing works, it is almost always:
  - The CSS entry file is not imported.
  - The content scan does not include the files where classes are used (v3).
  - You used v3 directives in v4 or v4 import in v3.
  - You used dynamic class strings that Tailwind can’t statically detect.

Bad (won’t be detected reliably):

```tsx
<div className={`text-${color}-500`} />
```

Good (explicit options):

```tsx
<div className={color === "blue" ? "text-blue-500" : "text-red-500"} />
```

## Accessibility defaults

- Always include visible focus styles (`focus-visible:` ring/outline).
- Do not remove focus outlines unless you replace them with a better visible treatment.
- Ensure color contrast in dark mode, not just light mode.

## References

- Tailwind v3 installation: https://v3.tailwindcss.com/docs/installation
- Tailwind v4 + Vite installation: https://tailwindcss.com/docs/installation/using-vite
