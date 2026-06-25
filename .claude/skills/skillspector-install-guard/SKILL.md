---
name: skillspector-install-guard
description: Scan third-party agent extensions with SkillSpector before installation. Use when Claude is asked to install, approve, recommend, update, or review a skill, MCP server, plugin, connector, slash-command pack, agent repo, zip archive, local SKILL.md bundle, or similar agent capability from a directory, file URL, Git URL, or archive.
---

# Skillspector Install Guard

## Overview

Run SkillSpector before any agent-extension install work. Produce a clear install verdict, summarize the findings, and stop unsafe installs before they happen.

## Workflow

1. Resolve the install target.
Use the most local artifact available: unpacked directory first, then a specific `SKILL.md`, then a zip file, then a Git or file URL.

2. Run the scanner.
Invoke `scripts/scan-before-install.sh <target>` from this skill directory.
Default to static-only mode. Add `--llm` only when the user wants a deeper scan and credentials are available.

3. Apply the decision policy.
Read [references/install-policy.md](references/install-policy.md) and classify the result before any install step.

4. Report the verdict.
State the target, scan mode, risk score, severity, recommendation, and the top findings. If the verdict is not clearly safe, stop and ask for confirmation or decline the install.

## Rules

- Never install first and scan later.
- Never skip the scan because the source looks reputable.
- Treat scan failures as blockers, not silent warnings.
- If the result is static-only, say so explicitly so a low score is not mistaken for a full semantic clean bill.
- Prefer the scanner's JSON output for reasoning, then summarize it for the user in plain language.

## Commands

```bash
bash .claude/skills/skillspector-install-guard/scripts/scan-before-install.sh ./path/to/skill
bash .claude/skills/skillspector-install-guard/scripts/scan-before-install.sh https://github.com/org/repo
bash .claude/skills/skillspector-install-guard/scripts/scan-before-install.sh ./skill.zip --llm
```
