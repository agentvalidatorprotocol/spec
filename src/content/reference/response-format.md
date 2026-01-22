# Response Format

Validators return a JSON response compatible with Claude Code hooks. The response controls whether the agent can proceed and provides details about any violations found.

## Response Schema

```typescript
{
  // Hook control (required)
  "decision": "block" | undefined,
  "reason": string,

  // Validation details (required)
  "passed": boolean,
  "violations": [
    {
      "rule": string,
      "file": string,
      "line": number,
      "snippet": string,
      "suggestion": string
    }
  ],

  // Optional context
  "summary": string
}
```

## Hook Control Fields

These fields integrate with Claude Code's hook system:

| Field | Type | Description |
|-------|------|-------------|
| `decision` | `"block"` or undefined | Set to `"block"` to prevent the agent from continuing |
| `reason` | string | Explanation shown to the agent when blocked |

When `decision` is `"block"`, Claude Code will automatically prompt the agent with the `reason` to fix the issues.

## Validation Fields

| Field | Type | Description |
|-------|------|-------------|
| `passed` | boolean | Whether validation passed without violations |
| `violations` | array | List of violations found (empty if passed) |
| `summary` | string | Human-readable summary of the result |

### Violation Object

| Field | Type | Description |
|-------|------|-------------|
| `rule` | string | Identifier of the rule that was violated |
| `file` | string | Path to the file containing the violation |
| `line` | number | Line number (1-indexed) |
| `snippet` | string | Code snippet showing the problem |
| `suggestion` | string | Recommended fix |

## Severity Mapping

The validator's severity level determines the response structure:

### Error Severity
Blocks the agent until violations are fixed:

```json
{
  "decision": "block",
  "reason": "Security violation: hardcoded API key detected in src/config.ts:12. Use environment variable instead.",
  "passed": false,
  "violations": [
    {
      "rule": "no-secrets",
      "file": "src/config.ts",
      "line": 12,
      "snippet": "const API_KEY = \"sk-12345...\"",
      "suggestion": "Use environment variable: process.env.API_KEY"
    }
  ],
  "summary": "1 security violation found"
}
```

### Warning Severity
Notifies but allows continuation:

```json
{
  "passed": false,
  "violations": [
    {
      "rule": "function-length",
      "file": "src/utils.ts",
      "line": 45,
      "snippet": "function processData() { ... }",
      "suggestion": "Consider breaking this 150-line function into smaller units"
    }
  ],
  "reason": "Code quality warning: function exceeds recommended length",
  "summary": "1 code quality warning"
}
```

### Info Severity
Logs information without interruption:

```json
{
  "passed": true,
  "violations": [],
  "summary": "Documentation coverage: 85% of public functions have JSDoc"
}
```

## Exit Codes

When running as a hook script, use exit codes alongside the JSON response:

| Exit Code | Meaning |
|-----------|---------|
| `0` | Success - JSON response is processed |
| `2` | Blocking error - only stderr is shown, JSON ignored |
| Other | Non-blocking error - continues execution |

## Example: Complete Validator Response

```json
{
  "decision": "block",
  "reason": "2 security violations must be fixed before continuing",
  "passed": false,
  "violations": [
    {
      "rule": "no-secrets",
      "file": "src/config.ts",
      "line": 12,
      "snippet": "const API_KEY = \"sk-12345...\"",
      "suggestion": "Use process.env.API_KEY"
    },
    {
      "rule": "no-secrets",
      "file": "src/db.ts",
      "line": 8,
      "snippet": "const DB_PASSWORD = \"hunter2\"",
      "suggestion": "Use process.env.DB_PASSWORD"
    }
  ],
  "summary": "2 hardcoded secrets detected"
}
```
