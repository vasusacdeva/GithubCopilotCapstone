# Skill: Jira Retrieval

Reusable capability for fetching and normalizing Jira issue content via the `jira` MCP server (`mcp-atlassian`), given any `jiraId`.

## When to use

Any stage that needs authoritative Jira context — primarily `01-requirements`, but also
`06-code-review`/`07-verification` if they need to re-check acceptance criteria.

## Steps

1. Call the Jira "get issue" tool with the given `jiraId`. Never substitute a different or previously-used
   key.
2. Extract: summary, description, acceptance criteria (parsed from description or a custom field), labels,
   linked issues, and the latest comments.
3. Normalize into markdown using the section layout in `instructions/01-requirements.instructions.md`.
4. Cache the raw JSON response at `.cache/<jiraId>.atlassian-issue.json` for reuse within the same run.

## Failure handling

If the issue cannot be found or the MCP call fails, report the exact error back to the user and stop —
do not fabricate issue content.
