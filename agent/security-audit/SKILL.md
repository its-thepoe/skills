---
name: security-audit
description: >
  Use when reviewing a codebase for production security, secure coding, leaked secrets,
  authentication or authorization flaws, unsafe database access, vulnerable dependencies,
  API abuse, deployment hardening, or a pre-release security gate. Produces evidence-backed
  findings and file-level remediation. Not a compliance certification or authorization to
  attack live systems.
argument-hint: "[path] [mode:report|fix|release-gate] [profile:auto|web|api|supabase|mobile|cloud|ai]"
---

# Security Audit

Audit the real repository, not an imagined architecture. Use OWASP ASVS 5.0.0 as the
application-control baseline and NIST SSDF for lifecycle coverage. Treat Top 10 lists as
awareness aids, not proof that an application is secure.

## Modes

- `mode:report` (default): inspect and report; do not change files.
- `mode:fix`: audit, then implement verified fixes within the user's requested scope.
- `mode:release-gate`: report blockers and return `BLOCKED`, `CONDITIONAL`, or `READY`.
- `profile:auto` (default): detect applicable profiles. An explicit profile adds focus but
  never removes relevant controls.

If multiple modes are supplied, stop and ask for one. A target path defaults to the current
repository.

## Non-Negotiable Safety

- Never print, paste, commit, or place a discovered secret in a report. Show only secret
  type, file, line when safely obtainable, and a redacted fingerprint.
- A secret in Git history is compromised even if deleted. Recommend revocation or rotation
  before history cleanup.
- Do not install tools, alter dependencies, run migrations, change cloud resources, or send
  attack payloads to a live host in report mode.
- Do not run DAST, fuzzing, brute force, exploit code, or destructive database tests without
  explicit authorization and a non-production target.
- Preserve existing user changes. Never weaken a control just to make a test pass.
- Do not claim compliance, penetration-test coverage, or "fully secure."

## Workflow

### 1. Establish the Audit Boundary

Read `AGENTS.md`, `CLAUDE.md`, security policies, deployment docs, manifests, lockfiles, CI,
infrastructure, migrations, and environment-variable examples if present. Check `git status`
and identify generated, vendored, test, and production code.

Record:

- languages, frameworks, package managers, runtime, and deployment targets
- public entrypoints, APIs, webhooks, jobs, admin surfaces, and file uploads
- authentication provider, session model, roles, tenant boundaries, and privileged clients
- databases, storage, queues, third-party APIs, secrets, CI/CD, IaC, and containers
- sensitive data classes and the highest-impact actions

State what cannot be inspected. Never silently treat missing cloud or database access as a
pass.

### 2. Select the Control Profile

Always apply:

- OWASP ASVS 5.0.0 Level 1 as the minimum web/application baseline
- OWASP Top 10:2025 for risk coverage
- NIST SP 800-218 SSDF for repository, build, release, and vulnerability-response practices
- relevant OWASP Cheat Sheets for implementation details

Add conditionally:

- ASVS Level 2 for applications handling accounts, private data, money, or meaningful
  business actions; Level 3 only when the product's risk warrants it
- OWASP API Security Top 10:2023 for HTTP, GraphQL, RPC, webhook, or service APIs
- OWASP MASVS for native mobile applications
- Supabase/Postgres checks for exposed schemas, RLS, grants, views, functions, and elevated keys
- cloud, IaC, container, browser-extension, desktop, or AI controls when those surfaces exist

Read [reference.md](reference.md) before grading findings or applying a technology profile.

### 3. Build a Compact Threat Model

Map `actor -> entrypoint -> trust boundary -> privileged operation -> data`. Identify:

- assets an attacker would value
- anonymous, authenticated, admin, service, and third-party actors
- cross-user and cross-tenant object access
- abuse paths, expensive operations, and external URLs or files controlled by users
- failure modes for confidentiality, integrity, availability, and auditability

Keep this tied to repository evidence. Do not invent infrastructure.

### 4. Run Read-Only Discovery

Run the bundled scanner from the repository root:

```bash
bash <skill-folder>/scripts/repo-security-scan.sh .
```

Then use the repository's configured tools. Prefer existing lockfile-aware dependency audits,
secret scanners, SAST, IaC scanners, linters, tests, and build commands. Do not install a new
scanner in report mode. Review findings manually; scanner output is evidence to investigate,
not a verdict.

Inspect Git-tracked secret-like files and, when a secret scanner is available, Git history.
Do not use commands that echo secret values into the transcript.

