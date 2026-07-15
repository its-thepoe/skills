#!/usr/bin/env bash
# ============================================================================
# THE one sustained publish path for this repo (no tokens, no CI required).
#
# Run EVERY time from Terminal.app / iTerm — never from Cursor's agent shell.
#
#   cd "/path/to/poe-skills"
#   npm login
#   npm whoami          # must print: its-thepoe
#   ./scripts/publish-all.sh
#
# What happens on EOTP (normal for this account):
#   1. npm prints a https://www.npmjs.com/auth/cli/... URL
#   2. this script opens it in your browser (macOS `open`)
#   3. you approve with your WebAuthn / security key
#   4. you press Enter back here
#   5. the script retries and keeps publishing — the approval opens a short
#      grace window (~5 min) so you usually only click once for a big batch
#
# Never set NPM_OTP / --otp. Never use a Bypass-2FA token for this flow.
# Safe to re-run: already-published versions are skipped.
# ============================================================================
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=lib/publish-common.sh
source "$ROOT/scripts/lib/publish-common.sh"
FAILED_PACKAGES=()
MAX_PUBLISH_ATTEMPTS=3

require_interactive_tty() {
  if [ ! -t 0 ] || [ ! -c /dev/tty ]; then
    echo "ERROR: This script needs a real interactive terminal (Terminal.app / iTerm)."
    echo "Cursor's agent shell cannot complete browser 2FA — open Terminal.app and run:"
    echo
    echo "  cd \"$ROOT\""
    echo "  npm login && npm whoami && ./scripts/publish-all.sh"
    echo
    exit 1
  fi
}

# Extract the auth.cli URL from npm's EOTP error text (if present) and open it.
open_auth_url_from_log() {
  local log_file="$1"
  local url
  url="$(grep -oE 'https://www\.npmjs\.com/auth/cli/[A-Za-z0-9._~-]+' "$log_file" 2>/dev/null | head -1 || true)"
  if [ -z "$url" ]; then
    return 1
  fi
  echo ">>> Opening browser for approval:"
  echo ">>>   $url"
  if command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  fi
  return 0
}

require_interactive_tty

echo "== Checking npm auth =="
WHOAMI="$(npm whoami 2>/dev/null || true)"
if [ "$WHOAMI" != "its-thepoe" ]; then
  echo "ERROR: npm whoami must print 'its-thepoe' (got: '${WHOAMI:-<not logged in>}')."
  echo "Run: npm login"
  echo "Then verify: npm whoami"
  exit 1
fi
echo "OK npm whoami -> $WHOAMI"
echo

echo "== Validating all packages =="
npm run validate
echo

publish_one() {
  local ws_path="$1"
  local pkg_name local_version registry_version
  local attempt=1
  local tmp_log

  pkg_name=$(get_package_name "$ws_path")
  local_version=$(get_local_version "$ws_path")
  registry_version=$(get_registry_version "$pkg_name")

  if [ -n "$registry_version" ] && [ "$local_version" = "$registry_version" ]; then
    echo "SKIP  $pkg_name@$local_version (already on registry)"
    return 0
  fi

  echo "PUBLISH $pkg_name@$local_version (registry has: ${registry_version:-none})"

  while [ "$attempt" -le "$MAX_PUBLISH_ATTEMPTS" ]; do
    tmp_log="$(mktemp)"
    # Keep npm output on the terminal AND in the log so we can extract the auth URL.
    # Use PIPESTATUS[0] — tee always exits 0, so we must read npm's real status.
    set +e
    npm publish --access public -w "$ws_path" 2>&1 | tee "$tmp_log"
    local npm_status=${PIPESTATUS[0]}
    set -e
    if [ "$npm_status" -eq 0 ]; then
      rm -f "$tmp_log"
      return 0
    fi
    echo
    if open_auth_url_from_log "$tmp_log"; then
      echo ">>> Approve in the browser that just opened (WebAuthn / security key)."
    else
      echo ">>> That failed with EOTP (or similar). If npm printed a browser URL above,"
      echo ">>> open it, approve with your security key, then come back here."
    fi
    rm -f "$tmp_log"
    read -r -p ">>> Press Enter once approved (attempt $attempt/$MAX_PUBLISH_ATTEMPTS) to retry $pkg_name: " _ < /dev/tty
    attempt=$((attempt + 1))
  done

  echo "FAILED  $pkg_name@$local_version after $MAX_PUBLISH_ATTEMPTS attempts — continuing; rerun later to retry."
  FAILED_PACKAGES+=("$pkg_name")
  return 0
}

echo "== Publishing skill packages =="
load_workspaces
for ws_path in "${SKILL_WORKSPACES[@]}"; do
  publish_one "$ws_path"
done

echo
echo "== Publishing orchestrator (@its-thepoe/skills) =="
if [ -n "$SKILLS_ORCHESTRATOR_WORKSPACE" ]; then
  publish_one "$SKILLS_ORCHESTRATOR_WORKSPACE"
else
  echo "ERROR: 'skills' workspace not found in package.json workspaces array."
  exit 1
fi

echo
if [ "${#FAILED_PACKAGES[@]}" -gt 0 ]; then
  echo "Done, with failures. These packages did not publish after $MAX_PUBLISH_ATTEMPTS attempts each:"
  printf '  - %s\n' "${FAILED_PACKAGES[@]}"
  echo "Rerun ./scripts/publish-all.sh to retry just these (everything else will be skipped)."
  exit 1
else
  echo "Done. Smoke test:"
  echo "  npx --yes @its-thepoe/skills@latest check"
fi
