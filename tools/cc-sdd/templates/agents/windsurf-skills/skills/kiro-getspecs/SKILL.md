---
name: kiro-getspecs
description: Brownfield entry point for existing codebases. Reverse-engineers project structure into .kiro/ steering, roadmap, and spec seeds (brief.md + spec.json). Use when adopting cc-sdd on a project that has code but no specs, or when onboarding to an unfamiliar brownfield repo.
metadata:
  shared-rules: "getspecs-principles.md"
---


# Get Specs (Brownfield Reverse Engineering)

<background_information>
**Role**: Bootstrap cc-sdd on brownfield (existing) projects without rewriting the codebase.

**Mission**:
- Understand what the project already is (tech, architecture, modules, conventions)
- Materialize that understanding as durable `.kiro/` artifacts
- Propose natural spec boundaries as seeds — not full requirements yet

**Success Criteria**:
- Steering captures patterns and principles, not file catalogs
- Spec seeds have clear boundaries derived from code reality
- User can continue with `@kiro-spec-requirements` or `@kiro-spec-batch` without re-explaining the project
- No spec-kit / `.specify/` artifacts created

**When to use instead of `@kiro-discovery`**:
- Project has substantial code but empty or missing `.kiro/specs/`
- Team is adopting cc-sdd mid-flight on an existing repo
- You need project memory and spec backlog from code, not from a new feature idea

**When NOT to use**:
- Greenfield new project → `@kiro-discovery` or `@kiro-spec-init`
- Single small feature on a project that already has steering + specs → `@kiro-discovery`
- You only need gap analysis for one existing spec → `@kiro-validate-gap`
</background_information>

<instructions>

## Phase 0: Gate and Scope

1. **Confirm brownfield intent**: Existing codebase with meaningful implementation (not empty scaffold).
2. **Optional focus** ($ARGUMENTS): Module, domain, or area to prioritize when decomposing specs.
3. **Explain output contract** before writing:
   - Creates/updates: `{{KIRO_DIR}}/steering/{product,tech,structure,roadmap}.md`
   - Creates spec seeds: `{{KIRO_DIR}}/specs/<slug>/{spec.json,brief.md,requirements.md}` — `requirements.md` is **project-description stub only** (same as `@kiro-spec-init`), not EARS requirements
   - Does NOT create: EARS requirements body, `design.md`, `tasks.md`, `.specify/`
4. **Safety check**: If any spec has `spec.json` with `approvals.requirements.approved: true` or `approvals.design.approved: true`, list them and ask before overwriting or duplicating boundaries.
5. **Proceed only after user confirms** (or user explicitly invoked the skill expecting writes).

## Phase 1: Lite Scan (metadata only)

Gather **metadata only**. Do NOT read full source files yet.

- **Specs inventory**: List `{{KIRO_DIR}}/specs/*/spec.json` if any (name, phase, approvals)
- **Steering inventory**: Which files exist under `{{KIRO_DIR}}/steering/`
- **Project root**: List top-level directories and key config files (package.json, pyproject.toml, go.mod, etc.)
- **Git presence**: Check if `.git` exists (do not run destructive git commands)

Note: `empty .kiro/` → full bootstrap; partial `.kiro/` → additive merge mode.

## Phase 2: Reverse Analysis (delegate)

Read `references/analysis-guide.md` from this skill's directory for the analysis framework.

**Spawn a sub-agent** (or execute sequentially if sub-agents unavailable) to analyze the codebase and return a structured summary **under 200 lines**:

1. Tech stack and versions (from config files, not guesses)
2. Architecture pattern and layering
3. Module/domain boundaries with paths
4. Conventions (naming, testing, error handling)
5. Candidate spec boundaries (natural seams for independent specs)
6. Areas of high change risk or tight coupling

**Context budget**: Sub-agent does heavy exploration; main context receives summary only.

If optional structural code graphs exist in the project (e.g. graphify), prefer them for module boundaries before broad file reads.

## Phase 3: Git Forensics (when `.git` exists)

Run lightweight, read-only git inspection:

```bash
git log --oneline -20
git branch -a | head -30
git log --oneline --since="6 months ago" --pretty=format:%s | sort | uniq -c | sort -rn | head -15
```

Extract:
- Active feature areas from branch names (`feature/*`, `fix/*`)
- Recurring themes in commit messages
- Recently hot directories (if inferable from commits)

Use this to **prioritize spec seeds**, not to invent features that do not exist in code.

## Phase 4: Steering Bootstrap

Load principles from `rules/getspecs-principles.md` in this skill's directory.

