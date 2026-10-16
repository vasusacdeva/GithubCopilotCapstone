# Approval Hook
 
**Event:** After each SDLC agent stage.
 
**Purpose:** Enforce human or authorized pipeline approval before progression.
 
**Checks:**
- Require an explicit `approved`, `rejected`, or `blocked` decision.
- Record approver, rationale, evidence, and timestamp in the stage artifact.
- Require the story ID, expected artifact path, and predecessor approval reference in the artifact before accepting the decision.
- Permit the next agent only when the decision is `approved`.
 
**Block when:** Approval is absent, inferred from tool success, or the stage is `rejected` or `blocked`.
 
**Output:** Decision status and the exact next action.
 
**Recovery:** Rejected or blocked stages retain the last approved state and require a new approved artifact; they do not append a successful history entry.
 
**Flow:**
Requirements generated.
Approve?
Reject?
If Rejectd -> Don't move to Architecture Agent.