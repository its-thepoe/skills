# Dev Mode, inspection, and codegen plugins

Distilled from [Working in Dev Mode](https://developers.figma.com/docs/plugins/working-in-dev-mode/), [Codegen plugins](https://developers.figma.com/docs/plugins/codegen-plugins/) (linked from Dev Mode doc), and related manifest fields. Prefer live docs.

## Dev Mode vs Design

- Dev Mode is **read-oriented** for implementers: simplified layers, Inspect panel, box model, etc.
- **Plugins in Dev Mode** can power **Inspect** (custom panel) or **codegen** (custom snippets/metadata next to native code).

## Manifest: inspection plugin (example)

```json
{
  "name": "Plugin for inspection",
  "id": "000000000000000000",
  "api": "1.0.0",
  "main": "code.js",
  "documentAccess": "dynamic-page",
  "editorType": ["dev"],
  "capabilities": ["inspect", "vscode"]
}
```

- `"editorType": ["dev"]` — appears in Dev Mode.
- `"inspect"` — can occupy Inspect / Plugins panel area.
- `"vscode"` — also runs in **Figma for VS Code** ([help article](https://help.figma.com/hc/en-us/articles/15023121296151)).

Use `figma.editorType` and `figma.mode` in code to branch behavior.

## Read-only document

In Dev Mode, **setters that mutate the scene generally throw** — no `createRectangle`, `remove()`, renaming nodes, etc.

**Allowed (examples):**

- Read nodes, traverse, `findAll`, selection, `getNodeByIdAsync`
- `figma.showUI`, event listeners (`selectionchange`, etc.)
- Network via plugin `fetch` (with manifest allowlist)
- **Exceptions:** some metadata APIs — `setPluginData` / `setRelaunchData` per current docs; **`exportAsync`** allowed; confirm in [Working in Dev Mode](https://developers.figma.com/docs/plugins/working-in-dev-mode/) for your API version

**Invalid in Dev Mode (illustrative):**

```ts
const node = figma.createRectangle() // throws
```

## Pages and performance

- Dev Mode uses **dynamic page loading** even without `documentAccess` — default is current page; load others explicitly ([accessing document](https://developers.figma.com/docs/plugins/accessing-document/)).
- `figma.skipInvisibleInstanceChildren` defaults **`true`** in Dev Mode for performance.

## UI layout in Dev Mode

- Plugin iframe can fill **full Inspect panel** (resizable). Design **responsive** UI: min width ~**300px**, vertical scroll, avoid fixed layouts that break in narrow or VS Code horizontal layouts.

## Codegen plugins

- Contribute generated code or metadata into the **code section** of Inspect (alongside native snippets).
- May not need a visible iframe for pure codegen flows.
- Manifest: `editorType` includes `"dev"`, `capabilities` includes `"codegen"` (and often `"inspect"` per doc patterns).
- Declare supported languages via `codegenLanguages`; optional `codegenPreferences` for units, selects, actions ([manifest](https://developers.figma.com/docs/plugins/manifest/)).

Full API walkthrough: [Plugins for Codegen](https://developers.figma.com/docs/plugins/codegen-plugins/).

## Figma for VS Code

Add `"vscode"` to `capabilities`.

### Open external URLs

Use **`figma.openExternal(url)`** from main in response to UI messages — not raw `window.open` / `<a target="_blank">` alone, due to VS Code embedding constraints.

### Avoid native `alert` / `confirm`

VS Code blocks native dialogs — use custom in-UI modals.

### Keyboard shortcuts in hosted / complex UIs

Copy/paste/undo may need explicit handling when running inside VS Code; see doc section **Handling keyboard shortcuts in Visual Studio Code** — pattern: detect `figma.vscode`, send flag to UI, add `keydown` + `document.execCommand` handlers.

### Detect VS Code

```ts
if (figma.vscode) {
  // running in Figma for VS Code extension context
}
```

## Related

- [plugin-setup-and-manifest.md](plugin-setup-and-manifest.md) — `capabilities`, `codegenLanguages`
- [plugin-ui-and-theming.md](plugin-ui-and-theming.md) — responsive UI, `openExternal` pattern
- [validation-and-recovery.md](validation-and-recovery.md) — validate in Design mode before shipping Dev-only features
