# Skill: Implementation Planning

Reusable capability for turning design findings into ordered, verifiable tasks.

## When to use
`04-implementation-planner`, after stage 03 is approved.

## Steps
1. Define the file layout.
2. Write tasks T1..Tn with dependencies, requirement coverage, and the design findings each resolves.
3. Add a dependency diagram (Mermaid) and verify there are no cycles.
4. Define validation per level: unit, acceptance, security, pipeline (`tests/validate-story.ps1`).
5. List exact artifact filenames later stages must write.
6. Record risks, mitigations, and out-of-scope items.

## Failure handling
If a design finding has no task, or a task has no requirement or finding, fix the plan before requesting approval.
