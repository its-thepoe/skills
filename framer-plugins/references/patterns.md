# Framer Plugin Patterns

Common patterns extracted from the 32 official example plugins in [framer/plugins](https://github.com/framer/plugins). For API details, see [api-reference.md](api-reference.md).

## CMS Plugin Entry Point (main.tsx)

The canonical pattern for CMS plugins. Every official CMS plugin follows this structure:

```typescript
import { framer } from "framer-plugin"
import "framer-plugin/framer.css"

const collection = await framer.getActiveManagedCollection()
const previousSourceId = await collection.getPluginData("sourceId")
const previousSlugFieldId = await collection.getPluginData("slugFieldId")

// Attempt silent sync first (syncManagedCollection mode)
if (framer.mode === "syncManagedCollection" && previousSourceId && previousSlugFieldId) {
    if (!framer.isAllowedTo(...SYNC_METHODS)) {
        framer.closePlugin("Insufficient permissions", { variant: "error" })
    }
    await framer.hideUI()
    await syncCollection(collection, previousSourceId, previousSlugFieldId)
    framer.closePlugin("Sync complete", { variant: "success" })
}

// Fall through to configuration UI
const root = document.getElementById("root")!
createRoot(root).render(<App collection={collection} />)
```

**Key insight**: `syncManagedCollection` mode should attempt silent sync and close. Only show UI if sync fails or no config exists. This is the most important CMS plugin pattern.

---

## Sync Algorithm (Universal)

All official CMS plugins use the "unsynced items" pattern for full-replace sync:

```typescript
async function syncCollection(collection: ManagedCollection, items: ItemData[]) {
    const unsyncedItems = new Set(await collection.getItemIds())

    const collectionItems = items.map(item => {
        unsyncedItems.delete(item.id)  // Mark as still present
        return {
            id: item.id,
            slug: slugify(item.title),
            draft: false,
            fieldData: {
                title: { type: "string", value: item.title },
                // ... more fields
            },
        }
    })

    await collection.setFields(fields)
    await collection.removeItems(Array.from(unsyncedItems))  // Remove stale items
    await collection.addItems(collectionItems)                // Upsert current items
    await collection.setPluginData("sourceId", sourceId)
}
```

**Order**: `setFields` → `removeItems` (stale) → `addItems` (all current)

Since `addItems` is upsert, unchanged items just get updated in place.

---

## Permission Check Pattern

```typescript
import { framer, type ProtectedMethod } from "framer-plugin"

export const SYNC_METHODS = [
    "ManagedCollection.setFields",
    "ManagedCollection.addItems",
    "ManagedCollection.removeItems",
    "ManagedCollection.setPluginData",
] as const satisfies ProtectedMethod[]

// At sync start (imperative):
if (!framer.isAllowedTo(...SYNC_METHODS)) {
    framer.closePlugin("Insufficient permissions", { variant: "error" })
}

// In React components (reactive):
import { useIsAllowedTo } from "framer-plugin"
const canSync = useIsAllowedTo(...SYNC_METHODS)
<button disabled={!canSync} onClick={handleSync}>Sync</button>
```

---

## Slug Generation

All official plugins use this identical slugify function:

```typescript
function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^\p{Letter}\p{Number}()]+/gu, "-")
        .replace(/^-+|-+$/gu, "")
}
```

**Slugs must be unique** within a collection. The Airtable plugin validates this:

```typescript
const seenSlugs = new Set<string>()
for (const item of items) {
    if (seenSlugs.has(item.slug)) throw new Error(`Duplicate slug: ${item.slug}`)
    seenSlugs.add(item.slug)
}
```

---

## Simple Hash for Stable IDs

When the data source doesn't have stable IDs (e.g., RSS feeds), generate them:

```typescript
function simpleHash(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
}
```

---

## UI Sizing Per Screen State

Official plugins change window size based on the current screen:

```typescript
// Separate functions for each UI state
async function showLoginUI() {
    await framer.showUI({ width: 320, height: 340, resizable: false })
}

async function showConfigUI() {
    await framer.showUI({ width: 360, height: 425, minWidth: 360, minHeight: 425, resizable: true })
}

// Or in useLayoutEffect based on state:
useLayoutEffect(() => {
    framer.showUI({
        width: hasConfig ? 360 : 260,
        height: hasConfig ? 425 : 340,
        resizable: hasConfig,
    })
}, [hasConfig])
```

---

## Plugin Data Keys Pattern

Store sync state on the collection so it persists across users:

```typescript
const PLUGIN_KEYS = {
    SOURCE_ID: "pluginSourceId",
    SLUG_FIELD_ID: "pluginSlugFieldId",
    LAST_SYNCED: "pluginLastSynced",
    TABLE_NAME: "pluginTableName",
} as const

// Write after sync:
await collection.setPluginData(PLUGIN_KEYS.SOURCE_ID, sourceId)
await collection.setPluginData(PLUGIN_KEYS.LAST_SYNCED, new Date().toISOString())

// Read at startup:
const previousSourceId = await collection.getPluginData(PLUGIN_KEYS.SOURCE_ID)
```

---

## OAuth Authentication Pattern

Used by Airtable, Google Sheets, Notion, HubSpot:

```typescript
class Auth {
    private TOKENS_KEY = "pluginTokens"

    async authorize(): Promise<Tokens> {
        // 1. Get auth URL from external worker
        const { authUrl, readKey } = await fetch("https://oauth.fetch.tools/my-plugin/authorize").then(r => r.json())
        // 2. Open browser for user to authorize
        window.open(authUrl)
        // 3. Poll for tokens
        return this.pollForTokens(readKey)
    }

    getTokens(): Tokens | null {
        const stored = localStorage.getItem(this.TOKENS_KEY)
        return stored ? JSON.parse(stored) : null
    }

    saveTokens(tokens: Tokens) {
        localStorage.setItem(this.TOKENS_KEY, JSON.stringify(tokens))
    }

    logout() {
        localStorage.removeItem(this.TOKENS_KEY)
        window.location.reload()
    }
}

export const auth = new Auth()
```

Tokens always go in `localStorage` (per-user, not shared).

---

## API Key Authentication Pattern

Simpler alternative (not explicitly in official examples, but used by community plugins):

```typescript
// Validate before persisting
async function validateApiKey(key: string): Promise<boolean> {
    try {
        const res = await fetch(`https://api.example.com/test?key=${key}`)
        return res.ok
    } catch {
        return false
    }
}

