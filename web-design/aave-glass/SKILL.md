---
name: aave-glass
description: >-
  Use when building true refraction-style glass on the web, especially when the
  user wants Aave Glass, Liquid Glass-like DOM refraction, SVG
  feDisplacementMap, cross-browser glass, or Safari-safe lens effects. Not for
  generic backdrop-blur glassmorphism; use this when the glass must bend live
  rendered content or switch to WebGL for video/canvas surfaces.
argument-hint: "[component-or-surface]"
---

# Aave Glass

Use this skill when the glass effect needs to behave like a lens, not a frosted overlay.

## Core rule

- Do not fake this with only `backdrop-filter`.
- The target is live refraction of real rendered content.
- Prefer SVG `feDisplacementMap` for live DOM.
- Switch to WebGL when the surface cannot be reliably filtered with SVG, especially live video in Safari and canvas-driven pixels.

## What this effect actually is

- The lens bends the content inside it by displacing the content's own pixels.
- The displacement is driven by a generated map, usually a small PNG.
- The red channel controls horizontal bend.
- The green channel controls vertical bend.
- Pixels outside the lens stay at a neutral value so nothing moves there.
- The lens stays interactive because the underlying DOM is still the real DOM.

## Implementation workflow

1. Confirm the surface type:
   - Live DOM: text, buttons, cards, layouts, images in normal HTML
   - Canvas-drawn pixels
   - Live video
2. Choose the renderer:
   - Live DOM -> SVG filter with `feDisplacementMap`
   - Canvas or QR-like pixel surfaces -> WebGL shader fed by the same displacement map
   - Live `<video>` in Safari -> WebGL, not SVG
3. Define the lens geometry:
   - `lensW`
   - `lensH`
   - `borderRadius`
   - `scale`
   - `depth`
   - `curvature`
   - `splay`
   - `chromaAmount`
   - `blur`
   - `glow`
   - `edgeHighlight`
   - `specularAngle`
4. Generate the displacement map from the lens geometry.
5. Apply the map to the content:
   - DOM -> filter region follows the lens
   - WebGL -> shader samples the target texture using the same map
6. Add finishing passes:
   - faint chromatic fringe
   - rim light / edge highlight
   - specular highlight
7. Validate browser behavior:
   - Chromium
   - Safari desktop
   - Safari iOS
   - Firefox

## Surface patterns

### 1) Lens over live DOM

Use for:
- switches
- sliders
- segmented controls
- floating controls over layouts
- cards and interface shells

Rules:
- Refract the real rendered content, not a screenshot copy.
- Keep text readable through the lens.
- Preserve pointer interaction and selection.
- Move the filter region when the lens moves.
- Regenerate the map only when the lens shape changes.

### 2) Lens over highlighted duplicate content

Use for:
- switch thumbs
- selected segmented controls
- slider fills

Rules:
- Refract a highlighted copy of the fill or selected pill instead of the whole control when legibility would otherwise suffer.
- This keeps the glass tactile while preserving readable labels and value tracks.

### 3) Lens over canvas or QR-like pixels

Use for:
- QR codes
- custom canvas widgets
- non-DOM pixel surfaces

Rules:
- Reuse the same displacement map.
- Send the map into a WebGL shader.
- The renderer changes, the lens math does not.

### 4) Lens over live video

Use for:
- transport controls
- scrub bars
- floating video chrome

Rules:
- On Safari, do not rely on SVG filtering for live `<video>`.
- Use a single WebGL renderer that samples the playing video as a texture.
- Let each control own its own lens and displacement map while reading from the same video texture.
- Use stronger highlight and rim light because moving footage is the hardest legibility case.

## Performance rules

- Moving the lens should be cheap.
- Map regeneration should happen only when the lens shape changes, not when it only changes position.
- For symmetric rounded-rect lenses, compute one quadrant of the map and mirror it into the other three quadrants.
- Keep the filter region as tight as possible.
- Keep Safari surfaces conservative in size and DOM complexity.
- Treat highlight passes as expensive; restrict them to the lens area when the browser allows it without artifacts.

## Safari rules

- Safari caches SVG filter output by filter ID.
- If the map changes and the filter ID stays the same, Safari can freeze on stale output.
- Generate a fresh filter ID whenever the displacement map updates.
- Safari has a practical ceiling for source graphic size in SVG filters.
- Large or complex refracted DOM can break into blocks or disappear.
- Safari will not reliably feed live `<video>` pixels through the SVG filter pipeline.

## Component guidance from the Aave article

### Switch

- The lens acts as the thumb.
- Refract a copy of the track fill to create the moving internal highlight.
- Stronger refraction is acceptable because the fill is mostly visual feedback.

### Slider

- The lens rides the track.
- Use softer refraction than the switch so the progress fill stays readable as a value.
- Move only the filter region during drag.

### Toggle group

- Use the glass itself as the selection indicator.
- Refract a highlighted pill, not the labels behind it.
- Use spring motion instead of a rigid slide.

### QR code

- Render the code to canvas.
- Drive a shader with the same generated map.
- Use tap or press deformation for tactility.

### Video controls

- Wrap each control in its own lens.
- Sample the same playing video underneath.
- Prefer WebGL for Safari compatibility.

## Invariants

- Never call this “Aave Glass” if it is only blur, transparency, and borders.
- Never use Chromium-only techniques as the primary implementation.
- Never regenerate the full map every frame just because the lens moved.
- Never let the lens destroy text readability.
- Never ship without Safari testing when the effect is central to the UI.

## Minimal architecture sketch

```tsx
type LensConfig = {
  lensW: number;
  lensH: number;
  borderRadius: number;
  scale: number;
  depth: number;
  curvature: number;
  splay: number;
  chromaAmount: number;
  blur: number;
  glow: number;
  edgeHighlight: number;
  specularAngle: number;
};

function Glass({
  lens,
  x,
  y,
  refractionTarget,
  children,
}: {
  lens: LensConfig;
  x: number;
  y?: number;
  refractionTarget?: React.ReactNode;
  children: React.ReactNode;
}) {
  // 1) Generate or reuse the displacement map for the current lens shape.
  // 2) Move only the filter region when the lens position changes.
  // 3) Render DOM via SVG filter or route to WebGL for unsupported surfaces.
  return <>{children}</>;
}
```

## Use this skill for requests like

- “Make this feel like Aave Glass, not generic glassmorphism.”
- “Build a refractive lens over live HTML.”
- “Create a slider or switch with a moving glass thumb.”
- “Make this work in Safari too.”
- “Apply the same glass pipeline to DOM, canvas, and video.”

## Supporting file

- For source notes, browser constraints, and article-specific extraction, read [reference.md](reference.md).
