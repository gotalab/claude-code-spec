---
description: Template kiro commands with parameter placeholders
allowed-tools: Bash, Glob, Grep, Read, Write, Edit, MultiEdit
argument-hint: [source-dir] [dest-dir] [options...]
---

# Template Parameter Replacement

Copy kiro command files from source to destination and apply template parameter replacements.

## ⚠️ Claude Code File Operation Notes
- **Existing files**: Must use Read tool before Write/Edit operations
- **New files**: Can use Write directly, but check if destination already exists
- **Complex operations**: Use Task tool with general-purpose agent for robust processing
- **Task agent instructions**: Must emphasize "complete file copy, not content generation" to avoid template mixing

## Parameters
Parse from `$ARGUMENTS`:
- **First argument**: Source directory (default: `.claude/commands/kiro/`)
- **Second argument**: Destination directory (default: `tools/cc-sdd/templates/agents/claude-code/commands/os-mac/`)
- **Options** (any order):
  - `--windows` or `--mac`: Target OS (default: `--mac`)
  - `-y` or `--yes`: Skip confirmation

## Default Operation
If no arguments provided, copies from `.claude/commands/kiro/` to `tools/cc-sdd/templates/agents/claude-code/commands/os-mac/` with Mac OS formatting (no bash -c wrapping)

## Argument Processing
Arguments received: `$ARGUMENTS`

Parse arguments to determine:
- Source directory (first non-option argument)
- Destination directory (second non-option argument)  
- Target OS (from `--windows`/`--mac` options)
- Confirmation skip (from `-y`/`--yes` options)

## Template Replacement Rules

1. **Directory path replacement**: `.kiro` → `{{KIRO_DIR}}`
2. **Language placeholder replacement**: `"language": "ja"` → `"language": "{{LANG_CODE}}"`
3. **Bash command wrapping (Windows only)**: 
   - **Search pattern**: Lines containing `Exclamation mark` followed by backtick-enclosed commands
   - **Replace with**: Exclamation mark + backtick + bash -c 'original-command' + backtick
   - **Process**: 
     - Original: EXCLAMATION + BACKTICK + command + BACKTICK
     - Windows:  EXCLAMATION + BACKTICK + bash -c 'command' + BACKTICK  
     - Mac:      Keep original format unchanged
   - Handle nested quotes and escape characters properly
4. **File extension**: `.md` → `.tpl.md`, `.toml` → `.tpl.toml`

## Task: Process Command Files

### 1. Create Destination Directory
Ensure the destination directory exists.

### 2. Enumerate and Process Source Files
1. **Find all source files**: Use Glob to find `*.md` and `*.toml` files in source directory
2. **Process each file** in the list:
   - **Read source file content**
   - **Apply template replacements**:
     - Replace all instances of `.kiro` with `{{KIRO_DIR}}`
     - Replace `"language": "ja"` with `"language": "{{LANG_CODE}}"`
     - Replace `"language": "en"` with `"language": "{{LANG_CODE}}"`
     - Replace `"language": "zh-TW"` with `"language": "{{LANG_CODE}}"`
     - **If target is Windows**: Find and wrap bash commands (EXCLAMATION + BACKTICK pattern) with bash -c syntax
   - **Write to destination** with `.tpl.md` or `.tpl.toml` extension
   - **Report progress** for each file

### 3. OS Detection and Confirmation

#### OS Detection Priority (highest to lowest):
1. **Explicit OS argument**: `--windows` or `--mac` in arguments → Use specified OS
2. **Path-based detection**: Destination path contains `os-windows` → Windows, `os-mac` → Mac
3. **Default fallback**: Mac (no bash -c wrapping)

#### Confirmation Logic:
- Skip confirmation if `-y` or `--yes` in arguments
- Otherwise, prompt user for confirmation before proceeding

#### OS-Specific Processing:
- **Mac**: Keep bash commands as `command` (no wrapping)
- **Windows**: Wrap bash commands as `bash -c 'command'`

### 4. Summary Report
After completion, provide:
- Number of files processed
- Source and destination paths
- List of files created

## Instructions

### 1. Parse Arguments
- Extract source and destination directories from `$ARGUMENTS`
- Identify OS target (`--windows`/`--mac`) and confirmation flags (`-y`/`--yes`)
- Apply defaults: source=`.claude/commands/kiro/`, dest=`tools/cc-sdd/templates/agents/claude-code/commands/os-mac/`

### 2. Validation and Error Handling
- **Validate source directory**:
  - Check directory exists, show error if not found
  - Check contains `.md` or `.toml` files, warn if empty
- **Validate destination path**: Create parent directories if needed
- **Check permissions**: Verify write access to destination

### 3. OS Detection
Apply OS detection priority: explicit (`--windows`/`--mac`) → path-based → default (mac)

### 4. User Confirmation
- Display operation summary: source, destination, target OS, file count
- Skip if `-y`/`--yes` provided, otherwise prompt for confirmation
- Allow user to abort operation

### 5. File Processing
For each source file:
- **Read file content** with error handling for read failures
- **Apply replacements**:
  - `.kiro` → `{{KIRO_DIR}}`
  - Language codes → `{{LANG_CODE}}`
  - Windows-only: Wrap bash commands with `bash -c '...'`
- **Handle special characters**: Escape quotes properly in bash -c wrapping
- **Write to destination** with error handling for write failures
- **Report progress** for each file processed

### 6. Final Summary
- Count of files successfully processed
- List of created files
- Any errors or warnings encountered

This command enables creating templateized versions of kiro commands for distribution and reuse across different projects.