#!/usr/bin/env bash
# Publish all @its-thepoe/* packages in dependency order.
# Requires: npm login, and permission to publish under scope @its-thepoe
# (npm username must be "its-thepoe" OR you must belong to org "its-thepoe").
#
# Browser-based publish: run without NPM_OTP; complete browser auth and rerun if npm asks.
# OTP-based 2FA only: NPM_OTP=123456 ./scripts/publish-all.sh (code valid ~30s)
#
# If a workspace version is already on npm, that publish is skipped (continues to next).
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

run_publish() {
  local workspace="$1"
  local tmp
  tmp=$(mktemp)
  set +e
  if [ -n "${NPM_OTP:-}" ]; then
    npm publish --access public --otp="$NPM_OTP" -w "$workspace" >"$tmp" 2>&1
  else
    npm publish --access public -w "$workspace" >"$tmp" 2>&1
  fi
  local code=$?
  set -e
  cat "$tmp"
  if [ "$code" -eq 0 ]; then
    rm -f "$tmp"
    return 0
  fi
  if grep -Eqi 'cannot publish over the previously published|previously published versions' "$tmp"; then
    rm -f "$tmp"
    echo "SKIP $workspace (this version is already on the registry)"
    return 0
  fi
  rm -f "$tmp"
  return "$code"
}

npm run validate

run_publish @its-thepoe/alt-text
run_publish @its-thepoe/design-and-refine
run_publish @its-thepoe/design-engineering
run_publish @its-thepoe/design-motion-principles
run_publish @its-thepoe/family-taste
run_publish @its-thepoe/canva-app-builder
run_publish @its-thepoe/codebase-content-ideas
run_publish @its-thepoe/market-command-matrix
run_publish @its-thepoe/root-cause-analysis
run_publish @its-thepoe/write-a-skill
run_publish @its-thepoe/skills

echo "Done. Smoke test: npx @its-thepoe/skills@latest check"
