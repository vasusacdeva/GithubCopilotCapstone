# Agentic SDLC Standards
 
## CREATE Framework
 
All Agentic SDLC work must follow the CREATE framework:
 
- **Context**: Establish the Jira story, repository state, constraints, dependencies, and prior approved artifacts.
- **Role**: State the current agent's single responsibility and boundaries.
- **Execution**: Perform only the actions required for the current lifecycle stage.
- **Approval**: Record an explicit approval, rejection, or blocked decision with approver, rationale, evidence, and timestamp.
- **Tools**: Use only the tools required for the current stage and respect MCP, repository, and security boundaries.
- **Expected Output**: Produce the defined stage artifact and a structured status containing evidence, risks, and next action.
 
## SDLC Sequence
 
The parent orchestration agent must execute agents in this exact order:
 
1. `00-sdlc-pipeline.agent.md` - orchestrate the complete lifecycle.
2. `01-requirements.agent.md` - intake and formalize Jira requirements.
3. `02-architecture.agent.md` - define solution architecture and integrations.
4. `03-design-review.agent.md` - identify architecture risks, gaps, and recommendations.
5. `04-implementation-planner.agent.md` - create implementation tasks, dependencies, and sequencing.
6. `05-implementation.agent.md` - execute the approved implementation plan.
7. `06-code-review.agent.md` - review quality, standards, security, and maintainability.
8. `07-verification.agent.md` - verify traceability, completeness, tests, and release readiness.
9. `08-pr-creator.agent.md` - create and document the GitHub pull request.
 
Never skip, reorder, parallelize, or invoke a later stage before the preceding stage is approved.
 
## Approval Gates
 
- Require an explicit `approved` decision before executing the next agent.
- Treat `rejected` and `blocked` as terminal states for the current stage; document the reason and required action.
- Do not infer approval from tool success, document creation, silence, or passing tests alone.
- Preserve every decision in the relevant stage artifact with the approver, rationale, evidence, and timestamp.
- Require release-readiness approval before PR creation and GitHub confirmation before reporting completion.
 
## MCP Usage
 
- Use **Jira MCP** for Jira story intake and Jira metadata. Treat the Jira issue key, title, description, status, priority, dependencies, and acceptance criteria as source data.
- Use **GitHub MCP** for repository and branch checks and for pull request creation. Do not fabricate repository, branch, commit, PR number, or PR URL details.
- Pass only the minimum approved context required by the next agent.
 
## Documentation
 
- Store all story-specific outputs under `docs/<story-id>/`.
- Use the Jira issue key as `<story-id>` and preserve it in every artifact.
- Keep stage artifacts traceable and concise. Include status, decision, evidence, risks, and next action.
- Create the story directory dynamically only after the pipeline accepts the story for processing.
 
## Hooks
 
Trigger configured lifecycle hooks at the applicable stage and tool-operation boundaries. Do not create or modify hook definitions unless explicitly requested. If a required hook is unavailable or fails, record the result and stop when the applicable approval or safety gate requires it.
 
## Efficiency
 
- Apply prompt caching to stable instructions, repository conventions, stage contracts, and tool schemas.
- Apply token optimization by searching narrowly, summarizing large MCP responses, avoiding repeated context, and requesting structured outputs.
- Preserve high-signal decisions, evidence, risks, and unresolved questions; do not omit information needed for approval or traceability.
 
## Agent Definitions
 
Keep agent definitions concise and focused on one lifecycle responsibility. Each definition must clearly state its purpose, context, role, action, tools, expected output, and next agent. Do not add unrelated responsibilities, duplicate another agent's work, or create unrequested sub-agents and workflow files.
 