---
name: iconsax
description: >-
  Install and use Iconsax correctly in React, React Native, and TypeScript
  projects. Use when adding iconsax-react, fixing missing Iconsax imports,
  replacing hallucinated icon names, or resolving exact Iconsax component names.
argument-hint: "[project-or-component]"
---

# Iconsax

Use this skill when a project should use **Iconsax** and the agent might guess package names, icon names, variants, or JSX incorrectly.

For React projects, prefer:

```bash
npm install iconsax-react
```

Package manager equivalents:

```bash
pnpm add iconsax-react
yarn add iconsax-react
bun add iconsax-react
```

For React Native projects, use the package the project already uses when present. If adding Iconsax fresh, use the package this skill supports:

```bash
npm install iconsax-react-nativejs
```

## Required workflow

1. Read `package.json` first.
2. Confirm the app framework and package manager from existing lockfiles.
3. Confirm whether an Iconsax package is already installed before adding one.
4. Use `iconsax-react` for React/Next.js/Vite unless the project is React Native.
5. Use `iconsax-react-nativejs` only for React Native projects.
6. Resolve exact icon names before editing imports.
7. Import named icons from the installed Iconsax package.
8. Render icons as direct React components.
9. Run the project’s typecheck, lint, or build command after edits.

If a React Native project already uses another Iconsax package, inspect that installed package’s exports before changing imports. Do not swap package names casually.

## Correct React usage

```tsx
import { SearchNormal } from "iconsax-react";

export function SearchButton() {
  return (
    <button type="button" aria-label="Search">
      <SearchNormal
        size={20}
        color="currentColor"
        variant="Linear"
        aria-hidden="true"
      />
    </button>
  );
}
```

Iconsax components accept these common props:

```tsx
<SearchNormal color="currentColor" size={20} variant="Linear" />
```

Valid variants:

- `Linear`
- `Outline`
- `TwoTone`
- `Bulk`
- `Broken`
- `Bold`

## Finding valid icons

Do not invent icon names. Resolve names from the installed Iconsax package before editing imports.

Best option: run the bundled resolver script from the skill folder while your shell is inside the target project:

```bash
node /path/to/iconsax/scripts/find-iconsax-icons.mjs search
node /path/to/iconsax/scripts/find-iconsax-icons.mjs user add
node /path/to/iconsax/scripts/find-iconsax-icons.mjs arrow right
node /path/to/iconsax/scripts/find-iconsax-icons.mjs notification
```

If the Iconsax package is not installed yet, install the correct package first, then run the resolver:

```bash
npm install iconsax-react
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search
```

When this skill is installed at `~/.agents/skills/iconsax`, use:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search
```

If the target project uses React Native:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs --package iconsax-react-nativejs search
```

To print import-ready output:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search --import
```

Example output:

```tsx
import { SearchNormal } from "iconsax-react";
```

`--import` and `--jsx` print the best match by default. Add `--all` to print every match:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search --import --all
```

To print JSX-ready output:

```bash
node ~/.agents/skills/iconsax/scripts/find-iconsax-icons.mjs search --jsx
```

If the skill folder is not available, inspect the installed package directly:

```bash
rg "export const .*Search" node_modules/iconsax-react/dist/index.d.ts
rg "export const .*Arrow.*Right" node_modules/iconsax-react/dist/index.d.ts
rg "export const .*User.*Add" node_modules/iconsax-react/dist/index.d.ts
```

If the user asks for an icon that does not exist, pick the closest available icon from resolver output and mention the substitution briefly.

## Icon name rules

- Icon names are PascalCase React components: `SearchNormal`, `ArrowRight2`, `ProfileAdd`.
- Iconsax names do not usually end with `Icon`.
- Numeric suffixes matter: `ArrowRight`, `ArrowRight2`, and `ArrowRight3` are different exports.
- Search by concept words, not guessed final names: `user add`, `arrow right`, `message`, `calendar`.
- Use the exact export returned by the resolver.
- Never use wildcard imports like `import * as Icons from "iconsax-react"`.

## Known-good common icons

These names exist in `iconsax-react@0.0.8`, but still verify with the resolver before editing imports:

