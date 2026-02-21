---
sidebar_position: 1
title: Introduction
---

# Introduction

The Agent Validator Protocol (AVP) defines how AI coding agents validate their own output using **prompts as validators**. Instead of writing shell scripts or custom code, you describe your quality checks in natural language — and a sub-agent interprets them. This document describes **AVP 1.0**.

## The Problem

AI coding agents make mistakes. They introduce security vulnerabilities, miss edge cases, forget documentation, and occasionally write code that doesn't follow your project's conventions. The more autonomy you give an agent, the more important it becomes to verify its work.

AVP lets you constantly review the work of an agent. Every time your coding agent modifies a file, validators automatically check the changes against your quality standards — catching hardcoded secrets, enforcing complexity limits, ensuring tests exist, and more.

## Why Not Just Hooks?

Agent hook systems like Claude Code's `PostToolUse` already let you run scripts after tool calls. So why AVP?

**Pluggable rules.** With raw hooks, you maintain one monolithic script that handles all your checks. Adding a new rule means editing that script. Removing one means careful surgery. With AVP, each rule is a separate `VALIDATOR.md` file. Drop one in to enable it, delete it to disable. No code changes required.

**Parallel execution.** A single hook script runs checks sequentially. AVP validators run in parallel — your security checks, complexity analysis, and documentation validation all execute simultaneously. For agents making frequent edits, this dramatically reduces validation overhead.

**Portable rules.** VALIDATOR.md files are self-contained. Share them across projects, publish them for others, or pull in community validators. The standardized format means any AVP-compatible agent can run them.

**Prompts, not scripts.** Traditional validation means writing shell scripts, regex patterns, or custom tooling. AVP validators are natural language prompts interpreted by a sub-agent. Describe what you want to check in plain English — the LLM handles the pattern matching, context understanding, and edge cases that would require extensive code in a script-based approach.

## What is AVP?

AVP is a specification for **prompt-based validators** — quality checks written in natural language rather than code. Instead of writing shell scripts or custom tooling, you write prompts describing what to check. A sub-agent interprets your prompts and validates the code.

Validators are organized as **RuleSets** — logical groupings of related rules in a folder structure. Each RuleSet contains:

- **VALIDATOR.md** — Metadata, versioning, and common configuration
- **rules/** directory — Individual rule files, each with its own validation logic and severity
- **Optional files** — README.md, favicon.png, scripts/, references/, assets/

This means anyone who can write a clear prompt can create validators. No scripting required. Your validation rules are as flexible as natural language — check for security patterns, enforce architectural boundaries, verify documentation quality, or anything else you can describe.

## Example RuleSet

**Directory structure**:
```
.avp/validators/security-rules/
├── VALIDATOR.md
├── README.md
└── rules/
    ├── no-secrets.md
    ├── no-sql-injection.md
    └── no-xss.md
```

**VALIDATOR.md**:
```yaml
---
name: security-rules
description: Comprehensive security validation for code changes
trigger: PostToolUse
match:
  tools: [Write, Edit]
tags:
  - security
metadata:
  version: "1.0.0"
---

# Security Rules

Validates code changes against common security vulnerabilities.

Rules are automatically discovered from the `rules/` directory.
```

**rules/no-secrets.md**:
```yaml
---
name: no-secrets
description: Detects hardcoded secrets like API keys and passwords
severity: error
---

# No Secrets Rule

Check for hardcoded secrets in the modified code.

## Patterns

1. API keys (sk-, api_key=, apiKey:)
2. Passwords (password=, passwd, pwd)
3. AWS credentials
4. Private keys (-----BEGIN.*PRIVATE KEY-----)
```

## How It Works

The validation flow integrates with agent hook systems:

1. **Agent modifies code** — The AI agent uses Write, Edit, or similar tools to change files
2. **Hook fires** — The agent's hook system (e.g., `PostToolUse`) triggers after the tool completes
3. **Validators match** — Each validator checks if its trigger conditions match (tool type, file patterns)
4. **Sub-agent validates** — Matching validators spawn a sub-agent with the VALIDATOR.md prompt to check the changes
5. **Results reported** — The framework reports any violations found

## Severity Levels

Each rule specifies a severity that determines behavior on violation:

| Severity | Behavior |
|----------|----------|
| `info` | Log the result, continue execution |
| `warn` | Notify user, continue execution |
| `error` | Agent must fix violations before continuing |

Different rules within the same RuleSet can have different severities — some blocking (`error`), others non-blocking (`warn` or `info`).

## Multiple Validators

AVP is designed for projects to use many validators simultaneously. Validators are discovered from a directory and run in parallel.

### Directory Organization

Validators are discovered from two locations:

1. **Project validators**: `.avp/validators/` in the project root
2. **User validators**: `~/.avp/validators/` in the user's home directory

```
.avp/validators/
├── security-rules/         # Security RuleSet
│   ├── VALIDATOR.md
│   ├── README.md
│   ├── favicon.png
│   └── rules/
│       ├── no-secrets.md
│       ├── no-sql-injection.md
│       └── no-xss.md
├── code-quality/           # Quality RuleSet
│   ├── VALIDATOR.md
│   ├── README.md
│   └── rules/
│       ├── no-console.md
│       └── require-tests.md
└── team-conventions/       # Custom RuleSet
    ├── VALIDATOR.md
    └── rules/
        ├── naming-conventions.md
        └── import-order.md
```

Each validator is a **RuleSet** — a directory containing:
- **VALIDATOR.md** (required) — Metadata and configuration
- **rules/** directory (required) — Individual rule files
- **README.md** (optional) — Detailed documentation
- **favicon.png** (optional) — Visual icon
- **scripts/**, **references/**, **assets/** (optional) — Supporting files

### Discovery

An AVP-compatible agent scans both validator directories and loads all valid VALIDATOR.md files. Each validator's `name` must be unique across the entire set.

**Precedence**: If the same validator name exists in both locations, the project validator (`.avp/validators/`) takes precedence over the user validator (`~/.avp/validators/`).

### Parallel Execution

When a hook event fires, all matching validators run concurrently:

```
PostToolUse (Write to src/api.ts)
    ├── security-rules       ─┐
    ├── code-quality          ├── Validators run in PARALLEL
    ├── team-conventions      │
    └── api-standards        ─┘
```

Within each validator, rules execute in **lexicographical order** by file path.

This parallel validator execution is a key advantage over monolithic hook scripts.

### Result Aggregation

Results from all validators are collected and the most severe outcome determines the overall result:

| Validator Results | Overall Outcome |
|-------------------|-----------------|
| All pass | **PASSED** — continue normally |
| Some warn, none error | **WARNED** — log warnings, continue |
| Any error | **ERROR** — agent must fix before continuing |

When multiple validators return errors, all violations are aggregated and presented to the agent together.
