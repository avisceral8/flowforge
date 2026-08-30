#!/usr/bin/env bash
# FlowForge installer — copies the skill package into agent harness skill directories.
# Upstream base: tt-a1i/archify (MIT). FlowForge changes: MIT.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR"

if [ ! -f "$SRC/SKILL.md" ]; then
  echo "error: $SRC/SKILL.md not found — run from the FlowForge repository root" >&2
  exit 1
fi

install_to() {
  local dest_dir="$1"
  local dest="$dest_dir/flowforge"
  mkdir -p "$dest_dir"
  rm -rf "$dest"
  mkdir -p "$dest"
  # Tracked-only copy: excludes node_modules, tests, and dev scripts.
  for item in SKILL.md schemas renderers references recipes examples assets bin delta sources evals thinking types package.json; do
    if [ -e "$SRC/$item" ]; then cp -r "$SRC/$item" "$dest/"; fi
  done
  echo "installed: $dest"
}

case "${1:-all}" in
  --pi)      install_to "$HOME/.pi/skills" ;;
  --claude)  install_to "$HOME/.claude/skills" ;;
  --codex)   install_to "$HOME/.codex/skills" 2>/dev/null || install_to "$HOME/.agents/skills" ;;
  --opencode) install_to "$HOME/.config/opencode/skills" ;;
  all)
    [ -d "$HOME/.pi" ] && install_to "$HOME/.pi/skills"
    [ -d "$HOME/.claude" ] && install_to "$HOME/.claude/skills"
    [ -d "$HOME/.codex" ] && install_to "$HOME/.codex/skills" 2>/dev/null || true
    [ -d "$HOME/.config/opencode" ] && install_to "$HOME/.config/opencode/skills"
    ;;
  *) echo "usage: $0 [--pi|--claude|--codex|--opencode|all]" >&2; exit 1 ;;
esac

echo "FlowForge installed. Ask your agent: \"Map our expense approval process.\""
