# Alt text — reference

Supporting detail for [SKILL.md](SKILL.md). Keep `SKILL.md` as the entry; load this file when scanning, classifying, or drafting.

---

## Core quality rules (evidence-aligned)

Great alt text is:

| Principle | Meaning |
|-----------|---------|
| **Accurate & equivalent** | Same meaning and **function** as the image in *this* context |
| **Succinct** | Usually a few words; aim **&lt; ~125 characters** unless complex-image exception |
| **Contextual** | Depends on role on the page — never describe in isolation |
| **Non-redundant** | No repeating adjacent headings/captions; no “image of …” |
| **Purpose-driven** | Why it’s there — not literal pixels unless appearance *is* the point |
| **Always present** | Every `<img>` needs an `alt` attribute — **even if empty** (`alt=""`) for decorative |

**Pitfalls:** filenames as alt, keyword stuffing, subjective words (“beautiful”), leaving alt off when content exists, decorative images with verbose alt.

---

## W3C-inspired decision tree

Before writing alt, answer in order (adapted from [W3C Images Tutorial](https://www.w3.org/WAI/tutorials/images/decisiontree/)):

1. **Does the image contain text?**
   - Text is already nearby as real text → often **`alt=""`** (decorative/redundant)
   - Text only for visual treatment → **`alt=""`**
   - Text has a **function** (e.g. icon) → describe **function**
   - Text is **unique** to the image → **transcribe** the text (concisely)

2. **Is the image a link or button and would purpose be unclear without it?**
   - Yes → describe **destination or action** (e.g. “View full report”, not “picture of document”)

3. **Does the image add meaning beyond decoration?**
   - Yes, simple photo/graphic → brief **meaning**
   - Yes, complex (chart, diagram, map) → **short summary** in `alt`; put details in body, `<figcaption>`, or linked description
   - Yes, but **redundant** with adjacent text → **`alt=""`**

4. **Purely decorative or no added meaning?**
   - Yes → **`alt=""`** (or prefer CSS `background-image` for purely decorative)

**Unclear?** Prefer a short purpose statement in context, or ask the user (mark **LOW** confidence).

---

## Framework image patterns and greps

Use `rg` (ripgrep) or project search. Adjust globs to the repo’s `src/`, `app/`, `content/` layouts.

**Exclude:** `node_modules/`, `dist/`, `.next/`, `build/`, `coverage/`, lockfiles unless user wants them.

### Next.js (`next/image`)

- Import: `from "next/image"` or `from "next/legacy/image"`
- JSX: `<Image` with props `src`, `alt`, often `width`/`height` or `fill`

**Example greps:**

```bash
rg '<Image\b' --glob '*.{tsx,jsx,js}'
rg 'next/image' --glob '*.{tsx,jsx,js}'   # import path
rg 'next/legacy/image' --glob '*.{tsx,jsx,js}'
```

**Rules:**

- `alt` is **required** for meaningful images; use `alt=""` when [decorative](#w3c-inspired-decision-tree).
- For `fill` layouts, `alt` rules are the same — size props don’t change a11y.

### React (non-Next)

- `<img` lowercase in JSX
- Design-system `Image` components: same as whatever prop they map to `alt` on the DOM

```bash
rg '<img\b' --glob '*.{tsx,jsx,js}'
rg '<Image\b' --glob '*.{tsx,jsx,js}'
```

If a wrapper passes `alt` through, set the wrapper’s `alt` prop per its docs.

### Astro

- `@astrojs/image` / `astro:assets`: `<Image`, `<Picture`

```bash
rg '<Image\b|<Picture\b' --glob '**/*.{astro,tsx,jsx}'
rg 'astro:assets|astrojs/image' --glob '**/astro.config.*'
```

**Rules:**

- Set `alt` on Astro `<Image>`; for `<Picture>`, set alt on the primary image per [Astro image docs](https://docs.astro.build/en/guides/images/).

### Vue / Nuxt

- `<img alt="static">` vs `:alt="dynamicFromCms"` — static marketing copy should be a plain string; bind only when data-driven.

```bash
rg '<img\b' --glob '*.{vue,tsx,jsx}'
rg '(:alt|v-bind:alt)\s*=' --glob '*.vue'
```

### Markdown / MDX

- `![alt text](url "optional title")`
- Raw HTML `<img>` inside MDX

```bash
rg '!\[[^\]]*\]\([^)]+\)' --glob '*.{md,mdx}'
rg '<img\b' --glob '*.{md,mdx}'
```

**Rules:**

- **Empty** markdown alt `![](url)` is usually an a11y gap — propose a real alt or move to decorative CSS.

### Plain HTML templates

```bash
rg '<img\b' --glob '*.{html,htm,vue,astro,svelte}'
```

---

## CMS content patterns

**Scope `cms`:** focus on `content/`, `data/`, `posts/`, `sanity-export/`, `*.json` frontmatter blocks, etc.

### Common shapes

| Shape | Where alt lives |
|-------|-----------------|
| **Frontmatter** | `image: { src, alt }` or `coverAlt:` |
| **Portable Text / rich text** | Image blocks with `asset` + `alt` field — **field name varies** |
| **Headless JSON** | `fields.file.url` + sibling `fields.title` or `description` — confirm which field is a11y-safe |
| **YAML collections** | Same as JSON; watch indentation |

### Sanity (illustrative)

- Image type often has `asset` + optional `alt`. If the schema has no alt, **flag as blocked** — schema/workflow change needed, not a one-line content fix.

### Contentful / similar

- Asset **description** vs **title** — prefer whatever your frontend maps to `alt`. If unclear, mark **LOW** and ask.

**Rule:** Never invent new CMS keys; match the repo’s existing content contract. If missing, add a table row: “Blocked — no alt field in schema/content model.”

---

## Framework-specific implementation notes

### Next.js `<Image>`

```tsx
import Image from "next/image";

<Image src={hero} alt="Concise description of the photo in context." width={800} height={600} priority />;
```

Decorative:

```tsx
<Image src={texture} alt="" width={32} height={32} aria-hidden />;
```

Use `aria-hidden` only when the image is **purely** decorative; pair with `alt=""` per team policy — don’t double-announce.

### React `<img>`

```tsx
<img src={url} alt="Meaningful short description" loading="lazy" decoding="async" />
```

### Astro `<Image>` (astro:assets)

Follow project imports; always pass `alt`:

```astro
<Image src={import('../assets/photo.png')} alt="Summary appropriate to the page." />
```

### Vue

```vue
<img :src="url" :alt="imageAltFromCms" />
```

Static marketing:

```vue
<img src="/hero.jpg" alt="Customers collaborating on a dashboard in an office." />
```

---

## Good vs bad examples

| Type | Bad | Why | Good |
|------|-----|-----|------|
| Informative (article) | `Image of a smiling woman in a spacesuit` | “Image of”, too generic | `Astronaut Ellen Ochoa` |
| Functional (logo link) | `Shield with longhorn` | Appearance, not destination | `University of Texas at Austin homepage` |
| Decorative | `Decorative swirl separator` | Noise for SRs | `alt=""` |
| Complex | `Sales chart` (vague) | No insight | `Line chart: revenue rising from $1.2M to $2.8M, Q1–Q4 2025` + data table in page |
| Text in image | `Blue infographic` | Ignores text | `Infographic: 40% faster loading; 25% more engagement; accessible to all users` |

---

## Quick checklist (every image)

- [ ] Has an `alt` attribute (or markdown equivalent)?
- [ ] Accurate to **context and purpose**?
- [ ] Succinct (~125 chars or less unless complex)?
- [ ] No redundancy with adjacent text?
- [ ] No “image of …” / filename-as-alt?
- [ ] Makes sense when read aloud with surrounding content?

---

## Verification aids (optional)

- **axe DevTools**, **WAVE**, **Lighthouse** “image alt” audits
- Screen readers: VoiceOver (macOS), NVDA (Windows)
- Re-grep after edits for `<Image` / `<img` without `alt` in touched files

---

## Further reading

- [W3C WAI: An alt Decision Tree](https://www.w3.org/WAI/tutorials/images/decisiontree/)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)
- [WCAG 2.2 Understanding 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
