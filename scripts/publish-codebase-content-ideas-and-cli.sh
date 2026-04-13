#!/usr/bin/env bash
# After you bump @its-thepoe/codebase-content-ideas and sync skills/package.json
# (dependency + orchestrator version), run this from the repo root — order is fixed.
#
# 2FA: NPM_OTP=123456 ./scripts/publish-codebase-content-ideas-and-cli.sh
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

run_publish @its-thepoe/codebase-content-ideas
run_publish @its-thepoe/skills

echo "Done. Smoke: npx --yes @its-thepoe/skills@latest check"
