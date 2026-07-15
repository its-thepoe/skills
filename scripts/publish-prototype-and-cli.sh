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
  if [ -n "${NPM_OTP:-}" ]; then
    npm publish --access public --otp="$NPM_OTP" -w "$workspace"
  else
    npm publish --access public -w "$workspace"
  fi
}

run_publish @its-thepoe/prototype
run_publish @its-thepoe/tauri-best-practices
run_publish @its-thepoe/skills

echo "Done. Smoke: npx --yes @its-thepoe/skills@latest check"
