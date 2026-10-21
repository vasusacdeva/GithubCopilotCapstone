# Skill: Pull Request Creation

Reusable capability for publishing the story's changes as a GitHub pull request via the `github` MCP server.

## When to use
`08-pr-creator`, after stage 07 is approved and PR creation is requested.

## Steps
1. Re-run the validation in `skills/07-release-verification-skill.md`; stop on failure.
2. Confirm repository, owner, and base branch through GitHub MCP; check for an existing PR from the same branch.
3. Create `feature/<story-id>-<slug>` locally, stage only the story's files, and leave unrelated local edits out.
4. Commit, push the branch, then create the PR with a body covering summary, acceptance criteria, validation, security, and known gaps.
5. Record the repository, branches, commit SHA, PR number, and URL exactly as returned by GitHub.

## Failure handling
Never force-push, merge, or fabricate details. On any error, report it, record the blocking reason, and stop.
