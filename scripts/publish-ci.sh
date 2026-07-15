#!/usr/bin/env bash
# ============================================================================
# CI publish script — runs only inside GitHub Actions via trusted publishing
# (OIDC). See .github/workflows/publish.yml and docs/publish-step-by-step.md.
#
# Unlike scripts/publish-all.sh (local, browser 2FA), this never prompts:
# OIDC exchanges a short-lived token per publish with no 2FA challenge, as
# long as the package has a Trusted Publisher configured on npmjs.com for
# this repo + workflow file. Packages that aren't configured yet fail with
# ENEEDAUTH — this script logs those and keeps going instead of aborting the
# whole run, since migrating 100+ packages to trusted publishing happens
# gradually, one npmjs.com click-through at a time.
# ============================================================================
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=lib/publish-common.sh
source "$ROOT/scripts/lib/publish-common.sh"
FAILED_PACKAGES=()

echo "== Validating all packages =="
npm run validate
echo

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
  if npm publish --access public -w "$ws_path"; then
    return 0
  fi

  echo "FAILED  $pkg_name@$local_version — likely no Trusted Publisher configured yet for this package on npmjs.com."
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
  echo "Done, with failures. These packages need a Trusted Publisher configured on npmjs.com:"
  printf '  - %s\n' "${FAILED_PACKAGES[@]}"
  exit 1
else
  echo "Done. All packages published or already up to date."
fi
