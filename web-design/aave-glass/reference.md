# Aave Glass Reference

This file captures the concrete mechanics from Aave's article so the main skill can stay short and usable.

## Article takeaways

### Cross-browser claim

Aave explicitly contrasts three approaches:

- SVG `backdrop-filter` -> Chromium only
- HTML-in-Canvas API -> Chromium behind a flag
- Their technique -> Chromium, Safari, Firefox

The main takeaway is: do not anchor this skill to browser-flag APIs or Chromium-only glass tricks.

## The actual rendering model

The article's key idea is that the lens bends the content inside it, not pixels sampled from behind it.

- The content renders as normal.
- An SVG `feDisplacementMap` reads the lens map.
- The map tells each pixel how far to shift in X and Y.
- Because the content itself is what's displaced, text remains selectable and links remain clickable.

That is the important mental model for implementations.

## Displacement map details

The article describes the map as a small generated PNG:

- red channel -> horizontal displacement
- green channel -> vertical displacement
- neutral values outside the lens -> no movement

The interactive map demo in the article exposes these lens knobs:

- `Width`
- `Height`
- `BorderRadius`
- `Scale`
- `Depth`
- `Curvature`
- `Splay`
- `Chroma`
- `Blur`
- `Glow`
- `Edge Highlight`
- `Specular Angle`

Use those terms directly in implementations and reviews when this skill is applied.

## Component patterns mentioned in the article

### Switch

- The lens is the thumb.
- A copy of the track fill is refracted to create a moving highlight.

### Slider

- The same lens pattern is used.
- Refraction is gentler than on the switch.
- Moving the slider should shift the filter region, not force a new map each frame.

### Toggle group

- The lens becomes the selection indicator.
- It refracts a highlighted pill rather than the labels directly.
- It uses spring motion when moving between options.

### QR code

- The surface is canvas, not DOM.
- The same displacement map is passed into WebGL.

### Video player

- Each control gets its own lens.
- All lenses sample the same video.
- Safari live video requires WebGL because SVG filters do not get the video pixels.

## Safari constraints from the article

### 1) Filter ID caching

Safari caches SVG filter output by filter ID.

If the displacement map changes without a new filter ID:

- the old result can persist
- the lens can appear frozen

Practical fix:

- regenerate the filter ID whenever the map changes

### 2) Source graphic size ceiling

Safari has an upper limit on the size and complexity of the source graphic a filter can process.

Symptoms:

- mismatched blocks
- dropped effect
- inconsistent behavior across versions and devices

Practical fix:

- keep refracted areas conservative
- avoid giant full-page refracted regions on Safari

### 3) Video limitation

Safari composites live `<video>` on the GPU and does not reliably feed that surface into the SVG filter pipeline.

Practical fix:

- use WebGL for live video lenses

### 4) Highlight-pass cost

The specular highlight is a separate pass.

By default, its cost scales to the whole filter region.

Practical fix from the article:

- Safari can use a smaller lens-scoped read region for the highlight
- Chromium may show sub-pixel flicker when cropped too aggressively

That means browser-specific tuning is acceptable here.

## Performance technique called out by Aave

The article says the map is regenerated during squish or resize, so generation must be cheap.

Their optimization:

- rounded-rect lens has four-fold symmetry
- compute only the top-left quadrant
- mirror into the other three quadrants
- negate X across the vertical axis
- negate Y across the horizontal axis

This is a concrete implementation detail worth preserving in the skill.

## What this skill should reject

- generic glassmorphism based only on blur + opacity
- browser-flag-only solutions
- Chromium-only demos presented as production-ready
- full-map regeneration every frame during simple translation
- giant refracted DOM regions with no Safari footprint controls

## Suggested implementation stack

### DOM surfaces

- React or vanilla DOM
- SVG filter with `feDisplacementMap`
- dynamically generated displacement map asset

### Canvas / QR / video surfaces

- WebGL shader
- same displacement map
- per-lens geometry and highlight settings

## Source

- Aave, “Building Glass for the Web”: https://aave.com/design/building-glass-for-the-web
