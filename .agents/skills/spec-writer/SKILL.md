---
name: spec-writer
description: Turn a natural-language request into a compact implementation spec.
---

## Goal

Convert the request into a compact Spec document.

## Rules

- Keep the Spec short, implementation-oriented, and self-contained.
- Assume the next agent will not see the original conversation.
- Define summary, scope, non-scope, constraints, parallelization notes, and completion criteria.
- Use concrete file paths, component or API names, branch rules, and observable outcomes.
- Put non-obvious facts, invariants, platform differences, and blockers in `Constraints` or `Notes`.
- Do not include task breakdowns or long explanations.
- Save the Spec document under `docs/specs`.

## Output

Create or update a Spec document using the `docs/templates/spec.md` template.

## Stop when

- The Spec is self-contained and clear enough to split into tasks.
