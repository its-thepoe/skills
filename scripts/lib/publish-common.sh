#!/usr/bin/env bash
# Shared helpers for scripts/publish-all.sh (local, browser 2FA) and
# scripts/publish-ci.sh (GitHub Actions, OIDC trusted publishing).
#
# Both scripts read the workspace list live from the root package.json —
# there is no separate hardcoded list anywhere else.

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

# Populates SKILL_WORKSPACES (array) and SKILLS_ORCHESTRATOR_WORKSPACE
# (string, the "skills" entry) from the root package.json workspaces array.
load_workspaces() {
  SKILL_WORKSPACES=()
  SKILLS_ORCHESTRATOR_WORKSPACE=""
  while IFS= read -r ws_path; do
    if [ "$ws_path" = "skills" ]; then
      SKILLS_ORCHESTRATOR_WORKSPACE="$ws_path"
      continue
    fi
    SKILL_WORKSPACES+=("$ws_path")
  done < <(node -p "require('./package.json').workspaces.join('\n')")
}
