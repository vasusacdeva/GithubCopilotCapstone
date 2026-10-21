# 04 Implementation Planner Agent Instructions

Agent: `.github/agents/04-implementation-planner.agent.md`

## Purpose
Convert the approved design review into `docs/<story-id>/04-impl-plan.md`.

## Steps
1. Verify stage 03 is `approved`.
2. Define the file layout and ordered tasks (T1..Tn) with dependencies, requirement coverage, and the design findings each task resolves.
3. Include a dependency diagram, a validation strategy (unit, acceptance, security, pipeline), and the artifacts later stages must produce (use exact filenames, for example `05-implementation-summary.md`).
4. State the scope as local only; stages 01-07 must not require GitHub.
5. List risks, mitigations, and out-of-scope items.

## Rules
- Plan only; do not create application code.
- Every task traces to a requirement or design finding; no unplanned work.
- Keep tasks small and independently verifiable.

## Approval block
Decision, approver, rationale, evidence, timestamp, next agent. Leave `pending` until the user replies.

## Next agent
`05-implementation.agent.md` after `approved`.
