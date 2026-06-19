# Analysis Guide (GetSpecs)

Distilled procedures for brownfield reverse engineering into `.kiro/` artifacts.

## Tech Stack

1. Identify primary languages from file extensions and config
2. Extract versions from lockfiles and engine fields (package.json, pyproject.toml, go.mod, pom.xml)
3. Note frameworks from dependencies and import patterns
4. Record build, test, and CI tooling from config files

| Category | Where to look |
|----------|---------------|
| Runtime | package.json engines, .nvmrc, Dockerfile |
| Web/API | dependencies, main entrypoints |
| Data | ORM configs, migration folders, docker-compose |
| Test | jest.config, pytest.ini, *_test.go patterns |
| CI | .github/workflows, .gitlab-ci.yml |

## Architecture

| Pattern | Signals |
|---------|---------|
| Layered | controller/service/repository folders |
| Feature-first | features/, modules/ by domain |
| Hexagonal | ports/, adapters/ |
| Monorepo | packages/, apps/, workspaces |
| Microservices | multiple deployable roots |

Document **organization strategy** (layer vs feature vs hybrid), not every folder.

## Conventions

Extract from linter/formatter config and sampled files:

- File and symbol naming
- Import order and alias patterns
- Error handling style
- Logging approach
- Test file placement and naming

## Modules

For each meaningful module/domain:

| Field | Content |
|-------|---------|
| Name | Short slug candidate |
| Path | Root directory |
| Responsibility | One sentence |
| Depends on | Other modules (from imports/graph) |
| Spec candidate? | yes/no + rationale |

## Git Signals (optional)

- Branch prefixes → active domains
- Commit themes → recurring change areas
- Do not treat git history as product requirements

## Spec Candidate Selection

Rank candidates by:

1. Clear module boundary in code
2. Independent test/deploy surface
3. Recent change velocity (git)
4. User focus from `$ARGUMENTS`

Target 3–8 seeds; defer overflow to roadmap notes for a second pass.
