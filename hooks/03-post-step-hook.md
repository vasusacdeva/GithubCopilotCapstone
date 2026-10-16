# Post-Step Hook
 
**Event:** After each approved SDLC agent stage.
 
**Purpose:** Close the stage and prepare an efficient handoff.
 
**Checks:**
- Persist the stage status, artifact path, decision, evidence, and risks.
- Append exactly one history entry after approval; repeated execution must not duplicate an identical entry.
- Identify the next ordered agent and required input artifact.
 
**Block when:** The stage artifact or approval evidence cannot be persisted.
 
**Output:** Completed stage summary and next-agent handoff context.
 
**Recovery:** If state persistence fails, leave the previous state and approval gate intact for retry.
 
**Flow:**
Update docs/<story-id>/pipeline-state.json
Record current stage
Enable next agent
 