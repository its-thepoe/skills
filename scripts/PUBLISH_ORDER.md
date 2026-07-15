# npm publish order (`@its-thepoe/*`)

> **LOCKED path that finally works — do not replace.**
>
> Terminal.app only → `npm login && npm whoami && ./scripts/publish-all.sh`
>
> Full law: [docs/publish-step-by-step.md](../docs/publish-step-by-step.md) · Agents: [../AGENTS.md](../AGENTS.md) · Rule: [../.cursor/rules/npm-publish.mdc](../.cursor/rules/npm-publish.mdc)

```bash
cd "/path/to/skills"
npm login
npm whoami   # must print: its-thepoe
./scripts/publish-all.sh
```

Or: `npm run publish:all`

Never run from Cursor's agent shell. Never pipe `npm publish` (breaks TTY → unclickable `auth/cli/***`).

## What the script does

1. Refuses non-interactive shells (no TTY).
2. Checks `npm whoami` → must be `its-thepoe`.
3. Validates all workspaces.
4. Reads `package.json` → `workspaces` (skills first, orchestrator last).
5. Skips versions already on the registry.
6. Runs `npm publish` with a real TTY so npm opens the browser on 2FA.

## Adding a new skill

Add its folder to `package.json` → `workspaces`. Then Terminal publish as above.

## 2FA

Browser / WebAuthn only. Never `NPM_OTP` / `--otp`.

Optional CI / Trusted Publishing (later, not required): see [publish-step-by-step.md](../docs/publish-step-by-step.md).
