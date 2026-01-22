# Validator Lifecycle

Validators work by spawning a sub-agent to review changes made by the primary agent. This automated review catches issues the agent might miss.

## Execution Flow

Validators follow a predictable lifecycle that integrates with the agent's hook system:

```mermaid
flowchart LR
    A[Agent Acts] --> B[Hook Event Fires]
    B --> C{Validators Match?}
    C -->|Yes| D[Sub-Agent Evaluates]
    C -->|No| E[Continue]
    D --> F{Violations?}
    F -->|None| G[PASSED]
    F -->|Info/Warn| H[WARNED]
    F -->|Error| I[ERROR]
    G --> E
    H --> E
    I --> J[Agent Must Fix]
    J --> A
```

## Detailed Steps

### 1. Agent Acts

Each turn of the AI agent is a chance to validate.

### 2. Hook Event Fires

After the tool completes, the agent fires the appropriate hook event. Most validators use `PostToolUse`, which fires after any tool succeeds.

### 3. Matching Validators Run

All validators in the validators directory are checked against the event. Each validator matches based on:

- **Trigger type**: Does the hook event match (e.g., `PostToolUse`, `Stop`)?
- **Tool matcher**: Does the tool match (e.g., Write, Edit)?
- **File patterns**: Does the file match (e.g., *.ts, *.jsx)?
- **Trigger matcher**: For lifecycle events, does the source match (e.g., `startup`)?

Multiple validators can match the same event. For example, a `Write` to `src/api.ts` might match:
- `no-secrets` (matches all Write/Edit)
- `no-console` (matches *.ts files)
- `api-standards` (matches src/api/** files)

### 4. Parallel Evaluation

All matching validators run concurrently, each spawning its own sub-agent:

```
Hook Event: PostToolUse (Write to src/api.ts)
     │
     ├──► no-secrets validator ──► Sub-agent 1 ──► Result 1
     │
     ├──► no-console validator ──► Sub-agent 2 ──► Result 2
     │
     └──► api-standards validator ──► Sub-agent 3 ──► Result 3
                                                        │
                                            ◄───────────┘
                                         Aggregate Results
```

Each sub-agent receives:
- The VALIDATOR.md prompt content
- Context about the tool call (file path, changes, etc.)
- Any hook-specific input data

### 5. Results Aggregated

Results from all validators are collected. The aggregation rules:

| Individual Results | Aggregated Outcome | Behavior |
|-------------------|-------------------|----------|
| All `passed: true` | **PASSED** | Continue normally |
| Any `passed: false` with `severity: warn` | **WARNED** | Log warnings, continue |
| Any `passed: false` with `severity: error` | **ERROR** | Block until fixed |

When multiple validators fail:
- All violations are combined into a single report
- The agent sees all issues at once, not one at a time
- This enables efficient batch fixing

Example aggregated response:
```json
{
  "outcome": "ERROR",
  "validators": [
    {
      "name": "no-secrets",
      "passed": false,
      "violations": [...]
    },
    {
      "name": "no-console",
      "passed": false,
      "violations": [...]
    }
  ],
  "totalViolations": 3,
  "summary": "2 validators failed with 3 total violations"
}
```

## Response Format

Validators return a standardized JSON response:

```json
{
  "passed": true | false,
  "violations": [
    {
      "rule": "rule-name",
      "file": "path/to/file.ts",
      "line": 42,
      "snippet": "problematic code",
      "suggestion": "how to fix it"
    }
  ],
  "summary": "Human-readable summary"
}
```

## Best Practices

- Keep validators focused - one concern per validator
- Use appropriate severity - don't block on style issues
- Provide actionable suggestions in violation messages
- Include line numbers and code snippets for context
- Keep estimated token usage low for faster execution
