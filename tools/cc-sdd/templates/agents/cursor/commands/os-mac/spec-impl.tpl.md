<meta>
description: Execute spec tasks using TDD methodology
argument-hint: [feature-name] <task-numbers>
</meta>

# Execute Spec Tasks with TDD

Execute implementation tasks from spec using Kent Beck's Test-Driven Development methodology.

## Arguments: [feature-name]
Tool policy: Use Cursor file tools (read_file/list_dir/glob_file_search/apply_patch/edit_file); no shell.

## Current Specs
Available specs: Discover via list_dir/glob_file_search under `{{KIRO_DIR}}/specs/`

## Instructions

### Help Mode (--help)
If arguments contain "--help", show usage:
```
/kiro/spec-impl [feature-name] <task-numbers>

Examples:
  /kiro/spec-impl auth-system 1.1            # Execute task 1.1
  /kiro/spec-impl auth-system 1,2,3          # Execute tasks 1, 2, 3
  /kiro/spec-impl auth-system --all          # Execute all pending tasks
```

### Pre-Execution Validation
Feature name: Parse first token of `[feature-name]` argument

Validate required files exist:
- Requirements: Check `{{KIRO_DIR}}/specs/[feature-name]/requirements.md` via read_file
- Design: Check `{{KIRO_DIR}}/specs/[feature-name]/design.md` via read_file
- Tasks: Check `{{KIRO_DIR}}/specs/[feature-name]/tasks.md` via read_file
- Metadata: Check `{{KIRO_DIR}}/specs/[feature-name]/spec.json` via read_file

### Context Loading
**Load all required content before execution:**

**Core Steering:**
- Structure: `{{KIRO_DIR}}/steering/structure.md`
- Tech Stack: `{{KIRO_DIR}}/steering/tech.md`
- Product: `{{KIRO_DIR}}/steering/product.md`

**Custom Steering:**
Additional files: Discover via list_dir/glob_file_search in `{{KIRO_DIR}}/steering` excluding `structure.md`, `tech.md`, `product.md`

**Spec Documents:**
Feature directory: Parse from `[feature-name]` argument
- Requirements: `{{KIRO_DIR}}/specs/[feature-name]/requirements.md`
- Design: `{{KIRO_DIR}}/specs/[feature-name]/design.md`
- Tasks: `{{KIRO_DIR}}/specs/[feature-name]/tasks.md`

**Note**: [feature-name] will be replaced with actual feature name during execution

### Task Execution
1. **Parse feature name and task numbers** from arguments
2. **Load all context** (steering + spec documents)
3. **Extract checkboxes** from tasks.md: Read file and parse `- [ ]` / `- [x]` lines programmatically (no shell)
4. **Execute each checkbox** using TDD methodology directly

### For Each Task Checkbox
Execute using TDD methodology directly:

**Implementation Steps:**
1. **Load Project Context** (read these files first):
   - Structure: `{{KIRO_DIR}}/steering/structure.md`
   - Tech Stack: `{{KIRO_DIR}}/steering/tech.md`
   - Product: `{{KIRO_DIR}}/steering/product.md`
   - Custom steering files: Discover via list_dir/glob_file_search in `{{KIRO_DIR}}/steering` excluding `structure.md`, `tech.md`, `product.md`
   - Spec Metadata: `{{KIRO_DIR}}/specs/[feature-name]/spec.json`
   - Requirements: `{{KIRO_DIR}}/specs/[feature-name]/requirements.md`
   - Design: `{{KIRO_DIR}}/specs/[feature-name]/design.md`
   - All Tasks: `{{KIRO_DIR}}/specs/[feature-name]/tasks.md`

2. **TDD Implementation** for each specific task:
   - **RED**: Write failing tests first
   - **GREEN**: Write minimal code to pass tests
   - **REFACTOR**: Clean up and improve code structure

3. **Task Completion**:
   - Verify all tests pass
   - Update checkbox from `- [ ]` to `- [x]` in `{{KIRO_DIR}}/specs/[feature-name]/tasks.md`
   - Ensure no regressions in existing tests

**For each task:**
- Extract exact checkbox content from tasks.md
- Follow Kent Beck's TDD methodology strictly
- Implement only the specific task requirements
- Maintain code quality and test coverage

## Implementation Logic

1. **Parse Arguments**:
   - Feature name: First argument
   - Task numbers: Second argument (support: "1", "1,2,3", "--all")

2. **Validate**:
   - Spec directory exists
   - Required files (requirements.md, design.md, tasks.md, spec.json) exist
   - Spec is approved for implementation

3. **Execute**:
   - **Load all file contents** into memory first
   - **Build complete context** for implementation
   - **Execute each task sequentially** using TDD methodology
   - Each task implementation receives complete project knowledge

## Error Handling

- Spec not found: Run /kiro/spec-init first
- Not approved: Complete spec workflow first
- Task failure: Keep checkbox unchecked, show error

## Success Metrics

- All selected checkboxes marked [x] in tasks.md
- Tests pass
- No regressions