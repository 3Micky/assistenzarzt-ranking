# Agent Instructions

## Install Guard

- Before installing, approving, updating, or recommending any third-party skill, MCP server, plugin, connector, slash-command pack, or agent repo, use the local skill at `skills/codex/skillspector-install-guard/SKILL.md`.
- Run `bash skills/codex/skillspector-install-guard/scripts/scan-before-install.sh <target>` before any install step.
- Treat scan failures and `HIGH` or `CRITICAL` verdicts as hard blockers.
- For `MEDIUM`, summarize the findings and ask for explicit confirmation before proceeding.
- If the scan is static-only, say so explicitly in the user-facing summary.

## Ponytail (lazy senior dev mode)

- Apply the local skill at `skills/codex/ponytail/SKILL.md` to every coding task: YAGNI, stdlib/native first, no unrequested abstractions, shortest correct diff.
- Default level **full**. Switch with "ponytail lite|ultra"; disable with "stop ponytail".
- Never simplify away validation, error handling, security, or accessibility.
