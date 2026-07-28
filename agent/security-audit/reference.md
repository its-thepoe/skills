# Security Audit Reference

Load this file before assigning severity, selecting a technology profile, or writing fixes.

## Standards Hierarchy

Use standards for the job they actually do:

| Source | Use | Do not use it as |
| --- | --- | --- |
| OWASP ASVS 5.0.0 | Testable application security requirements; cite versioned IDs | A universal infrastructure or compliance standard |
| OWASP Top 10:2025 | Coverage prompt for common web risk classes | A complete verification checklist |
| NIST SP 800-218 SSDF 1.1 | Secure development, build protection, release, and vulnerability response | Line-by-line application test cases |
| OWASP Cheat Sheet Series | Context-specific implementation guidance | A substitute for architecture review |
| OWASP API Security Top 10:2023 | API-specific awareness, especially object authorization and abuse | Proof that an API is secure |
| OWASP MASVS | Native mobile application verification | A web-only checklist |
| CIS Benchmarks/provider guidance | Deployment-specific hardening | A framework-independent default |

Use ASVS Level 1 as the minimum application baseline. Use Level 2 for most production products
with authenticated users, private data, payments, health data, admin actions, or tenant
boundaries. Level 3 is a risk decision, not a badge to apply automatically.

Compliance regimes such as PCI DSS, HIPAA, SOC 2, ISO 27001, and privacy laws require known
scope, jurisdiction, contracts, operational evidence, and often specialist review. Map findings
to them only when requested; never certify compliance from a source-code audit.

## Severity and Confidence

Severity measures plausible impact and exploitability in this repository:

| Severity | Practical meaning | Typical examples |
| --- | --- | --- |
| Critical | Direct, low-complexity compromise with broad or irreversible impact | Active privileged key exposed; unauthenticated remote code execution; trivial bulk sensitive-data access |
| High | Serious confidentiality, integrity, or availability loss on a reachable path | Cross-tenant access; admin action without authorization; exploitable injection; account takeover path |
| Medium | Meaningful weakness requiring conditions, limited scope, or chained exploitation | Missing CSRF on a state-changing cookie-auth route; weak abuse controls on a costly endpoint |
| Low | Limited impact or defense-in-depth gap | Non-sensitive version disclosure; narrow header hardening gap with no demonstrated path |
| Info | Useful hardening or unverified observation | Scanner candidate, inventory gap, or recommendation without a current exploit path |

Confidence is separate:

- High: traced source to sink or reproduced safely; assumptions are minimal.
- Medium: strong code/config evidence but runtime or environment state is unavailable.
- Low: pattern or architecture concern needing confirmation. Keep it out of release blockers
  unless the missing evidence itself is the blocker.

Do not calculate a fake CVSS score. Use CVSS only when enough environmental and exploitability
data exists, and show the vector.

## Corrected Rules

These replace common but misleading absolutes:

- "Never trust input" means validate at every trust boundary, including webhooks, files,
  queues, database values, and third-party APIs. Client validation is user experience, not a
  security boundary.
- Validate syntax and semantics before use. Encode at the output sink. Sanitize only content
  intentionally allowed to contain active markup. Blindly sanitizing everything before storage
  can corrupt data and does not replace sink-specific encoding.
- Deny by default and grant least privilege. Authorization must be checked server-side for the
  action, object, fields, tenant, and current state.
- A WAF, CDN, firewall, container, or obfuscator is defense in depth, not a mandatory universal
  control and never a replacement for secure code or authorization.
- Rate-limit sensitive, expensive, enumerable, and abuse-prone operations with actor-aware and
  distributed controls. A single arbitrary limit on every route is not a security design.
- Use CSRF defenses when browsers automatically attach credentials, such as cookies. Bearer
  tokens not automatically attached by the browser have a different threat model.
- Prefer secure, `HttpOnly`, `SameSite` cookies for browser sessions when architecture permits.
  Token storage is a threat-model decision; local storage increases token theft impact under XSS.
- Use phishing-resistant MFA for administrators where feasible, but still authorize every admin
  action. MFA does not secure an unprotected route.
- Rotate secrets immediately on exposure or suspected compromise and according to key lifetime,
  provider capability, and organizational policy. A universal 90-day rotation does not repair
  poor storage and may create unsafe manual handling.
- Use maintained cryptographic libraries and platform primitives. Algorithm names such as
  "AES-256" alone do not prove secure mode, nonce, authentication, or key management.
