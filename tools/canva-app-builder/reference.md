# Canva app builder — reference

Use this with [SKILL.md](SKILL.md). Keep `SKILL.md` as router/entry; use this file for execution detail.

---

## Minimal spec-first checklist

Before touching code:

- If available, use Canva MCP server first:
  - `https://www.canva.dev/docs/connect/canva-mcp-server-setup/`
  - `https://www.canva.dev/docs/apps/mcp-server/`
- Read: `https://www.canva.dev/docs/apps/llms.txt`
- Read feature-specific docs from the index (API refs, quickstart, guidelines).
- Confirm whether each required API is GA or beta.
- List assumptions and convert unknowns into explicit checks.

If MCP is unavailable, state that explicitly and continue with web docs fallback.

---

## Build checklist

### Architecture

- Uses Canva starter kit baseline unless intentionally diverging:
  - `https://www.canva.dev/docs/apps/setting-up-starter-kit/`
  - expected prerequisites include Node `v24` and npm `v11` (see `https://www.canva.dev/docs/apps/prerequisites/`)
- App runs inside Canva iframe model.
- SDK packages and APIs are documented for the target version.
- App feature contract is explicit: trigger -> operation -> output.
- App entry and intent wiring align with current Canva guidance.

### UX and design

- Uses Canva App UI Kit patterns/components.
- Follows Canva design principles (clarity, consistency, safe defaults).
- Empty/loading/error states are present.

### Reliability

- Handles network/auth failures with actionable messages.
- Uses feature support checks before optional capability paths.
- Handles close/dispose lifecycle safely.
- Uses consent-safe external navigation via `requestOpenExternalUrl`.

### Scopes and permissions

- For each API method used, verify required scope in docs and configure it:
  - Developer Portal scopes page, or
  - `canva-app.json` via Canva CLI (`runtime.permissions`).
- Verify install flow explains requested scopes clearly.
- Treat scope mismatch as a release blocker.

### Testing

- Set up SDK package test environments (for example: `@canva/asset/test`, `@canva/design/test`, `@canva/platform/test`).
- Mock Canva SDK packages for unit tests; keep `@canva/error` unmocked to model realistic SDK failures.
- Test all three classes of behavior:
  - API called with expected args
  - unsupported feature path (`features.isSupported` false)
  - thrown SDK errors (`CanvaError`, e.g. `quota_exceeded`)
- Use `TestAppUiProvider` for component tests.

---

## Failure matrix template

```text
Flow: <feature name>

Happy path:
- Trigger:
- SDK/API sequence:
- Expected result:

Failure path A (auth):
- Symptom:
- User message:
- Recovery:

Failure path B (unsupported feature):
- Detection:
- Fallback:
- User message:

Failure path C (network/back-end):
- Detection:
- Retry policy:
- User message:
```

---

## Submission-readiness pass

Use this in `mode:submission`.

1. Re-open the exact docs used and confirm API names/signatures.
2. Verify manifest/config/permissions match real behavior.
3. Verify no hidden beta dependency without disclosure.
4. Verify user-facing text matches what the app actually does.
5. Verify production requirements that examples often omit:
  - robust error handling and user feedback
  - i18n coverage (commonly via `@canva/app-i18n-kit`)
  - intent entry structure aligned to current guidance
6. Produce a short "ready/not ready" verdict with blockers.

### Bundle constraints (must pass)

- Build output generated with `npm run build` from starter kit or equivalent.
- Final uploaded artifact is a single JS bundle (`dist/app.js` pattern).
- No production dependence on code-splitting.
- Bundle size <= 5MB.

### Analytics constraints

- Use Canva-provided analytics in the Developer Portal.
- Do not attempt third-party analytics scripts (CSP blocks third-party scripts).

### Versioning expectations

- If a released app needs changes, create a **new version** in the Developer Portal.
- An app can have at most **two versions** at once: current and previous.

---

## Figma resource usage

The Canva Figma resource is for mocking app UI using components aligned with the App UI Kit:

- [https://www.canva.dev/docs/apps/figma-resource/](https://www.canva.dev/docs/apps/figma-resource/)

Use it for UI exploration and review artifacts, not as a substitute for SDK/API docs.

Related:

- [https://www.canva.dev/docs/apps/mcp-server/](https://www.canva.dev/docs/apps/mcp-server/)
- [https://www.canva.dev/docs/connect/canva-mcp-server-setup/](https://www.canva.dev/docs/connect/canva-mcp-server-setup/)
- [https://www.canva.dev/docs/apps/setting-up-starter-kit/](https://www.canva.dev/docs/apps/setting-up-starter-kit/)
- [https://www.canva.dev/docs/apps/prerequisites/](https://www.canva.dev/docs/apps/prerequisites/)
- [https://www.canva.dev/docs/apps/integrating-canva/](https://www.canva.dev/docs/apps/integrating-canva/)
- [https://www.canva.dev/docs/apps/configuring-scopes/](https://www.canva.dev/docs/apps/configuring-scopes/)
- [https://www.canva.dev/docs/apps/bundling-apps/](https://www.canva.dev/docs/apps/bundling-apps/)
- [https://www.canva.dev/docs/apps/analytics/](https://www.canva.dev/docs/apps/analytics/)
- [https://www.canva.dev/docs/apps/versioning-apps/](https://www.canva.dev/docs/apps/versioning-apps/)
- [https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/welcome-%F0%9F%8E%89--docs](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/welcome-%F0%9F%8E%89--docs)
- [https://www.canva.dev/docs/apps/app-ui-kit/](https://www.canva.dev/docs/apps/app-ui-kit/)
- [https://www.canva.dev/docs/apps/design-guidelines/principles/](https://www.canva.dev/docs/apps/design-guidelines/principles/)
- [https://www.canva.dev/docs/apps/testing/](https://www.canva.dev/docs/apps/testing/)
- [https://www.canva.dev/docs/apps/examples/unit-test/](https://www.canva.dev/docs/apps/examples/unit-test/)
- [https://www.canva.dev/docs/apps/examples/open-external-link/](https://www.canva.dev/docs/apps/examples/open-external-link/)

