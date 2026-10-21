---
description: "Stage 01: retrieve the Jira story and write the requirements artifact."
agent: "Requirements Agent"
---
Run stage 01 for Jira story `${input:storyId:Jira key, e.g. KAN-116}`.

- Follow `instructions/01-requirements.instructions.md` and `skills/01-jira-retrieval-skill.md`.
- Retrieve the story through Jira MCP; stop and report the exact error if it cannot be found.
- Write `docs/<story-id>/01-requirements.md` with requirements, acceptance criteria, assumptions, open questions, and risks.
- Leave the approval decision `pending` until I reply.
