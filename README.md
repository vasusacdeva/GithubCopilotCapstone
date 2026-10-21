# Copilot Agentic SDLC Pipeline Capstone

An end-to-end, Jira-driven software delivery pipeline built from GitHub Copilot custom agents, instructions,
skills, prompts, hooks, and MCP connections. The pipeline takes **any** Jira issue key at runtime and walks it
through requirements, architecture, design review, implementation planning, implementation, code review,
verification, and PR creation, producing a traceable set of docs along the way.

> **No story is hardcoded in the pipeline.** The Jira key (`<story-id>`) is supplied at runtime. Every agent,
> instruction, skill, prompt, and script is parameterized. `docs/KAN-116/`, `app/`, and `tests/tasks.test.js`
> are the output of running the pipeline for story KAN-116.

## Folder structure

```
.cache/
  prompt-cache.md               Prompt caching rules (the folder is gitignored; see the note below)
.github/
  agents/                       Custom Copilot agents, one per pipeline stage (00-08)
  copilot-instructions.md       Repo-wide standards (CREATE framework, approval gates, MCP usage)
.vscode/
  mcp.json                      MCP server connections (Jira + GitHub)
app/                            To-Do app built for KAN-116 (index.html, app.js, tasks.js, storage.js, styles.css)
docs/
  <story-id>/                   Created per run: stage artifacts 01-08 and pipeline-state.json
hooks/                          Lifecycle hooks: pre-step, approval, post-step
instructions/                   Detailed rules per agent (00-08), referenced by each agent
prompts/                        Default prompt per agent (00-08)
skills/                         Reusable capabilities used by agents (see table below)
tests/
  tasks.test.js                 Unit tests for the KAN-116 app (node --test)
  validate-story.ps1            Pipeline validation script: -JiraId <KEY>
package.json                    `npm test` runs the unit tests
.token-optimization.md          Notes on keeping the pipeline cheap on tokens
```

`.cache/` is listed in `.gitignore`, so `.cache/prompt-cache.md` is not committed unless the ignore rule is
changed.

## How the pieces fit together

Each agent in `.github/agents/` is a short definition (context, role, action, tools, expected output). It
points to:

- an **instruction** file in `instructions/` for the detailed rules, steps, and approval block,
- a **default prompt** in `prompts/` to start the stage,
- a **skill** in `skills/` for the reusable steps.

| # | Agent | Instruction | Default prompt | Skill |
|---|-------|-------------|----------------|-------|
| 00 | `00-sdlc-pipeline` | `instructions/00-sdlc-pipeline.instructions.md` | `prompts/00-sdlc-pipeline.prompt.md` | `skills/00-pipeline-orchestration-skill.md` |
| 01 | `01-requirements` | `instructions/01-requirements.instructions.md` | `prompts/01-requirements.prompt.md` | `skills/01-jira-retrieval-skill.md` |
| 02 | `02-architecture` | `instructions/02-architecture.instructions.md` | `prompts/02-architecture.prompt.md` | `skills/02-architecture-design-skill.md` |
| 03 | `03-design-review` | `instructions/03-design-review.instructions.md` | `prompts/03-design-review.prompt.md` | `skills/03-design-review-skill.md` |
| 04 | `04-implementation-planner` | `instructions/04-implementation-planner.instructions.md` | `prompts/04-implementation-planner.prompt.md` | `skills/04-implementation-planning-skill.md` |
| 05 | `05-implementation` | `instructions/05-implementation.instructions.md` | `prompts/05-implementation.prompt.md` | `skills/05-local-implementation-skill.md` |
| 06 | `06-code-review` | `instructions/06-code-review.instructions.md` | `prompts/06-code-review.prompt.md` | `skills/06-code-review-skill.md` |
| 07 | `07-verification` | `instructions/07-verification.instructions.md` | `prompts/07-verification.prompt.md` | `skills/07-release-verification-skill.md` (includes PR validation) |
| 08 | `08-pr-creator` | `instructions/08-pr-creator.instructions.md` | `prompts/08-pr-creator.prompt.md` | `skills/08-pr-creation-skill.md` (re-runs the validation in the 07 skill) |

