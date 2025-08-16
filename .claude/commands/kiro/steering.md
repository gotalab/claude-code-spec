---
description: Create or update Kiro steering documents intelligently based on project state
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Glob, Grep, LS
---

# Kiro Steering Management

Intelligently create or update steering documents in `.kiro/steering/` to maintain accurate project knowledge for spec-driven development. This command detects existing documents and handles them appropriately.

## Existing Files Check

### Current steering documents status
- Product overview: !`[ -f ".kiro/steering/product.md" ] && echo "✅ EXISTS - Will be updated preserving custom content" || echo "📝 Not found - Will be created"`
- Technology stack: !`[ -f ".kiro/steering/tech.md" ] && echo "✅ EXISTS - Will be updated preserving custom content" || echo "📝 Not found - Will be created"`
- Project structure: !`[ -f ".kiro/steering/structure.md" ] && echo "✅ EXISTS - Will be updated preserving custom content" || echo "📝 Not found - Will be created"`
- Custom steering files: !`source .claude/commands/kiro/helpers.sh && count_custom_steering`

## Project Analysis

### Current Project State
- Project files: !`find . -path ./node_modules -prune -o -path ./.git -prune -o -path ./dist -prune -o -type f \( -name '*.py' -o -name '*.js' -o -name '*.ts' -o -name '*.jsx' -o -name '*.tsx' -o -name '*.java' -o -name '*.go' -o -name '*.rs' \) -print 2>/dev/null | head -10`
- Configuration files: !`find . -maxdepth 3 \( -name 'package.json' -o -name 'requirements.txt' -o -name 'pom.xml' -o -name 'Cargo.toml' -o -name 'go.mod' -o -name 'pyproject.toml' -o -name 'tsconfig.json' \) 2>/dev/null`
- Documentation: !`find . -maxdepth 3 -path ./node_modules -prune -o -path ./.git -prune -o -path ./.kiro -prune -o \( -name 'README*' -o -name 'CHANGELOG*' -o -name 'LICENSE*' -o -name '*.md' \) -print 2>/dev/null | head -10`

### Recent Changes (if updating)
- Last steering update: !`git log -1 --oneline -- .kiro/steering/ 2>/dev/null || echo "No previous steering commits"`
- Commits since last steering update: !`LAST_COMMIT=$(git log -1 --format=%H -- .kiro/steering/ 2>/dev/null); if [ -n "$LAST_COMMIT" ]; then git log --oneline ${LAST_COMMIT}..HEAD --max-count=20 2>/dev/null || echo "Not a git repository"; else echo "No previous steering update found"; fi`
- Working tree status: !`git status --porcelain 2>/dev/null || echo "Not a git repository"`

### Existing Documentation
- Main README: @README.md
- Package configuration: @package.json
- Python requirements: @requirements.txt
- TypeScript config: @tsconfig.json
- Project documentation: @docs/

## Smart Update Strategy

Based on the existing files check above, this command will:

### For NEW files (showing "📝 Not found"):
Generate comprehensive initial content covering all aspects of the project.

### For EXISTING files (showing "✅ EXISTS"):
1. **Preserve user customizations** - Any manual edits or custom sections
2. **Update factual information** - Dependencies, file structures, commands
3. **Add new sections** - Only if significant new capabilities exist
4. **Mark deprecated content** - Rather than deleting
5. **Maintain formatting** - Keep consistent with existing style

## Inclusion Modes for Core Steering Files

The three core steering files (product.md, tech.md, structure.md) are designed to be **Always Included** - loaded in every AI interaction to provide consistent project context.

### Understanding Inclusion Modes
- **Always Included (Default for core files)**: Loaded in every interaction - ensures consistent project knowledge
- **Conditional**: Loaded only when working with matching file patterns (mainly for custom steering)  
- **Manual**: Referenced on-demand with @filename syntax (for specialized contexts)

### Core Files Strategy
- `product.md`: Always - Business context needed for all development decisions
- `tech.md`: Always - Technical constraints affect all code generation
- `structure.md`: Always - Architectural decisions impact all file organization