**If steering is missing or incomplete**:
1. Read templates from `{{KIRO_DIR}}/settings/templates/steering/` (product, tech, structure)
2. Synthesize from Phase 2 summary + Phase 3 git signals
3. Write `product.md`, `tech.md`, `structure.md` — **patterns and decisions**, not exhaustive lists

**If steering already exists**:
- Read existing files first
- Propose **additive** updates only; preserve user-authored sections
- Report drift between steering and codebase; do not silently replace

**Optional**: Write `roadmap.md` in Phase 5 instead of here if spec decomposition is not ready yet.

## Phase 5: Roadmap and Spec Seeds

Read `references/spec-seed-template.md` from this skill's directory.

### Decompose boundaries

From analysis + git signals + optional `$ARGUMENTS` focus:

- Prefer **vertical slices** or **module-aligned** specs that can progress independently
- Target **3–8 spec seeds** for typical mid-size repos; fewer for small repos
- Each seed must answer: what existing capability does this spec document/improve?

### Write roadmap.md

Use the full roadmap structure in `references/spec-seed-template.md` (aligned with `@kiro-discovery` Path D: Overview, Approach Decision, Scope, Constraints, Boundary Strategy, Specs).

### Write each spec seed

For every slug under `## Specs (dependency order)`:

1. Create `{{KIRO_DIR}}/specs/<slug>/`
2. Write `brief.md` using the brownfield brief format in `references/spec-seed-template.md`
   - **Current State** must reflect code that exists today
   - **Existing Spec Touchpoints** must reference real modules/paths
3. Write `spec.json` from `{{KIRO_DIR}}/settings/templates/specs/init.json`:
   - Replace `{{FEATURE_NAME}}`, `{{TIMESTAMP}}`, `{{LANG_CODE}}`
   - Keep `phase: "initialized"` and all approvals `false`
4. Write `requirements.md` **stub** from `{{KIRO_DIR}}/settings/templates/specs/requirements-init.md`:
   - Replace `{{PROJECT_DESCRIPTION}}` with a synthesis from brief **Problem**, **Current State**, and **Desired Outcome** (who, situation, target state)
   - Leave the `## Requirements` section empty — EARS content is `@kiro-spec-requirements`
   - Do not set `approvals.requirements.generated` to true

**Do NOT** generate EARS acceptance criteria — that is `@kiro-spec-requirements`.

### Verify artifacts

Read back each written file (`steering/*`, `roadmap.md`, each seed's `brief.md`, `spec.json`, `requirements.md`). If any write failed, stop and report before handoff.

## Phase 6: Handoff

Present to user:

1. **Steering status**: created / updated / unchanged (with paths)
2. **Spec seeds table**: slug | one-line scope | dependencies
3. **Evidence gaps**: areas needing human input before requirements
4. **Next command** (choose one):
   - Single seed: `@kiro-spec-requirements <slug>`
   - Multiple seeds: `@kiro-spec-batch` (after reviewing briefs)
   - Steering only: `@kiro-steering` when steering needs refinement before specs (existing core files trigger Sync Mode)

**CRITICAL**: All artifacts must be on disk before suggesting next commands. Conversation text does not survive session boundaries.

</instructions>

## Output Description

Provide output in the project's language (detect from README or user; default `en`) with:

1. **Brownfield Summary** (3–5 bullets): stack, architecture, module count, seeds created
2. **Files Written**: bullet list with full paths
3. **Spec Seed Backlog**: table of slugs + dependency order
4. **Next Step**: one recommended command in a code block

Keep total output under 400 words. Details live on disk.

## Safety & Fallback

| Scenario | Action |
|----------|--------|
| Empty repo / scaffold only | Stop: use `@kiro-discovery` greenfield path |
| User declines writes | Report analysis only; no disk changes |
| Templates missing | Report missing path under `{{KIRO_DIR}}/settings/templates/` |
| Existing approved specs | Never overwrite; append roadmap items or propose new slugs |
| Huge monolith (>15 seeds) | Propose phased roadmap; write top 5–8 seeds first; ask user to continue |
| No git | Skip Phase 3; rely on structure analysis only |

## Relationship to Other Skills

| Skill | Relationship |
|-------|----------------|
| `@kiro-discovery` | Idea-first routing; getSpecs is **code-first** bootstrap |
| `@kiro-steering` | Same steering output; getSpecs automates initial bootstrap from code |
| `@kiro-spec-init` | Creates one spec from description; getSpecs creates **many seeds** from code |
| `@kiro-spec-requirements` | **Next step** — turns seeds into EARS requirements |
| `@kiro-validate-gap` | Per-spec gap analysis **after** requirements exist |
