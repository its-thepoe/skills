---
name: prototype
description: >-
  Explore a UI concept by producing five genuinely different, working design
  directions in one self-contained HTML prototype. Use for prototypes, mockups,
  sketches, flows, screens, components, and visual comparisons. Enforces
  grounded product content, strong hierarchy, accessible tokens, meaningful
  interaction states, and an anti-AI-slop visual review before delivery.
argument-hint: "[concept to prototype]"
---

# Prototype — five directions, one usable document

Turn the user's concept into five credible product directions, not five skins
of one layout. The prototype is a design instrument: it must make tradeoffs
visible, allow interaction, and be specific enough that a developer could build
the chosen direction.

If the concept is too vague to design against, ask at most two short questions
about the user, platform, or primary task. Otherwise make a reasonable
assumption, state it briefly in the document, and continue.

## 1. Ground the product before styling it

Write a private preflight before coding:

- **User and job:** who is acting, what are they trying to accomplish, and what
  decision or task is the screen supporting?
- **Object and state:** what is being created, edited, moved, deleted, shared,
  or reviewed? Is this the default, empty, loading, error, success, or
  destructive-confirmation state?
- **Constraints:** platform, viewport, existing product language, data model,
  permissions, reversibility, and accessibility requirements.
- **Success:** what should the user understand or do within five seconds?

When the concept belongs to an existing product, prototype the requested
surface inside that product's language. Do not invent a complete replacement
app shell unless the user asked for one. If screenshots or local reference
assets are supplied, study them first and preserve their useful content,
terminology, and visual conventions.

Do not invent consequential product facts. If a value is unknown, use an
obviously neutral but plausible value and keep it internally consistent. Never
use filler such as “seamless,” “next-gen,” “orchestration layer,” fake runtime
labels, or unexplained enterprise jargon.

## 2. Make the five directions actually different

Each direction must change at least three of these dimensions:

| Dimension | Examples |
| --- | --- |
| Interaction model | centered dialog, side sheet, inline guardrail, command surface, staged review |
| Information hierarchy | consequence-first, object-first, choice-first, progressive disclosure |
| Spatial composition | centered, anchored rail, split editorial, list/detail, canvas/contextual |
| Density | calm sparse, compact pro-tool, media-led, data-led, guided |
| Visual language | quiet utility, editorial, warm tactile, technical, high-contrast |

The five directions must not share the same sidebar, search field, three-card
grid, modal proportions, and only swap the title or accent color. A direction
fails if its structure can be described as “the same screen, recolored.”

Before writing markup, create an internal five-row matrix with each direction's
name, interaction model, hierarchy, layout, and visual language. If two rows
are too similar, redesign one before coding.

Give each direction a short name and a one-sentence rationale that explains the
tradeoff and intended user/context. The rationale is documentation; the mockup
itself must communicate the design without relying on the explanation.

## 3. Use real content and real states

Every iteration is a real mockup, not a mood board. Include content that proves
the design works:

- concrete object names, counts, dates, or statuses where the concept needs
  them;
- copy that states what changes, what stays safe, and what happens next;
- a believable default state plus at least one meaningful interaction state;
- destructive actions with accurate reversibility and an explicit consequence;
- focus, hover, disabled, loading, success/undo, or validation states where
  they materially affect the flow;
- responsive behavior for the likely target viewport and a narrow viewport.

Never use blank gradient rectangles as pretend images, decorative “cards” with
no purpose, repeated fake thumbnails, or placeholder UI that hides whether the
layout works. If visual media is important, use a meaningful inline SVG, a
small CSS diagram, a local asset, or a clearly labeled content placeholder with
an actual role. Do not use remote images or image URLs in the self-contained
file.

For destructive flows, do not write generic “Are you sure?” copy. Name the
object, scope, permanence, affected locations/devices, and recovery path. The
primary action must say what it does: “Move to trash,” “Delete permanently,”
“Erase local files,” etc. Do not claim cloud or local behavior unless the
concept establishes it.

## 4. Establish a restrained design system first

Define a compact token set before building the five views. Use the project's
existing system when one exists; otherwise choose deliberately:

- an OKLCH-based palette with a clear surface, text, muted-text, border, and
  accent hierarchy; check contrast rather than trusting a dark theme;
- one display/body font family or one deliberate pairing, with a semantic type
  scale and unitless line heights;
- a spacing rhythm, controlled measure, and consistent hit areas;
- radii and shadows that have a reason. Use concentric radii for nested
  surfaces, but do not put every element in a rounded box;
- motion tokens for interactive transitions, with transform/opacity preferred
  over layout properties and reduced-motion behavior.

Do not force a “premium” dark aesthetic. Choose light, dark, or mixed surfaces
from the product context. Do not default to purple/blue gradients, glowing
edges, glassmorphism, grain, or giant rounded wrappers. One strong visual idea
beats a pile of effects.