| Intent | Iconsax export |
| --- | --- |
| Search | `SearchNormal` |
| Add | `Add` |
| Close | `CloseCircle` |
| Edit | `Edit2` |
| Delete | `Trash` |
| Home | `Home` |
| Settings | `Setting2` |
| Notification | `Notification` |
| User/Profile | `Profile` |
| Add user | `UserAdd` |
| Arrow right | `ArrowRight2` |
| Calendar | `Calendar` |
| Message | `Message` |
| Menu | `Menu` |
| Filter | `Filter` |
| Heart/Favorite | `Heart` |
| Eye/View | `Eye` |
| Lock | `Lock` |
| Copy | `Copy` |
| Upload | `DocumentUpload` |

## App-level wrapper

If a project uses Iconsax in many files, create or reuse a local wrapper so defaults stay consistent. Keep this optional; direct imports are clearer for small usage.

```tsx
import type { ComponentProps, ElementType } from "react";

type IconsaxComponent = ElementType<{
  size?: string | number;
  color?: string;
  variant?: "Linear" | "Outline" | "TwoTone" | "Bulk" | "Broken" | "Bold";
}>;

type IconProps<T extends IconsaxComponent> = {
  icon: T;
} & Omit<ComponentProps<T>, "color" | "size" | "variant"> & {
    color?: string;
    size?: string | number;
    variant?: "Linear" | "Outline" | "TwoTone" | "Bulk" | "Broken" | "Bold";
  };

export function Icon<T extends IconsaxComponent>({
  icon: IconComponent,
  size = 20,
  color = "currentColor",
  variant = "Linear",
  ...props
}: IconProps<T>) {
  return (
    <IconComponent
      size={size}
      color={color}
      variant={variant}
      {...props}
    />
  );
}
```

Then use it like this:

```tsx
import { SearchNormal } from "iconsax-react";
import { Icon } from "@/components/ui/icon";

export function SearchTrigger() {
  return (
    <button type="button" aria-label="Search">
      <Icon icon={SearchNormal} />
    </button>
  );
}
```

If the icon is decorative, pass `aria-hidden="true"`:

```tsx
<Icon icon={SearchNormal} aria-hidden="true" />
```

## Accessibility

- Icon-only buttons need `aria-label`.
- Icons next to visible text usually do not need their own label.
- Use `aria-hidden="true"` for decorative SVG icons.
- Do not hardcode `aria-hidden="true"` in a shared wrapper if consumers may need accessible standalone SVGs.
- Use `color="currentColor"` so icons follow text color and theme classes.
- Do not rely on icon shape alone for destructive or critical actions; pair with text, tooltip, or confirmation when needed.

## Common fixes

| Problem | Fix |
| --- | --- |
| `Cannot find module 'iconsax-react'` | Install `iconsax-react` |
| React Native project imports fail | Use the installed React Native package, usually `iconsax-react-nativejs` |
| Icon import does not exist | Run the resolver script and import the exact export |
| Icon name ends with `Icon` | Remove the suffix; Iconsax exports are usually `SearchNormal`, not `SearchNormalIcon` |
| Icon color ignores theme | Use `color="currentColor"` and theme-aware text classes |
| Bundle got large | Remove wildcard imports like `import * as Icons` |

## Package notes

- `iconsax-react` is the React package and exposes direct React components.
- `iconsax-react-nativejs` is the React Native package this skill supports.
- Some Iconsax docs mention older React Native package names; prefer the package already installed in the project, or `iconsax-react-nativejs` for fresh React Native setup.
- `vuesax-icon-pack` is older/adjacent package material; do not use it in React projects unless the project already depends on it.
- `iconsax.io` is the official Iconsax site, but code imports must be verified against the installed npm package.

## References

- Iconsax React docs: https://iconsax-react.pages.dev/
- Iconsax React GitHub: https://github.com/premier213/iconsax-react
- Iconsax official site: https://iconsax.io/
- React Native npm package: https://www.npmjs.com/package/iconsax-react-nativejs
- Vuesax icon pack CDN: https://www.jsdelivr.com/package/npm/vuesax-icon-pack
