---
description: "Run the full Agentic SDLC pipeline for one Jira story."
agent: "SDLC Pipeline Agent"
---
Run the SDLC pipeline for Jira story `${input:storyId:Jira key, e.g. KAN-116}`.

- Follow `instructions/00-sdlc-pipeline.instructions.md` and `skills/00-pipeline-orchestration-skill.md`.
- Create `docs/<story-id>/pipeline-state.json` after confirming the story exists.
- Execute stages 01 to 08 in order, stopping after each stage for my explicit `approved`, `rejected`, or `blocked` decision.
- Report the current stage, artifact, evidence, risks, and the exact reply needed to continue.
