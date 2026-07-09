# Framer Plugin Pitfalls & Workarounds

Known gotchas discovered from official examples, Framer docs, and community experience.

## UI & Styling

### Framer overrides `<button>` styles
Framer's built-in CSS has high specificity on `<button>` elements. Custom backgrounds and text colors get silently overridden, especially in light mode.

**Workarounds:**
- Use `<div role="button" tabIndex={0}>` for custom-styled interactive elements
- If you must use `<button>`, apply `!important` on `background` and `color`
- Use high-specificity selectors: `.parent .child.active { background: red !important; }`

### framer.css conflicts
Importing `"framer-plugin/framer.css"` provides Framer's base styles (fonts, colors, input styling), but can conflict with custom CSS. The import is optional but recommended for a native look.

### showUI flicker
Calling `framer.showUI()` in a `useEffect` causes a visible resize flicker. Always use `useLayoutEffect`:

```typescript
useLayoutEffect(() => {
    framer.showUI({ width: 320, height: hasConfig ? 380 : 340 })
}, [hasConfig])
```

### SVG icon centering
Icons in `framer.json` must use a 30×30 viewBox. Paths drawn at absolute coordinates can end up outside the visible area. Use `<g transform="translate(15 15)">` with centered path coordinates.

---

## SDK Behavior

### "Invoking protected message type" toast warnings
`setPluginData()`, `addManagedCollectionItems()`, `setManagedCollectionFields()`, and other SDK methods trigger visible toast notifications saying "Invoking protected message type ... without checking permissions first."

**What it is**: A Framer SDK internal message-passing warning surfaced as a user-facing toast. NOT just a console warning — users see it.

**Workarounds:**
- For settings: use `localStorage` instead of `setPluginData()` to eliminate the toast entirely
- For collection operations (`addItems`, `setFields`): unavoidable — these are core sync APIs. Likely a Framer SDK bug that will be fixed.
- `console.warn` overrides do NOT suppress these toasts (they come from the SDK's internal layer, not `console`)

### closePlugin throws internally
`framer.closePlugin()` returns `never` and throws `FramerPluginClosedError`. Any code after it won't execute. The SDK auto-suppresses unhandled rejections of this class, but if you have a `catch` block:

```typescript
try {
    await syncCollection(collection)
    framer.closePlugin("Done", { variant: "success" })
} catch (error) {
    if (error instanceof FramerPluginClosedError) return  // Must ignore
    // Handle real errors
}
```

### addItems is upsert
`collection.addItems()` adds new items AND updates existing ones matched by `id`. You don't need to check whether an item already exists before adding it.

### Slug uniqueness is required
Items in a collection must have unique slugs. If two items share a slug, the sync may fail or produce unexpected results. Always validate before calling `addItems`.

---

## Data Storage

### pluginData size limits
- `framer.setPluginData()`: 2kB per entry, 4kB total across all keys (project-level)
- `collection.setPluginData()`: 2kB per entry, 4kB per collection
- Values must be strings. Pass `null` to delete a key.

### localStorage is sandboxed
`localStorage` is sandboxed per-plugin origin and per-user. It's safe for API keys and tokens. It's synchronous (no async needed) and has no Framer-imposed size limits.

### When to use which storage

| Data | Storage | Reason |
|------|---------|--------|
| API keys, auth tokens | `localStorage` | Per-user, not shared, no size warnings |
| User preferences | `localStorage` | Per-user, synchronous |
| Data source ID, slug field | `collection.setPluginData()` | Shared across collaborators |
| Last sync timestamp | `collection.setPluginData()` | Shared state for the collection |
| Project-level config | `framer.setPluginData()` | Shared, but tiny (4kB total) |

Per Framer's own docs: `pluginData` should NOT store sensitive data like API keys.

---

## Framer Environment

### Cmd+Z / Ctrl+Z captures globally
Framer captures undo globally. Users may accidentally undo the plugin instantiation when they expect to undo text input within the plugin. This is NOT interceptable from within the plugin iframe.

### Console logs
`console.log` output appears in the browser devtools, not the terminal. To see logs:
1. Right-click the plugin iframe in Framer
2. "Inspect Element"
3. Switch to Console tab

The `npm run dev` terminal only shows Vite build/HMR output.

### Plugins run in an iframe
All plugins execute inside a sandboxed iframe. This means:
- CORS restrictions apply to external API calls
- `window.parent` access is limited
- Storage is sandboxed per-origin

### Permission errors
When a plugin attempts a protected operation without permission, the SDK throws `FramerPluginError` and shows a toast: "Insufficient permissions." Always check with `framer.isAllowedTo()` before attempting protected operations.

---

## Common Mistakes

### Not attempting silent sync
The most common mistake in CMS plugins: always showing UI in `syncManagedCollection` mode. The correct pattern is to try syncing silently first and close the plugin on success. Only fall through to UI if sync fails or no config exists.

### Forgetting field data type wrapper
Field values must include explicit type:
```typescript
// WRONG
fieldData: { title: "Hello" }

// CORRECT
fieldData: { title: { type: "string", value: "Hello" } }
```

### Using setPluginData for API keys
API keys should go in `localStorage`, not `pluginData`. `pluginData` is shared across all project collaborators and triggers toast warnings.

### Not handling FramerPluginClosedError
If you have try/catch around async operations that end with `closePlugin()`, you must explicitly ignore `FramerPluginClosedError` or your error handling will catch it.

### Hardcoding UI dimensions
Plugin UI should resize based on the current screen state. Use `useLayoutEffect` to call `showUI` with appropriate dimensions when the state changes.

### Not checking permissions before sync
Always call `framer.isAllowedTo()` at the start of sync operations. Without it, users see unhelpful "Insufficient permissions" toasts mid-sync.

---

## Debugging Tips

- **Toast debugging**: If you see "Invoking protected message type" toasts, it's the SDK — not your code. For settings, switch to `localStorage`.
- **Invisible button text**: If button text disappears in light mode, Framer is overriding your color. Add `color: #fff !important` or use `<div role="button">`.
- **Plugin won't load**: Check `framer.json` for valid mode names and icon paths. Icons must exist in `public/`.
- **Sync runs but nothing appears**: Check that `fieldData` values have the `{ type, value }` wrapper. Raw values are silently ignored.
- **Items disappear after sync**: If you call `removeItems` with all IDs before `addItems`, there's a race condition window. Use the unsynced-items pattern instead.
- **"setPluginData" quota exceeded**: You hit the 4kB limit. Use fewer keys or store structured data as a single JSON string.
