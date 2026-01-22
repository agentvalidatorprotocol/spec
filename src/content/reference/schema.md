# VALIDATOR.md Schema

The VALIDATOR.md file format defines a validator using YAML frontmatter and Markdown content. The format is designed to be compatible with [Claude Code hooks](https://code.claude.com/docs/en/hooks) and follows conventions from [Agent Skills](https://agentskills.io/specification).

## Directory Structure

A validator can be a single file or a directory:

```
# Simple: single file
validators/
└── no-secrets.md

# Complex: directory with supporting files
validators/
└── no-secrets/
    ├── VALIDATOR.md       # Required
    ├── scripts/           # Optional: executable scripts
    │   └── scan-secrets.py
    ├── references/        # Optional: additional docs
    │   └── secret-patterns.md
    └── assets/            # Optional: templates, data
        └── patterns.json
```

## File Format

```markdown
---
name: validator-name
description: What this validator checks and when to use it.
severity: error | warn | info
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx"]
category: security
tags:
  - keyword1
  - keyword2
---

# Validator Title

Instructions for the validation sub-agent.

## Rules

Specific conditions to evaluate.

## Response

How to format the JSON output.
```

## Frontmatter Fields

### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | string | 1-64 chars, kebab-case | Unique identifier for the validator |
| `description` | string | 1-1024 chars | What this validator checks and when to use it |
| `severity` | string | `info`, `warn`, `error` | Determines blocking behavior |
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

#### severity

Determines behavior when violations are found:

| Value | Behavior |
|-------|----------|
| `info` | Log result, continue execution |
| `warn` | Notify user, continue execution |
| `error` | Block until violations are fixed |

#### trigger

The hook event that activates this validator. See [Triggers Reference](/validators/triggers) for full list.

Common triggers:
- `PostToolUse` - After successful tool execution (most common)
- `PreToolUse` - Before tool execution
- `Stop` - When agent finishes responding
- `UserPromptSubmit` - When user submits prompt

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `match` | object | Conditions for when to run |
| `match.tools` | string[] | Tool names or regex patterns |
| `match.files` | string[] | Glob patterns for files |
| `triggerMatcher` | string | Matcher for lifecycle triggers |
| `category` | string | Grouping category (e.g., `security`, `quality`) |
| `tags` | string[] | Keywords for discovery and filtering |
| `once` | boolean | Run only once per session (default: false) |
| `timeout` | number | Execution timeout in seconds (default: 60) |
| `license` | string | License name or reference |
| `compatibility` | string | Environment requirements |
| `metadata` | object | Arbitrary key-value pairs |

#### match

Filters which tool calls trigger the validator:

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

# Combine both
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

#### category

Groups validators for organization and filtering:

```yaml
category: security
```

Common categories: `security`, `quality`, `style`, `documentation`, `testing`

#### tags

Keywords for discovery and filtering. Unlike `category` (single value), tags allow multiple labels:

```yaml
tags:
  - security
  - secrets
  - credentials
  - api-keys
```

Tags help with:
- **Discovery**: Finding validators by keyword search
- **Filtering**: Running subsets of validators (e.g., all `security` tagged)
- **Organization**: Grouping related validators across categories

Recommended tag conventions:
- Use lowercase, hyphenated names
- Include the problem domain (`sql-injection`, `xss`, `secrets`)
- Include the solution type (`blocking`, `warning`, `audit`)
- Include language/framework when specific (`typescript`, `react`, `node`)

#### compatibility

Describes environment requirements:

```yaml
compatibility: Requires Node.js 18+ and npm
```

#### metadata

Arbitrary key-value pairs for additional information:

```yaml
metadata:
  author: your-org
  version: "1.0"
  source: https://github.com/your-org/validators
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
4. **Response format** - How to structure the JSON output

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

## Response Format

Return JSON with decision, passed, violations, and summary.
```

## Complete Examples

### Simple Validator

```yaml
---
name: no-console
description: Detects console.log statements that should not be committed to production code. Apply to all JavaScript and TypeScript file modifications.
severity: warn
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx", "*.js", "*.jsx"]
category: quality
tags:
  - console
  - logging
  - cleanup
  - javascript
  - typescript
---

# No Console Statements

Check for console methods that should be removed before production.

## Rules

1. Flag `console.log()` calls
2. Flag `console.warn()` calls
3. Flag `console.error()` calls
4. Flag `console.debug()` calls

**Exceptions:**
- Test files (`*.test.ts`, `*.spec.ts`)
- Files in `__tests__` directories

## Response Format

{
  "passed": false,
  "reason": "1 console statement should be removed",
  "violations": [{
    "rule": "no-console",
    "file": "src/utils.ts",
    "line": 42,
    "snippet": "console.log('debug')",
    "suggestion": "Remove or use a proper logger"
  }],
  "summary": "1 console statement found"
}
```

### Blocking Validator

```yaml
---
name: no-secrets
description: Blocks commits containing hardcoded secrets like API keys, passwords, and tokens. Critical security validator for all file modifications.
severity: error
trigger: PostToolUse
match:
  tools: [Write, Edit]
category: security
tags:
  - secrets
  - credentials
  - api-keys
  - passwords
  - blocking
metadata:
  author: security-team
  version: "2.0"
---

# No Secrets Validator

Scan for hardcoded credentials that must never be committed.

## Rules

1. API keys (sk-*, api_key=, apiKey:)
2. Passwords (password=, passwd=, pwd=)
3. AWS credentials (AKIA*, aws_secret)
4. Private keys (-----BEGIN.*PRIVATE KEY-----)
5. JWT tokens (eyJ...)
6. Database connection strings with credentials

## Response Format

Since this is severity: error, include "decision": "block":

{
  "decision": "block",
  "reason": "Security: hardcoded API key in src/config.ts:12",
  "passed": false,
  "violations": [{
    "rule": "no-secrets",
    "file": "src/config.ts",
    "line": 12,
    "snippet": "const API_KEY = \"sk-...\"",
    "suggestion": "Use process.env.API_KEY"
  }],
  "summary": "1 hardcoded secret detected"
}
```

### PreToolUse Validator

```yaml
---
name: safe-commands
description: Validates bash commands before execution to prevent destructive operations. Blocks rm -rf, format, and other dangerous commands.
severity: error
trigger: PreToolUse
match:
  tools: [Bash]
category: security
tags:
  - bash
  - commands
  - destructive
  - blocking
  - pre-execution
---

# Safe Commands Validator

Check bash commands before execution.

## Rules

Block these patterns:
1. `rm -rf /` or `rm -rf ~`
2. `mkfs` or `format`
3. `dd if=` writing to devices
4. `chmod -R 777`
5. `curl | bash` (piped execution)

## Response Format

Use PreToolUse decision control:

{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked: rm -rf with dangerous path"
  },
  "passed": false,
  "violations": [{
    "rule": "safe-commands",
    "file": "",
    "line": 0,
    "snippet": "rm -rf /",
    "suggestion": "Use specific paths, not root"
  }],
  "summary": "Dangerous command blocked"
}
```

### Stop Validator

```yaml
---
name: tests-must-pass
description: Ensures all tests pass before the agent stops working. Forces the agent to continue if tests are failing.
severity: error
trigger: Stop
category: testing
tags:
  - tests
  - ci
  - blocking
  - stop-hook
---

# Tests Must Pass

Verify tests pass before allowing the agent to stop.

## Rules

1. Check if any test files were modified
2. Run the test suite
3. Block if tests are failing

## Response Format

Use Stop decision control to force continuation:

{
  "decision": "block",
  "reason": "Tests failing: 3 tests in src/utils.test.ts. Run npm test and fix before stopping.",
  "passed": false,
  "violations": [{
    "rule": "tests-must-pass",
    "file": "src/utils.test.ts",
    "line": 45,
    "snippet": "expect(result).toBe(true)",
    "suggestion": "Fix the failing assertion"
  }],
  "summary": "3 tests failing"
}
```
