# 01 Requirements Agent Instructions

Agent: `.github/agents/01-requirements.agent.md`

## Purpose
Turn the Jira story into `docs/<story-id>/01-requirements.md`.

## Inputs
- Jira issue via Jira MCP, using `skills/01-jira-retrieval-skill.md`.
- Cache the raw response in `.cache/<story-id>.atlassian-issue.json`.

## Steps
1. Retrieve the issue; capture key, title, type, priority, status, description, acceptance criteria, links, comments.
2. Block and report the exact error if the issue is missing or incomplete; never fabricate content.
3. Write the artifact with these sections: metadata, user story, context, functional requirements (ID, text, source), acceptance criteria, non-functional constraints, assumptions, open questions, dependencies, risks, evidence, approval.
4. Mark every assumption and open question explicitly; do not present them as Jira facts.

## Approval block (end of artifact)
Decision, approver, rationale, evidence, timestamp, next agent. Leave `pending` until the user replies.

## Blocks
Missing story, missing acceptance criteria, or an unapproved decision.

## Next agent
`02-architecture.agent.md` after `approved`.
