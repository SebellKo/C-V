## Goal

- Complete exactly one user-specified small task inside one user-specified middle task.

## Flow

1. Read the explicitly provided Spec and Task documents.
2. Read the user-specified middle task and small task.
3. Implement only that small task.
4. Self-review and refactor only within task scope.
5. Update the small task to `In Review`.
6. Stop and wait for user approval.
7. After approval, update the small task to `Done`.
8. If all small tasks in the middle task are `Done`, update the middle task to `Done`.
9. When the middle task becomes `Done`, create a compact handoff under `scratchpad/docs/handoff/<current-branch-name>` using `scratchpad/templates/handoff.md`.

## Rules

- Treat the explicitly provided Spec and Task documents as the source of truth for the current run.
- Treat the user-specified task as the only implementation target.
- Do not select the next task on your own.
- Do not work across multiple middle tasks in one run.
- Do not work on more than one small task.
- Do not move to the next small task automatically.
- Keep changes as small as possible.
- Do not add a validation section unless explicit checks are actually available.
- Read Spec from `scratchpad/docs/specs`.
- Read Task from `scratchpad/docs/tasks`.
- Do not create a handoff document for an individual small task.
- Update a small task to `Done` only after user approval.

## Stop

- The specified small task is completed and marked as `In Review`, or
- The user-approved small task is updated to `Done`, or
- The middle task is updated to `Done` and its handoff document is created.
