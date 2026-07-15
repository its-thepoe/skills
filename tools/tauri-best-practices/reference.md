# Tauri v2 reference

Sources: [Tauri v2 docs](https://v2.tauri.app/), [CLI](https://v2.tauri.app/reference/cli/), [Capabilities](https://v2.tauri.app/security/capabilities/), [Develop](https://v2.tauri.app/develop/), [App size](https://v2.tauri.app/concept/size/).

---

## Project layout

```text
my-app/
├── package.json              # scripts: tauri dev | tauri build
├── src/                      # frontend (or framework root)
├── src-tauri/
│   ├── Cargo.toml
│   ├── Cargo.lock            # commit this
│   ├── tauri.conf.json
│   ├── tauri.macos.conf.json # optional platform merge
│   ├── capabilities/
│   │   └── default.json
│   ├── src/
│   │   ├── main.rs           # thin entry
│   │   └── lib.rs            # app setup, commands, plugins
│   └── build.rs
```

`tauri.conf.json` key paths:

```json
{
  "build": {
    "devUrl": "http://localhost:1420",
    "beforeDevCommand": "npm run dev",
    "frontendDist": "../dist",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [{ "title": "My App", "width": 800, "height": 600 }],
    "security": { "capabilities": ["default"] }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/icon.png"],
    "macOS": { "minimumSystemVersion": "10.13" }
  }
}
```

Platform-specific files (`tauri.macos.conf.json`, etc.) merge automatically at build time.

---

## CLI cheat sheet

| Command | Purpose |
| --- | --- |
| `tauri dev` | Dev mode — Rust watch + frontend devUrl |
| `tauri dev --no-watch` | Disable Rust file watcher |
| `tauri dev --release` | Release-mode Rust in dev (slow; rare) |
| `tauri build` | Release binary + bundle installers |
| `tauri build --no-bundle` | Release binary only |
| `tauri build --no-sign` | Skip code signing (local Mac) |
| `tauri build -d` | Debug build through build pipeline |
| `tauri bundle` | Bundle already-built binary |
| `tauri info` | Environment diagnostic |
| `tauri add <plugin>` | Add official plugin |
| `tauri migrate` | v1 → v2 migration helper |

Pass cargo args after `--`: `tauri dev -- --verbose`

---

## Cargo profiles

### Development (compile speed)

```toml
[profile.dev]
incremental = true

[profile.dev.package."*"]
opt-level = 1
debug = false
```

### Release (binary size — from Tauri size guide)

```toml
[profile.release]
codegen-units = 1
lto = true
opt-level = "s"   # use "3" if runtime speed matters more than size
panic = "abort"
strip = true
```

### Faster release *compiles* (not smaller binaries)

For local iteration only — do not ship without testing:

```toml
[profile.release-fast]
inherits = "release"
lto = false
codegen-units = 16
```

Build with: `cargo build --profile release-fast` or custom config merge.

### Toolchain accelerators (optional)

- **sccache** — shared compiler cache across projects
- **mold** / **lld** — faster linker on Linux; macOS benefits from avoiding redundant links via separate `targetDir`

---

## macOS build pipeline timing

Typical `tauri build` phases on Mac:

1. `beforeBuildCommand` — frontend production build (often 30s–3m)
2. `cargo build --release` — Rust (1–10m cold; incremental if artifacts cached)
3. Bundle `.app` — copy assets, plist, icons (seconds–minutes)
4. Code sign — requires cert in keychain
5. DMG creation
6. Notarization + stapling — **can take hours first time**

**Dev loop should only hit phase 1–2 in dev mode**, not 4–6.

For local testing:

```bash
npm run tauri build -- --no-bundle --no-sign
open src-tauri/target/release/bundle/macos/*.app  # path varies
```

---

## IPC: commands and events

### Command (Rust)

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}!")
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error running tauri application");
}
```

### Command (frontend)

```ts
import { invoke } from "@tauri-apps/api/core";

const msg = await invoke<string>("greet", { name: "World" });
```

### Event (fire-and-forget)

```rust
use tauri::Emitter;
app.emit("file-progress", payload)?;
```

```ts
import { listen } from "@tauri-apps/api/event";
const unlisten = await listen("file-progress", (e) => { /* ... */ });
```

Rules:

- Command args and returns must be JSON-serializable.
- Keep commands thin — heavy work on background threads (`tauri::async_runtime`).
- Register commands in `invoke_handler`; scope with capabilities / `AppManifest::commands` for ACL.

---

## Capabilities template

`src-tauri/capabilities/default.json`:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Main window defaults",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:allow-set-title"
  ]
}
```

Reference in `tauri.conf.json`:

```json
{
  "app": {
    "security": {
      "capabilities": ["default"]
    }
  }
}
```

Add plugin permissions only when the plugin is used. Use `platforms: ["macOS"]` for desktop-only APIs.

---

## `.taurignore`

Place in `src-tauri/` to stop `tauri dev` from rebuilding on generated files:

```text
src/generated/**
**/bindings.rs
```

---

## Frontend dev server (Vite)

```ts
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  clearScreen: false,
  server: {
    host: host || false,
    port: 1420,
    strictPort: true,
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
  },
});
```

---

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Running `tauri build` during UI iteration | Use `tauri dev` |
| `beforeBuildCommand` runs on every `tauri dev` via misconfigured script | Split dev vs build scripts |
| Universal binary (`universal-apple-darwin`) on every dev build | Dev on native arch only; universal for release CI |
| Too many default plugin features enabled | Trim `Cargo.toml` features |
| `rust-analyzer` + `tauri dev` same `target/` | Separate `targetDir` |
| `MACOSX_DEPLOYMENT_TARGET` mismatch | Align conf + rust-analyzer |
| Blocking IPC in command handler | `spawn` / async runtime |
| Broad `permissions: ["*"]` | Split capabilities per window |

---

## Diagnostic commands

```bash
# Environment
npm run tauri info

# Verbose dev
npm run tauri dev -- --verbose

# Time release compile without bundle
time npm run tauri build -- --no-bundle

# Cargo why is this crate here
cd src-tauri && cargo tree -i some_crate

# Clean when caches are corrupted (last resort)
cd src-tauri && cargo clean
```

---

## v1 → v2 reminders

- Run `tauri migrate` from project root.
- `allowlist` → **capabilities** + permissions.
- `@tauri-apps/api` import paths changed (`@tauri-apps/api/core`, etc.).
- Mobile targets: `tauri ios dev` / `tauri android dev`.

Migration: [from Tauri 1](https://v2.tauri.app/start/migrate/from-tauri-1/).
