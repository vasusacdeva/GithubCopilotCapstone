# Copilot Agentic SDLC Pipeline Capstone

An end-to-end, Jira-driven software delivery pipeline built entirely from GitHub Copilot custom agents, MCP
connections, hooks, and skills. The pipeline takes **any** Jira issue key at runtime and walks it through
requirements, architecture, design review, implementation planning, implementation, code review,
verification, and PR creation — producing a traceable set of docs along the way.

> **No story is hardcoded.** The Jira key (`jiraId`) is always supplied as a runtime argument when you invoke
> the orchestrator agent. Nothing in this repo references a fixed issue such as `KAN-114` — every agent, doc
> template, and script is parameterized.

## Folder structure

```
.cache/                         Ephemeral cache of MCP responses (gitignored content, see prompt-cache.md)
.github/
  agents/                       Custom Copilot agents, one per pipeline stage (00-08)
  copilot-instructions.md       Repo-wide instructions for Copilot
.vscode/
  mcp.json                      MCP server connections (Jira + GitHub)
docs/
  _template/                    Blank templates copied into docs/<jiraId>/ on each run
  <jiraId>/                     Created dynamically per run, never pre-created or committed empty
hooks/                          Lifecycle hook specs used by every agent (pre-step, approval, post-step)
skills/                         Reusable, cross-stage capabilities (Jira retrieval, PR validation)
tests/
  validate-story.ps1            Parameterized validation script: -JiraId <KEY>
.token-optimization.md          Notes on keeping the pipeline cheap on tokens
```

## Pipeline stages

| # | Agent | Reads | Writes |
|---|-------|-------|--------|
| 00 | `00-sdlc-pipeline` (orchestrator) | — | `docs/<jiraId>/pipeline-state.json` |
| 01 | `01-requirements` | Jira issue (via `jira` MCP) | `docs/<jiraId>/01-requirements.md` |
| 02 | `02-architecture` | 01 | `docs/<jiraId>/02-architecture.md` |
| 03 | `03-design-review` | 01, 02 | `docs/<jiraId>/03-design-review.md` (approval gate) |
| 04 | `04-implementation-planner` | 01-03 | `docs/<jiraId>/04-impl-plan.md` |
| 05 | `05-implementation` | 04 | feature built locally from the user story, run locally + `docs/<jiraId>/05-implementation-summary.md` |
| 06 | `06-code-review` | 05 diff | `docs/<jiraId>/06-code-review.md` (approval gate) |
| 07 | `07-verification` | 05, `tests/validate-story.ps1` | `docs/<jiraId>/07-verification-report.md` |
| 08 | `08-pr-creator` | all prior docs (via `github` MCP) | `docs/<jiraId>/08-pr-summary.md` + PR |

## Running the pipeline

1. Open the Chat view, pick the **SDLC Pipeline Orchestrator** agent.
2. Give it the Jira key as the argument, e.g. `@00-sdlc-pipeline PROJ-123`.
3. The orchestrator creates `docs/PROJ-123/` from `docs/_template/`, then delegates to each stage agent in
   order, pausing at the approval gates defined in [hooks/02-approval-hook.md](hooks/02-approval-hook.md).

### Stage 05 runs locally (no GitHub repo required)

Stage 05 never asks for a GitHub repository, owner, or branch. It:

1. Creates the feature from the Jira user story and the approved plan (`04-impl-plan.md`) directly in the
   current workspace.
2. Runs the feature locally (for example, the app start command or the targeted tests) and records the
   command, output, and result in `docs/<jiraId>/05-implementation-summary.md`.
3. Stops at the approval gate without any GitHub interaction.

GitHub is only needed at stage 08 (`08-pr-creator`), after verification is approved. Stages 01-07 work
without a repository or the `github` MCP server.

## Connecting MCP

[.vscode/mcp.json](.vscode/mcp.json) declares two servers:

- `jira` — the `mcp-atlassian` server (run via `uvx`), used for Jira retrieval. Needs the
  `JIRA_API_ACCESS_TOKEN` environment variable to be set.
- `github` — the `@modelcontextprotocol/server-github` server, used for PR creation. Needs the
  `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable to be set.

Open `.vscode/mcp.json` and click **Start** on each server. Secrets are read from environment variables and
are never stored in this repo.
