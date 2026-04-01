# Publishing jargon & install paths

This doc does two things:

1. **Installer journeys** — what it *feels like* to install these skills depending on which approach you use (timeouts, folders touched, what “success” looks like).
2. **Glossary** — plain-English definitions for npm publishing terms (`semver`, `npx`, `files`, etc.).

The **`@its-thepoe/skills`** orchestrator is documented in the repo [`README.md`](../README.md); paths and flags here match that tool.

---

## Installer journeys (what you’ll experience)

### 1) Fleet install via `npx` (recommended)

**Command (example):**

```bash
npx @its-thepoe/skills@latest install --all
```

**What typically happens:**

1. **First seconds** — `npx` resolves `@its-thepoe/skills@latest` from the npm registry. If you haven’t used it recently, npm may **download** the package (and its dependencies — the individual skill packages) into a cache. This can take a few seconds on a slow network; repeats are usually faster.
2. **CLI runs** — the `skills` binary starts and prints lines like `CREATE` / `REPLACE` / `SKIP` for each agent directory. **`SKIP`** means the symlink already points at the right place; that’s normal and good.
3. **Disk layout** — by default the tool creates **symlinks** under your home directory, for example:
   - `~/.cursor/skills/<skill-name>`
   - `~/.claude/skills/<skill-name>`
   - `~/.config/opencode/skills/<skill-name>`
   - `~/.codeium/windsurf/skills/<skill-name>`  
   Each link targets the **resolved** skill folder inside `node_modules` (when installed via `npx`, that’s inside npm’s cache layout—not something you usually browse by hand).
4. **You finish** — the CLI says it’s done. **Agents don’t always hot-reload skills**; restart Cursor / Claude Code / OpenCode / Windsurf (or reload the window) if a skill doesn’t show up immediately.

**Dry run (no writes):**

```bash
npx @its-thepoe/skills@latest install --all --dry-run
```

You see **`DRY-RUN CREATE`** / **`DRY-RUN REPLACE`** lines. Nothing under `~/.cursor/skills` etc. changes—use this to preview.

**Limit which apps get skills:**

```bash
npx @its-thepoe/skills@latest install --all --only=cursor,claude
```

Only those trees are updated; others stay untouched.

**If symlinks fail (often Windows):**

```bash
npx @its-thepoe/skills@latest install --all --strategy copy
```

The experience shifts: the CLI **copies** a full skill folder into each agent path instead of linking. Copies use a small marker file (`.its-thepoe-skills-install.json`) so **`remove`** can safely delete only installs this tool created.

---

### 2) Update / “did I get the latest?” via `npx`

**Re-apply links (idempotent):**

```bash
npx @its-thepoe/skills@latest sync --all
```

Feels the same as `install --all`: mostly **`SKIP`** if nothing changed, **`REPLACE`** if a symlink pointed somewhere else.

**Health check (local):**

```bash
npx @its-thepoe/skills@latest check
```

You get a block per skill and per agent (**cursor**, **claude**, …): **OK symlink**, **OK directory copy**, or **MISSING**. Exit code is non-zero if anything is missing—useful in scripts.

**Optional registry compare (needs network):**

```bash
npx @its-thepoe/skills@latest check --online
```

npm may run `npm view` for each package; brief delay, works offline only for the local part unless you skip `--online`.

Stress-free habit for end users: **`@latest`** on the package name whenever they want “whatever is newest on npm,” then **`sync --all`** or **`install --all`**.

---

### 3) Single skill via orchestrator (still `npx`, one name)

```bash
npx @its-thepoe/skills@latest install alt-text
```

Same flow as fleet install, but only manifest-listed names you pass. Good when someone doesn’t want every skill.

---

### 4) `npm install` only a **skill** package (no orchestrator)

Example:

```bash
npm install @its-thepoe/alt-text
```

**What you get:** files under `node_modules/@its-thepoe/alt-text/` (everything in that package’s `files` list—`SKILL.md`, `reference.md`, `references/`, etc.).

**What you do *not* get automatically:** Cursor/Claude/etc. **do not** read `node_modules` for skills. There is **noinstall step** unless you also symlink/copy into `~/.cursor/skills` (or run **`@its-thepoe/skills install alt-text`**).

**Experience summary:** great for **apps** that import the package as content; for **personal agent folders**, treat this as “download only,” then use the orchestrator or manual links.

---

### 5) Install the **CLI** with `npm` (global or in a project)

**Global:**

```bash
npm install -g @its-thepoe/skills
skills install --all
```

**Project dev dependency:**

```bash
npm install --save-dev @its-thepoe/skills
npx skills install --all
```

**Experience:** same behavior as section 1, but the package lives in a **stable** `node_modules` (your project or global prefix) instead of only npx’s cache. Resolution of `@its-thepoe/*` skill packages still goes through the orchestrator’s dependencies. Prefer this in teams that want a **pinned version** in `package.json` instead of always `@latest`.

---

### 6) From a **git clone** of this repo (contributors)

