# 05 Implementation Agent Instructions

Agent: `.github/agents/05-implementation.agent.md`

## Purpose
Execute the approved plan and write `docs/<story-id>/05-implementation-summary.md`.

## Steps
1. Verify stage 04 is `approved`.
2. Implement tasks in plan order; change only what the plan covers.
3. Run targeted checks (for example `npm test`) and record the exact command, output summary, and result.
4. Record deviations from the plan with the reason; fix test or tooling failures and note them.
5. Write the summary: changed files by task, deviations, validation results, acceptance status, manual checks, risks, approval.

## Rules
- Run locally; do not interact with GitHub or require a repository.
- Follow secure coding: no `innerHTML`/`eval` with user data, validate inputs at boundaries.
- Do not claim checks you did not run; list unexecuted checks (for example browser checks) explicitly.
- Do not touch unrelated files or hooks.

## Approval block
Decision, approver, rationale, evidence, timestamp, next agent. Leave `pending` until the user replies.

## Next agent
`06-code-review.agent.md` after `approved`.
