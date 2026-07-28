---
name: wxt
description: >
  Use when building, debugging, migrating, or shipping a browser extension with WXT.
  Covers project bootstrap, WXT entrypoints, manifest config, browser targets, dev mode,
  ZIP/release flow, and WXT-specific gotchas like dynamic content scripts or background/content
  entrypoints being imported in Node during build. Prefer skill "tailwindcss" for styling-only
  work. Not for plain Vite apps or non-extension browser code.
argument-hint: "[feature, bug, browser target, or release task]"
---

# WXT

## When to use this skill

Use this for actual WXT work: creating a project, adding extension surfaces, fixing config,
targeting Chrome/Firefox/Edge, packaging builds, or troubleshooting WXT behavior.

Before changing code, check whether the repo already has:

- `wxt.config.ts`
- `entrypoints/`
- `public/`
- `modules/`
- a `wxt` dependency in `package.json`

If the repo is not already on WXT and the user asked for a migration, keep the migration small
and verify each extension surface after moving it.

## Workflow

1. Detect the project state.
   - Existing WXT app: extend the current structure instead of inventing a new one.
   - New WXT app: scaffold with `npx wxt@latest init`, `pnpm dlx wxt@latest init`, or `bunx wxt@latest init`.
   - From-scratch setup: install `wxt`, create at least one entrypoint, add scripts, then run `wxt prepare`.

2. Map the feature to the right entrypoint.
   - Background logic: `entrypoints/background.ts`
   - Browser action UI: `entrypoints/popup/`
   - Content script behavior/UI: `entrypoints/content.*`
   - Settings UI: `entrypoints/options/`
   - Devtools/new tab/side panel/unlisted pages: add the specific WXT entrypoint instead of forcing raw manifest edits first

3. Implement with WXT conventions, not generic Vite guesses.
   - Keep background and content-script runtime code inside the entrypoint loader's `main`/callback.
   - Use `defineConfig` in `wxt.config.ts` for manifest, browser startup, modules, imports, and build config.
   - Add permissions in `manifest`, and branch by browser or manifest version when support differs.

4. Run the smallest useful dev loop.
   - `npm run dev` / `pnpm dev` / `bun run dev`
   - Use `wxt -b firefox` or equivalent script when the bug is browser-specific.
   - If a repo has many surfaces, narrow work to the affected entrypoints instead of rebuilding everything mentally.

5. Package and release with WXT commands.
   - Build: `wxt build`
   - ZIP: `wxt zip`
   - Alternate browser: `wxt zip -b firefox`
   - Store submission automation: `wxt submit init`, then `wxt submit`

6. Verify the real extension behavior.
   - Confirm the target browser loads the extension.
   - Confirm entrypoints mount where expected.
   - Confirm requested permissions match actual APIs used.
   - Confirm browser-specific branches still build.

## Invariants

- Do not hand-edit generated output in `.output/`.
- Do not manually stuff dev-only content script registrations into the manifest just because dev mode does not show them there.
- Do not put browser runtime code at the top level of background or content-script entrypoints that WXT imports during build.
- Keep permissions as small as possible; split by browser or manifest version when needed.
- Prefer WXT modules and config hooks over ad-hoc build scripts when the change is WXT-specific.

## Checklist

- [ ] Confirmed whether the repo already uses WXT
- [ ] Used the correct WXT entrypoint type for the feature
- [ ] Kept runtime code out of forbidden top-level spots
- [ ] Updated `wxt.config.ts` instead of scattering manifest/build changes
- [ ] Ran the relevant dev/build/zip command
- [ ] Verified browser-target behavior and permissions

## Additional resources

- [reference.md](reference.md) — commands, structure, and WXT-specific gotchas