- Prefer Argon2id for new password storage. Use scrypt where unavailable, bcrypt mainly for
  compatible legacy systems, and provider-managed password storage when an identity provider
  owns the credential.
- Certificate pinning, jailbreak/root detection, and code obfuscation can add mobile defense in
  depth but can also create operational risk. Never use them as the primary authorization or
  data-protection boundary.
- Update dependencies based on exploitability, reachability, severity, and available fixes.
  Lockfiles, integrity, provenance, and controlled build inputs matter alongside patch cadence.

## Core Review Matrix

### Architecture and Access Control

- Enumerate routes, handlers, RPCs, jobs, webhooks, admin pages, storage buckets, and public DB
  objects.
- For each object identifier, test owner, other user, other tenant, anonymous, and admin cases.
- Find alternate paths that reach the same side effect.
- Verify server authorization uses trusted identity, not role/user/tenant values from the body.
- Check mass assignment and property-level authorization on create/update serializers.

### Input, Injection, and Output

- Validate all external inputs server-side with type, allowed values, length, range, and
  cross-field/business constraints.
- Use parameterized DB queries and non-shell APIs. If a shell is unavoidable, pass fixed
  executable and argument arrays without interpolation.
- Apply context-aware HTML, attribute, JavaScript, CSS, URL, LDAP, and command encoding at sinks.
- For rich HTML or Markdown, use a maintained sanitizer with an explicit allowlist.
- Limit uploads by bytes, count, type, content signature, storage path, and processing time;
  store outside executable/public paths when possible.
- For user-controlled outbound URLs, constrain schemes, hosts, ports, redirects, DNS resolution,
  and private/link-local/metadata ranges; revalidate after redirects.

### Authentication and Sessions

- Prefer mature identity libraries/providers; do not invent password, token, or crypto schemes.
- Verify signup, login, logout, recovery, email change, MFA, reauthentication, and account
  linking cannot enumerate, replay, or cross identities.
- Check cookie flags, session rotation after login/privilege change, expiry, revocation, and
  concurrent-session behavior.
- Apply throttling and detection to credential, OTP, reset, and recovery attempts.
- Require recent authentication for destructive or sensitive changes.

### API and Abuse

- Inventory every API version and method, including GraphQL operations, RPCs, webhooks, and stale
  endpoints.
- Bound request body size, pagination, query complexity, fan-out, batch size, concurrency,
  retries, and expensive business actions.
- Authenticate webhooks cryptographically; validate timestamp and replay window; make handlers
  idempotent.
- Treat third-party API responses as untrusted and set connection/read/total timeouts.
- Ensure errors and schemas do not expose internal fields or excess object properties.

### Browser and Transport

- Restrict CORS to required origins, methods, headers, and credential behavior. CORS is not
  server-side authorization.
- Use a tested CSP that matches the application. Prefer `frame-ancestors` for clickjacking
  control; retain `X-Frame-Options` where legacy compatibility matters.
- Verify HTTPS and HSTS at the actual edge before recommending preload.
- Review open redirects, unsafe URL schemes, postMessage origin checks, DOM sinks, service
  workers, and client bundles for private configuration.

### Data, Secrets, and Cryptography

- Classify sensitive data and minimize collection, retention, replication, logs, and client
  exposure.
- Keep elevated credentials in a secret manager or protected runtime configuration, never in a
  browser/mobile/desktop/extension bundle.
- Distinguish public project identifiers and publishable keys from elevated secrets. Public keys
  must still be constrained by server/database authorization.
- Check encryption in transit and at rest, key ownership, envelope/key rotation design, nonce/IV
  correctness, authenticated encryption, and backup protection.
- Review logs for access tokens, session IDs, passwords, connection strings, secrets, and
  unnecessary personal data.

### Dependencies, Build, CI, and Deployment

- Verify lockfiles are committed and match manifests. Review install scripts, Git dependencies,
  unpinned actions/images, registries, package publication, and dependency confusion risk.
- Run ecosystem audits and SAST already available in the repository; assess reachability and
  production exposure before grading.
- Minimize CI token permissions; protect release jobs and environments; do not expose secrets to
  untrusted pull requests or logs.
- Scan IaC and images when present. Use minimal maintained images, a non-root runtime where
  feasible, read-only filesystems/capabilities where compatible, and no baked-in secrets.
- Verify production disables debug/test/admin conveniences and uses safe error handling,
  timeouts, health checks, backups, restore tests, monitoring, and rollback.

### Resilience and Incident Readiness

- Bound retries and fail safely during auth, policy, key, database, and dependency failures.
- Log authentication events, authorization failures, admin actions, privilege changes, secret
  use where supported, and security-control changes without sensitive values.
