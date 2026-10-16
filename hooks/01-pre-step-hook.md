# Pre-Step Hook
 
**Event:** Before each SDLC agent stage.
 
**Purpose:** Confirm the stage can start safely.
 
**Checks:**
- Verify the current Jira story key and `docs/<story-id>/` context.
- Verify the preceding stage artifact exists and is explicitly `approved`.
- Verify the requested stage matches the configured `00-08` sequence.
- Verify the expected predecessor and output paths are derived from the same story ID; never accept caller-supplied paths outside `docs/<story-id>/`.
- Load only the minimum approved context required by the stage.
 
**Block when:** The predecessor is missing, unapproved, rejected, blocked, or out of order.
 
**Output:** Stage name, story ID, input artifact, and `ready` or `blocked` status.
 
**Recovery:** A blocked pre-step leaves `docs/<story-id>/pipeline-state.json` unchanged and records the missing or invalid prerequisite in the run result.
 
**Flow:**
Respective jira story exist exists?
Previous stage approved?
docs/<story-id>/pipeline-state.json exists?
If no → Stop.
 