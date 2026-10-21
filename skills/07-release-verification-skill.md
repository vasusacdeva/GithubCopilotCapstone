# Skill: Release Verification

Reusable capability for proving traceability and release readiness before a PR. Also serves as the PR validation guard that `08-pr-creator` re-runs.

## When to use
`07-verification` (to produce `docs/<story-id>/07-verification-report.md`), after stage 06 is approved, and `08-pr-creator` (as a final guard before calling the `github` MCP server).

## Steps
1. Run `tests/validate-story.ps1 -JiraId <story-id>` to confirm `docs/<story-id>/` has all required docs through `06-code-review.md` and `pipeline-state.json` shows `code-review.approval == "approved"`.
2. Run the project's own test suite (for example `npm test`).
3. Report Pass only if both the structural check and the tests succeed; otherwise report Fail with each failing check.
4. Build the approval chain table for stages 01-06 from the artifacts and `pipeline-state.json`.
5. Build a traceability table: requirement, design, implementation, test, status.
6. List open items (review findings, unexecuted manual checks) with owners.
7. State readiness: Ready, Conditionally ready, or Not ready, with the reason.

## Failure handling
Any failing or unexecuted required check prevents "Ready"; list it explicitly and do not proceed to stage 08. On any failure, `08-pr-creator` must not open a PR; route back to the stage 07 report for the user to action.