### 5. Trace the High-Risk Paths Manually

For each public or privileged operation, trace request to side effect:

1. Input boundary: type, shape, size, semantic validation, canonicalization, and upload limits.
2. Authentication: identity established by a trusted mechanism; failure behavior is safe.
3. Authorization: server-side action, object, property, role, and tenant checks on every path.
4. Data access: parameterized queries, least privilege, RLS/grants where applicable, safe
   transactions, and no client-held elevated credential.
5. Output: context-aware encoding; HTML sanitization only when rich HTML is intentionally
   supported.
6. Abuse controls: risk-based rate limits, quotas, idempotency, replay protection, bot or
   fraud controls where relevant.
7. Observability: useful security events without tokens, passwords, secrets, or unnecessary PII.
8. Failure handling: generic client errors, bounded retries/timeouts, cleanup, and fail-closed
   behavior for security decisions.

Also review sessions/cookies, CSRF when ambient credentials are used, CORS, CSP and security
headers, redirects, SSRF, deserialization, command execution, cryptography, dependency and
build integrity, CI permissions, container/IaC defaults, backups, monitoring, and incident
response.

### 6. Prove Each Finding

A finding requires:

- verified file and line, configuration evidence, or reproducible command output
- an attacker-controlled source and a security-relevant sink or missing control
- affected asset and realistic impact
- confidence level and any assumptions

Search-pattern matches alone are not findings. Do not label a public identifier, publishable
key, test fixture, development-only route, or framework-escaped output as exploitable without
tracing its use.

Grade with the severity rules in [reference.md](reference.md). Prefer a lower severity with
high confidence over an inflated claim.

### 7. Produce an Actionable Report

Lead with the production verdict and the most consequential evidence. For every finding include:

```markdown
### SEC-001: [specific title]
Severity: High | Confidence: High
Location: path/to/file.ts:42
Standards: CWE-639, OWASP A01:2025, ASVS v5.0.0-[control]

Evidence: [what the code actually does]
Attack path: [attacker input -> missing control -> impact]
Fix: [exact files and ordered implementation steps]
Patch: [minimal code/config/SQL example adapted to this repository]
Verification: [negative and positive tests plus command]
Residual risk: [what remains after the fix]
```

Include:

- architecture and trust-boundary summary
- findings ordered by severity, then confidence
- quick containment for exposed secrets or active critical paths
- remediation waves: before release, next sprint, hardening backlog
- exact CI/release guardrails to prevent recurrence
- coverage, commands run, uninspected surfaces, and false-positive notes

If there are no verified findings, say so and list coverage gaps. Never replace the report with
a generic checklist.

### 8. Fix and Verify When Authorized

In `mode:fix`, fix root causes in priority order. Add or update tests for access control,
validation, failure paths, and regressions. Use migrations for database changes; make security
migrations idempotent where the repository requires it. Run the smallest relevant checks after
each change, then the production build and repository test suite when feasible.

Do not rotate credentials or modify production services yourself unless the user explicitly
requests that external action. Provide the exact containment sequence instead.

## Release Gate

Return `BLOCKED` when any verified condition exists:

- exposed active secret or elevated credential
- unauthenticated or cross-tenant access to sensitive data/actions
- client-side privileged key or server path that trusts client authorization
- known exploitable critical/high dependency on a reachable production path
- production debug/admin surface without effective access control
- missing validation on a path enabling injection, SSRF, arbitrary file access, or command execution
- required security test/build cannot run and the missing evidence affects a high-risk path

Return `CONDITIONAL` for unresolved medium risks or material coverage gaps with compensating
controls. Return `READY` only for the inspected scope with no blockers; list residual risk and
state that this is not a certification.

## Quality Gate

- [ ] Scope, profiles, trust boundaries, and coverage gaps are explicit
- [ ] Secret values are redacted and never copied into output
- [ ] Every finding has evidence, impact, exact remediation, and a verification test
- [ ] Authentication and authorization are checked separately
- [ ] Client-visible keys are treated as public; protection is enforced server-side
- [ ] Automated scan results were manually validated
- [ ] Dependency, CI/build, database, deployment, logging, and incident readiness were considered
- [ ] Release verdict matches the verified evidence

## Resources

- [reference.md](reference.md) - standards hierarchy, severity model, technology profiles,
  corrected rules, commands, and source links
- [scripts/repo-security-scan.sh](scripts/repo-security-scan.sh) - safe read-only repository triage
