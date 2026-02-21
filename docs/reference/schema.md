---
sidebar_position: 1
title: VALIDATOR.md Schema
---

# VALIDATOR.md Schema

**AVP 1.0**

The VALIDATOR.md file format defines validators using YAML frontmatter and Markdown content. Validators can be:
- **Single rules**: One validation check per file
- **RuleSets**: Logical groupings of related rules in a folder structure

The format is designed to be compatible with [Claude Code hooks](https://code.claude.com/docs/en/hooks) and follows conventions from [Agent Skills](https://agentskills.io/specification).

## Directory Structure

Validators are discovered from two locations:

1. **Project validators**: `.avp/validators/` in the project root
2. **User validators**: `~/.avp/validators/` in the user's home directory

If the same validator name exists in both locations, the project validator takes precedence.

### Validator Structure

All validators are **RuleSets** — directories containing a VALIDATOR.md file and one or more rule files:

```
.avp/validators/
├── security-rules/
│   ├── VALIDATOR.md       # Required: RuleSet metadata
│   ├── README.md          # Optional: detailed documentation
│   ├── favicon.png        # Optional: icon (16x16, 32x32, or 64x64)
│   ├── rules/             # Required: individual rule files
│   │   ├── no-secrets.md
│   │   ├── no-sql-injection.md
│   │   ├── no-xss.md
│   │   ├── injection/     # Subdirectories for organization
│   │   │   ├── command-injection.md
│   │   │   └── path-traversal.md
│   │   └── crypto/
│   │       ├── weak-crypto.md
│   │       └── insecure-random.md
│   ├── scripts/           # Optional: shared scripts
│   │   └── detect.py
│   ├── references/        # Optional: additional docs
│   │   └── owasp-guidelines.md
│   └── assets/            # Optional: templates, data
│       └── patterns.json
└── code-quality/
    ├── VALIDATOR.md
    ├── README.md
    ├── rules/
    │   ├── no-console.md
    │   ├── require-tests.md
    │   └── complexity/
    │       └── cyclomatic-complexity.md
    └── scripts/
        └── check-coverage.sh
```

**Required files**:
- `VALIDATOR.md` — RuleSet metadata and configuration (for agents)
- `rules/*.md` — At least one rule file

**Optional files**:
- `README.md` — User-facing documentation (installation, usage, configuration)
- `favicon.png` — Visual icon for decoration
- `scripts/` — Executable helper scripts
- `references/` — Additional reference documentation
- `assets/` — Templates, patterns, or data files

**File purposes**:
- **VALIDATOR.md** — Loaded by agents, contains metadata and prompt instructions
- **README.md** — For humans browsing directories, explains how to use the RuleSet

See [RuleSets](../core-concepts/rulesets) for detailed information about organizing rules.

## VALIDATOR.md Format (RuleSet Level)

The VALIDATOR.md file defines metadata and common settings for a RuleSet:

```yaml
---
name: validator-name
description: What this RuleSet validates.
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx"]
tags:
  - security
  - keyword1
favicon: favicon.png
metadata:
  version: "1.0.0"
---

# Validator Title

Overview of the RuleSet and its purpose.

All rules are discovered automatically from the `rules/` directory.
```

## Rule File Format (Individual Rule)

Each rule file in `rules/` contains its own validation logic:

```yaml
---
name: rule-name
description: What this specific rule checks.
severity: error | warn | info
match:
  files: ["*.ts"]
---

# Rule Title

Detailed instructions for the validation sub-agent.

## Conditions

Specific patterns and conditions to evaluate.
```

## VALIDATOR.md Frontmatter (RuleSet Level)

### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | string | 1-64 chars, kebab-case | Unique identifier for the validator |
| `description` | string | 1-1024 chars | What this RuleSet validates |
| `trigger` | string | Hook event name | When the validator runs |

#### name

The `name` field follows [Agent Skills naming conventions](https://agentskills.io/specification#name-field):
- Must be 1-64 characters
- Lowercase letters, numbers, and hyphens only (`a-z`, `0-9`, `-`)
- Must not start or end with a hyphen
- Must not contain consecutive hyphens (`--`)
- Must match the directory name if using directory structure

Valid examples:
```yaml
name: no-secrets
name: function-complexity
name: require-tests
```

Invalid examples:
```yaml
name: No-Secrets      # uppercase not allowed
name: -no-secrets     # cannot start with hyphen
name: no--secrets     # consecutive hyphens not allowed
```

#### description

The `description` field helps agents decide when to apply the validator:
- Must be 1-1024 characters
- Should describe what the validator checks AND when to use it
- Include keywords that help with discovery

Good example:
```yaml
description: Detects hardcoded secrets like API keys, passwords, and tokens in source code. Use for all file modifications to prevent credential leaks.
```

Poor example:
```yaml
description: Checks for secrets.
```

#### trigger

The hook event that activates this validator. See [Triggers Reference](../core-concepts/triggers) for full list.

### Rule Discovery

Rules are discovered automatically by convention. All `.md` files in the `rules/` directory and its subdirectories are loaded as rules.

```
validator-name/
├── VALIDATOR.md       # Overall metadata
└── rules/
    ├── rule-one.md    # Automatically discovered
    ├── rule-two.md    # Automatically discovered
    ├── security/      # Subdirectories allowed
    │   ├── no-secrets.md
    │   └── no-xss.md
    └── quality/
        └── no-console.md
```

**Discovery rules**:
- All files with `.md` extension in `rules/` and subdirectories are loaded
- Subdirectories can be used for organization (e.g., `security/`, `quality/`)
- Each rule must have valid YAML frontmatter
- Rule names must be unique within the RuleSet
- Rules are executed in **lexicographical order** by file path

**Execution order example**:
```
rules/
├── 01-secrets.md           # Runs 1st
├── 02-sql-injection.md     # Runs 2nd
├── security/
│   ├── crypto.md           # Runs 3rd (rules/security/crypto.md)
│   └── xss.md              # Runs 4th (rules/security/xss.md)
└── zzz-final-check.md      # Runs last
```

Use filename prefixes (01-, 02-, etc.) if order matters.

Common triggers:
- `PostToolUse` - After successful tool execution (most common)
- `PreToolUse` - Before tool execution
- `Stop` - When agent finishes responding
- `UserPromptSubmit` - When user submits prompt

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `match` | object | Default conditions for when to run (inherited by rules) |
| `match.tools` | string[] | Tool names or regex patterns |
| `match.files` | string[] | Glob patterns for files |
| `triggerMatcher` | string | Matcher for lifecycle triggers |
| `tags` | string[] | Keywords for organization and discovery |
| `favicon` | string | Path to icon file (e.g., `favicon.png`) |
| `once` | boolean | Run only once per session (default: false) |
| `timeout` | number | Execution timeout in seconds (default: 60) |
| `license` | string | License name or reference |
| `compatibility` | string | Environment requirements |
| `metadata` | object | Arbitrary key-value pairs |

#### match

Filters which tool calls trigger the validator.

**Matching rules**:
- When both `tools` and `files` are specified, **both must match** (AND logic)
- File patterns are matched against the **full path** (e.g., `*.ts` matches `src/utils/helper.ts`)
- If the tool doesn't operate on a file (e.g., `Bash`), the `files` matcher is ignored and only `tools` is checked

```yaml
# Match specific tools
match:
  tools: [Write, Edit, MultiEdit]

# Match with regex
match:
  tools: ["Write|Edit"]

# Match specific file patterns
match:
  files: ["*.ts", "*.tsx", "src/**/*.js"]

# Combine both (AND logic: tool must match AND file must match)
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx"]
```

**MCP Tools**: Use the pattern `mcp__<server>__<tool>`:
```yaml
match:
  tools: ["mcp__memory__.*"]  # All memory server tools
```

#### triggerMatcher

For lifecycle triggers, filter by specific conditions:

```yaml
# Only run on fresh starts, not resumes
trigger: SessionStart
triggerMatcher: startup

# Only run on manual compaction
trigger: PreCompact
triggerMatcher: manual

# Only run on permission prompts
trigger: Notification
triggerMatcher: permission_prompt
```

Available matchers by trigger:

| Trigger | Matchers |
|---------|----------|
| `SessionStart` | `startup`, `resume`, `clear`, `compact` |
| `SessionEnd` | `clear`, `logout`, `prompt_input_exit`, `other` |
| `Setup` | `init`, `maintenance` |
| `PreCompact` | `manual`, `auto` |
| `Notification` | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` |

#### once

When `true`, the validator runs only once per session. After the first successful execution, it's skipped for the remainder of the session.

```yaml
once: true  # Only validate once
```

Useful for session setup validators that don't need to run repeatedly.

#### timeout

Maximum execution time in seconds (default: 60):

```yaml
timeout: 30  # 30 second timeout
```

#### tags

Keywords for organization and discovery:

```yaml
tags:
  - security
  - secrets
  - credentials
  - api-keys
```

Tags help with:
- **Organization**: Group validators by domain (e.g., `security`, `quality`, `docs`)
- **Discovery**: Find validators by keyword search

Recommended tag conventions:
- Use lowercase, hyphenated names
- Include the primary domain as the first tag (`security`, `quality`, `testing`, `docs`)
- Include the problem domain (`sql-injection`, `xss`, `secrets`)
- Include language/framework when specific (`typescript`, `react`, `node`)

#### favicon

Optional path to an icon file for visual identification in UIs:

```yaml
favicon: favicon.png
favicon: assets/icon.svg
```

**Recommendations**:
- **Format**: PNG or SVG
- **Size**: 16x16, 32x32, or 64x64 pixels (or larger for high-DPI displays)
- **Location**: Validator root directory or `assets/` subdirectory
- **File size**: Keep under 10KB for fast loading
- **Design**: Use clear, recognizable iconography that represents the RuleSet's purpose

The favicon appears in:
- Validator selection UIs
- Documentation and catalogs
- IDE integrations
- Dashboard displays

#### compatibility

Describes environment requirements:

```yaml
compatibility: Requires Node.js 18+ and npm
```

#### metadata

Arbitrary key-value pairs for additional information, following the [Agent Skills metadata convention](https://agentskills.io/specification#metadata-field). Use this field for properties not defined by the AVP spec, including versioning:

```yaml
metadata:
  author: your-org
  version: "1.0.0"
  source: https://github.com/your-org/validators
```

We recommend [Semantic Versioning](https://semver.org/) for the `version` key:
- **MAJOR**: Incompatible changes (e.g., removed rules, changed behavior)
- **MINOR**: Added functionality (e.g., new rules)
- **PATCH**: Bug fixes and improvements

## Rule File Frontmatter (Individual Rule Level)

Each rule file in the `rules/` directory has its own frontmatter defining specific validation behavior.

### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | string | 1-64 chars, kebab-case | Unique identifier for the rule |
| `description` | string | 1-1024 chars | What this rule checks |
| `severity` | string | `info`, `warn`, `error` | Determines blocking behavior |

#### name

Follows the same conventions as VALIDATOR.md names:
- Must be 1-64 characters
- Lowercase letters, numbers, and hyphens only
- Must not start or end with hyphen
- Must be unique within the RuleSet

```yaml
name: no-secrets
name: sql-injection-check
name: require-tests
```

#### description

Describes what this specific rule validates:

```yaml
description: Detects hardcoded API keys, passwords, and tokens in source code. Blocks commits containing credentials.
```

#### severity

Determines behavior when this rule finds violations:

| Value | Behavior |
|-------|----------|
| `info` | Log result, continue execution |
| `warn` | Notify user, continue execution |
| `error` | Block until violations are fixed |

Different rules in the same RuleSet can have different severities:

```yaml
# rules/no-secrets.md
severity: error      # Blocking

# rules/no-console.md
severity: warn       # Non-blocking
```

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `match` | object | Override parent match conditions |
| `match.files` | string[] | Glob patterns for files |
| `tags` | string[] | Additional tags beyond parent |
| `timeout` | number | Override parent timeout |

Rules inherit settings from the parent VALIDATOR.md but can override them:

```yaml
# Parent VALIDATOR.md
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx"]

# Rule can narrow the match
match:
  files: ["src/**/*.ts"]  # Only src directory
```

## Trigger Values

All supported triggers compatible with Claude Code hooks:

### Tool Execution
- `PreToolUse` - Before tool execution (supports matchers)
- `PostToolUse` - After successful tool execution (supports matchers)
- `PostToolUseFailure` - After tool failure (supports matchers)
- `PermissionRequest` - On permission dialogs (supports matchers)

### Prompt & Response
- `UserPromptSubmit` - When user submits prompt
- `Stop` - When main agent finishes
- `SubagentStart` - When spawning subagent
- `SubagentStop` - When subagent finishes

### Session Lifecycle
- `SessionStart` - Session begins (supports triggerMatcher)
- `SessionEnd` - Session ends (supports triggerMatcher)
- `Setup` - During setup/maintenance (supports triggerMatcher)
- `PreCompact` - Before compaction (supports triggerMatcher)

### Notifications
- `Notification` - On notifications (supports triggerMatcher)

## Markdown Content

The markdown section after frontmatter provides instructions to the validation sub-agent. Structure for efficient context usage:

### Recommended Sections

1. **Title** - Clear name for the validator
2. **Description** - What the validator checks
3. **Rules** - Specific conditions to evaluate

### Progressive Disclosure

For complex validators, keep the main file under 500 lines and use references:

```markdown
---
name: comprehensive-security
description: Full security audit for code changes
severity: error
trigger: PostToolUse
---

# Comprehensive Security Validator

See [references/security-rules.md](references/security-rules.md) for the complete rule set.

## Quick Reference

- No hardcoded secrets
- No SQL injection vulnerabilities
- No XSS vulnerabilities
```

## Complete Examples

### Security RuleSet

**VALIDATOR.md**:
```yaml
---
name: security-rules
description: Comprehensive security validation for code changes. Detects secrets, SQL injection, and XSS vulnerabilities.
trigger: PostToolUse
match:
  tools: [Write, Edit]
tags:
  - security
  - owasp
favicon: favicon.png
metadata:
  author: security-team
  version: "1.0.0"
  source: https://github.com/example/validators
---

# Security Rules

This RuleSet validates code changes against common security vulnerabilities.

Rules are automatically discovered from the `rules/` directory.
```

**rules/no-secrets.md**:
```yaml
---
name: no-secrets
description: Detects hardcoded secrets like API keys, passwords, and tokens.
severity: error
---

# No Secrets Rule

Scan for hardcoded credentials that must never be committed.

## Patterns

1. API keys: `sk-*`, `api_key=`, `apiKey:`
2. Passwords: `password=`, `passwd=`, `pwd=`
3. AWS credentials: `AKIA*`, `aws_secret`
4. Private keys: `-----BEGIN.*PRIVATE KEY-----`
5. JWT tokens: `eyJ...`
```

**rules/no-sql-injection.md**:
```yaml
---
name: no-sql-injection
description: Detects SQL injection vulnerabilities from string concatenation.
severity: error
match:
  files: ["**/*.ts", "**/*.js", "**/*.py"]
---

# SQL Injection Prevention

Check for unsafe SQL query construction.

## Patterns

1. String concatenation in SQL: `"SELECT * FROM " + table`
2. Template literals with user input: `\`SELECT * FROM \${table}\``
3. Unparameterized queries

## Safe Alternatives

Use parameterized queries or ORM query builders.
```

**rules/no-xss.md**:
```yaml
---
name: no-xss
description: Detects potential XSS vulnerabilities in frontend code.
severity: warn
match:
  files: ["**/*.tsx", "**/*.jsx", "**/*.html"]
---

# XSS Prevention

Check for unsafe HTML rendering patterns.

## Patterns

1. `dangerouslySetInnerHTML` without sanitization
2. Direct DOM manipulation with user input
3. Unsafe `eval()` or `Function()` calls
```

### Code Quality RuleSet

**VALIDATOR.md**:
```yaml
---
name: code-quality
description: Enforces code quality standards including console cleanup and test coverage.
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
tags:
  - quality
  - testing
metadata:
  version: "2.1.0"
---

# Code Quality Rules

Maintains code quality standards across the project.

Rules are automatically loaded from `rules/`.
```

**rules/no-console.md**:
```yaml
---
name: no-console
description: Detects console.log statements in production code.
severity: warn
---

# No Console Statements

Remove debug console calls before committing.

## Patterns

1. `console.log()`
2. `console.warn()`
3. `console.error()`
4. `console.debug()`

**Exceptions**: Test files and `__tests__` directories.
```

**rules/require-tests.md**:
```yaml
---
name: require-tests
description: Ensures new code includes corresponding test files.
severity: error
---

# Require Tests

New functionality must include tests.

## Rules

1. New files in `src/` should have corresponding test files
2. Modified files with exported functions should have test coverage
```
