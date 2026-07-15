# AGENTS.md — maintainer invariants for this repo

## npm publish (non-negotiable)

The path that **finally worked** and must never be lost:

```bash
# Terminal.app / iTerm ONLY — not Cursor agent
npm login
npm whoami                # must print: its-thepoe
./scripts/publish-all.sh
```

- Full law: [`docs/publish-step-by-step.md`](docs/publish-step-by-step.md)
- Cursor rule (always apply): [`.cursor/rules/npm-publish.mdc`](.cursor/rules/npm-publish.mdc)
- Script: [`scripts/publish-all.sh`](scripts/publish-all.sh) — must keep a **real TTY**; never pipe `npm publish` through `tee` (causes redacted `auth/cli/***`)

Do **not** invent Bypass-2FA tokens, per-skill publish scripts, or agent-shell publish as the solution. Optional CI / Trusted Publishing is secondary and cannot first-publish brand-new packages.
