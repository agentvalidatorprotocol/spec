# no-secrets

Detect hardcoded secrets, API keys, and credentials in code.

## Overview

| Property | Value |
|----------|-------|
| **Severity** | error |
| **Trigger** | PostToolUse |
| **Category** | security |
| **Tags** | `secrets`, `credentials`, `api-keys`, `passwords`, `blocking` |
| **File Patterns** | `*` |

## What It Checks

- `api-keys` - Patterns like `sk-`, `api_key=`, `apiKey:`
- `passwords` - Patterns like `password=`, `passwd`, `pwd`
- `aws-credentials` - AWS access key IDs and secret keys
- `private-keys` - PEM format private keys

## Examples

### Will Error

Code like this will trigger an error and must be fixed:

```typescript
// Bad - hardcoded secrets
const API_KEY = "sk-12345abcdef";
const DB_URL = "postgres://user:password@host/db";
```

### Correct Approach

Use environment variables instead:

```typescript
// Good - use environment variables
const API_KEY = process.env.API_KEY;
const DB_URL = process.env.DATABASE_URL;
```

## VALIDATOR.md Definition

```yaml
---
name: no-secrets
description: "Detect hardcoded secrets, API keys, and credentials"
severity: error
trigger: PostToolUse
match:
  tools:
    - Write
    - Edit
  files:
    - "*"
category: security
tags:
  - secrets
  - credentials
  - api-keys
  - passwords
  - blocking
---

# No Secrets Validator

You are a security validator. After the agent edits code, check for hardcoded secrets.

## Rules to Check

1. **API Keys** - Look for patterns like `sk-`, `api_key=`, `apiKey:`
2. **Passwords** - Look for `password=`, `passwd`, `pwd`
3. **AWS Credentials** - Look for AWS access key IDs and secret keys
4. **Private Keys** - Look for `-----BEGIN.*PRIVATE KEY-----`
5. **Connection Strings** - Database URLs with embedded credentials

## Response Format

Return JSON with decision, reason, passed, violations, and summary.
```

## Related Validators

- [no-eval](/validators/security/no-eval) - Prevent dangerous eval usage
- [sql-injection](/validators/security/sql-injection) - Detect SQL injection vulnerabilities
