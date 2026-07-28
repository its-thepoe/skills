#!/usr/bin/env bash

set -u

target_dir="${1:-.}"

if [ ! -d "$target_dir" ]; then
  printf 'error: target is not a directory: %s\n' "$target_dir" >&2
  exit 2
fi

if ! command -v rg >/dev/null 2>&1; then
  printf 'error: repo-security-scan requires rg (ripgrep)\n' >&2
  exit 2
fi

cd "$target_dir" || exit 2

scan_globs=(
  --hidden
  --glob '!.git/**'
  --glob '!node_modules/**'
  --glob '!vendor/**'
  --glob '!.next/**'
  --glob '!dist/**'
  --glob '!build/**'
  --glob '!coverage/**'
  --glob '!target/**'
  --glob '!Pods/**'
)

section() {
  printf '\n== %s ==\n' "$1"
}

scan_counts() {
  label="$1"
  pattern="$2"
  section "$label"

  matches="$(rg --count-matches "${scan_globs[@]}" --regexp "$pattern" . 2>/dev/null || true)"
  if [ -n "$matches" ]; then
    printf '%s\n' "$matches"
  else
    printf 'none found\n'
  fi
}

printf 'Security triage for: %s\n' "$(pwd)"
printf 'Output contains file paths and match counts, never matching secret values.\n'

section "Repository state"
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git status --short
else
  printf 'not a Git worktree\n'
fi

section "Security-relevant manifests"
rg --files "${scan_globs[@]}" \
  | rg '(^|/)(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|requirements[^/]*\.txt|pyproject\.toml|Pipfile(\.lock)?|poetry\.lock|Gemfile(\.lock)?|go\.(mod|sum)|Cargo\.(toml|lock)|composer\.(json|lock)|Dockerfile[^/]*|compose[^/]*\.ya?ml|.*\.tf|.*\.tfvars|serverless\.ya?ml|supabase/config\.toml)$' \
  || printf 'none found\n'

section "Tracked secret-like filenames"
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  tracked_sensitive="$(
    git ls-files \
      | rg '(^|/)(\.env($|\.)|.*\.(pem|key|p12|pfx|jks|keystore)|id_(rsa|dsa|ecdsa|ed25519)|credentials[^/]*\.json|service-account[^/]*\.json)$' \
      || true
  )"
  if [ -n "$tracked_sensitive" ]; then
    printf '%s\n' "$tracked_sensitive"
  else
    printf 'none found\n'
  fi
else
  printf 'skipped: not a Git worktree\n'
fi

scan_counts \
  "High-confidence secret candidates (redacted)" \
  '(AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk_(live|test)_[A-Za-z0-9]{16,}|rk_(live|test)_[A-Za-z0-9]{16,}|sk-[A-Za-z0-9_-]{20,}|sb_secret_[A-Za-z0-9_-]{16,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})'

scan_counts \
  "Client-visible environment variable candidates" \
  '(NEXT_PUBLIC_|VITE_|PUBLIC_|EXPO_PUBLIC_|NUXT_PUBLIC_|REACT_APP_)[A-Z0-9_]+'

scan_counts \
  "Privileged database key or role references" \
  '(SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY|sb_secret_|service_role)'

scan_counts \
  "Dynamic execution and unsafe rendering candidates" \
  '(dangerouslySetInnerHTML|\.innerHTML[[:space:]]*=|(^|[^A-Za-z])(eval|exec|system)[[:space:]]*\(|new Function[[:space:]]*\(|child_process|shell[[:space:]]*:[[:space:]]*true)'

scan_counts \
  "Authentication material in browser storage candidates" \
  '(localStorage|sessionStorage).*(token|jwt|session|auth)|document\.cookie'

scan_counts \
  "Sensitive logging candidates" \
  '(console\.(log|debug|info|warn|error)|logger\.(debug|info|warn|error)).*(password|passwd|token|secret|authorization|cookie|api[_-]?key)'

scan_counts \
  "Broad CORS or browser-origin candidates" \
  '(Access-Control-Allow-Origin.{0,20}\*|origin[[:space:]]*:[[:space:]]*['"'"'"]\*['"'"'"])'

scan_counts \
  "Supabase/Postgres policy and privilege candidates" \
  '(security[[:space:]]+definer|with[[:space:]]+check[[:space:]]*\([[:space:]]*true[[:space:]]*\)|using[[:space:]]*\([[:space:]]*true[[:space:]]*\)|disable[[:space:]]+row[[:space:]]+level[[:space:]]+security|grant[[:space:]]+(all|execute).*(anon|authenticated|public))'

scan_counts \
  "Network fetch and redirect candidates for SSRF/open-redirect review" \
  '(fetch|axios\.(get|post|request)|redirect|sendRedirect|NextResponse\.redirect).*(url|uri|href|target|destination|returnTo|callback)'

scan_counts \
  "Weak password hashing or general hash use candidates" \
  '(md5|sha1|createHash[[:space:]]*\([[:space:]]*['"'"'"](md5|sha1|sha256)['"'"'"]|bcrypt)'

section "Public endpoint and privileged surface candidates"
surface_files="$(
  rg --files "${scan_globs[@]}" \
    | rg '(^|/)(api|routes?|controllers?|handlers?|functions?|webhooks?|admin|migrations?|supabase|entrypoints|src-tauri)(/|\.|$)' \
    || true
)"
if [ -n "$surface_files" ]; then
  printf '%s\n' "$surface_files"
else
  printf 'none found by path heuristic\n'
fi

section "Next steps"
printf '%s\n' \
  '1. Manually inspect every candidate; a match is not a vulnerability.' \
  '2. Trace public and privileged operations from input through authorization to side effect.' \
  '3. Run lockfile-aware dependency, secret-history, SAST, IaC, and image scanners already configured in the repository.' \
  '4. Redact all secret values in reports and rotate any exposed active credential.'
