# Skill: Code Review

Reusable capability for reviewing a change against approved artifacts.

## When to use
`06-code-review`, after stage 05 is approved.

## Steps
1. Read each changed file and compare it with the architecture decisions and plan tasks.
2. Run targeted checks: tests, editor diagnostics, and a search for unsafe sinks (`innerHTML`, `eval(`, inline handlers).
3. Verify acceptance coverage: code path and test for each criterion.
4. Review security, accessibility, error handling, and maintainability.
5. Record findings as `CR-n` with severity, file, recommendation, and blocking flag; verify blockers with evidence.

## Failure handling
Blocking findings return the work to stage 05; do not approve or edit application code during review.
