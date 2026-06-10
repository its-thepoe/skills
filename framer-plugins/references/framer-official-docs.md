# Framer Plugin SDK — official documentation

If anything in this skill conflicts with **Framer** or **`framer-plugin` on npm**, treat Framer as correct.

## Canonical links ([Framer Developers](https://www.framer.com/developers/))

| Topic | URL |
| --- | --- |
| Developers hub | [framer.com/developers](https://www.framer.com/developers/) |
| Plugin quick start | [Plugins quick start](https://www.framer.com/developers/plugins-quick-start) |
| API reference | [Reference](https://www.framer.com/developers/reference) |
| Changelog | [Changelog](https://www.framer.com/developers/changelog) |
| Upgrading / breaking changes | [Upgrading](https://www.framer.com/developers/upgrading) |
| Plugins overview | [Plugins](https://www.framer.com/developers/plugins/reference) |
| CMS / collections | [CMS](https://www.framer.com/developers/cms) |
| Plugin modes | [Modes](https://www.framer.com/developers/modes) |
| Plugin UI (`showUI`, etc.) | [Interface](https://www.framer.com/developers/interface) |
| Permissions | [Permissions](https://www.framer.com/developers/plugins-permissions) |
| Storing data | [Storing data](https://www.framer.com/developers/storing-data) |
| Nodes / canvas from plugins | [Nodes](https://www.framer.com/developers/nodes) |
| `framer.json` | [Configuration](https://www.framer.com/developers/configuration) |
| Publishing | [Publishing](https://www.framer.com/developers/publishing) |

## Package version

- SDK: [`framer-plugin` on npm](https://www.npmjs.com/package/framer-plugin) — run `npm view framer-plugin version` in your project or globally to match docs to the version you ship.

## Refresh vendored files from upstream mirror

This repo’s `SKILL.md` / `references/*.md` are adapted from [fredm00n/framerlabs](https://github.com/fredm00n/framerlabs) (MIT). To pull the latest mirror (then re-apply your local `SKILL.md` frontmatter if needed):

```bash
SKILL_DIR="/path/to/skills/framer-plugins"
RAW="https://raw.githubusercontent.com/fredm00n/framerlabs/main/skills/framer-plugins"
curl -fsSL "$RAW/SKILL.md" -o "$SKILL_DIR/SKILL.upstream.md"
curl -fsSL "$RAW/references/api-reference.md" -o "$SKILL_DIR/references/api-reference.md"
curl -fsSL "$RAW/references/patterns.md" -o "$SKILL_DIR/references/patterns.md"
curl -fsSL "$RAW/references/pitfalls.md" -o "$SKILL_DIR/references/pitfalls.md"
```

Keep `references/framer-official-docs.md` when copying; merge `SKILL.upstream.md` into `SKILL.md` or restore portable frontmatter (`name`, `description`, `argument-hint`, scope lines).
