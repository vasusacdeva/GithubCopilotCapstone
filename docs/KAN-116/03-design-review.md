# KAN-116 - Design Review: Create Basic To-Do List

- **Story ID:** KAN-116
- **Input artifact:** docs/KAN-116/02-architecture.md (approved by vasu_sachdeva, 2026-10-16)
- **Output artifact:** docs/KAN-116/03-design-review.md
- **Overall assessment:** Ready for implementation planning, provided the recommendations below are incorporated.

## Requirements Coverage

| Requirement | Covered by | Result |
|-------------|-----------|--------|
| FR-1 input + "Add Task" button | `index.html` form | Covered |
| FR-2 / FR-3 add as active, appears immediately | `addTask`, render (AD-4) | Covered |
| FR-4 input clears | `app.js` | Covered |
| FR-5 delete permanently | `removeTask`, AD-6 | Covered |
| FR-6 mark complete | `toggleTask`, AD-5 | Covered |
| FR-7 view list | render | Covered |

All acceptance criteria (AC-1, AC-2, AC-3) trace to a component. No uncovered requirement.

## Findings

| ID | Severity | Finding | Recommendation |
|----|----------|---------|----------------|
| DR-1 | High | Separate `tasks.js`, `storage.js` and `app.js` suggest ES modules, which browsers block over `file://` (CORS). The app would not open by double-clicking `index.html`. | Use classic `<script>` tags and a dual export (`globalThis` for the browser, `module.exports` for Node tests), or document a local static server. Prefer classic scripts. |
| DR-2 | Medium | `addTask` behavior on invalid input is ambiguous ("throws or returns unchanged"). | Fix one contract: return the list unchanged and let `app.js` keep focus on the input. No exceptions for normal validation. |
| DR-3 | Medium | Task `id` generation is unspecified; `crypto.randomUUID` needs a secure context and may be missing on `file://`. | Generate ids from `Date.now()` plus a random suffix or counter, with no dependency on `crypto.randomUUID`. |
| DR-4 | Medium | The README names stage 05's artifact `05-implementation.md`, while `tests/validate-story.ps1` requires `05-implementation-summary.md`. Stage 07 would fail on the filename. | Write `05-implementation-summary.md` (the name the script enforces). Note the README mismatch as a follow-up, not in scope. |
| DR-5 | Medium | `validate-story.ps1` requires `03-design-review.md`, `04-impl-plan.md`, `05-implementation-summary.md`, `06-code-review.md` and a `code-review` stage key in `pipeline-state.json` with `approval: approved`. The state file currently uses stage keys like `requirements` and `architecture`. | Use the key `code-review` for stage 06 so the script's check works. |
| DR-6 | Low | Length cap (200) and "empty rejected" are assumptions. | Enforce via `maxlength` on the input and again in `addTask`. Keep the constant in one place. |
| DR-7 | Low | Icon-only delete button needs an accessible name and a visible trash icon without external assets. | Use an inline SVG or the trash emoji with `aria-label="Delete task: <text>"`. No external CDN. |
| DR-8 | Low | Corrupt `localStorage` JSON or non-array data must not break startup. | `loadTasks` validates shape (array of objects with string `text`) and returns `[]` on failure. |
| DR-9 | Low | No automated test plan is stated. | Plan `tests/tasks.test.js` using `node --test` for add, toggle, remove, validation and storage fallback. |

## Security Review

- AD-8 (`textContent` only) is sufficient against stored XSS. Add a test with `<img onerror>` text that asserts no element is created.
- No inline handlers; this permits a strict CSP `<meta>` (`default-src 'none'; script-src 'self'; style-src 'self'`). Recommended.
- No network calls or secrets. No dependency to audit.

## Risks

| Risk | Impact | Status |
|------|--------|--------|
| DR-1 not applied | App fails to load from `file://` | Mitigated by recommendation |
| DR-4 / DR-5 not applied | Stage 07 validation fails | Mitigated by recommendation |
| Assumptions AD-1 to AD-7 differ from stakeholder intent | Rework | Open; the architecture is already approved with these assumptions |

## Recommendations Carried Into Stage 04

1. Classic scripts with dual export; open via `file://` (DR-1).
2. `addTask` returns the list unchanged on invalid input (DR-2).
3. Id generation without `crypto.randomUUID` (DR-3).
4. Stage 05 artifact is `05-implementation-summary.md` (DR-4).
5. Use the stage key `code-review` in the state file (DR-5).
6. Add `tests/tasks.test.js` run with `node --test` (DR-9).
7. Add a CSP meta tag and an XSS test (security review).

## Approval

- **Decision:** approved
- **Approver:** vasu_sachdeva (user)
- **Rationale:** User explicitly replied "approved for stage 3".
- **Evidence:** this document; predecessor approval in 02-architecture.md
- **Timestamp:** 2026-10-16
- **Next agent on approval:** `04-implementation-planner.agent.md`
