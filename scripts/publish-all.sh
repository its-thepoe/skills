#!/usr/bin/env bash
# Publish all @its-thepoe/* packages in dependency order.
# Requires: npm login, and permission to publish under scope @its-thepoe
# (npm username must be "its-thepoe" OR you must belong to org "its-thepoe").
#
# If npm 2FA is enabled, set a one-time code (valid ~30s) when you run:
#   NPM_OTP=123456 ./scripts/publish-all.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OTP_ARGS=()
if [ -n "${NPM_OTP:-}" ]; then
  OTP_ARGS+=(--otp="$NPM_OTP")
fi

npm run validate

npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/alt-text
npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/design-and-refine
npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/design-engineering
npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/design-motion-principles
npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/family-taste
npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/write-a-skill
npm publish --access public "${OTP_ARGS[@]}" -w @its-thepoe/skills

echo "Done. Smoke test: npx @its-thepoe/skills@latest check"
