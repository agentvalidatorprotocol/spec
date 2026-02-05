---
sidebar_position: 3
title: Severity Levels
---

# Severity Levels

Severity levels control how the agent responds to rule violations. Each rule in a RuleSet specifies its own severity, allowing mixed blocking and non-blocking validation within the same validator.

## Available Levels

### Info

Violations are logged but execution continues without interruption. Use for suggestions, metrics, and non-critical feedback.

**Best for:**
- Documentation suggestions
- Code style preferences (non-blocking)
- Metrics and telemetry
- Helpful tips and best practices

### Warning

User is notified of violations but execution continues. Use for important issues that don't require immediate fixing.

**Best for:**
- Code quality issues (long functions, high complexity)
- Missing tests for new code
- Deprecated API usage
- Performance suggestions

### Error

Violations must be fixed before the agent can continue. Use sparingly for security-critical or breaking issues.

**Best for:**
- Security vulnerabilities (hardcoded secrets, SQL injection)
- Dangerous operations (eval, code execution)
- Breaking changes to public APIs
- Critical configuration errors

## Choosing the Right Severity

:::tip
When in doubt, start with `warn` severity. You can always escalate to `error` if violations persist, but overly strict validators frustrate developers and get disabled.
:::

### Questions to Ask

1. **Can this cause production issues?**
   If yes, consider `error`

2. **Is this a security concern?**
   If yes, usually `error`

3. **Is this a style preference?**
   If yes, usually `info` or `warn`

4. **Would this block legitimate work?**
   If yes, consider `warn` instead of `error`

## Configuring Severity

Severity is set in each rule file's frontmatter:

```yaml
# rules/no-secrets.md
---
name: no-secrets
description: Detects hardcoded secrets
severity: error
---
```

### Mixed Severities

Different rules within the same RuleSet can have different severities:

```
security-rules/
├── VALIDATOR.md
└── rules/
    ├── no-secrets.md        # severity: error (blocking)
    ├── no-sql-injection.md  # severity: error (blocking)
    └── no-xss.md           # severity: warn (non-blocking)
```

This allows you to block critical issues while only warning about less severe ones.

Agent implementations may allow users to override severity levels through configuration when needed.
