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

print_help() {
  cat <<'EOF'
Usage: ./scripts/publish-all.sh [--all | --changed | --workspace <path> ...]

Modes:
  --all                  Publish every workspace (default; full release audit)
  --changed              Publish workspaces changed relative to HEAD
  --workspace <path>     Publish one workspace; may be repeated

All modes require Terminal.app/iTerm, npm whoami -> its-thepoe, and a real TTY.
Actual npm publishes remain serial and unpiped so browser WebAuthn works.
EOF
}

if [ "$#" -gt 0 ] && { [ "$1" = "--help" ] || [ "$1" = "-h" ]; }; then
  print_help
  exit 0
fi

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

SELECTION_MODE="all"
for arg in "$@"; do
  case "$arg" in
    --changed) SELECTION_MODE="changed" ;;
    --workspace) SELECTION_MODE="explicit" ;;
    --all) SELECTION_MODE="all" ;;
  esac
done

SELECTED_OUTPUT="$(node "$ROOT/scripts/lib/publish-selection.mjs" --paths-only "$@")"
SELECTED_WORKSPACES=()
while IFS= read -r ws_path; do
  [ -n "$ws_path" ] && SELECTED_WORKSPACES+=("$ws_path")
done <<< "$SELECTED_OUTPUT"

if [ "${#SELECTED_WORKSPACES[@]}" -eq 0 ]; then
  if [ "$SELECTION_MODE" = "changed" ]; then
    echo "ERROR: No workspaces changed relative to HEAD; nothing to publish."
  else
    echo "ERROR: Workspace selection is empty."
  fi
  exit 1
fi

echo "== Selected workspaces ($SELECTION_MODE): ${#SELECTED_WORKSPACES[@]} =="
printf '  - %s\n' "${SELECTED_WORKSPACES[@]}"
echo

VALIDATE_ARGS=()
if [ "$SELECTION_MODE" != "all" ]; then
  for ws_path in "${SELECTED_WORKSPACES[@]}"; do
    VALIDATE_ARGS+=(--workspace "$ws_path")
  done
fi

echo "== Validating selected packages =="
if [ "${#VALIDATE_ARGS[@]}" -gt 0 ]; then
  npm run validate -- "${VALIDATE_ARGS[@]}"
else
  npm run validate
fi
echo

publish_one() {
  local ws_path="$1"
  local registry_version="$2"
  local pkg_name local_version
  local attempt=1

  pkg_name=$(get_package_name "$ws_path")
  local_version=$(get_local_version "$ws_path")

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
SKILL_WORKSPACES=()
SKILLS_ORCHESTRATOR_WORKSPACE=""
for ws_path in "${SELECTED_WORKSPACES[@]}"; do
  if [ "$ws_path" = "skills" ]; then
    SKILLS_ORCHESTRATOR_WORKSPACE="$ws_path"
  else
    SKILL_WORKSPACES+=("$ws_path")
  fi
done

PACKAGE_NAMES=()
for ws_path in "${SELECTED_WORKSPACES[@]}"; do
  PACKAGE_NAMES+=("$(get_package_name "$ws_path")")
done

REGISTRY_URL="$(npm config get registry)"
REGISTRY_VERSIONS_JSON="$(node "$ROOT/scripts/registry-versions.mjs" --json --registry "$REGISTRY_URL" "${PACKAGE_NAMES[@]}")"

registry_version_for() {
  node -e 'const data = JSON.parse(process.argv[1]); process.stdout.write(data[process.argv[2]] || "")' "$REGISTRY_VERSIONS_JSON" "$1"
}

for ws_path in "${SKILL_WORKSPACES[@]}"; do
  pkg_name=$(get_package_name "$ws_path")
  publish_one "$ws_path" "$(registry_version_for "$pkg_name")"
done

echo
echo "== Publishing orchestrator (@its-thepoe/skills) =="
if [ -n "$SKILLS_ORCHESTRATOR_WORKSPACE" ]; then
  pkg_name=$(get_package_name "$SKILLS_ORCHESTRATOR_WORKSPACE")
  publish_one "$SKILLS_ORCHESTRATOR_WORKSPACE" "$(registry_version_for "$pkg_name")"
else
  echo "No orchestrator selected; publishing selected skill packages only."
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
