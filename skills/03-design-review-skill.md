# Skill: Design Review

Reusable capability for assessing whether an architecture is ready to implement.

## When to use
`03-design-review`, after stage 02 is approved.

## Steps
1. Build a coverage table: each requirement against the component that satisfies it.
2. Check runtime constraints (for example ES modules over `file://`, `crypto.randomUUID` availability).
3. Cross-check pipeline tooling: filenames and state keys expected by `tests/validate-story.ps1` and the README.
4. Review security, accessibility, error handling, and testability.
5. Record each finding as `DR-n` with severity, evidence, and a concrete recommendation.
6. Summarize the recommendations stage 04 must carry forward.

## Failure handling
An unresolved High finding blocks approval; report it with the required change.
