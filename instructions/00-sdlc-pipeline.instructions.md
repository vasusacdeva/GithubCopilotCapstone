# 00 SDLC Pipeline Agent Instructions

Agent: `.github/agents/00-sdlc-pipeline.agent.md`

## Purpose
Orchestrate one Jira story through stages 01-08 in strict order.

## Before starting (pre-step hook)
- Confirm the Jira key is supplied by the user; never reuse or guess a key.
- Confirm the story exists via Jira MCP before creating `docs/<story-id>/`.
- Create `docs/<story-id>/pipeline-state.json` only after the story is accepted.

## Rules
- Run `01` to `08` in order. Never skip, reorder, or parallelize.
- Start a stage only when the predecessor artifact has an explicit `approved` decision from a named approver.
- Do not infer approval from tool success, document creation, silence, or passing tests.
- Treat `rejected` and `blocked` as terminal for the stage; record the reason and required action.
- Pass only the minimum approved context to the next agent (see `.cache/prompt-cache.md`).
- Do not create or edit hook definitions unless asked.

## State file
Per stage record: `status`, `approval`, `approver`, `artifact`, `updated`. Append exactly one `history` entry per approved stage; never duplicate. Use the stage keys `requirements`, `architecture`, `design-review`, `implementation-planner`, `implementation`, `code-review`, `verification`, `pr-creator` (`tests/validate-story.ps1` reads `code-review`).

## Output each turn
Current stage, status, artifact path, evidence, risks, next action, and the exact approval reply needed.

## Next agent
`01-requirements.agent.md`, then each stage in sequence after approval.
