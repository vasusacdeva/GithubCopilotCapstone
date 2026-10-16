# Skill: PR Validation

Reusable capability for proving an implementation is ready before `pr-creator` opens a pull request.

## When to use

`verification-engineer` (to produce `docs/<jiraId>/07-verification-report.md`) and `pr-creator` (as a final
guard before calling the `github` MCP server).

## Steps

1. Run `tests/validate-story.ps1 -JiraId <jiraId>` to confirm:
   - `docs/<jiraId>/` contains all required docs through `06-code-review.md`.
   - `pipeline-state.json` shows `code-review.approval == "approved"`.
2. Run the project's own test/build suite if one exists in the touched area.
3. Only report an overall **Pass** if both the structural checks and the project tests succeed; otherwise
   **Fail** with the specific failing check(s) listed.

## Failure handling

On any failure, `pr-creator` must not open a PR. Route back to `verification-engineer`'s report for the
user to action.