## Pipeline stages and artifacts

| # | Agent | Reads | Writes |
|---|-------|-------|--------|
| 00 | `00-sdlc-pipeline` (orchestrator) | | `docs/<story-id>/pipeline-state.json` |
| 01 | `01-requirements` | Jira issue (via Jira MCP) | `docs/<story-id>/01-requirements.md` |
| 02 | `02-architecture` | 01 | `docs/<story-id>/02-architecture.md` |
| 03 | `03-design-review` | 02 (and 01 for coverage) | `docs/<story-id>/03-design-review.md` |
| 04 | `04-implementation-planner` | 03 | `docs/<story-id>/04-impl-plan.md` |
| 05 | `05-implementation` | 04 | app code and tests in the workspace, plus `docs/<story-id>/05-implementation-summary.md` |
| 06 | `06-code-review` | 05 | `docs/<story-id>/06-code-review.md` |
| 07 | `07-verification` | 06, `tests/validate-story.ps1` | `docs/<story-id>/07-verification-report.md` |
| 08 | `08-pr-creator` | 07 (via GitHub MCP) | `docs/<story-id>/08-pr-summary.md` and the pull request |

Every stage artifact ends with an approval block: decision, approver, rationale, evidence, timestamp, and next
agent.

## Running the pipeline

1. Start with the `SDLC Pipeline Agent`, or run a stage's default prompt from `prompts/`, and give it the Jira
   key (for example `KAN-116`).
2. The agent confirms the story exists, creates `docs/<story-id>/pipeline-state.json`, and runs stage 01.
3. After each stage it stops. Reply `approved`, `rejected`, or `blocked` (with the approver and reason) to
   continue. Approval is never inferred, as defined in [hooks/02-approval-hook.md](hooks/02-approval-hook.md).
4. Stages run strictly in order 01 to 08; a later stage never starts before the preceding one is approved.

VS Code lists prompt files as slash commands only from `.github/prompts/`. The files in `prompts/` can be
copied or moved there if you want that.

### Stage 05 runs locally (no GitHub repo required)

Stage 05 never asks for a GitHub repository, owner, or branch. It:

1. Builds the feature from the approved plan (`04-impl-plan.md`) directly in the workspace.
2. Runs the checks locally (for example `npm test`) and records the command, output, and result in
   `docs/<story-id>/05-implementation-summary.md`, including any check it could not run.
3. Stops at the approval gate without any GitHub interaction.

GitHub is only needed at stage 08 (`08-pr-creator`), after verification is approved. Stages 01-07 work without
a repository or the GitHub MCP server.

## Validation and tests

```powershell
npm test                                          # unit tests in tests/tasks.test.js
./tests/validate-story.ps1 -JiraId KAN-116        # checks docs 01-06 exist and code-review is approved
```

`validate-story.ps1` expects these filenames and the state key `code-review` in `pipeline-state.json`:
`01-requirements.md`, `02-architecture.md`, `03-design-review.md`, `04-impl-plan.md`,
`05-implementation-summary.md`, `06-code-review.md`.

## KAN-116 To-Do app

Open `app/index.html` in a browser. It is a static page with no build step: add a task with the button or
Enter, tick the checkbox to mark it complete, and use the trash icon to delete it. Tasks are kept in the
browser's `localStorage`.

## Connecting MCP

[.vscode/mcp.json](.vscode/mcp.json) declares two servers:

- `jira`: the `mcp-atlassian` server (run via `uvx`), used for Jira retrieval. Needs the
  `JIRA_API_ACCESS_TOKEN` environment variable to be set.
- `github`: the `@modelcontextprotocol/server-github` server, used for PR creation. Needs the
  `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable to be set.

Open `.vscode/mcp.json` and click **Start** on each server. Secrets are read from environment variables and
are never stored in this repo.
