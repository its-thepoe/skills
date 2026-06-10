# Framer Code Components & Overrides — official documentation

If anything in this skill conflicts with **Framer** or the **`framer`** package on npm, treat Framer as correct.

## Canonical links ([Framer Developers](https://www.framer.com/developers/))

| Topic | URL |
| --- | --- |
| Developers hub | [framer.com/developers](https://www.framer.com/developers/) |
| Code Components (intro + reference) | [Components reference](https://www.framer.com/developers/components-reference) |
| General API reference index | [Reference](https://www.framer.com/developers/reference) |
| When to use Code vs Overrides vs Plugins vs Fetch | [Comparison](https://www.framer.com/developers/comparison) |
| FAQ (npm, code limits, support) | [FAQ](https://www.framer.com/developers/faq) |
| Changelog (platform + API notes) | [Changelog](https://www.framer.com/developers/changelog) |
| Upgrading | [Upgrading](https://www.framer.com/developers/upgrading) |

If a URL moves, start from the [developers hub](https://www.framer.com/developers/) and use their navigation.

## Packages

- **Site / canvas code** uses the **`framer`** package APIs (`addPropertyControls`, `RenderTarget`, etc.). Check [framer on npm](https://www.npmjs.com/package/framer) and your Framer editor version.
- **Do not confuse** with **`framer-plugin`** — that is for editor plugins only (see the `framer-plugins` skill).

## Refresh vendored files from upstream mirror

This repo’s `SKILL.md` / `references/*.md` are adapted from [fredm00n/framerlabs](https://github.com/fredm00n/framerlabs) (MIT). To pull the latest mirror (then re-apply your local `SKILL.md` frontmatter if needed):

```bash
SKILL_DIR="/path/to/skills/framer-code-components-overrides"
RAW="https://raw.githubusercontent.com/fredm00n/framerlabs/main/skills/framer-code-components-overrides"
curl -fsSL "$RAW/SKILL.md" -o "$SKILL_DIR/SKILL.upstream.md"
curl -fsSL "$RAW/references/patterns.md" -o "$SKILL_DIR/references/patterns.md"
curl -fsSL "$RAW/references/property-controls.md" -o "$SKILL_DIR/references/property-controls.md"
curl -fsSL "$RAW/references/webgl-shaders.md" -o "$SKILL_DIR/references/webgl-shaders.md"
```

Keep `references/framer-official-docs.md` when copying; merge `SKILL.upstream.md` into `SKILL.md` or restore portable frontmatter (`name`, `description`, `argument-hint`, scope lines).
