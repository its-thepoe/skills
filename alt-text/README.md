# @its-thepoe/alt-text

**Agent Skill** — finds images with missing, empty, or weak **alt text**, proposes concrete replacements, and applies edits only after you approve a **review table**.

## What it does

Scans your repo for image usage (including **Next.js** `next/image`, **React**, **Astro**, **Vue**, Markdown/MDX, and CMS-shaped JSON/YAML). It classifies decorative vs informative images, drafts alt text that matches what’s on screen, and walks a **review → apply** loop so you keep control over copy and risk.

## Why it’s useful

- Catches accessibility gaps before ship without hand-auditing every file.
- Gives **consistent**, context-aware phrasing instead of generic `"image"` placeholders.
- Separates **facts** (what the image shows) from **guesswork** when the asset is unclear.

## Use when

- You want an **a11y pass on images**, “fix alt text”, or “missing alt” work.
- You’re shipping marketing or app UI with lots of `img` / `Image` usage.
- You need a repeatable agent workflow, not a one-off manual list.

## Install into your agents

```bash
npx @its-thepoe/skills@latest install alt-text
```

Or install [all skills](https://www.npmjs.com/package/@its-thepoe/skills).

## Contents

- `SKILL.md` — workflow and rules  
- `reference.md` — framework greps, W3C-style decision tree, examples  

## Docs

- [Repository & troubleshooting](https://github.com/its-thepoe/skills)

## License

MIT