```bash
git clone <repo-url> && cd skills
npm install
npm run skills -- install --all --dry-run
npm run skills -- check
```

**Experience:** no npm publish involved. The CLI resolves skills from the **workspace** `node_modules` symlinked to local folders. Use **`--dry-run`** first; real **`install --all`** writes into your home directory like production `npx`.

---

### 7) Manual copy or symlink (no Node)

You copy or `ln -s` a skill folder into `~/.cursor/skills/<name>` (etc.) yourself.

**Experience:** full control, no registry; **updates** are manual (re-copy or relink). No `check` unless you run the orchestrator elsewhere.

---

## Quick comparison

| Approach | Best for | You touch `~/.*`? | Updates |
|----------|----------|-------------------|---------|
| `npx @its-thepoe/skills@latest install --all` | Most users, one-shot setup | Yes (symlink or copy) | Re-run with `@latest` + `sync`/`install` |
| `npx … check` / `check --online` | Verify or CI | No (read-only) | N/A |
| `npm install @its-thepoe/<skill>` only | Bundling in an app | No, unless you wire paths yourself | `npm update` in that project |
| Global / devDependency CLI | Teams pinning versions | Yes, when you run `install` | Bump dep, run `sync` again |
| Git clone + `npm run skills` | Editing skills | Yes, if you install | Pull repo, re-run |
| Manual symlink | Minimal tooling | Yes | Manual |

---

## Glossary (terms)

### Package / module

A **package** is a folder npm can install. It usually has a `package.json`. When you publish, npm uploads a **tarball** (compressed archive) of that folder.

### npm registry

The **registry** is npm’s server catalog (by default `https://registry.npmjs.org/`). **Publishing** means uploading your package tarball there so anyone can install it.

### package.json

The **manifest** for your package: name, version, files to include, scripts, dependencies, etc. If it is wrong, installs break or files go missing.

### Scoped package name

A name like `@its-thepoe/alt-text`.

- `@its-thepoe` is the **scope** (often a user or org).
- Helps avoid name collisions and groups related packages.

### Version and semver

**Semver** is `MAJOR.MINOR.PATCH` (example: `1.2.3`).

- **PATCH** — bug fixes, safe updates.
- **MINOR** — new features, backward compatible.
- **MAJOR** — breaking changes.

Once a version is published, **you cannot republish that same version** — you must bump.

### Publishing (`npm publish`)

Uploads the current package to the registry. **Public** packages use `--access public` for scoped names.

You must be **logged in** (`npm login`) and allowed to publish under that scope.

### Tarball / pack

`npm pack` builds the tarball locally. **`npm pack --dry-run`** (or inspecting pack output) shows **which files** will ship — useful to ensure `references/**` is not accidentally excluded.

### files field

In `package.json`, `files` lists **what goes into the published package**.

Too strict = users get a **half skill** (missing `SKILL.md` or references). Too loose = you might ship junk. Prefer explicit lists or careful globs, then verify with pack.

### .npmignore

Like `.gitignore`, but for **publishing**. If present, it can **exclude** files from the tarball even if Git tracks them.

### Dependencies vs devDependencies

- **dependencies** — needed at runtime for library consumers.
- **devDependencies** — tools for development/tests; not installed when someone installs your package **unless** they dev-install.

For a skills orchestrator, **dependencies** often list **the skill packages** so `install --all` can resolve every skill from one `node_modules` tree.

### bin / CLI entry

`package.json` **`bin`** maps a command name to a JS file. After install, users can run that command.

With **`npx`**, users can run the CLI **without** globally installing it.

### npx

**npx** downloads a package temporarily (or uses cache), runs its **`bin`**, then finishes.

Common patterns:

- `npx @scope/pkg@latest` — run latest version explicitly.

`@latest` is a **dist-tag** (see below), not magic — it means “the newest version npm marks as latest.”

### dist-tags (`latest`, etc.)

Tags point versions. Default **`latest`** is what most people get when they `npm install pkg`.

You can publish with other tags (example: `beta`), but default docs should use **`latest`** for simplicity.

### Registry auth

**npm login** stores credentials (often token-based). **npm whoami** checks who you are. No auth → cannot publish.

### Orchestrator package vs content package

- **Orchestrator / meta CLI** — one package that coordinates *many* installs or updates (`install --all`, `check`, `sync`).
- **Content package** — one unit of shipped files (here: a skill folder as npm package).

This repo uses **both**: orchestrator for fleet UX; per-skill packages for modularity and npm pages.

### Symlink vs copy install

- **Symlink** — pointer from `~/.cursor/skills/foo` → real folder. Fast, one source of truth.
- **Copy** — duplicates files. Heavier, but avoids symlink permission issues (common on some Windows setups).

Good CLIs support **both** or fallback.

### Idempotent

Safe to run **twice** without making a mess. Second run should “fix or no-op,” not duplicate installs.

### Manifest (skills list)

A JSON file listing skills the orchestrator manages (names, package names). In this repo: [`skills/skills.manifest.json`](../skills/skills.manifest.json).
