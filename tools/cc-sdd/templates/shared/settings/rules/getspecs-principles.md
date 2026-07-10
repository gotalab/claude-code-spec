# GetSpecs Principles (Brownfield)

## Core Philosophy

1. **Code is the source of truth** — specs describe what exists and what will change, not wishful architecture.
2. **Respect existing patterns** — document conventions; do not "fix" the codebase during bootstrap.
3. **Seeds, not EARS** — each seed gets `brief.md`, `spec.json`, and a `requirements.md` **stub** (project description only, same contract as `/kiro-spec-init`). EARS acceptance criteria come from `/kiro-spec-requirements`.
4. **Boundaries over catalogs** — steering captures decisions and patterns, not every file and dependency.
5. **Additive by default** — never silently replace user steering or approved spec artifacts.

## Brownfield vs Greenfield

| Signal | Interpretation |
|--------|----------------|
| Substantial src/ with tests | Brownfield — getSpecs appropriate |
| Only README + empty src | Greenfield — redirect to `/kiro-discovery` |
| `.kiro/` partial | Merge mode — fill gaps, preserve existing |
| Approved requirements exist | Do not re-seed those features |

## Spec Boundary Heuristics

Prefer boundaries that:

- Match existing module or package seams
- Align with team ownership or git branch themes
- Can be implemented/reviewed without constant cross-spec edits
- Represent user-visible capability or clear infrastructure domain

Avoid boundaries that:

- Split one cohesive flow across many specs without dependency clarity
- Mirror arbitrary directory names with no behavioral boundary
- Duplicate an existing spec's domain

## Steering Granularity

**Include**: product purpose, tech stack decisions, layering rules, naming/testing conventions, integration constraints.

**Exclude**: full file trees, complete dependency lists, line-by-line API catalogs.

## Validation Before Handoff

- [ ] Every spec seed has `brief.md`, `spec.json`, and `requirements.md` stub
- [ ] `requirements.md` has Project Description only; `## Requirements` section empty
- [ ] Roadmap dependency order is acyclic
- [ ] Brief **Current State** cites real modules/paths from analysis
- [ ] User confirmed writes (Phase 0)
- [ ] All files read back from disk successfully
