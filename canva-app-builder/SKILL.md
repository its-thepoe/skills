---

## name: canva-app-builder

description: >-
  Builds Canva Apps that follow Canva Apps SDK docs, App UI Kit, and submission
  expectations with a spec-first workflow. Use when the user asks to build, fix,
  audit, or ship a Canva app, Apps SDK integration, appProcess flow, design add
  element flows, OAuth in Canva apps, or Marketplace-readiness. Not for Canva
  design editing only, Figma plugin development, or generic React apps outside
  Canva's iframe app model.
argument-hint: "[feature or app goal] [mode:build|audit|submission]"

# Canva app builder

Build Canva apps against the official Apps SDK contracts, not memory.

---

## Scope and guardrails

- Target: Canva Apps SDK apps running in Canva's app iframe.
- Primary sources:
  - [Canva MCP setup (Connect)](https://www.canva.dev/docs/connect/canva-mcp-server-setup/)
  - [Dev MCP server](https://www.canva.dev/docs/apps/mcp-server/)
  - [Apps docs index (`llms.txt`)](https://www.canva.dev/docs/apps/llms.txt)
  - [Prerequisites](https://www.canva.dev/docs/apps/prerequisites/)
  - [Quickstart](https://www.canva.dev/docs/apps/quickstart/)
  - [App UI Kit](https://www.canva.dev/docs/apps/app-ui-kit/)
  - [App UI Kit Storybook](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/welcome-%F0%9F%8E%89--docs)
  - [Design principles](https://www.canva.dev/docs/apps/design-guidelines/principles/)
  - [Figma resource](https://www.canva.dev/docs/apps/figma-resource/)
  - [Analytics](https://www.canva.dev/docs/apps/analytics/)
  - [App versioning](https://www.canva.dev/docs/apps/versioning-apps/)
- Do not invent SDK methods, payload shapes, or capability support.
- If a needed API is beta-only, call it out explicitly and gate usage.

---

## Modes

- `mode:build` (default): implement or refactor a Canva app feature.
- `mode:audit`: check existing app code for guideline/spec drift and provide fixes.
- `mode:submission`: harden toward Marketplace/team distribution readiness.
- `mode:test`: add or review unit tests using Canva SDK test utilities and support mocks.
- `mode:setup`: bootstrap from Canva starter kit with correct toolchain/version assumptions.
- `mode:release`: prep a versioned release plan (bundle, scopes, review constraints, and rollout notes).

If mode is omitted, use `mode:build`.

---

## Workflow

### 1) Resolve current spec before coding

1. Prefer Canva Dev MCP server when available:
  - Check `https://www.canva.dev/docs/connect/canva-mcp-server-setup/` and `https://www.canva.dev/docs/apps/mcp-server/` setup.
  - Use MCP tools/resources for feature-specific doc retrieval and current API behavior.
2. If MCP is not available, read `https://www.canva.dev/docs/apps/llms.txt`.
3. Open only the pages needed for the requested feature (API refs + guidelines).
4. Capture constraints in 5-10 bullets before implementation:
  - starter kit/runtime assumptions (Node/npm/tooling)
  - required auth flow
  - required scopes for the exact methods used
  - supported entry points / intents
  - API capability checks
  - UI kit and design rules
  - bundling/submission constraints (single bundle, size cap)
  - limits or known unsupported paths

### 2) Define feature contract

- State user action -> Canva effect -> failure states.
- Define exact SDK calls and sequence (`@canva/design`, `@canva/platform`, etc).
- Include fallback behavior for unsupported features.

### 3) Implement with compliance defaults

- Keep App UI Kit-first UI structure and copy clarity.
- Use capability checks (`features.isSupported`) before optional APIs.
- Prefer explicit error handling and user-visible recovery (toasts, retry states).
- Keep network/auth handling deterministic and debuggable.
- Map every scoped API call to required permissions in app config (portal/CLI), before release.

### 4) Validate

- Build/typecheck clean.
- Unit tests cover API calls, unsupported-feature branches, and SDK error branches.
- Manual flow test for:
  - success path
  - permission/auth failures
  - unsupported feature path
  - disposal/close behavior
- Confirm UI still matches App UI Kit and design principles.
- Confirm no review-blocking preview dependency (`@beta`) is required for release path.

### 5) Submission hardening (`mode:submission`)

- Confirm no undocumented API use.
- Confirm manifest/config and permissions match actual behavior.
- Ensure descriptions and user-facing labels match what app does.
- Confirm external URL flows use user-consent-safe patterns (`requestOpenExternalUrl`).
- Confirm production-level i18n is present (`@canva/app-i18n-kit`) when review scope requires it.
- Confirm bundling constraints are met: single JS bundle, no code-splitting dependency, final bundle <= 5MB.
- Confirm analytics constraints: no third-party analytics scripts inside the iframe (CSP).
- Confirm release/versioning plan: new version created in Developer Portal when needed (apps can have at most current + previous versions).
- Flag anything needing policy/legal review instead of guessing.

---

## Invariants

- Never claim "fully compliant" unless every relevant doc path was checked in this run.
- Never skip MCP if available; if unavailable, explicitly say "MCP unavailable, used web docs fallback."
- Never rely on stale memory when docs are available.
- Never use undocumented APIs as if stable.
- Never hide beta dependencies; mark them and provide a GA fallback when possible.
- Never treat starter examples as review-ready by default; enforce production hardening checks.
- Never ship without checking scope requirements for methods used.

---

## Output requirements

Always provide:

1. **Docs consulted** (URLs).
2. **What changed** (files/symbols).
3. **Spec checks passed** and any **open risks**.
4. **Next verification command(s)** the user can run.

---

## Related resources

- [reference.md](reference.md) — implementation checklist, failure matrix, and submission pass template.