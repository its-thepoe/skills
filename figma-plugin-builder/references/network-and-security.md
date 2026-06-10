# Network requests and security

Distilled from [Making Network Requests](https://developers.figma.com/docs/plugins/making-network-requests/) and [Plugin Manifest § networkAccess](https://developers.figma.com/docs/plugins/manifest/). Prefer live docs.

## Where `fetch` runs

Plugins use Figma’s **[Fetch API](https://developers.figma.com/docs/plugins/api/properties/global-fetch/)** from the **main (sandbox)** context (similar to browser Fetch). Older iframe-only networking patterns still work but Fetch from main is the recommended default.

## CORS and null origin

Plugin UI iframes often have a **null origin**. Requests need servers that allow cross-origin access (e.g. `Access-Control-Allow-Origin: *` or appropriate CORS for your case). Plan API contracts accordingly.

## Minimal example

```ts
;(async () => {
  const res = await fetch("https://httpbin.org/get?success=true")
  const json = await res.json()
  const text = figma.createText()
  await figma.loadFontAsync(text.fontName as FontName)
  text.characters = JSON.stringify(json.args, null, 2)
  figma.closePlugin()
})()
```

Always **`await figma.loadFontAsync`** before setting text when using default font.

## Declare `networkAccess`

Restrict to least privilege. Example — no network:

```json
"networkAccess": {
  "allowedDomains": ["none"]
}
```

Example — specific API:

```json
"networkAccess": {
  "allowedDomains": ["api.example.com"],
  "reasoning": "Loads user settings from our API.",
  "devAllowedDomains": ["http://localhost:3000"]
}
```

### Patterns (summary)

- `["none"]` — block all external network from the plugin.
- `["*"]` — allow all domains; **`reasoning` required** at publish.
- Hostnames, wildcards `*.example.com`, schemes `https://...`, paths `api.example.com/v1/` (trailing slash = prefix allow), exact path without slash = single endpoint.
- **Localhost** in `allowedDomains` → **`reasoning` required**; prefer `devAllowedDomains` for local-only dev servers.

If a domain is missing, the runtime throws a **CSP / connect-src** style error in the console.

## Testing domain lists

1. Set `allowedDomains: ["none"]`.
2. Run every code path that might network.
3. Note blocked URLs from console.
4. Add only required origins; re-test until clean.
5. Fill `reasoning` where required for Community transparency.

## Images and other side-effect calls

Anything that hits the network (`createImageAsync` URLs, font/CDN if applicable, etc.) must be covered by `allowedDomains` — not only explicit `fetch` calls.

## UI iframe vs main

If the UI navigates to an external site, **networkAccess** enforcement applies differently to **plugin-initiated** vs embedded site subresource loads (per [manifest note](https://developers.figma.com/docs/plugins/manifest/)) — design integrations with care.

## Related

- [plugin-setup-and-manifest.md](plugin-setup-and-manifest.md) — full `networkAccess` type
- [plugin-ui-and-theming.md](plugin-ui-and-theming.md) — secure `postMessage` + `pluginId` for hosted UI
