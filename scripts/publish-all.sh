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
# 2FA: browser verification only. Run from Terminal.app (interactive), not
# Cursor's agent shell — non-interactive shells break the browser prompt.
# Never pass NPM_OTP / --otp for this account.
#
# Safe to re-run: any package whose local version already matches the
# registry is skipped (no error, no re-publish attempt).
# ============================================================================
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

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
  npm publish --access public -w "$ws_path"
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
echo "Done. Smoke test:"
echo "  npx --yes @its-thepoe/skills@latest check"