## Task: Create or Update Steering Documents

### 1. Product Overview (`product.md`)

#### For NEW file:
Generate comprehensive product overview including:
- **Product Overview**: Brief description of what the product is
- **Core Features**: Bulleted list of main capabilities
- **Target Use Case**: Specific scenarios the product addresses
- **Key Value Proposition**: Unique benefits and differentiators

#### For EXISTING file:
Update only if there are:
- **New features** added to the product
- **Removed features** or deprecated functionality
- **Changed use cases** or target audience
- **Updated value propositions** or benefits

### 2. Technology Stack (`tech.md`)

#### For NEW file:
Document the complete technology landscape:
- **Architecture**: High-level system design
- **Frontend**: Frameworks, libraries, build tools (if applicable)
- **Backend**: Language, framework, server technology (if applicable)
- **Development Environment**: Required tools and setup
- **Common Commands**: Frequently used development commands
- **Environment Variables**: Key configuration variables
- **Port Configuration**: Standard ports used by services

#### For EXISTING file:
Check for changes in:
- **New dependencies** added via package managers
- **Removed libraries** or frameworks
- **Version upgrades** of major dependencies
- **New development tools** or build processes
- **Changed environment variables** or configuration
- **Modified port assignments** or service architecture

### 3. Project Structure (`structure.md`)

#### For NEW file:
Outline the codebase organization:
- **Root Directory Organization**: Top-level structure with descriptions
- **Subdirectory Structures**: Detailed breakdown of key directories
- **Code Organization Patterns**: How code is structured
- **File Naming Conventions**: Standards for naming files and directories
- **Import Organization**: How imports/dependencies are organized
- **Key Architectural Principles**: Core design decisions and patterns

#### For EXISTING file:
Look for changes in:
- **New directories** or major reorganization
- **Changed file organization** patterns
- **New or modified naming conventions**
- **Updated architectural patterns** or principles
- **Refactored code structure** or module boundaries

### 4. Custom Steering Files
If custom steering files exist:
- **Preserve them** - Do not modify unless specifically outdated
- **Check relevance** - Note if they reference removed features
- **Suggest new custom files** - If new specialized areas emerge

## Instructions

1. **Create `.kiro/steering/` directory** if it doesn't exist
2. **Check existing files** to determine create vs update mode
3. **Analyze the codebase** using native tools (Glob, Grep, LS)
4. **For NEW files**: Generate comprehensive initial documentation
5. **For EXISTING files**: 
   - Read current content first
   - Preserve user customizations and comments
   - Update only factual/technical information
   - Maintain existing structure and style
6. **Use clear markdown formatting** with proper headers and sections
7. **Include concrete examples** where helpful for understanding
8. **Focus on facts over assumptions** - document what exists
9. **Follow spec-driven development principles**

## Important Principles

### Security Guidelines
- **Never include sensitive data**: No API keys, passwords, database credentials, or personal information
- **Review before commit**: Always review steering content before version control
- **Team sharing consideration**: Remember steering files are shared with all project collaborators

### Content Quality Guidelines  
- **Single domain focus**: Each steering file should cover one specific area
- **Clear, descriptive content**: Provide concrete examples and rationale for decisions
- **Regular maintenance**: Review and update steering files after major project changes
- **Actionable guidance**: Write specific, implementable guidelines rather than abstract principles

### Preservation Strategy
- **User sections**: Any section not in the standard template should be preserved
- **Custom examples**: User-added examples should be maintained
- **Comments**: Inline comments or notes should be kept
- **Formatting preferences**: Respect existing markdown style choices

### Update Philosophy
- **Additive by default**: Add new information rather than replacing
- **Mark deprecation**: Use strikethrough or [DEPRECATED] tags
- **Date significant changes**: Add update timestamps for major changes
- **Explain changes**: Brief notes on why something was updated

The goal is to maintain living documentation that stays current while respecting user customizations, supporting effective spec-driven development without requiring users to worry about losing their work.
ultrathink