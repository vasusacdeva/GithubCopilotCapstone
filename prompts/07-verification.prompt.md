---
description: "Stage 07: verify completeness, traceability, and release readiness."
agent: "Verification Agent"
---
Run stage 07 for Jira story `${input:storyId:Jira key, e.g. KAN-116}`.

- Follow `instructions/07-verification.instructions.md` and `skills/07-release-verification-skill.md`.
- Proceed only if `docs/<story-id>/06-code-review.md` is approved.
- Run `./tests/validate-story.ps1 -JiraId <story-id>` and the project tests.
- Write `docs/<story-id>/07-verification-report.md` with evidence, traceability, open items, risks, and a readiness statement.
- Leave the release-readiness decision `pending` until I reply.
