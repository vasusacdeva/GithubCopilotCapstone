# 07 Verification Agent Instructions

Agent: `.github/agents/07-verification.agent.md`

## Purpose
Confirm completeness and release readiness and write `docs/<story-id>/07-verification-report.md`.

## Steps
1. Verify stage 06 is `approved` and `pipeline-state.json` has `code-review.approval = approved`.
2. Use `skills/07-release-verification-skill.md`: run `./tests/validate-story.ps1 -JiraId <story-id>` and the project test suite.
3. Report Pass only if both succeed; otherwise Fail with each failing check.
4. Include: validation evidence, approval chain for stages 01-06, requirement and acceptance traceability, open items, risk summary, readiness statement.

## Rules
- Run every check you report; mark anything not executed as "Not executed".
- Do not create a PR or call GitHub MCP.
- Readiness is "conditionally ready" while manual checks remain open.

## Approval block
Decision, approver, rationale, evidence, timestamp, next agent. Release-readiness approval is required before stage 08.

## Next agent
`08-pr-creator.agent.md` after `approved`.
