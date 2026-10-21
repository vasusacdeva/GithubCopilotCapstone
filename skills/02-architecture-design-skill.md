# Skill: Architecture Design

Reusable capability for turning approved requirements into a traceable architecture.

## When to use
`02-architecture`, after stage 01 is approved.

## Steps
1. Inspect the repository (existing code, tooling, runtime such as Node) before choosing a stack.
2. Turn each open question into a numbered decision (AD-n) with rationale; label assumptions.
3. Define components, responsibilities, data model, and interfaces; draw a Mermaid component diagram.
4. Build a traceability table mapping every requirement ID to a component or decision.
5. Add security (OWASP Top 10: output encoding, input validation, no secrets), accessibility, and testability notes.
6. List integrations (or "none") and risks with mitigations.

## Failure handling
If a requirement cannot be mapped, record it as a gap and block rather than inventing scope.
