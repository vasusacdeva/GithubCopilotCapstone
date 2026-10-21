# 02 Architecture Agent Instructions

Agent: `.github/agents/02-architecture.agent.md`

## Purpose
Define the architecture that satisfies the approved requirements and write `docs/<story-id>/02-architecture.md`.

## Inputs
Approved `01-requirements.md` and the repository state (inspect existing code and tooling first).

## Steps
1. Verify stage 01 is `approved`.
2. Resolve each open question with a numbered decision (AD-n) and a rationale; mark choices that are assumptions.
3. Describe components, responsibilities, data model, and interfaces; include a Mermaid diagram.
4. Map every requirement to a component or decision (traceability table).
5. Address security (OWASP Top 10), accessibility, and testability.
6. List integrations (state "none" if none) and risks with mitigations.

## Rules
- Prefer the simplest design that meets the requirements; do not add unrequested features.
- Do not write application code at this stage.

## Approval block
Decision, approver, rationale, evidence, timestamp, next agent. Leave `pending` until the user replies.

## Next agent
`03-design-review.agent.md` after `approved`.
