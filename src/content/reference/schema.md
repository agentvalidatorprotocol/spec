# VALIDATOR.md Schema

The VALIDATOR.md file format defines a validator using YAML frontmatter and Markdown content.

## File Structure

```markdown
---
name: validator-name
severity: error | warn | info
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx"]
---

# Validator Title

Description and instructions for the validation sub-agent.

## Rules

List of specific rules to check.

## Response

Instructions for formatting the JSON response.
```

## Frontmatter Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier for the validator (kebab-case) |
| `severity` | string | One of: `info`, `warn`, `error` |
| `trigger` | string | Hook event name (e.g., `PostToolUse`) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `match` | object | Conditions for when to run |
| `match.tools` | string[] | Tool names to match |
| `match.files` | string[] | Glob patterns for files |
| `description` | string | Human-readable description |
| `category` | string | Grouping category (e.g., `security`) |

## Trigger Values

The `trigger` field accepts hook event names:

- `PreToolUse` - Before tool execution
- `PostToolUse` - After successful tool execution
- `PostToolUseFailure` - After tool failure
- `UserPromptSubmit` - When user submits prompt
- `Stop` - When agent finishes responding
- `SubagentStop` - When subagent completes
- `SessionStart` - Session begins
- `SessionEnd` - Session ends
- `PreCompact` - Before context compaction
- `Setup` - During setup/maintenance
- `Notification` - On notifications
- `PermissionRequest` - On permission dialogs

## Match Patterns

### Tool Matching

```yaml
match:
  tools: [Write, Edit, MultiEdit]
```

Accepts tool names or regex patterns.

### File Matching

```yaml
match:
  files: ["*.ts", "*.tsx", "src/**/*.js"]
```

Supports glob patterns for filtering by file path.

## Markdown Content

The markdown section after the frontmatter provides instructions to the validation sub-agent. It should include:

1. **Title** - Clear name for the validator
2. **Description** - What the validator checks
3. **Rules** - Specific conditions to evaluate
4. **Response format** - How to structure the JSON output

### Example Content

```markdown
# No Console Statements

Check for console.log and other console methods in production code.

## Rules

Flag any use of:
- console.log()
- console.warn()
- console.error()
- console.debug()

Exception: Files in `__tests__` or `*.test.ts` directories.

## Response

Return JSON with hook control and validation details:
- decision: "block" if severity is error, omit otherwise
- reason: explanation for the agent
- passed: false if violations found
- violations: array with file, line, snippet, and suggestion
- summary: human-readable count
```

## Complete Example

```yaml
---
name: no-console
severity: warn
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx", "*.js", "*.jsx"]
description: Detects console statements in production code
category: quality
---

# No Console Statements

Check for console.log and other console methods that should not
be committed to production code.

## Rules

1. Flag `console.log()` calls
2. Flag `console.warn()` calls
3. Flag `console.error()` calls
4. Flag `console.debug()` calls

**Exceptions:**
- Test files (`*.test.ts`, `*.spec.ts`)
- Files in `__tests__` directories

## Response Format

Since this validator has `severity: warn`, it does not block:

{
  "passed": false,
  "reason": "Code quality: 1 console statement should be removed",
  "violations": [
    {
      "rule": "no-console",
      "file": "src/utils.ts",
      "line": 42,
      "snippet": "console.log('debug')",
      "suggestion": "Remove console statement or use a logger"
    }
  ],
  "summary": "1 console statement found"
}

If this were `severity: error`, the response would include `"decision": "block"` to stop the agent.
```
