---
description: Execute spec tasks using TDD methodology
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob, LS, WebFetch
argument-hint: <feature-name> [task-numbers]
---

# Execute Spec Tasks with TDD

Execute implementation tasks for **$1** using Kent Beck's Test-Driven Development methodology.

## Instructions

### Pre-Execution Validation
Validate required files exist for feature **$1**:
- Requirements: `{{KIRO_DIR}}/specs/$1/requirements.md`
- Design: `{{KIRO_DIR}}/specs/$1/design.md`  
- Tasks: `{{KIRO_DIR}}/specs/$1/tasks.md`
- Metadata: `{{KIRO_DIR}}/specs/$1/spec.json`

### Context Loading

**Core Steering:**
- Structure: @{{KIRO_DIR}}/steering/structure.md
- Tech Stack: @{{KIRO_DIR}}/steering/tech.md  
- Product: @{{KIRO_DIR}}/steering/product.md

**Custom Steering:**
- Additional `*.md` files in `{{KIRO_DIR}}/steering/` (excluding structure.md, tech.md, product.md)

**Spec Documents for $1:**
- Metadata: @{{KIRO_DIR}}/specs/$1/spec.json
- Requirements: @{{KIRO_DIR}}/specs/$1/requirements.md
- Design: @{{KIRO_DIR}}/specs/$1/design.md
- Tasks: @{{KIRO_DIR}}/specs/$1/tasks.md

### Task Execution
1. **Feature**: $1  
2. **Task numbers**: $2 (optional, defaults to all pending tasks)
3. **Load all context** (steering + spec documents)
4. **Execute selected tasks** using TDD methodology

### TDD Implementation
For each selected task:

1. **RED**: Write failing tests first
2. **GREEN**: Write minimal code to pass tests  
3. **REFACTOR**: Clean up and improve code structure
4. **Verify**: 
   - All tests pass
   - No regressions in existing tests
   - Code quality and test coverage maintained
5. **Mark Complete**: Update checkbox from `- [ ]` to `- [x]` in tasks.md

**Note**: Follow Kent Beck's TDD methodology strictly, implementing only the specific task requirements.

## Implementation Notes

- **Feature**: Use `$1` for feature name
- **Tasks**: Use `$2` for specific task numbers (optional)
- **Validation**: Check all required spec files exist
- **TDD Focus**: Always write tests before implementation
- **Task Tracking**: Update checkboxes in tasks.md as completed
