# npm publish order (`@its-thepoe/*`)

Publish **skill content packages** first, then the **orchestrator** (`@its-thepoe/skills`), because the orchestrator lists them as `dependencies`.

Order matches [`publish-all.sh`](publish-all.sh):

1. `alt-text`
2. `design-and-refine`
3. `design-engineering`
4. `design-motion-principles`
5. `family-taste`
6. `figma-plugin-builder`
7. `framer-code-components-overrides`
8. `framer-plugins`
9. `canva-app-builder`
10. `codebase-content-ideas`
11. `market-command-matrix`
12. `root-cause-analysis`
13. `write-a-skill`
14. `prototype` (new — publish before orchestrator when releasing `@its-thepoe/prototype`)
15. `tauri-best-practices` (new — publish before orchestrator when releasing `@its-thepoe/tauri-best-practices`)
16. `skills` (package name `@its-thepoe/skills`)

From repo root after `npm login`:

Or run the bundled script (same order):

```bash
chmod +x scripts/publish-all.sh
./scripts/publish-all.sh
```

Individual publishes:

```bash
npm publish --access public -w @its-thepoe/alt-text
npm publish --access public -w @its-thepoe/design-and-refine
npm publish --access public -w @its-thepoe/design-engineering
npm publish --access public -w @its-thepoe/design-motion-principles
npm publish --access public -w @its-thepoe/family-taste
npm publish --access public -w @its-thepoe/figma-plugin-builder
npm publish --access public -w @its-thepoe/framer-code-components-overrides
npm publish --access public -w @its-thepoe/framer-plugins
npm publish --access public -w @its-thepoe/canva-app-builder
npm publish --access public -w @its-thepoe/codebase-content-ideas
npm publish --access public -w @its-thepoe/market-command-matrix
npm publish --access public -w @its-thepoe/root-cause-analysis
npm publish --access public -w @its-thepoe/write-a-skill
npm publish --access public -w @its-thepoe/prototype
npm publish --access public -w @its-thepoe/tauri-best-practices
npm publish --access public -w @its-thepoe/skills
```

For **`prototype`** and **`tauri-best-practices`** (skills + orchestrator):

```bash
chmod +x scripts/publish-prototype-and-cli.sh
./scripts/publish-prototype-and-cli.sh
```

Bump versions together when releasing. Run `npm run validate` before publishing.

## Scope access (`@its-thepoe`)

Publishing a **scoped** package requires you to be allowed to publish under that scope:

- If your npm **username** is `its-thepoe`, `@its-thepoe/*` maps to your user scope.
- Otherwise create or join an **organization** on [npmjs.com](https://www.npmjs.com/) named `its-thepoe`, or change every `package.json` `name` field to match **your** scope (e.g. `@youruser/alt-text`) before publishing.

If `npm publish` returns **404** on `PUT` for `@its-thepoe/...`, fix scope ownership first; if **401**, run `npm login`.

If publish fails with **EOTP** / “one-time password” but your account uses **browser-based** publish auth, rerun the remaining `npm publish --access public -w <pkg>` commands in an interactive TTY/shell. Non-interactive publishes can fall back to `EOTP` instead of showing the browser verification URL. Use a fresh authenticator code only if your account uses OTP-style 2FA.

If the OTP **expires** partway through publishes, run the remaining `npm publish --access public -w <pkg>` lines from this doc with a new code.

## Smoke tests (after publish)

```bash
npx @its-thepoe/skills@latest install --all --dry-run
npx @its-thepoe/skills@latest check
```
