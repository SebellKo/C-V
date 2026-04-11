---
name: task-splitter
description: Split a Spec into dependency-aware middle tasks and small reviewable tasks.
---

## Goal

Break the Spec into middle tasks for parallel work and small tasks for step-by-step implementation.

## Rules

- First split the work into middle tasks, then small tasks.
- Middle tasks should be as independent as possible.
- Explicitly note dependencies between middle tasks.
- Make each middle task and small task self-contained enough to execute without the original conversation.
- For each small task, state concrete output, target files, preconditions, and guardrails.
- Small tasks must be small enough to review by diff.
- Track middle tasks and small tasks separately.
- Do not restate the whole Spec.
- Save the Task document under `docs/tasks`.

## Output

Create or update a Task document using `docs/templates/task.md`.

## Stop when

- The Spec is decomposed into dependency-aware, self-contained middle tasks and actionable small tasks.
