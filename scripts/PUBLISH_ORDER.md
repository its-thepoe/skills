# npm publish order (`@its-thepoe/*`)

**Canonical path (always): Terminal.app + browser 2FA. No tokens.**

```bash
cd "/path/to/skills"
npm login
npm whoami   # must print: its-thepoe
./scripts/publish-all.sh
```

Or: `npm run publish:all`

Never run this from Cursor's agent shell. Full doc: [docs/publish-step-by-step.md](../docs/publish-step-by-step.md).

## What the script does

1. Refuses non-interactive shells (no TTY).
2. Checks `npm whoami` → must be `its-thepoe`.
3. Validates all workspaces.
4. Reads `package.json` → `workspaces` (skills first, orchestrator last).
5. Skips versions already on the registry.
6. On `EOTP`: with a real Terminal TTY, npm opens your browser and waits for approval (do not pipe publish through `tee` — that redacts the URL to `***` and skips the opener).

## Adding a new skill

Add its folder to `package.json` → `workspaces`. Then Terminal publish as above.

## 2FA

Browser / WebAuthn only. Never `NPM_OTP` / `--otp`.

When the script opens a URL and asks you to press Enter: approve in the browser, come back, press Enter.

Optional CI / Trusted Publishing (later, not required): see the optional section in [publish-step-by-step.md](../docs/publish-step-by-step.md).
