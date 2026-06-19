# Spec Seed Templates

Use these when writing brownfield spec seeds in Phase 5. **Do not** write EARS acceptance criteria here.

## spec.json

Copy from `{{KIRO_DIR}}/settings/templates/specs/init.json` and replace placeholders:

- `{{FEATURE_NAME}}` → slug (kebab-case)
- `{{TIMESTAMP}}` → ISO 8601 now
- `{{LANG_CODE}}` → detected language (`en`, `ja`, `zh-TW`, …)

Keep `phase: "initialized"` and all `approvals.*.generated` / `approved` as `false`.

## requirements.md stub

Copy from `{{KIRO_DIR}}/settings/templates/specs/requirements-init.md`.

Replace `{{PROJECT_DESCRIPTION}}` with 2–4 paragraphs synthesized from the brief:

1. Who has the problem / who owns this capability
2. Current state (what the code does today)
3. Desired outcome when spec work is complete

Leave `## Requirements` as the template placeholder comment only.

## brief.md (brownfield)

```markdown
# Brief: <slug>

## Problem
[Who needs continuity/documentation/governance on this existing capability]

## Current State
[What the code already does — cite modules/paths from analysis]

## Desired Outcome
[What "spec-complete" means: documented requirements, safe changes, gap-closed design]

## Approach
[Document-then-evolve vs targeted enhancement — grounded in existing architecture]

## Scope
- **In**: [existing capability boundary]
- **Out**: [neighbor domains owned by other specs]

## Boundary Candidates
- [seam 1 from code structure]
- [seam 2]

## Out of Boundary
- [explicit non-goals]

## Upstream / Downstream
- **Upstream**: [modules/services this depends on]
- **Downstream**: [consumers in codebase]

## Existing Spec Touchpoints
- **Extends**: none (brownfield seed) | [existing spec]
- **Adjacent**: [neighbor slugs or modules — avoid overlap]

## Constraints
[Compatibility, versioning, deployment constraints observed in code]
```

## roadmap.md (full structure)

```markdown
# Roadmap

## Overview
[Project goal and chosen approach — 1–2 paragraphs]

## Approach Decision
- **Chosen**: [approach name and summary]
- **Why**: [key reasoning]
- **Rejected alternatives**: [what was considered and why rejected]

## Scope
- **In**: [what the overall project includes]
- **Out**: [what is explicitly excluded]

## Constraints
[technology, compatibility, timeline, or other project-wide constraints]

## Boundary Strategy
- **Why this split**: [why these spec boundaries improve independence]
- **Shared seams to watch**: [cross-spec boundaries needing careful review]

## Specs (dependency order)
- [ ] slug-a -- one line. Dependencies: none
- [ ] slug-b -- one line. Dependencies: slug-a
```

Mark `[x]` only when a spec has approved requirements (rare on first bootstrap).
