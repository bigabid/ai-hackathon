# Rule: Generating a Task List from a PRD

## Goal

Create a concise, implementation-ready task list from a PRD that a junior developer can follow. Favor clarity, logical sequencing, and explicit deliverables.

## Principles (Cursor Best Practices)

- Phase the plan: high-level tasks first, then expand into sub‑tasks after user confirmation.
- Traceability: map tasks to PRD sections/requirements (e.g., FR-3 → Task 2.1).
- Skimmability: short, verb-led tasks with checkboxes.
- File awareness: identify files to create/modify early.

### Why
- Reduces rework by aligning on scope before detail.
- Enables reviewers and CI to trace coverage against the PRD.
- Keeps execution predictable and auditable.

## Process

1. Receive PRD reference
   - Confirm file path and ensure it follows `/tasks/prd-[feature].md` naming.
2. Analyze PRD
   - Extract goals, user stories, functional requirements, constraints.
3. Assess current state
   - Identify existing modules/components/utilities to reuse or modify.
4. Phase 1: Generate Parent Tasks
   - 5–10 high-level tasks that cover the entire implementation and validation.
   - Present to user and pause.
5. Wait for confirmation
   - Proceed only when user responds “Go”.
6. Phase 2: Generate Sub‑Tasks
   - Break each parent task into actionable steps, each completable in ≤1–2 hours.
   - Include testing, docs, telemetry, and accessibility where applicable.
7. Identify Relevant Files
   - List probable files to create/modify with short rationale; include tests.
8. Save
   - Save as `tasks-[prd-file-name].md` in `/tasks/`.

### Why
- Staged expansion keeps alignment tight and minimizes churn.

## Output Format

```markdown
## Relevant Files

- `path/to/potential/file1.ts` - Why relevant.
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Why relevant.
- `path/to/another/file.test.tsx` - Unit tests.
- `lib/utils/helpers.ts` - Utility functions.
- `lib/utils/helpers.test.ts` - Unit tests.

### Notes

- Place tests alongside implementation files when possible.
- Use your project test runner consistently (e.g., Jest, Vitest, Pytest).

## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 Sub‑task description (FR‑x)
  - [ ] 1.2 Sub‑task description (FR‑y)
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 Sub‑task description
- [ ] 3.0 Parent Task Title
```

### Why
- Standardized structure makes progress obvious and automatable.

## Interaction Model

- After parent tasks are generated, pause for “Go”.
- After sub‑tasks are generated, proceed to implementation step‑by‑step.

### Why
- Prevents deep work on misaligned plans.

## Quality Bar for Tasks

- Verb-led and outcome-focused.
- Explicit acceptance per sub‑task (what proves it’s done?).
- Links to PRD requirement IDs and affected files.
- Includes testing and error/edge handling.

### Why
- Ensures completeness and testability.

## Saving

- Format: Markdown (`.md`)
- Location: `/tasks/`
- Filename: `tasks-[prd-file-name].md`

### Why
- Predictable location and naming for automation and reviews.
