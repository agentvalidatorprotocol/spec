---
sidebar_position: 1
title: Overview
---

# Example Validators

The specification includes example validators covering security, code quality, and documentation. These demonstrate common validation patterns that can be adapted to your needs.

## Available Examples

### [No Secrets](no-secrets)

A simple security rule that detects hardcoded credentials.

**Key features**:
- Pattern matching for API keys, passwords, AWS credentials
- Blocking severity to prevent credential leaks
- Clear examples of violations and safe alternatives

### [Security RuleSet](security-ruleset)

A comprehensive RuleSet demonstrating multiple related security rules.

**Key features**:
- Multiple rules (no-secrets, no-sql-injection, no-xss)
- Mixed severity levels (error and warn)
- Complete directory structure with README, favicon, scripts
- Rule inheritance and overrides
- Versioning with semver via metadata

## Learning Path

1. Start with **[No Secrets](no-secrets)** to understand the basic structure
2. Move to **[Security RuleSet](security-ruleset)** to see how rules are organized
3. Use these as templates for your own validators

## RuleSet vs Single Rule

All validators in AVP 1.0 are **RuleSets** — directories containing:
- VALIDATOR.md with metadata
- rules/ directory with individual rule files
- Optional README.md, favicon.png, and supporting files

This structure provides:
- **Organization** — Group related rules together
- **Flexibility** — Mix blocking and non-blocking rules
- **Versioning** — Track changes with semver via metadata
- **Documentation** — Detailed README for users
