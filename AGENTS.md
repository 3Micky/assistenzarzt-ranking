# Agent Instructions

## Install Guard

- Before installing, approving, updating, or recommending any third-party skill, MCP server, plugin, connector, slash-command pack, or agent repo, use the local skill at `skills/codex/skillspector-install-guard/SKILL.md`.
- Run `bash skills/codex/skillspector-install-guard/scripts/scan-before-install.sh <target>` before any install step.
- Treat scan failures and `HIGH` or `CRITICAL` verdicts as hard blockers.
- For `MEDIUM`, summarize the findings and ask for explicit confirmation before proceeding.
- If the scan is static-only, say so explicitly in the user-facing summary.
