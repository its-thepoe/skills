# npm publish order (`@its-thepoe/*`)

Publish **skill content packages** first, then the **orchestrator** (`@its-thepoe/skills`), because the orchestrator lists them as `dependencies`.

1. `alt-text`
2. `design-and-refine`
3. `design-engineering`
4. `design-motion-principles`
5. `family-taste`
6. `write-a-skill`
7. `skills` (package name `@its-thepoe/skills`)

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
npm publish --access public -w @its-thepoe/write-a-skill
npm publish --access public -w @its-thepoe/skills
```

Bump versions together when releasing. Run `npm run validate` before publishing.

## Scope access (`@its-thepoe`)

Publishing a **scoped** package requires you to be allowed to publish under that scope:

- If your npm **username** is `its-thepoe`, `@its-thepoe/*` maps to your user scope.
- Otherwise create or join an **organization** on [npmjs.com](https://www.npmjs.com/) named `its-thepoe`, or change every `package.json` `name` field to match **your** scope (e.g. `@youruser/alt-text`) before publishing.

If `npm publish` returns **404** on `PUT` for `@its-thepoe/...`, fix scope ownership first; if **401**, run `npm login`.

If publish fails with **EOTP** / “one-time password”, your account has **2FA** enabled. Use a fresh code from your authenticator:

```bash
NPM_OTP=123456 ./scripts/publish-all.sh
```

If the OTP **expires** partway through seven publishes, run the remaining `npm publish --access public --otp=... -w <pkg>` lines from this doc with a new code (or temporarily use an npm **automation** token / granular token if your org allows it).

## Smoke tests (after publish)

```bash
npx @its-thepoe/skills@latest install --all --dry-run
npx @its-thepoe/skills@latest check
```