Typography is structural: headings must have a clear descending hierarchy,
headings use deliberate wrapping, body copy has a readable measure, dynamic
numbers use tabular numerals, and small text must remain legible. Never let
low-contrast muted text carry essential meaning.

## 5. Build the self-contained document

Save the result to `prototypes/<concept-slug>.html`. Create `prototypes/` only
if it does not exist. The file must contain all CSS and JavaScript inline and
must work offline: no CDNs, external stylesheets, web fonts, remote images, or
network-dependent behavior. Use semantic HTML and inline SVG for icons and
diagrams. Avoid emoji as primary product icons; their appearance varies by OS.

The shell must be quiet and useful:

- a light, readable navigation bar or rail lists `1`–`5` and each direction's
  name;
- clicking a tab and pressing keys `1`–`5` switches directions;
- the active tab is visibly active and keyboard-focusable;
- document `<title>` and the main `<h1>` name the concept;
- the shell must not compete with or obscure the mockup;
- do not include host-app/browser chrome in the prototype itself.

Keep the rationale outside the product surface or in a restrained caption. Do
not fill the page with repeated explanations, design jargon, or decorative
metadata.

## 6. Interaction and accessibility minimums

Implement only interactions that help evaluate the concept, but make those
interactions real:

- buttons and tabs are actual buttons with labels;
- keyboard focus is visible and the tab order is sensible;
- dialogs/sheets have close and cancel behavior, and Escape works where
  appropriate;
- destructive confirmations cannot be triggered by an unlabeled icon alone;
- touch targets are at least 44×44px where practical, 40×40px minimum on
  desktop;
- contrast is checked for text and controls;
- `prefers-reduced-motion` disables nonessential transform-based animation;
- responsive layouts do not rely on horizontal overflow or tiny controls.

Use transitions for interactive states and short, interruptible motion. Never
use `transition: all`; never animate `top`, `left`, `width`, or `height` for
polish. Do not add animation merely to make a static mockup look busy.

## 7. Anti-slop rejection pass

Before delivering, inspect the actual HTML at desktop and narrow widths. Reject
and revise if any answer is “yes”:

### Structure

- Are the five directions mostly the same shell, grid, and modal with changed
  labels?
- Is a full invented dashboard surrounding a small requested component?
- Are there cards inside cards inside cards without a clear semantic reason?
- Does the composition feel centered, symmetrical, and template-like by
  default rather than intentionally composed?
- Is the first viewport overcrowded or mostly empty because the hierarchy was
  not solved?

### Content

- Are there blank gradients, generic thumbnails, or repeated filler blocks?
- Could any label be deleted without losing product meaning?
- Is copy explaining that a design is “premium” instead of helping a user act?
- Are counts, cloud/local claims, recovery behavior, or permissions invented or
  contradictory?
- Does a destructive button say exactly what will happen?

### Visual system

- Is essential text too dim on the chosen surface?
- Are all controls pills, all containers rounded, or all surfaces the same dark
  gray?
- Are generic AI gradients, glows, harsh borders, or giant shadows doing the
  work instead of hierarchy and spacing?
- Are fonts, sizes, line lengths, or heading levels inconsistent?
- Are icons inconsistent, oversized, or used as decoration rather than
  communicating an action?

### Behavior

- Do tabs, keys, buttons, close/cancel, and relevant confirmation states work?
- Does the layout remain usable at a narrow width?
- Does focus remain visible and does reduced motion work?
- Are there console errors, broken references, or accidental network requests?

If any answer is “yes,” do not report completion. Fix the file and run the pass
again. The final output should feel specific to the product and task, not like a
generic “premium dashboard.”

## 8. Execution order

1. Restate the concept in one line and record assumptions.
2. Complete the user/task/state preflight.
3. Build the five-direction matrix and remove near-duplicates.
4. Define tokens and content before styling details.
5. Build the five actual mockups and their useful interaction states.
6. Add navigation, keyboard switching, focus treatment, and responsive rules.
7. Open the file, inspect every direction at desktop and narrow widths, and
   run the anti-slop rejection pass.
8. Verify there are no console errors and no external dependencies.
9. Report the exact absolute path and the macOS command, for example:
   `open "/absolute/path/to/prototypes/concept-slug.html"`.

## Final quality checklist

- [ ] The concept, user, task, state, and constraints are grounded.
- [ ] Five directions differ in interaction model, hierarchy, composition, and
      visual language—not just color.
- [ ] Content is specific, internally consistent, and consequence-accurate.
- [ ] No blank gradient imagery, fake dashboard metadata, or filler jargon.
- [ ] Palette, contrast, typography, measure, spacing, radii, and shadows were
      chosen deliberately.
- [ ] The mockups contain useful states and working interactions.
- [ ] Keyboard navigation, focus, Escape/cancel, hit areas, and reduced motion
      are handled.
- [ ] The document works offline with inline CSS/JS and no console errors.
- [ ] Desktop and narrow-width inspection passed.
- [ ] The anti-slop rejection pass returned no “yes” answers.
