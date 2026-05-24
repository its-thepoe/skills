# Tailwind CSS Reference

Use this when setup is non-standard or the project is mid-migration.

## Preflight checklist

- Identify framework (Next.js, Vite, Remix, Astro, CRA, etc.).
- Identify Tailwind major version (v3 vs v4).
- Identify CSS entry file and confirm it is imported.
- Identify build pipeline (Vite plugin vs PostCSS).
- Confirm content scanning covers files that contain class strings.

## Next.js monorepo + ESM pitfalls (high leverage)

If utilities don't apply but Tailwind "seems installed", assume **config resolution** is wrong until proven otherwise.

### 1) Working directory mismatch

In monorepos, `next dev` can effectively behave like it's running from a different root than you expect. If Tailwind config uses relative paths, content globs can silently stop matching.

Preferred fix:

```bash
cd apps/web && next dev
```

If you have a repo-level `dev:web` script, make it `cd apps/web && next dev ...` rather than `next dev apps/web ...`.

### 2) ESM repo breaks `.js` CommonJS configs

If your repo root `package.json` includes `"type": "module"`:

- `postcss.config.js` and `tailwind.config.js` are treated as ESM.
- `module.exports = ...` will throw `ReferenceError: module is not defined`.

Fix: use `.cjs` for those configs when you want CommonJS:

- `postcss.config.cjs`
- `tailwind.config.cjs`

### 3) Pin Tailwind's config in PostCSS (v3)

When Tailwind v3 is running through PostCSS, explicitly point it at the right config so it can't "discover" the wrong one (or none):

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: { config: "./tailwind.config.cjs" },
    autoprefixer: {},
  },
};
```

## Setup recipes (minimal)

### V4 + Vite

- Install: `tailwindcss` + `@tailwindcss/vite`
- Vite plugin enabled in `vite.config.*`
- CSS entry uses `@import "tailwindcss";`

### V3 + PostCSS

- Install: `tailwindcss` + `postcss` + `autoprefixer`
- `postcss.config.*` includes `tailwindcss` and `autoprefixer`
- `tailwind.config.*` exists with correct `content` globs
- CSS entry uses `@tailwind base/components/utilities`

## Migration notes (v3 -> v4)

- Replace v3 directives with `@import "tailwindcss";`.
- Replace PostCSS plugin config (`tailwindcss`) with `@tailwindcss/postcss` only if using PostCSS.
- Delete/adjust obsolete `tailwind.config.*` patterns when the project adopts v4 conventions.

## Migration checklist (v3 -> v4)

1. Snapshot the v3 baseline:
   - Identify current CSS entry file and verify classes apply.
   - Note current `tailwind.config.*`, PostCSS config, and integration points.
2. Upgrade dependencies (Tailwind v4 + integration).
3. Update CSS entry to v4 import.
4. Update build integration (Vite plugin or PostCSS plugin).
5. Keep `content` scanning accurate during migration (avoid “classes missing” false alarms).
6. Add a visible Tailwind test element and verify on a real page.
7. Fix plugin differences and any deprecated class usage surfaced by lint/build.
8. Re-run build/tests and confirm production build is correct.

## Troubleshooting checklist

- Is the CSS file with Tailwind imported?
- Are class names present as string literals in the built source?
- Does the framework use a non-standard source folder that content scanning missed (v3)?
- Are you using `class` vs `className` correctly for the framework?
- Are you fighting CSS specificity from an existing component library?

## Recommended UX defaults

- Buttons: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`
- Inputs: same focus-visible ring + clear invalid states
- Layout: mobile-first `sm:` `md:` `lg:` with small deltas
