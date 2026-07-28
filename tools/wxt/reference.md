# WXT reference

## Bootstrap commands

Use the official initializer when making a new WXT app:

```bash
bunx wxt@latest init
pnpm dlx wxt@latest init
npx wxt@latest init
```

Minimal manual install:

```bash
npm i -D wxt
pnpm i -D wxt
bun add -D wxt
```

Recommended scripts:

```json
{
  "scripts": {
    "dev": "wxt",
    "dev:firefox": "wxt -b firefox",
    "build": "wxt build",
    "build:firefox": "wxt build -b firefox",
    "zip": "wxt zip",
    "zip:firefox": "wxt zip -b firefox",
    "postinstall": "wxt prepare"
  }
}
```

## Common file map

```text
<root>/
  entrypoints/
    background.ts
    popup/
    options/
  public/
  modules/
  wxt.config.ts
  web-ext.config.ts
```

Use `modules/` for local WXT modules. Published modules can also be added through `modules` in `wxt.config.ts`.

## Entrypoint rules that matter

- `background.ts`: runtime logic must live inside `defineBackground(...)`
- content script entrypoints: runtime logic must live inside `main(...)`
- popup/options/devtools pages: treat them like app surfaces, but still let WXT own the extension wiring

Bad:

```ts
browser.action.onClicked.addListener(() => {
  console.log("clicked");
});
```

Good:

```ts
export default defineBackground(() => {
  browser.action.onClicked.addListener(() => {
    console.log("clicked");
  });
});
```

## Config examples

Basic config:

```ts
export default defineConfig({
  manifest: {
    permissions: ["storage"],
  },
});
```

Branch by browser:

```ts
export default defineConfig({
  manifest: ({ browser }) => ({
    permissions:
      browser === "chrome"
        ? ["storage", "favicon", "declarativeNetRequest"]
        : ["storage", "webRequest"],
  }),
});
```

Add a published module:

```ts
export default defineConfig({
  modules: ["@wxt-dev/auto-icons"],
});
```

Add auto-import directories:

```ts
export default defineConfig({
  imports: {
    dirs: ["src/shared", "src/utils"],
  },
});
```

## Browser targeting

- Default browser is configurable and can be overridden with `--browser` / `-b`
- Manifest version can be set in config and overridden with `--mv2` or `--mv3`
- Output goes to `.output/` by default
- `outDirTemplate` can reshape output folders if a repo needs browser- or mode-specific artifacts

## Dev-mode gotchas

- WXT dynamically registers content scripts during development so they may not appear in the manifest the way you expect
- If you need browser startup customization, use `web-ext.config.ts`, `wxt.config.ts`, or `$HOME/web-ext.config.ts`
- WXT adds a dev reload shortcut by default; that can be configured through `dev.reloadCommand`

## Release flow

Build artifacts:

```bash
wxt build
wxt zip
wxt zip -b firefox
```

Submit to stores:

```bash
wxt submit init
wxt submit
```

Generate the ZIPs you plan to release before submitting.
