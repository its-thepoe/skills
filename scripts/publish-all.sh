#!/usr/bin/env bash
# Publish all @its-thepoe/* packages in dependency order.
# Requires: npm login, and permission to publish under scope @its-thepoe
# (npm username must be "its-thepoe" OR you must belong to org "its-thepoe").
#
# If npm 2FA is enabled, set a one-time code (valid ~30s) when you run:
#   NPM_OTP=123456 ./scripts/publish-all.sh
set -eo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

run_publish() {
  local workspace="$1"
  if [ -n "${NPM_OTP:-}" ]; then
    npm publish --access public --otp="$NPM_OTP" -w "$workspace"
  else
    npm publish --access public -w "$workspace"
  fi
}

npm run validate

run_publish @its-thepoe/alt-text
run_publish @its-thepoe/design-and-refine
run_publish @its-thepoe/design-engineering
run_publish @its-thepoe/design-motion-principles
run_publish @its-thepoe/family-taste
run_publish @its-thepoe/codebase-content-ideas
run_publish @its-thepoe/write-a-skill
run_publish @its-thepoe/skills

echo "Done. Smoke test: npx @its-thepoe/skills@latest check"
