# Prompt Caching Instructions

Rules for keeping stable context cacheable and avoiding repeated MCP calls across SDLC stages.

## 1. Order prompts for cache hits

Place content in this order, most stable first. Any change invalidates everything after it.

1. Repository standards: `.github/copilot-instructions.md`
2. Agent definition for the current stage: `.github/agents/0N-*.agent.md`
3. Tool schemas and skills (`skills/*.md`, hooks in `hooks/*.md`)
4. Approved predecessor artifact(s) from `docs/<story-id>/`
5. Story-specific, changing input (Jira data, user request, latest decision)

Do not insert timestamps, run IDs, or story data into items 1 to 3.

## 2. Cache raw MCP responses

| Source | Cache file | Written by | Reused by |
|--------|-----------|------------|-----------|
| Jira issue | `.cache/<story-id>.atlassian-issue.json` | Stage 01 (`skills/01-jira-retrieval-skill.md`) | Stages 06 and 07 when re-checking acceptance criteria |
| GitHub repo and branch checks | `.cache/<story-id>.github-context.json` | Stage 08 | Retries of stage 08 within the same run |

- Store the raw response plus a `fetchedAt` timestamp.
- Reuse the cache within the same pipeline run; do not call the MCP server again for unchanged data.
- Never cache secrets, tokens, or credentials.

## 3. Invalidate the cache when

- The Jira `updated` value differs from the cached one, or the story key changes.
- A stage is rejected or blocked and the requirements are changed.
- The user asks for a refresh.
- The repository, base branch, or head branch changes (GitHub cache).

When in doubt, make one lightweight check (for example, Jira `updated` only) before refetching in full.

## 4. Hand off artifacts, not transcripts

- Pass only the approved predecessor artifact and the minimum context the stage needs.
- Summarize large MCP responses into the stage artifact; keep the raw payload in `.cache/`.
- Preserve decisions, evidence, risks, and open questions; drop duplicated narrative.

## 5. Cache hygiene

- `.cache/` is gitignored; treat its contents as disposable and rebuildable.
- This instruction file lives in `.cache/` as referenced by `.token-optimization.md`. Because the folder is ignored, it is not committed unless `.gitignore` is changed to allow `.cache/prompt-cache.md`.
- Safe to delete `.cache/<story-id>.*` at any time; the next run refetches.
