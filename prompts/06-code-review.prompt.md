---
description: "Stage 06: review the implementation for quality, security, and acceptance coverage."
agent: "Code Review Agent"
---
Run stage 06 for Jira story `${input:storyId:Jira key, e.g. KAN-116}`.

- Follow `instructions/06-code-review.instructions.md` and `skills/06-code-review-skill.md`.
- Proceed only if `docs/<story-id>/05-implementation-summary.md` is approved.
- Run the tests and unsafe-pattern checks, then write `docs/<story-id>/06-code-review.md` with severity-rated findings and acceptance coverage.
- Do not modify application code. Leave the approval decision `pending` until I reply.
