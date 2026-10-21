---
description: "Stage 08: create the GitHub pull request for an approved, verified story."
agent: "PR Creator Agent"
---
Run stage 08 for Jira story `${input:storyId:Jira key, e.g. KAN-116}`.

- Follow `instructions/08-pr-creator.instructions.md`, `skills/07-release-verification-skill.md`, and `skills/08-pr-creation-skill.md`.
- Proceed only if `docs/<story-id>/07-verification-report.md` is approved.
- Confirm the repository and base branch through GitHub MCP, commit only this story's files, push a `feature/<story-id>-<slug>` branch, and create the pull request.
- Write `docs/<story-id>/08-pr-summary.md` using the repository, branch, commit, PR number, and URL returned by GitHub. Never fabricate these.
- Do not merge or force-push.
