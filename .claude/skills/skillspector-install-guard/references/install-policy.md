# Install Policy

Apply these rules after every SkillSpector run.

## Block install

- Scan command fails.
- `safe_to_install` is `false`.
- Severity is `HIGH` or `CRITICAL`.
- Recommendation is `DO NOT INSTALL`.

## Require explicit user confirmation

- Severity is `MEDIUM`.
- Risk score is above 20 even if the recommendation is not a hard block.
- The scan ran in static-only mode and findings look incomplete for a high-impact install.

## Safe to proceed

- Severity is `LOW`.
- `safe_to_install` is `true`.
- No blocking findings are present.

## Reporting format

Include:

- Target scanned
- `risk_score`
- `severity`
- `recommendation`
- `safe_to_install`
- `scan_mode` or whether `llm_used` is false
- The top 3 findings with file paths when available

## Notes

- A static-only scan is still useful, but say clearly that semantic analysis was skipped.
- If the user wants to override a `MEDIUM` result, summarize the findings before continuing.
- Do not hide the difference between "no issues found" and "scan could not run".
