#!/usr/bin/env bash
# ============================================================================
# THE ONE canonical publish script for this repo. Do not create another one.
#
# Publishes every @its-thepoe/* skill package, then the orchestrator
# (@its-thepoe/skills) last. Reads the workspace list directly from the root
# package.json — there is no hardcoded skill list to go stale. Add a skill to
# package.json "workspaces" and this script picks it up automatically.
#
# REQUIRED before running, every session:
#   npm login
#   npm whoami        # must print: its-thepoe
#
# 2FA: this account is `two-factor auth: auth-and-writes` with a browser/
# WebAuthn second factor (no TOTP codes exist for it — never pass NPM_OTP /
# --otp). `npm publish` requires its own fresh OTP challenge per write; it
# does NOT inherit a session from `npm login`, and unlike `npm login` it does
# NOT auto-poll for approval — it fails fast with `EOTP` and prints a URL.
#
# Per npm's own behavior, approving that URL opens a short (~5 minute) grace
# window during which further publishes succeed without a new prompt. So
# this script does not abort on EOTP: it pauses, tells you to approve the
# printed URL, waits for Enter, and retries — then keeps going through the
# rest of the batch in the same run, reusing that grace window instead of
# needing one browser click per package.
#
# Run from Terminal.app (interactive) — the retry prompt needs a real TTY.
#
# Safe to re-run: any package whose local version already matches the
# registry is skipped (no error, no re-publish attempt).
# ============================================================================
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
FAILED_PACKAGES=()
MAX_PUBLISH_ATTEMPTS=3

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

get_local_version() {
  # $1 = workspace path, e.g. design/prototype or skills
  node -p "require('./$1/package.json').version"
}

get_package_name() {
  node -p "require('./$1/package.json').name"
}

get_registry_version() {
  # $1 = package name, e.g. @its-thepoe/prototype
  npm view "$1" version 2>/dev/null || true
}

publish_one() {
  local ws_path="$1"
  local pkg_name local_version registry_version

  pkg_name=$(get_package_name "$ws_path")
  local_version=$(get_local_version "$ws_path")
  registry_version=$(get_registry_version "$pkg_name")

  if [ -n "$registry_version" ] && [ "$local_version" = "$registry_version" ]; then
    echo "SKIP  $pkg_name@$local_version (already on registry)"
    return 0
  fi

  echo "PUBLISH $pkg_name@$local_version (registry has: ${registry_version:-none})"

  local attempt=1
  while [ "$attempt" -le "$MAX_PUBLISH_ATTEMPTS" ]; do
    if npm publish --access public -w "$ws_path"; then
      return 0
    fi
    echo
    echo ">>> That failed — if you saw 'code EOTP' with a browser URL above, this is normal for"
    echo ">>> this account's 2FA. Open the URL, approve it, then come back here."
    read -r -p ">>> Press Enter once approved (attempt $attempt/$MAX_PUBLISH_ATTEMPTS) to retry $pkg_name: " _ < /dev/tty
    attempt=$((attempt + 1))
  done

  echo "FAILED  $pkg_name@$local_version after $MAX_PUBLISH_ATTEMPTS attempts — continuing with the rest, rerun the script later to retry this one."
  FAILED_PACKAGES+=("$pkg_name")
  return 0
}

echo "== Publishing skill packages =="
SKILLS_WORKSPACE=""
while IFS= read -r ws_path; do
  if [ "$ws_path" = "skills" ]; then
    SKILLS_WORKSPACE="$ws_path"
    continue
  fi
  publish_one "$ws_path"
done < <(node -p "require('./package.json').workspaces.join('\n')")

echo
echo "== Publishing orchestrator (@its-thepoe/skills) =="
if [ -n "$SKILLS_WORKSPACE" ]; then
  publish_one "$SKILLS_WORKSPACE"
else
  echo "ERROR: 'skills' workspace not found in package.json workspaces array."
  exit 1
fi

echo
if [ "${#FAILED_PACKAGES[@]}" -gt 0 ]; then
  echo "Done, with failures. These packages did not publish after $MAX_PUBLISH_ATTEMPTS attempts each:"
  printf '  - %s\n' "${FAILED_PACKAGES[@]}"
  echo "Rerun ./scripts/publish-all.sh to retry just these (everything else will be skipped)."
else
  echo "Done. Smoke test:"
  echo "  npx --yes @its-thepoe/skills@latest check"
fi
