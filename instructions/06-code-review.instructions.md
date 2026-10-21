# 06 Code Review Agent Instructions

Agent: `.github/agents/06-code-review.agent.md`

## Purpose
Review the implementation and write `docs/<story-id>/06-code-review.md`.

## Steps
1. Verify stage 05 is `approved`.
2. Read every changed source and test file against the approved architecture and plan.
3. Run targeted checks: tests, editor diagnostics, and a search for unsafe sinks (`innerHTML`, `eval`, inline handlers).
4. Produce: checks run, acceptance coverage, design conformance, findings, security review, residual risks.
5. Classify findings `CR-n` as High, Medium, or Low with file, recommendation, and whether blocking.

## Rules
- Review only; do not modify application code. Send blocking issues back to stage 05.
- Verify blockers with evidence; do not report speculative issues as blocking.
- Use the state key `code-review` when the pipeline records this stage.

## Approval block
Decision, approver, rationale, evidence, timestamp, next agent. Leave `pending` until the user replies.

## Next agent
`07-verification.agent.md` after `approved`.
