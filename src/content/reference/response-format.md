# Response Format

Validators return a JSON response compatible with [Claude Code hooks](https://code.claude.com/docs/en/hooks#hook-output). The response controls whether the agent can proceed and provides details about any violations found.

## Response Structure

The response format has two parts:

1. **Hook control** - Trigger-specific fields that control agent behavior
2. **Validation details** - Standardized fields for reporting violations

```typescript
{
  // Hook control (trigger-specific)
  "decision": "block" | "allow" | "deny" | "ask" | undefined,
  "reason": string,

  // Hook-specific output (optional)
  "hookSpecificOutput": {
    "hookEventName": string,
    "additionalContext": string,
    "permissionDecision": string,
    "permissionDecisionReason": string,
    "updatedInput": object
  },

  // Validation details
  "passed": boolean,
  "violations": Violation[],
  "summary": string
}
```

## Trigger-Specific Decision Control

Different triggers support different decision controls. Your validator should output the appropriate fields based on its trigger type.

### PreToolUse

Controls whether a tool call proceeds.

| Field | Values | Effect |
|-------|--------|--------|
| `hookSpecificOutput.permissionDecision` | `"allow"` | Bypasses permission system, tool executes |
| | `"deny"` | Blocks tool call, reason shown to agent |
| | `"ask"` | Shows confirmation to user |
| `hookSpecificOutput.permissionDecisionReason` | string | Explanation (shown to agent on deny) |
| `hookSpecificOutput.updatedInput` | object | Modifies tool input before execution |
| `hookSpecificOutput.additionalContext` | string | Context added before tool executes |

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Command contains rm -rf, which is blocked by security policy"
  },
  "passed": false,
  "violations": [{
    "rule": "no-destructive-commands",
    "file": "",
    "line": 0,
    "snippet": "rm -rf /",
    "suggestion": "Use safer deletion methods"
  }],
  "summary": "Blocked dangerous command"
}
```

### PermissionRequest

Controls permission dialogs shown to the user.

| Field | Values | Effect |
|-------|--------|--------|
| `hookSpecificOutput.decision.behavior` | `"allow"` | Auto-approves permission |
| | `"deny"` | Denies permission |
| `hookSpecificOutput.decision.updatedInput` | object | Modifies input (with allow) |
| `hookSpecificOutput.decision.message` | string | Message shown on deny |
| `hookSpecificOutput.decision.interrupt` | boolean | Stop agent on deny |

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "command": "npm run lint"
      }
    }
  },
  "passed": true,
  "violations": [],
  "summary": "Auto-approved lint command"
}
```

### PostToolUse

Provides feedback after tool execution.

| Field | Values | Effect |
|-------|--------|--------|
| `decision` | `"block"` | Prompts agent with reason to fix issues |
| | undefined | Continues normally |
| `reason` | string | Explanation shown to agent |
| `hookSpecificOutput.additionalContext` | string | Context for agent to consider |

```json
{
  "decision": "block",
  "reason": "Security violation: hardcoded API key detected in src/config.ts:12",
  "passed": false,
  "violations": [{
    "rule": "no-secrets",
    "file": "src/config.ts",
    "line": 12,
    "snippet": "const API_KEY = \"sk-12345...\"",
    "suggestion": "Use process.env.API_KEY"
  }],
  "summary": "1 security violation found"
}
```

### UserPromptSubmit

Controls prompt processing and adds context.

| Field | Values | Effect |
|-------|--------|--------|
| `decision` | `"block"` | Prevents prompt processing, erases prompt |
| | undefined | Allows prompt to proceed |
| `reason` | string | Shown to user (not in context) |
| `hookSpecificOutput.additionalContext` | string | Added to conversation context |

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Current branch: main. Last commit: Fix auth bug."
  },
  "passed": true,
  "violations": [],
  "summary": "Added git context"
}
```

### Stop / SubagentStop

Controls whether agent must continue working.

| Field | Values | Effect |
|-------|--------|--------|
| `decision` | `"block"` | Forces agent to continue |
| | undefined | Allows agent to stop |
| `reason` | string | Required when blocking - tells agent what to do |

```json
{
  "decision": "block",
  "reason": "Tests are failing. Run `npm test` and fix the 3 failing tests before stopping.",
  "passed": false,
  "violations": [{
    "rule": "tests-must-pass",
    "file": "src/utils.test.ts",
    "line": 45,
    "snippet": "expect(result).toBe(true)",
    "suggestion": "Fix the assertion or the implementation"
  }],
  "summary": "3 tests failing"
}
```

### SessionStart / Setup

Adds context to the session.

| Field | Values | Effect |
|-------|--------|--------|
| `hookSpecificOutput.additionalContext` | string | Added to agent context |

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Project uses TypeScript strict mode. Prefer functional patterns."
  },
  "passed": true,
  "violations": [],
  "summary": "Loaded project context"
}
```

## Validation Fields

These fields are consistent across all triggers:

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

The validator's severity level determines the default response behavior:

### Error Severity
Blocks the agent until violations are fixed:

```json
{
  "decision": "block",
  "reason": "Security violation: hardcoded API key detected",
  "passed": false,
  "violations": [...],
  "summary": "1 security violation found"
}
```

### Warning Severity
Notifies but allows continuation:

```json
{
  "passed": false,
  "violations": [...],
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
  "summary": "Documentation coverage: 85%"
}
```

## Exit Codes

When running as a hook script, use exit codes alongside the JSON response:

| Exit Code | Meaning |
|-----------|---------|
| `0` | Success - JSON response is processed |
| `2` | Blocking error - only stderr is shown, JSON ignored |
| Other | Non-blocking error - continues execution |

## Common JSON Fields

These optional fields work with any trigger:

| Field | Type | Description |
|-------|------|-------------|
| `continue` | boolean | If false, stops agent after hook (default: true) |
| `stopReason` | string | Message shown when continue is false |
| `suppressOutput` | boolean | Hide stdout from transcript (default: false) |
| `systemMessage` | string | Warning message shown to user |

## Complete Example: PostToolUse Validator

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
