---
name: tauri-best-practices
description: >-
  Tauri v2 desktop/mobile app development, debugging, and build optimization.
  Use when working in Tauri projects, slow macOS dev or bundle times, tauri dev/build
  failures, capabilities/permissions, IPC commands, tauri.conf.json, or migrating
  from Tauri v1. Not for generic Rust or frontend-only apps without Tauri.
argument-hint: "[symptom, e.g. slow mac bundle | dev recompiles every save]"
---

# Tauri best practices (v2)

Official docs: [v2.tauri.app](https://v2.tauri.app/) · CLI: [reference/cli](https://v2.tauri.app/reference/cli/) · Security: [capabilities](https://v2.tauri.app/security/capabilities/)

## First move — classify the pain

| Symptom | Likely cause | Fast path |
| --- | --- | --- |
| Every Rust save recompiles deps for ~60s+ | `rust-analyzer` + `tauri dev` fighting over `target/` and `MACOSX_DEPLOYMENT_TARGET` mismatch | [macOS dev compile fix](#macos-dev-compile-speed-fix) |
| `tauri dev` slow only on first run | Cold Cargo cache — normal once | Wait; verify incremental rebuilds after |
| `tauri build` slow on Rust step | Release LTO / codegen-units | Tune `[profile.release]` — see [reference.md](reference.md#cargo-profiles) |
| `tauri build` slow after Rust finishes | Frontend `beforeBuildCommand`, DMG, signing, notarization | [Bundle vs build](#separate-build-from-bundle) |
| App fast in dev, slow in release build | Debug vs release, missing `opt-level`, dev-only code paths | Compare `tauri dev` vs `tauri build`; profile commands |
| Frontend HMR works, Rust change restarts whole app | Expected unless using targeted workflows | Reduce `src-tauri` watch scope via `.taurignore` |

Always run `npm run tauri info` (or `cargo tauri info`) and read `src-tauri/tauri.conf.json` before changing anything.

---

## Workflow

### 1. Baseline the project

1. Confirm **Tauri v2** (`@tauri-apps/api` / `tauri` crate `2.x`, not `1.x`).
2. Read:
   - `src-tauri/tauri.conf.json` (+ `tauri.macos.conf.json` if present)
   - `src-tauri/Cargo.toml` (`[profile.dev]`, features, workspace members)
   - Root `package.json` scripts (`tauri dev`, `beforeDevCommand`, `beforeBuildCommand`)
3. Run `tauri info` — capture Rust, Node, Xcode, and target triple versions.
4. Time **one** representative action with `time` (e.g. single-line Rust edit → rebuild, or full `tauri build`).

### 2. macOS dev compile speed fix

This fixes the most common “Mac app takes forever to bundle/rebuild on every save” report on Tauri v2.

**Root cause:** `tauri dev` sets `MACOSX_DEPLOYMENT_TARGET` from `bundle.macOS.minimumSystemVersion` (default `10.13`). `rust-analyzer` often runs without it and shares the same `target/` dir → cache invalidation and file-lock stalls on every save.

**Fix (apply all three):**

**A — Align deployment target** in `src-tauri/tauri.conf.json`:

```json
{
  "bundle": {
    "macOS": {
      "minimumSystemVersion": "10.13"
    }
  }
}
```

Use your real minimum macOS version if higher — the value must match everywhere below.

**B — Match rust-analyzer env** (`.vscode/settings.json` or Cursor equivalent):

```json
{
  "rust-analyzer.cargo.extraEnv": {
    "MACOSX_DEPLOYMENT_TARGET": "10.13"
  },
  "rust-analyzer.cargo.targetDir": "target/analyzer"
}
```

`targetDir` can be `true` (separate dir) or `"target/analyzer"`. **Separate target dirs is the biggest win** — stops `rust-analyzer` and `tauri dev` from locking each other.

**C — Optional dev profile tuning** in `src-tauri/Cargo.toml`:

```toml
[profile.dev]
incremental = true

[profile.dev.package."*"]
opt-level = 1
debug = false
```

Trade-off: slightly harder to debug *dependency* code. Test that rebuilds drop to seconds after a one-line app change.

Restart IDE + kill stray `cargo`/`tauri` processes after applying.

### 3. Separate build from bundle

For iteration, **do not** run full `tauri build` when you only need to test the binary:

```bash
# Rust release binary only — skip DMG/pkg and signing
npm run tauri build -- --no-bundle

# Or build binary then bundle later
npm run tauri build -- --no-bundle
npm run tauri bundle
```

Useful flags ([CLI reference](https://v2.tauri.app/reference/cli/)):

| Flag | When |
| --- | --- |
| `--no-bundle` | Skip DMG/pkg/notarization — fastest release compile check |
| `--no-sign` | Local Mac testing without signing setup |
| `-d` / `--debug` | Release pipeline but debug binary (faster link, slower runtime) |
| `--skip-stapling` | First notarization (can take hours) |
| `-f feature` | Trim unused plugin features |

Ensure `beforeBuildCommand` is not rebuilding the frontend unnecessarily (cache Vite/webpack; avoid `rm -rf dist` in scripts).

### 4. Fix the actual task

After perf triage, apply normal Tauri v2 rules:

- **IPC:** Prefer `invoke` commands with typed args; use `emit`/`listen` for lifecycle/state only. See [reference.md](reference.md#ipc-commands-and-events).
- **Security:** Capabilities in `src-tauri/capabilities/` — least privilege per window. Never expose broad `fs`/`shell` to all windows by default.
- **Config:** Platform overrides in `tauri.macos.conf.json`; keep secrets out of `tauri.conf.json`.
- **Plugins:** `tauri add <plugin>` — enable only needed permissions in capabilities.
- **Watch scope:** `.taurignore` in `src-tauri` for generated files (see [develop guide](https://v2.tauri.app/develop/)).

Deep tables: [reference.md](reference.md).

### 5. Verify

1. Single-line Rust change → rebuild should be **seconds**, not minutes (after macOS fix).
2. `tauri dev` still opens webview; frontend HMR still works.
3. `tauri build --no-bundle` completes; app launches.
4. If shipping: signed bundle + notarization only on release CI, not every local dev loop.

Report before/after timings and which lever fixed it.

---

## Invariants

- **Never** commit `src-tauri/target/` — do commit `Cargo.lock`.
- **Never** disable capabilities/permissions to “make it work” without documenting the risk.
- **Never** run full `tauri build` (with bundle + sign) in the inner dev loop — use `tauri dev` or `--no-bundle`.
- **Do not** set `tauri dev --release` as the default dev workflow unless profiling release-only bugs.
- Prefer **Tauri v2** config shape (`app`, `bundle`, `plugins`) — not v1 `tauri.allowlist`.

---

## Handoffs

| Situation | Route elsewhere |
| --- | --- |
| Pure Rust algorithm perf (no Tauri) | Rust profiling / `cargo flamegraph` |
| Frontend-only Vite/webpack slowness | Frontend bundler config |
| SwiftUI / native macOS app (no Tauri) | `swiftui-pro` skill |
| Tauri v1 → v2 migration | `tauri migrate` + [migration guide](https://v2.tauri.app/start/migrate/from-tauri-1/) |

---

## Additional resources

- [reference.md](reference.md) — project layout, Cargo profiles, signing, capabilities templates, CLI cheat sheet
- [Tauri blog](https://v2.tauri.app/blog/) · [Releases](https://v2.tauri.app/release/)
