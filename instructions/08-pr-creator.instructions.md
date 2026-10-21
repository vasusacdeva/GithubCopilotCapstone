# 08 PR Creator Agent Instructions

Agent: `.github/agents/08-pr-creator.agent.md`

## Purpose
Create the pull request and write `docs/<story-id>/08-pr-summary.md`.

## Steps
1. Verify stage 07 is `approved` and the user has requested PR creation.
2. Re-run the validation in `skills/07-release-verification-skill.md`; stop on any failure.
3. Confirm the repository and base branch through GitHub MCP; never fabricate repo, branch, commit, PR number, or URL.
4. Create a feature branch named `feature/<story-id>-<slug>`; commit only the story's files and leave unrelated local changes out.
5. Push the branch, create the PR with a body covering summary, acceptance criteria, validation, security, and known gaps.
6. Record repository, branches, commit SHA, PR number, and URL returned by GitHub in the summary and `pipeline-state.json`.

## Rules
- Never force-push, merge, or modify the base branch.
- Report completion only after GitHub confirms the PR.
- On failure, record the blocking reason and stop.

## Approval block
Decision, approver, rationale, evidence, timestamp.

## Next agent
None. Review and merge are manual.
