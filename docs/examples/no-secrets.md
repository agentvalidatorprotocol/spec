---
sidebar_position: 2
title: No Secrets
---

# No Secrets Example

A simple RuleSet with one rule that detects hardcoded secrets in code.

## Directory Structure

```
.avp/validators/no-secrets/
├── VALIDATOR.md
├── favicon.png        # Optional: icon for visual identification
└── rules/
    └── no-secrets.md
```

:::tip
Add a `favicon.png` (16x16, 32x32, or 64x64) to make your RuleSet visually identifiable in UIs.
:::

## Overview

| Property | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Trigger** | PostToolUse |
| **Rules** | 1 (no-secrets) |
| **Severity** | error |
| **Tags** | `security`, `secrets`, `credentials` |

## What It Checks

- **API keys** - Patterns like `sk-`, `api_key=`, `apiKey:`
- **Passwords** - Patterns like `password=`, `passwd`, `pwd`
- **AWS credentials** - AWS access key IDs and secret keys
- **Private keys** - PEM format private keys
- **Connection strings** - Database URLs with embedded credentials

## Examples

### Will Error

Code like this will trigger an error and must be fixed:

```typescript
// ❌ BLOCKED - hardcoded secrets
const API_KEY = "sk-12345abcdef";
const DB_URL = "postgres://user:password@host/db";
const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";
```

### Correct Approach

Use environment variables instead:

```typescript
// ✅ PASS - use environment variables
const API_KEY = process.env.API_KEY;
const DB_URL = process.env.DATABASE_URL;
const AWS_KEY = process.env.AWS_ACCESS_KEY_ID;
```

## VALIDATOR.md

The RuleSet configuration file:

```yaml
---
name: no-secrets
description: Detects hardcoded secrets, API keys, and credentials in code. Blocks commits containing credentials to prevent security leaks.
version: "1.0.0"
trigger: PostToolUse
match:
  tools: [Write, Edit]
tags:
  - security
  - secrets
  - credentials
metadata:
  author: security-team
---

# No Secrets Validator

Prevents hardcoded credentials from being committed to version control.

The rule is automatically loaded from the `rules/` directory.
```

## rules/no-secrets.md

The individual rule file with validation logic:

```yaml
---
name: no-secrets
description: Detects hardcoded secrets like API keys, passwords, and tokens
severity: error
---

# No Secrets Rule

Check for hardcoded credentials that must never be committed.

## Detection Patterns

### API Keys

Look for patterns commonly used for API keys:
- Prefixes: `sk-`, `pk-`, `api_key=`, `apiKey:`
- Format: Long alphanumeric strings (20+ chars)

**Examples**:
```typescript
const apiKey = "sk-abc123def456";           // ❌ BLOCKED
const stripeKey = "pk_live_abc123";          // ❌ BLOCKED
```

### Passwords

Look for password assignments:
- Patterns: `password=`, `passwd=`, `pwd=`
- Context: Hardcoded strings, not user input

**Examples**:
```python
password = "MyPassword123"                   # ❌ BLOCKED
config = {"passwd": "secret"}                # ❌ BLOCKED
```

### AWS Credentials

AWS access keys have specific formats:
- Access keys: Start with `AKIA` (20 chars)
- Secret keys: 40 character base64 strings

**Examples**:
```bash
export AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"     # ❌ BLOCKED
aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG..."  # ❌ BLOCKED
```

### Private Keys

PEM-encoded private keys:
- Pattern: `-----BEGIN.*PRIVATE KEY-----`

**Examples**:
```text
-----BEGIN RSA PRIVATE KEY-----        # ❌ BLOCKED
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----
```

### Database Connections

Connection strings with embedded credentials:

**Examples**:
```python
db_url = "postgresql://admin:secret@localhost/db"    # ❌ BLOCKED
mongo_uri = "mongodb://user:pass@host:27017/db"      # ❌ BLOCKED
```

## Safe Alternatives

### Environment Variables

```typescript
// ✅ PASS
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;
```

### Configuration Files (Gitignored)

```typescript
// config.local.ts (in .gitignore)
export const config = {
  apiKey: "sk-abc123def456"
};

// app.ts
import { config } from './config.local';  // ✅ PASS
```

## Exceptions

The following are **not** flagged:
- Example values in documentation
- Test fixtures: `test/fixtures/fake-credentials.ts`
- Fake/placeholder values: `password = "changeme"`
```

## Usage

1. **Create the directory**:
   ```bash
   mkdir -p .avp/validators/no-secrets/rules
   ```

2. **Add the files**:
   - Create `VALIDATOR.md` with RuleSet configuration
   - Create `rules/no-secrets.md` with the rule logic

3. **Test it**:
   ```bash
   # This will trigger the validator
   echo 'const key = "sk-test123";' > test.ts
   ```

## Key Takeaways

This example demonstrates:
- **Minimal RuleSet structure** — One VALIDATOR.md + one rule file
- **Blocking severity** — Error level prevents commits with secrets
- **Clear detection patterns** — Specific examples of violations
- **Safe alternatives** — How to properly handle credentials
- **Versioning** — Using semver (1.0.0)

For a more complex example with multiple rules, see [Security RuleSet](security-ruleset).