- Confirm alerts have owners and useful thresholds; logging alone is not detection.
- Check a vulnerability intake path, supported versions, patch process, secret-rotation runbook,
  backup restore process, and incident contacts.

## Supabase and Postgres Profile

Apply only when Supabase/Postgres is present:

- Treat publishable/legacy `anon` keys as public identifiers with low privileges. Treat
  `sb_secret_...` and legacy `service_role` keys as elevated secrets that bypass RLS and must
  never enter browser, mobile, desktop, extension, URL, or logs.
- Enable RLS on every table or view exposed through the Data API. Pair RLS with explicit grants;
  neither replaces the other.
- Test policies with anonymous, owner, another user, another tenant, and admin/service cases.
  Review `USING` and `WITH CHECK` separately for each operation.
- Reject permissive writes unless the business model explicitly requires them and abuse is
  controlled. Public analytics/click writes should usually pass through a validated,
  rate-limited server endpoint.
- Prefer `security invoker`. Every `SECURITY DEFINER` function needs a fixed safe `search_path`,
  schema-qualified relations, narrow `EXECUTE` grants, and adversarial tests.
- Review views for `security_invoker`, exposed materialized/foreign tables, storage bucket
  policies, and default privileges.
- Put grants, RLS, policies, views, and functions in idempotent migrations. Run Supabase security
  and performance advisors after DB security changes when access is available.

The route shape is framework-specific. In Next.js, privileged server work may use Route Handlers,
Server Actions with equivalent authorization, jobs, or separate services. The invariant is a
trusted server boundary, not one mandatory folder name.

## Conditional Profiles

- Native mobile: add OWASP MASVS storage, crypto, auth, network, platform, code, resilience, and
  privacy controls. Assume shipped binaries and embedded values are recoverable.
- Browser extension: review manifest permissions, host permissions, web-accessible resources,
  content-script/page boundaries, message sender validation, CSP, remote code, update integrity,
  and privileged API exposure.
- Desktop: review IPC/command allowlists, shell/filesystem capabilities, navigation, updater
  signing, local secret storage, and renderer isolation.
- Cloud/IaC: add provider identity, network, storage, logging, KMS, backup, public exposure, and
  organization-policy checks using provider and CIS guidance.
- AI/LLM: add prompt/data trust boundaries, tool authorization, retrieval poisoning, secret/data
  disclosure, output-to-action validation, cost limits, tenant isolation, and OWASP LLMSVS where
  applicable.

## Read-Only Commands

Choose only commands matching files and tools already present:

```bash
# Inventory
git status --short
rg --files -g '!*node_modules*' -g '!*vendor*'

# JavaScript ecosystems
npm audit --omit=dev
pnpm audit --prod
yarn npm audit --environment production

# Other ecosystems, only when already installed/configured
pip-audit
bundle audit check --update
cargo audit
govulncheck ./...
osv-scanner scan source -r .
gitleaks detect --no-banner --redact
semgrep scan --config auto
```

Do not run every command blindly. Network-backed audits may fail offline; report that as a
coverage gap. Do not treat dev-only findings as production-reachable without evidence.

## Sources and Synthesis

Primary baselines:

- OWASP ASVS 5.0.0: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10:2025: https://owasp.org/Top10/
- NIST SP 800-218 SSDF 1.1: https://csrc.nist.gov/pubs/sp/800/218/final
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- OWASP API Security Top 10:2023: https://owasp.org/API-Security/
- OWASP MASVS: https://mas.owasp.org/MASVS/
- CISA Secure by Design: https://www.cisa.gov/securebydesign
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase database functions: https://supabase.com/docs/guides/database/functions
- Supabase database advisors: https://supabase.com/docs/guides/database/database-advisors

Secondary sources reviewed for recurring themes:

- Wiz AppSec best practices: https://www.wiz.io/academy/application-security/application-security-best-practices
- F5 web application security practices: https://www.f5.com/company/blog/top-10-web-application-security-best-practices
- DEV Community modern web security list:
  https://dev.to/sandesh3142/defend-your-app-10-modern-best-practices-for-securing-web-applications-5bo1
- OWASP Secure Coding Practices quick-reference checklist:
  https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/stable-en/02-checklist/05-checklist

The secondary material consistently supports early security, input boundaries, least privilege,
dependency management, layered defenses, monitoring, and incident readiness. Where a secondary
source makes an absolute claim, use the corrected, context-dependent rules above.
