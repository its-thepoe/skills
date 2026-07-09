---
name: unicorn-studio
description: >-
  Unicorn Studio embed skill for performance-safe embeds, sizing, and site
  builder pitfalls. Use when integrating generated visuals from Unicorn Studio.
argument-hint: "[embed]"
---

# Unicorn Studio

Use this skill for embedding Unicorn Studio visuals safely.

## Focus

- Treat the embed as a third-party runtime.
- Check sizing, autoplay, and responsiveness.
- Avoid blocking the main content with the visual.
- Verify it still behaves in the target site builder or CMS.

## Common checks

- Is the embed responsive?
- Is loading deferred when possible?
- Does the page still work if the embed fails?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install unicorn-studio
```

