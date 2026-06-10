# Plugin setup and manifest

Distilled from [Plugin Quickstart](https://developers.figma.com/docs/plugins/plugin-quickstart-guide/) and [Plugin Manifest](https://developers.figma.com/docs/plugins/manifest/). Prefer the live docs for edge changes.

## Prerequisites

- **Figma desktop app** — plugin dev and testing load code from local disk ([downloads](https://www.figma.com/downloads/)).
- **Node.js + npm** — typings, build, lint.
- **Editor** — VS Code is the documented default; any editor works if TypeScript compiles to JS.

## Create a plugin

1. Desktop app: **Plugins → Development → New plugin**.
2. Choose product (e.g. Figma design), name, **Custom UI** if you need a modal.
3. **Save as** a folder anywhere on disk.
4. Open folder in editor; run `npm install`.
5. **TypeScript**: `manifest.json` `main` points at **compiled JS** (e.g. `code.js`), not `.ts`.
6. **Watch build**: VS Code **Run Build Task** → `watch-tsconfig.json` (or your project’s watch script).
7. **Run**: **Plugins → Development →** your plugin name. Enable **hot reload** in dev for faster iteration.

## Typical package concerns

- **Typings**: `npm install --save-dev @figma/plugin-typings` ([typings docs](https://developers.figma.com/docs/plugins/api/typings/)).
- **Lint**: `@figma/eslint-plugin-figma-plugins` + `@typescript-eslint/*` ([repo](https://github.com/figma/eslint-plugin-figma-plugins)).

## Example manifest (baseline)

```json
{
  "name": "MyPlugin",
  "id": "737805260747778092",
  "api": "1.0.0",
  "editorType": ["figma", "figjam"],
  "main": "code.js",
  "ui": "ui.html",
  "documentAccess": "dynamic-page",
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

### `name` (string)

Menu name.

### `id` (string)

Stable ID for publishing/updates. Comes from **Create new plugin** or publish flow.

### `api` (string)

Plugin API version. Pin intentionally; test before bumping ([API reference hub](https://developers.figma.com/docs/plugins/api/api-reference/)).

### `main` (string)

Relative path to **JavaScript** entry (sandbox / main thread).

### `ui` (optional)

- `string` — one HTML file; contents available as `__html__` in main code.
- `{ [key: string]: string }` — multiple HTML paths; use `__uiFiles__` ([global objects](https://developers.figma.com/docs/plugins/api/global-objects/)).

Used with `figma.showUI()`.

### `documentAccess`: `'dynamic-page'`

**Required for new plugins.** Avoids loading every page on first run. Omitting it can force **“Loading n pages for plugin…”** in multi-page files. Migrate older plugins per [dynamic loading guide](https://developers.figma.com/docs/plugins/migrating-to-dynamic-loading/).

### `networkAccess` (optional)

Domain allowlist for plugin network (fetch, etc.). See [network-and-security.md](network-and-security.md).

```ts
interface NetworkAccess {
  allowedDomains: string[]
  reasoning?: string
  devAllowedDomains?: string[]
}
```

### `parameters` / `parameterOnly`

Quick Actions parameters; keys map to `ParameterValues` in code. `parameterOnly: true` forces parameter UI before run (default `true` when set).

### `editorType`

`"figma"` | `"figjam"` | `"dev"` | `"slides"` | `"buzz"`. **Unsupported:** `["figjam", "dev"]` together.

### `menu`

Submenus and commands. Read `figma.command` in code to branch.

```json
"menu": [
  { "name": "Create Text", "command": "text" },
  { "name": "Create Frame", "command": "frame" },
  { "separator": true },
  {
    "name": "Create Shape",
    "menu": [{ "name": "Circle", "command": "circle" }]
  }
]
```

### `relaunchButtons`

Must align with `setRelaunchData()` `command` values. Optional `multipleSelection` for multi-select relaunch.

### `enableProposedApi` / `enablePrivatePluginApi`

Proposed API: **dev only**, not for published plugins. Private plugin API: org/private plugins + local dev.

### `build` (experimental)

Shell command run before loading `main`/`ui` (e.g. compile step).

### `permissions`

```ts
type PluginPermissionType =
  | "currentuser"
  | "activeusers"
  | "fileusers"
  | "payments"
  | "teamlibrary"
```

Enables `figma.currentUser`, `figma.activeUsers`, stamp author, payments, team library APIs respectively.

### `capabilities`

- `textreview` — [text review plugins](https://developers.figma.com/docs/plugins/textreview-plugins/)
- `codegen` — custom codegen in Dev Mode
- `inspect` — Inspect panel plugins
- `vscode` — Figma for VS Code ([Dev Mode VS Code](https://developers.figma.com/docs/plugins/working-in-dev-mode/#dev-mode-plugins-in-visual-studio-code))

### `codegenLanguages` / `codegenPreferences`

For codegen plugins (`editorType` includes `"dev"` and inspect/codegen setup). See API types `CodeLanguage`, `CodegenPreference`.

## Multi-HTML UI

Map form:

```json
"ui": {
  "main": "ui-main.html",
  "settings": "ui-settings.html"
}
```

Load with `figma.showUI(__uiFiles__.main)` (or the key you need).

## Samples

[figma/plugin-samples](https://github.com/figma/plugin-samples) — webpack/esbuild/React, dev mode, codegen, variables, etc.

## Related in this skill

- [plugin-ui-and-theming.md](plugin-ui-and-theming.md) — `showUI`, messaging, themes
- [dev-mode-and-codegen.md](dev-mode-and-codegen.md) — Dev Mode manifest + constraints
- [network-and-security.md](network-and-security.md) — `networkAccess` testing
