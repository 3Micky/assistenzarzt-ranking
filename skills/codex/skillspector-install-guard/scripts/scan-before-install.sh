#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scan-before-install.sh <target> [--llm|--no-llm] [--format json|terminal|markdown|sarif]

Scans a skill, MCP package, repo, zip, URL, directory, or SKILL.md with SkillSpector
before installation. Defaults to static-only JSON output.
EOF
}

format="${SKILLSPECTOR_FORMAT:-json}"
use_llm="${SKILLSPECTOR_USE_LLM:-0}"
target=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --format)
      format="${2:-}"
      shift 2
      ;;
    --llm)
      use_llm=1
      shift
      ;;
    --no-llm)
      use_llm=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "$target" ]]; then
        target="$1"
        shift
      else
        echo "Unexpected argument: $1" >&2
        usage >&2
        exit 64
      fi
      ;;
  esac
done

if [[ -z "$target" ]]; then
  usage >&2
  exit 64
fi

scan_args=(scan "$target" --format "$format")
if [[ "$use_llm" != "1" ]]; then
  scan_args+=(--no-llm)
fi

if command -v skillspector >/dev/null 2>&1; then
  exec skillspector "${scan_args[@]}"
fi

if command -v uvx >/dev/null 2>&1; then
  exec uvx --from git+https://github.com/NVIDIA/SkillSpector.git skillspector "${scan_args[@]}"
fi

if command -v uv >/dev/null 2>&1; then
  exec uv tool run --from git+https://github.com/NVIDIA/SkillSpector.git skillspector "${scan_args[@]}"
fi

cat >&2 <<'EOF'
SkillSpector is not installed and no uv runner is available.

Install one of:
  uv tool install git+https://github.com/NVIDIA/SkillSpector.git
  pip install skillspector
EOF
exit 69
