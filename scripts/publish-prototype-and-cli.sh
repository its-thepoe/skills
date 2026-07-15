#!/usr/bin/env bash
# Publish @its-thepoe/prototype and/or @its-thepoe/tauri-best-practices, then CLI.
# Bump versions in skills/package.json before running.
#
# 2FA: NPM_OTP=123456 ./scripts/publish-prototype-and-cli.sh
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run validate

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

run_publish @its-thepoe/prototype
run_publish @its-thepoe/tauri-best-practices
run_publish @its-thepoe/skills

echo "Done. Smoke: npx --yes @its-thepoe/skills@latest check"