// Store in localStorage (per-user, sandboxed)
function saveCredentials(apiKey: string, sourceId: string) {
    localStorage.setItem("apiKey", apiKey)
    localStorage.setItem("sourceId", sourceId)
}
```

---

## Close Warning During Sync

Prevent accidental close during long operations (from Notion plugin):

```typescript
async function syncWithWarning(collection: ManagedCollection) {
    try {
        await framer.setCloseWarning("Sync in progress. Closing will cancel the sync.")
        await performSync(collection)
        framer.closePlugin("Sync complete", { variant: "success" })
    } catch (error) {
        if (error instanceof FramerPluginClosedError) return
        throw error
    } finally {
        await framer.setCloseWarning(false)
    }
}
```

---

## Progress Tracking

For operations with many API calls (from Notion plugin):

```typescript
interface SyncProgress {
    current: number
    total: number
    hasFinishedLoading: boolean
}

// With concurrency limiting:
import pLimit from "p-limit"
const limit = pLimit(5)

const promises = items.map((item, i) =>
    limit(async () => {
        const result = await fetchItemDetails(item.id)
        onProgress({ current: i + 1, total: items.length, hasFinishedLoading: false })
        return result
    })
)
const results = await Promise.allSettled(promises)
```

---

## Error Resilience with Promise.allSettled

Don't let one failed item abort the entire sync:

```typescript
const results = await Promise.allSettled(promises)
const items: CollectionItem[] = []
const errors: SyncError[] = []

results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value !== null) {
        items.push(result.value)
    } else if (result.status === "rejected") {
        errors.push({ index, error: result.reason })
    }
})

// Sync whatever succeeded, report errors
await collection.addItems(items)
if (errors.length > 0) {
    framer.notify(`Synced with ${errors.length} errors`, { variant: "warning" })
}
```

---

## Item Order Preservation

Google Sheets plugin preserves row order:

```typescript
await collection.addItems(collectionItems)
await collection.setItemOrder(collectionItems.map(item => item.id))
```

---

## Menu Integration

Add context menu items to the plugin:

```typescript
framer.setMenu([
    {
        label: `View ${tableName} in Airtable`,
        visible: Boolean(dataSource),
        onAction: () => window.open(`https://airtable.com/${baseId}/${tableId}`),
    },
    { type: "separator" },
    { label: "Log Out", onAction: () => auth.logout() },
])
```

---

## Canvas Mode Patterns

For plugins that insert assets onto the canvas:

```typescript
// Mode-dependent behavior
if (framer.mode === "canvas") {
    await framer.addImage({ image: url, name, altText })
} else {
    // "image" or "editImage" mode — set on selection
    await framer.setImage({ image: url, name, altText })
    framer.closePlugin()
}

// Drag-and-drop support
import { Draggable } from "framer-plugin"
<Draggable data={{ type: "image", image: fullUrl, previewImage: thumbUrl, name, altText }}>
    <div className="image-card">...</div>
</Draggable>
```

---

## Field Definitions — Static vs Dynamic

### Static (simple plugins like RSS):
```typescript
const FIELDS: ManagedCollectionFieldInput[] = [
    { type: "string", name: "Title", id: "title" },
    { type: "link", name: "Link", id: "link" },
    { type: "date", name: "Date", id: "date" },
    { type: "formattedText", name: "Content", id: "content" },
]
```

### Dynamic (complex plugins like Airtable):
Infer field types from the data source, let users customize the mapping in UI, then call `setFields()` with the result.

---

## Cross-Collection Lookup

Notion plugin scans all collections to find linked databases:

```typescript
async function getExistingDatabaseMap(): Promise<Map<string, string>> {
    const map = new Map<string, string>()
    for (const collection of await framer.getCollections()) {
        const dbId = await collection.getPluginData("databaseId")
        if (dbId) map.set(dbId, collection.id)
    }
    return map
}
```
