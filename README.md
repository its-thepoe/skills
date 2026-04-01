# Agent Skills

This repository is the source of truth for reusable agent skills.

Each skill lives in one folder at the repo root:

```text
skills/
  <skill-name>/
    SKILL.md
    reference.md        # optional
    LOVABLE.md          # optional
    package.json        # optional
```

## Workflow for this repo

- Default workflow is **commit directly on `main`** for normal updates.
- Create feature branches only when explicitly needed.

## Install a skill locally

Use symlinks so updates in this repo instantly reflect in your agents.

### One skill

```bash
SKILL_SRC="/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/skills/<skill-name>"
mkdir -p ~/.cursor/skills ~/.claude/skills ~/.config/opencode/skills ~/.codeium/windsurf/skills
ln -sfn "$SKILL_SRC" ~/.cursor/skills/<skill-name>
ln -sfn "$SKILL_SRC" ~/.claude/skills/<skill-name>
ln -sfn "$SKILL_SRC" ~/.config/opencode/skills/<skill-name>
ln -sfn "$SKILL_SRC" ~/.codeium/windsurf/skills/<skill-name>
```

### Install all skills in this repo

```bash
SKILLS_ROOT="/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/skills"
mkdir -p ~/.cursor/skills ~/.claude/skills ~/.config/opencode/skills ~/.codeium/windsurf/skills
for skill_dir in "$SKILLS_ROOT"/*; do
  [ -d "$skill_dir" ] || continue
  [ -f "$skill_dir/SKILL.md" ] || continue
  skill_name="$(basename "$skill_dir")"
  ln -sfn "$skill_dir" ~/.cursor/skills/"$skill_name"
  ln -sfn "$skill_dir" ~/.claude/skills/"$skill_name"
  ln -sfn "$skill_dir" ~/.config/opencode/skills/"$skill_name"
  ln -sfn "$skill_dir" ~/.codeium/windsurf/skills/"$skill_name"
done
```

Reload/restart Cursor, Claude Code, OpenCode, and Windsurf after installing.

## Optional: Gemini / Antigravity

Path differs by setup. Common pattern:

```bash
mkdir -p ~/.gemini/skills
ln -sfn "$SKILL_SRC" ~/.gemini/skills/<skill-name>
```
