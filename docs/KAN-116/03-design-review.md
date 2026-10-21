# KAN-116 Design Review

## Status
| Field | Value |
|-------|-------|
| Story | KAN-116 - Create Basic To-Do List |
| Stage | 03 Design Review |
| Pre-step hook | ready (story dir and `pipeline-state.json` exist; stage 02 `approved` 2026-10-21; stage matches sequence) |
| Input | `docs/KAN-116/02-architecture.md` (approved), `docs/KAN-116/01-requirements.md` (approved, coverage) |
| Status | approved |
| Unresolved High findings | 0 |

## Repository Check
- Present: `.github/`, `.vscode/`, `hooks/`, `instructions/`, `prompts/`, `skills/`, `docs/`, `README.md`.
- Absent: `app/`, `tests/` (including `tests/validate-story.ps1`, `tests/tasks.test.js`), `package.json`. `README.md` describes all of these as existing (see DR-1, DR-2).

## Requirements Coverage
| Requirement | Satisfied by | Result |
|-------------|--------------|--------|
| FR-1 | `index.html` form, Controller submit, AD-5 | Covered |
| FR-2 | `TaskStore.add`, TaskView, AD-2 | Covered |
| FR-3 | Controller clears input after successful add | Covered |
| FR-4 | Delete button in TaskView, Controller delegation, `TaskStore.remove` | Covered |
| FR-5 | `TaskStore.remove`, re-render, save (AD-3, AD-4) | Covered |
| FR-6 | TaskView renders `TaskStore.all()`, empty-state message | Covered |
| FR-7 | `TaskStore.toggle`, AD-6 | Covered; no Jira acceptance criterion (DR-5) |
| AC-1 | FR-1..FR-3 | Covered |
| AC-2 | FR-4, FR-5 | Covered |

No uncovered requirements.

## Findings
| ID | Severity | Finding | Evidence | Recommendation |
|----|----------|---------|----------|----------------|
| DR-1 | Medium | Architecture and README disagree on structure. AD-1 specifies root-level `index.html`, `styles.css`, one `app.js`, ES modules not required. README specifies an `app/` folder with `index.html`, `app.js`, `tasks.js`, `storage.js`, `styles.css`, and a unit test `tests/tasks.test.js` run by `node --test`. | `02-architecture.md` AD-1, Components; `README.md` layout and "KAN-116 To-Do app" | Stage 04 must pick one layout and state it. Recommended: `app/` folder per README, with `TaskStore` and storage logic in separate files. If split into modules, prefer a design that works from `file://` (see DR-3); update README only if the plan changes the layout. Architecture itself is not edited. |
| DR-2 | Medium | Test tooling and pipeline script are absent. Stage 07 and `README.md` depend on `tests/validate-story.ps1`, `package.json` (`npm test`) and `tests/tasks.test.js`. Architecture defers the test framework to the planner. | Repository Check; `README.md` Validation and tests; `skills/07-release-verification-skill.md` | Stage 04 must plan creation of `package.json` with a no-dependency `npm test` (`node --test`) and `tests/tasks.test.js`, and decide whether `validate-story.ps1` is in scope or is a documented gap. Do not report a validation run as passed if the script does not exist. |
| DR-3 | Medium | Testability vs `file://` conflict. `TaskStore` is specified inside `app.js` as a DOM-free unit. A classic script cannot be imported by `node --test`; ES modules (`<script type="module">`) are blocked over `file://` by browser CORS rules. README says the page is opened directly in a browser. | AD-1 ("ES modules not required"); Testability; `README.md` ("Open `app/index.html` in a browser") | Choose one: (a) store logic in a UMD/CommonJS-compatible file loaded by a classic `<script>` and `require`d by tests, or (b) ES modules and require a local static server (update README). Option (a) preserves the no-build, open-the-file requirement. |
| DR-4 | Medium | CSP `default-src 'self'` behaves inconsistently on `file://` pages (opaque origin in some browsers) and may block local `app.js`/`styles.css`. A meta CSP also cannot cover all directives (for example `frame-ancestors`). | Security section of `02-architecture.md` | Specify explicit directives (for example `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:`) and require a manual check that the page loads from `file://` in an evergreen browser. Disallow inline scripts/styles so the policy needs no `unsafe-inline`. |
| DR-5 | Medium | FR-7 (mark complete) has no Jira acceptance criterion; AD-6 defines behavior from assumption A4. Risk of untestable or disputed expectations. | `01-requirements.md` Risks; `02-architecture.md` Risks | Stage 04 must define testable criteria for FR-7 (toggle on, toggle off, persists across reload, visible non-color cue) and tag them as derived from A4, not Jira. |
| DR-6 | Medium | Validation feedback is unspecified. AD-5 rejects empty input and caps at 200 characters, but does not say how the user is told, and pasted over-length text could be silently truncated or rejected. | AD-5; Accessibility section | Set `maxlength="200"` on the input, show a visible inline message for rejected input, and announce it via the `aria-live` region. `TaskStore.add` still enforces the limit independently. |
| DR-7 | Low | Focus management after delete is unspecified; deleting the focused button removes it from the DOM and drops keyboard focus. | Accessibility section | After delete, move focus to the next item's control, the previous one, or the input when the list becomes empty. |
| DR-8 | Low | `localStorage` validation is described only as "array of well-formed tasks". Duplicate IDs, over-length text, non-boolean `completed`, and non-string `id` are not defined. Fallback ID (timestamp + counter) uniqueness across reloads is not stated. | AD-3, AD-8; Security A08 | Define the validator: each item has string `id`, non-empty string `text` of at most 200 characters, boolean `completed`, numeric `createdAt`; drop invalid items and duplicate IDs. Initialize the fallback counter so IDs stay unique after reload. Add tests for corrupt and partial data. |
| DR-9 | Low | `crypto.randomUUID` needs a secure context; `file://` support varies. A fallback exists (AD-8) but is not tested. | AD-8 | Feature-detect `crypto.randomUUID`, and unit-test the fallback path. |
| DR-10 | Low | Multi-tab behavior is unspecified: a second tab overwrites stored tasks (last write wins). | AD-3 | Accept as a known limitation and note it in the implementation summary, or listen to the `storage` event to reload state. Not required by FR-1..FR-7. |
| DR-11 | Low | `createdAt` is stored but unused by any requirement or interface. | Data Model | Keep it (cheap, supports ordering and debugging) or drop it; record the choice in the plan. |

