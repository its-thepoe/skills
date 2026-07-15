# Troubleshooting

This page keeps the more operational notes out of the root README.

## Install Issues

| Problem | What to do |
| --- | --- |
| `npx ...` returns `404 Not Found` | The package may not be published yet, the name may be wrong, or npm may be using stale cache. Try again with `@latest`, or use a fresh cache. |
| `check` reports `MISSING` | Run `install` or `sync` again, then confirm the target skill folder exists. |
| Skills do not appear in the agent | Restart or reload the editor/agent after install. |
| Symlink errors on Windows | Use `--strategy copy`. |

## Useful Commands

Check installs:

```bash
npx @its-thepoe/skills@latest check
```

Check installs and compare to npm:

```bash
npx @its-thepoe/skills@latest check --online
```

Use a fresh npm cache if `npx` seems stale:

```bash
npx --cache /tmp/its-thepoe-skills-cache @its-thepoe/skills@latest check
```

## Maintainer Notes

**Publishing: Terminal.app + [`scripts/publish-all.sh`](../scripts/publish-all.sh) — see [publish-step-by-step.md](publish-step-by-step.md).** Always `npm login` then `npm whoami` (must show `its-thepoe`) first. Browser 2FA only — never `NPM_OTP`. Do not publish from Cursor's agent shell.
