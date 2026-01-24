# Introduction

The Agent Validator Protocol (AVP) defines how AI coding agents validate their own output through automated quality checks.

## The Problem

AI coding agents make mistakes. They introduce security vulnerabilities, miss edge cases, forget documentation, and occasionally write code that doesn't follow your project's conventions. The more autonomy you give an agent, the more important it becomes to verify its work.

AVP lets you constantly review the work of an agent. Every time your coding agent modifies a file, validators automatically check the changes against your quality standards — catching hardcoded secrets, enforcing complexity limits, ensuring tests exist, and more.

## Why Not Just Hooks?

Agent hook systems like Claude Code's `PostToolUse` already let you run scripts after tool calls. So why AVP?

**Pluggable rules.** With raw hooks, you maintain one monolithic script that handles all your checks. Adding a new rule means editing that script. Removing one means careful surgery. With AVP, each rule is a separate `VALIDATOR.md` file. Drop one in to enable it, delete it to disable. No code changes required.

**Parallel execution.** A single hook script runs checks sequentially. AVP validators run in parallel — your security checks, complexity analysis, and documentation validation all execute simultaneously. For agents making frequent edits, this dramatically reduces validation overhead.

**Portable rules.** VALIDATOR.md files are self-contained. Share them across projects, publish them for others, or pull in community validators. The standardized format means any AVP-compatible agent can run them.

## What is AVP?

AVP is a specification for validators — automated checks that run when an AI agent modifies code. Each validator is defined in a `VALIDATOR.md` file containing:

- **YAML frontmatter** with trigger conditions and severity
- **Markdown prompt** that instructs a sub-agent what to check

When the agent makes changes, validators run and return a standardized JSON response indicating pass, warn, or error with details about any violations.

## Example Validator

```yaml
---
name: no-secrets
severity: error
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*"]
---

# No Secrets Validator

Check for hardcoded secrets in the modified code.

## Rules

1. API keys (patterns: sk-, api_key=, apiKey:)
2. Passwords (password=, passwd, pwd)
3. AWS credentials
4. Private keys (-----BEGIN.*PRIVATE KEY-----)

## Response

Return JSON with decision, reason, passed, violations, and summary.
```

## How It Works

The validation flow integrates with agent hook systems:

1. **Agent modifies code** — The AI agent uses Write, Edit, or similar tools to change files
2. **Hook fires** — The agent's hook system (e.g., `PostToolUse`) triggers after the tool completes
3. **Validators match** — Each validator checks if its trigger conditions match (tool type, file patterns)
4. **Sub-agent validates** — Matching validators spawn a sub-agent with the VALIDATOR.md prompt to check the changes
5. **Response returned** — Validators return JSON with status and violation details

## Severity Levels

Each validator specifies a severity that determines behavior on violation:

| Severity | Behavior |
|----------|----------|
| `info` | Log the result, continue execution |
| `warn` | Notify user, continue execution |
| `error` | Agent must fix violations before continuing |

## Multiple Validators

AVP is designed for projects to use many validators simultaneously. Validators are discovered from a directory and run in parallel.

### Directory Organization

```
.validators/
├── no-secrets.md           # Simple single-file validator
├── no-console.md
├── require-tests.md
├── sql-injection/          # Complex validator with supporting files
│   ├── VALIDATOR.md
│   └── references/
│       └── patterns.md
└── custom-rules/           # Subdirectories for organization
    ├── team-conventions.md
    └── api-standards.md
```

Validators can be:
- **Single files**: `name.md` in the validators directory
- **Directories**: `name/VALIDATOR.md` with optional `scripts/`, `references/`, `assets/`
- **Nested**: Organized in subdirectories by team, category, or concern

### Discovery

An AVP-compatible agent scans the validators directory and loads all valid VALIDATOR.md files. Each validator's `name` must be unique across the entire set.

### Parallel Execution

When a hook event fires, all matching validators run concurrently:

```
PostToolUse (Write to src/api.ts)
    ├── no-secrets       ─┐
    ├── no-console        ├── Run in parallel
    ├── sql-injection     │
    └── api-standards    ─┘
```

This parallel execution is a key advantage over monolithic hook scripts.

### Result Aggregation

Results from all validators are collected and the most severe outcome determines the overall result:

| Validator Results | Overall Outcome |
|-------------------|-----------------|
| All pass | **PASSED** — continue normally |
| Some warn, none error | **WARNED** — log warnings, continue |
| Any error | **ERROR** — agent must fix before continuing |

When multiple validators return errors, all violations are aggregated and presented to the agent together.

### Filtering

Use `tags` to run subsets of validators:

```yaml
# Run only security validators
tags: [security]

# Run validators with specific tags
tags: [blocking, pre-commit]
```

This enables workflows like:
- **Fast feedback**: Run only `error` severity validators during development
- **Pre-commit**: Run all `blocking` tagged validators before committing
- **Full audit**: Run all validators including `info` severity for comprehensive reports