## Checks Performed
| Area | Result |
|------|--------|
| Security (OWASP) | Sound baseline (no `innerHTML`, validation, no network, no dependencies). Refine CSP (DR-4) and storage validation (DR-8). |
| Accessibility | Good baseline (label, native controls, live region, non-color completed cue). Gaps: error feedback (DR-6), focus after delete (DR-7). |
| Runtime constraints | `file://` conflicts with module-based layout and CSP wording (DR-3, DR-4); `randomUUID` has fallback (DR-9). |
| Pipeline consistency | Stage filenames match README and `validate-story.ps1` expectations (`03-design-review.md`, then `04-impl-plan.md`). Layout and tooling mismatches in DR-1, DR-2. |
| Error handling | `localStorage` failure falls back to memory (AD-3). Add tests (DR-8). |
| Testability | `TaskStore` is DOM-free but not importable as specified (DR-3); framework and files absent (DR-2). |

## Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Provisional decisions (Q1-Q5: top order, persistence, no delete confirmation, vanilla JS, evergreen browsers) were accepted at stage 02 but not answered by Jira | Rework if answers differ | Isolation points in the architecture; stage 04 keeps them in single places |
| Layout/test-tooling ambiguity (DR-1..DR-3) | Plan or tests that cannot run | Resolve in stage 04 before tasks are defined |
| Missing `validate-story.ps1` | Stage 07 cannot run its validation | Plan its creation or record the gap explicitly |
| CSP blocks local assets on `file://` | App appears broken | DR-4 directives and manual `file://` check |

## Recommendations for Stage 04
1. Choose and document one file layout (DR-1) that supports both `file://` opening and Node unit tests (DR-3).
2. Plan creation of `package.json`, `tests/tasks.test.js` and an `npm test` command; decide the `validate-story.ps1` scope (DR-2).
3. Define the CSP directives and a manual `file://` load check (DR-4).
4. Define derived acceptance criteria for FR-7 (DR-5).
5. Specify validation messaging, `maxlength`, and live-region announcements (DR-6).
6. Specify focus handling after delete (DR-7).
7. Specify the storage validator, fallback ID uniqueness, and tests for corrupt data and the ID fallback (DR-8, DR-9).
8. Record decisions on multi-tab behavior and `createdAt` (DR-10, DR-11).
9. Keep the architecture artifact unchanged; log deviations in the plan.

## Open Items Requiring Approval
- Confirm no High findings remain and that DR-1 to DR-6 (Medium) are accepted as carry-forward items for stage 04.
- Confirm preference for DR-3 option (a) (classic script, CommonJS-compatible store) or option (b) (ES modules plus local server).
- Confirm whether `validate-story.ps1` creation is in scope for this story.

## Approval
| Field | Value |
|-------|-------|
| Decision | approved |
| Approver | vasu_sachdeva (session user; name not stated in reply) |
| Rationale | User replied "approved for stage 3". DR-1 to DR-6 accepted as carry-forward items. The two open items were not answered, so the review's recommended defaults apply and are flagged as assumptions: DR-3 option (a) (classic script, CommonJS-compatible store); `validate-story.ps1` creation in scope |
| Evidence | This artifact; `02-architecture.md` (approved 2026-10-21); `01-requirements.md` (approved 2026-10-21); repository inspection; user reply |
| Timestamp | 2026-10-21 |
| Next agent | `04-implementation-planner.agent.md` after `approved` |
