# Plugin UI and theming

Distilled from [Creating a User Interface](https://developers.figma.com/docs/plugins/creating-ui/) and [CSS Variables and Theming](https://developers.figma.com/docs/plugins/css-variables/). Prefer live docs for updates.

## Show UI

1. Add `"ui": "ui.html"` to `manifest.json` (or multi-file map → `__uiFiles__`).
2. In main (sandbox) code:

```ts
figma.showUI(__html__, { width: 320, height: 240 })
```

Options include `width`, `height`, `title`, `visible`, **`themeColors: true`** (recommended for native-looking light/dark UI).

## Messaging: UI → main

**UI (iframe):**

```html
<script>
  parent.postMessage({ pluginMessage: { type: "submit", value: 42 } }, "*")
</script>
```

**Main:**

```ts
figma.ui.onmessage = (msg) => {
  if (msg.type === "submit") {
    // use msg.value
  }
}
```

Payload must go on `pluginMessage`. Second argument to `postMessage` is often `'*'` for null-origin iframe; see [Creating UI](https://developers.figma.com/docs/plugins/creating-ui/) for stricter origins + `pluginId` when hosting UI on a real URL.

## Messaging: main → UI

**Main:**

```ts
figma.ui.postMessage({ ready: true })
```

**UI:**

```html
<script>
  onmessage = (event) => {
    const data = event.data.pluginMessage
    // ...
  }
</script>
```

Structured data serializes like JSON — **methods/prototypes are lost**. Limits: no arbitrary `Blob`/`ArrayBuffer`/typed arrays except `Uint8Array` (per current docs).

## Queuing

Messages from main to UI are queued until the iframe finishes loading.

## Theme colors (`themeColors: true`)

- Adds `figma-light` or `figma-dark` on `<html>`.
- Injects a `<style>` with semantic tokens: `--figma-color-bg`, `--figma-color-text`, etc.

```css
body {
  background-color: var(--figma-color-bg);
  color: var(--figma-color-text);
}
```

### Caveats

- **FigJam** — no dark mode; tokens match FigJam light palette (purple accent vs blue in Design).
- **Externally hosted UI** — if you navigate the iframe to another URL, **do not** rely on `themeColors` the same way; theme for hosted UIs has limitations per docs.
- Inspect token defaults in dev: e.g. read `#figma-style` inner HTML from the injected block.

### Token naming

Pattern: `--figma-color-{type}-{role}-{prominence}-{interaction}`

- **type**: `bg` | `text` | `icon` | `border`
- **role** (examples): `brand`, `danger`, `success`, `component`, `selected`, …
- **prominence**: `secondary`, `tertiary`, `strong`, …
- **interaction**: `hover`, `pressed`, …

Frequent tokens: `--figma-color-text`, `--figma-color-text-secondary`, `--figma-color-bg`, `--figma-color-bg-brand`, `--figma-color-border`, `--figma-color-border-selected`.

Full tables: [CSS variables doc](https://developers.figma.com/docs/plugins/css-variables/).

Community: [Theme Colors Inspector](https://www.figma.com/community/plugin/1104533141442501061) plugin to explore tokens.

## Drag and drop onto canvas

Null-origin iframe: canvas does not get native drops; use `pluginDrop` via `postMessage`:

```js
parent.postMessage(
  {
    pluginDrop: {
      clientX: e.clientX,
      clientY: e.clientY,
      items: [{ type: "image/svg+xml", data: svgString }],
    },
  },
  "*"
)
```

Handle in main with `figma.on("drop", ...)`. See [Creating UI § Drop events](https://developers.figma.com/docs/plugins/creating-ui/) and [plugin-samples icon drag-and-drop](https://github.com/figma/plugin-samples).

Hosted iframe: prefer `postMessage` for cross-environment parity; coordinate conversion may need `figma.ui.getPosition()`.

## Close plugin

When work is done, main code should call `figma.closePlugin()` (optional message). If you never close, users see a stuck “Running…” state until they cancel.

## Related

- [plugin-setup-and-manifest.md](plugin-setup-and-manifest.md) — `ui` field, `__html__`
- [dev-mode-and-codegen.md](dev-mode-and-codegen.md) — full-size Inspect iframe in Dev Mode
- [gotchas.md](gotchas.md) — UI vs sandbox pitfalls
