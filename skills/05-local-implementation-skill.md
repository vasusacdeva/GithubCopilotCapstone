# Skill: Local Implementation

Reusable capability for building the approved plan in the workspace and proving it works, with no GitHub dependency.

## When to use
`05-implementation`, after stage 04 is approved.

## Steps
1. Implement tasks in plan order; touch only planned files.
2. Run targeted checks (for example `npm test`) and capture the command, result, and counts.
3. If a check fails, fix the cause, rerun, and record the failure and fix as a deviation.
4. Compare the result to each acceptance criterion; separate "logic verified" from "UI verified".
5. List checks that could not be run (for example browser steps) with instructions for the user.

## Failure handling
If a task cannot be completed as planned, stop, document the blocker, and request a plan change instead of improvising scope.
