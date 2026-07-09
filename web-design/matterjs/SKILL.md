---
name: matterjs
description: >-
  Matter.js skill for 2D physics scenes, bodies, constraints, collisions, and
  teardown. Use when adding playful physical interactions to the UI.
argument-hint: "[physics-goal]"
---

# Matter.js

Use this skill for 2D physics interactions built with Matter.js.

## Focus

- Keep the physics world isolated from the UI layer.
- Control gravity, restitution, friction, and collision categories explicitly.
- Stop the engine and remove listeners on teardown.
- Treat the simulation as a feature, not a background toy.

## Common checks

- Are bodies and composites cleaned up?
- Does the interaction remain understandable at high velocity?
- Is the scene stable on smaller screens?

## Install into your agents

```bash
npx @its-thepoe/skills@latest install matterjs
```

