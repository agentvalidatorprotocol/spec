---
sidebar_position: 3
title: Severity Levels
---

# Severity Levels

Severity levels control how the agent responds to validator violations. Choose the right level to balance enforcement with developer experience.

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

Severity is set in the VALIDATOR.md frontmatter:

```yaml
---
name: no-secrets
severity: error
trigger: PostToolUse
---
```

Agent implementations may allow users to override severity levels through configuration when needed.
