# Skill: Pipeline Orchestration

Reusable capability for running one Jira story through the ordered SDLC stages with approval gates.

## When to use
`00-sdlc-pipeline` at intake and at every stage handoff.

## Steps
1. Confirm the Jira key was supplied by the user and the story exists (see `skills/01-jira-retrieval-skill.md`).
2. Create `docs/<story-id>/pipeline-state.json` after the story is accepted; never pre-create empty story folders.
3. Before each stage, apply `hooks/01-pre-step-hook.md`: predecessor artifact exists and is `approved`, stage is next in sequence.
4. After each stage, apply `hooks/02-approval-hook.md`: require an explicit decision from a named approver; never infer approval.
5. After approval, apply `hooks/03-post-step-hook.md`: set the stage status, append one history entry, name the next agent.
6. Report: current stage, artifact, evidence, risks, and the exact reply needed to continue.

## State keys
`requirements`, `architecture`, `design-review`, `implementation-planner`, `implementation`, `code-review`, `verification`, `pr-creator`.

## Failure handling
On `rejected`, `blocked`, a missing predecessor, or a failed hook, stop, record the reason, and leave the last approved state unchanged.
