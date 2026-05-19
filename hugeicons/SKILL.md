---
name: hugeicons
description: >-
  Install and use Hugeicons Free correctly in React, Next.js, Vite, and
  TypeScript projects. Use when adding Hugeicons, fixing missing icon imports,
  replacing hallucinated icon usage, or wiring @hugeicons/react with
  @hugeicons/core-free-icons.
argument-hint: "[project-or-component]"
---

# Hugeicons

Use this skill when a project should use **Hugeicons Free** and the agent might guess package names, icon names, or JSX incorrectly.

Hugeicons Free for React needs **both** packages:

```bash
npm install @hugeicons/react @hugeicons/core-free-icons
```

Package manager equivalents:

```bash
pnpm add @hugeicons/react @hugeicons/core-free-icons
yarn add @hugeicons/react @hugeicons/core-free-icons
bun add @hugeicons/react @hugeicons/core-free-icons
```

## Required workflow

1. Read `package.json` first.
2. Confirm the app framework and package manager from existing lockfiles.
3. Confirm whether Hugeicons is already installed before adding packages.
4. Use the free package unless the user explicitly says they have Pro.
5. Import `HugeiconsIcon` from `@hugeicons/react`.
6. Import named icons from `@hugeicons/core-free-icons`.
7. Resolve exact icon names before editing code.
8. Render icons through `<HugeiconsIcon icon={SomeIcon} />`.
9. Run the project’s typecheck, lint, or build command after edits.

## Correct React usage

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";

export function NotificationsButton() {
  return (
    <button type="button" aria-label="Notifications">
      <HugeiconsIcon
        icon={Notification03Icon}
        size={20}
        color="currentColor"
        strokeWidth={1.5}
      />
    </button>
  );
}
```

Do **not** use icons as direct React components:

```tsx
// Wrong
import { Notification03Icon } from "@hugeicons/core-free-icons";

export function BadExample() {
  return <Notification03Icon />;
}
```

## Finding valid icons

Do not invent icon names. Resolve names from the installed free icon package before editing imports.

Best option: run the bundled resolver script from the skill folder while your shell is inside the target project:

```bash
node /path/to/hugeicons/scripts/find-free-icons.mjs search
node /path/to/hugeicons/scripts/find-free-icons.mjs notification
node /path/to/hugeicons/scripts/find-free-icons.mjs arrow right
node /path/to/hugeicons/scripts/find-free-icons.mjs user plus
```

When this skill is installed at `~/.agents/skills/hugeicons`, use:

```bash
node ~/.agents/skills/hugeicons/scripts/find-free-icons.mjs search
```

If the skill folder is not available, inspect the installed package directly:

```bash
rg "export .*Search" node_modules/@hugeicons/core-free-icons
rg "export .*Notification" node_modules/@hugeicons/core-free-icons
rg "export .*Arrow.*Right" node_modules/@hugeicons/core-free-icons
```

Or rely on TypeScript autocomplete from:

```tsx
import { SearchIcon } from "@hugeicons/core-free-icons";
```

If the user asks for an icon that does not exist, pick the closest available icon from resolver output and mention the substitution briefly.

## Icon name rules

- Free icon exports end with `Icon`.
- Names are PascalCase, often with numeric suffixes: `Notification03Icon`, `UserAdd01Icon`.
- Search by concept words, not guessed final names: `user add`, `arrow right`, `chart`, `calendar`.
- Use the exact export returned by the resolver.
- Never use wildcard imports like `import * as Icons from "@hugeicons/core-free-icons"`.

## App-level wrapper

If a project uses icons in multiple files, create or reuse a local wrapper so defaults stay consistent.

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<typeof HugeiconsIcon>;

export function Icon({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.5,
  ...props
}: IconProps) {
  return (
    <HugeiconsIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
```

Then use it like this:

```tsx
import { SearchIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";

export function SearchTrigger() {
  return (
    <button type="button" aria-label="Search">
      <Icon icon={SearchIcon} />
    </button>
  );
}
```

## Accessibility

- Icon-only buttons need `aria-label`.
- Icons next to visible text usually do not need their own label.
- Use `color="currentColor"` so icons follow text color and theme classes.
- Do not rely on icon shape alone for destructive or critical actions; pair with text, tooltip, or confirmation when needed.

## State icons

Prefer `altIcon` and `showAlt` instead of conditionally rendering two separate Hugeicons components.

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";

export function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      onClick={onToggle}
    >
      <HugeiconsIcon
        icon={ViewIcon}
        altIcon={ViewOffSlashIcon}
        showAlt={visible}
        size={18}
        color="currentColor"
        strokeWidth={1.5}
      />
    </button>
  );
}
```

## Common fixes

| Problem | Fix |
| --- | --- |
| `Cannot find module '@hugeicons/react'` | Install `@hugeicons/react` |
| `Cannot find module '@hugeicons/core-free-icons'` | Install `@hugeicons/core-free-icons` |
| Icon import exists but JSX fails | Render through `HugeiconsIcon`, not `<IconName />` |
| Icon name does not exist | Search exports in `node_modules/@hugeicons/core-free-icons` |
| Bundle got large | Remove wildcard imports like `import * as Icons` |
| Icon color ignores theme | Use `color="currentColor"` and theme-aware text classes |

## Pro note

Only use Pro packages when the user explicitly says they have Hugeicons Pro. Pro imports come from style packages such as `@hugeicons-pro/core-stroke-rounded`, while the free package is `@hugeicons/core-free-icons`.

## References

- Hugeicons React Quick Start: https://hugeicons.com/docs/integrations/react/quick-start
- Hugeicons React Best Practices: https://hugeicons.com/docs/integrations/react/best-practices
- Hugeicons Autocomplete: https://hugeicons.com/docs/features/autocomplete
