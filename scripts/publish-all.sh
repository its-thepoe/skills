#!/usr/bin/env bash
# ============================================================================
# LOCKED PATH — the publish flow that finally worked. Do not regress.
# See: docs/publish-step-by-step.md · AGENTS.md · .cursor/rules/npm-publish.mdc
#
#   # Terminal.app / iTerm ONLY — never Cursor agent
#   npm login && npm whoami && ./scripts/publish-all.sh
#
# CRITICAL: `npm publish` must keep a real TTY on stdout/stdin. If you pipe it
# (e.g. through `tee`), npm skips its built-in web OTP opener and only prints a
# redacted EOTP URL (`auth/cli/***`) you cannot click. Never pipe publish.
#
# With a real TTY, npm's otplease() opens the browser, polls until you approve,
# and retries the same publish. A short grace window usually covers the rest of
# the batch so you only approve once or twice.
#
# Never set NPM_OTP / --otp. Never invent a parallel "better" publish script.
# Safe to re-run: already-published versions are skipped.
# ============================================================================
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=lib/publish-common.sh
source "$ROOT/scripts/lib/publish-common.sh"
FAILED_PACKAGES=()
MAX_PUBLISH_ATTEMPTS=3

# Guard: if someone "improves" this script by piping publish again, fail loud.
assert_no_publish_pipe() {
  if grep -E 'npm publish[^
]*\|' "$ROOT/scripts/publish-all.sh" >/dev/null 2>&1; then
    echo "ERROR: scripts/publish-all.sh must not pipe 'npm publish' (breaks TTY / browser 2FA)."
    echo "Remove the pipe. See .cursor/rules/npm-publish.mdc"
    exit 1
  fi
}

require_interactive_tty() {
  if [ ! -t 0 ] || [ ! -t 1 ] || [ ! -c /dev/tty ]; then
    echo "ERROR: This script needs a real interactive terminal (Terminal.app / iTerm)."
    echo "Cursor's agent shell cannot complete browser 2FA — open Terminal.app and run:"
    echo
    echo "  cd \"$ROOT\""
    echo "  npm login && npm whoami && ./scripts/publish-all.sh"
    echo
    exit 1
  fi
}

require_interactive_tty

assert_no_publish_pipe

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

  pkg_name=$(get_package_name "$ws_path")
  local_version=$(get_local_version "$ws_path")
  registry_version=$(get_registry_version "$pkg_name")

  if [ -n "$registry_version" ] && [ "$local_version" = "$registry_version" ]; then
    echo "SKIP  $pkg_name@$local_version (already on registry)"
    return 0
  fi

  echo "PUBLISH $pkg_name@$local_version (registry has: ${registry_version:-none})"

  while [ "$attempt" -le "$MAX_PUBLISH_ATTEMPTS" ]; do
    # No pipes — npm needs a real TTY so otplease can open the browser.
    if npm publish --access public -w "$ws_path"; then
      return 0
    fi
    echo
    echo ">>> Publish failed for $pkg_name (attempt $attempt/$MAX_PUBLISH_ATTEMPTS)."
    echo ">>> If a browser opened, finish approving there, then press Enter here."
    echo ">>> If you only saw a redacted auth/cli/*** URL, that means stdout was"
    echo ">>> not a TTY — re-run this script from Terminal.app (not Cursor)."
    read -r -p ">>> Press Enter to retry $pkg_name: " _ < /dev/tty
    attempt=$((attempt + 1))
  done

  echo "FAILED  $pkg_name@$local_version after $MAX_PUBLISH_ATTEMPTS attempts — continuing; rerun later to retry."
  FAILED_PACKAGES+=("$pkg_name")
  return 0
}

echo "== Publishing skill packages =="
echo "(Browser may open for the first 2FA challenge — approve, then leave this Terminal alone.)"
echo
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
