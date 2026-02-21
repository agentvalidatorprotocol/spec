---
sidebar_position: 2
title: Security RuleSet
---

# Security RuleSet Example

This example shows a complete security RuleSet with multiple rules at different severity levels.

## Directory Structure

```
.avp/validators/security-rules/
├── VALIDATOR.md
├── README.md
├── favicon.png        # Icon for visual identification
├── rules/
│   ├── no-secrets.md
│   ├── no-sql-injection.md
│   └── no-xss.md
├── scripts/
│   └── detect-secrets.py
└── references/
    └── owasp-top-10.md
```

The `favicon.png` provides visual branding for the RuleSet:

<img src="/img/examples/security-favicon.png" alt="Security Rules Icon" width="64" height="64" />

## VALIDATOR.md

The main configuration file defines RuleSet metadata and common settings:

```yaml
---
name: security-rules
description: Comprehensive security validation for code changes. Detects secrets, SQL injection, and XSS vulnerabilities based on OWASP Top 10.
trigger: PostToolUse
match:
  tools: [Write, Edit]
tags:
  - security
  - owasp
  - vulnerabilities
favicon: favicon.png
license: MIT
metadata:
  author: security-team
  version: "1.0.0"
  source: https://github.com/example/security-rules
  documentation: https://example.com/docs/security
---

# Security Rules

This RuleSet validates code changes against common security vulnerabilities following OWASP Top 10 guidelines.

Rules are automatically discovered from the `rules/` directory. Each rule has its own severity level and validation logic.

## Resources

- OWASP Top 10 guidelines in `references/`
- Detection scripts in `scripts/`

For detailed documentation, see [README.md](README.md).
```

## README.md

Optional detailed documentation for users:

```markdown
# Security Rules Validator

Comprehensive security validation for code changes based on OWASP Top 10.

## Installation

1. Clone this validator into your project:
   ```bash
   mkdir -p .avp/validators
   cd .avp/validators
   git clone https://github.com/example/security-rules.git
   ```

2. The validator will automatically activate on the next `PostToolUse` event.

## Rules

### no-secrets (error)

**Description**: Detects hardcoded secrets like API keys, passwords, and tokens.

**Severity**: `error` — Blocks commits containing secrets

**Detects**:
- API keys (sk-, api_key=, apiKey:)
- Passwords (password=, passwd=, pwd=)
- AWS credentials (AKIA*, aws_secret_access_key)
- Private keys (-----BEGIN.*PRIVATE KEY-----)
- JWT tokens (eyJ...)
- Database connection strings with credentials

**Example violation**:
```typescript
const apiKey = "sk-abc123def456"; // ❌ BLOCKED
```

**Correct approach**:
```typescript
const apiKey = process.env.API_KEY; // ✅ PASS
```

### no-sql-injection (error)

**Description**: Detects SQL injection vulnerabilities from string concatenation.

**Severity**: `error` — Blocks unsafe SQL patterns

**Detects**:
- String concatenation in SQL queries
- Template literals with user input
- Unparameterized queries

**Example violation**:
```typescript
const query = "SELECT * FROM users WHERE id = " + userId; // ❌ BLOCKED
```

**Correct approach**:
```typescript
const query = db.prepare("SELECT * FROM users WHERE id = ?").bind(userId); // ✅ PASS
```

### no-xss (warn)

**Description**: Detects potential XSS vulnerabilities in frontend code.

**Severity**: `warn` — Notifies but allows continuation

**Detects**:
- `dangerouslySetInnerHTML` without sanitization
- Direct DOM manipulation with user input
- Unsafe `eval()` or `Function()` calls

**Example violation**:
```tsx
<div dangerouslySetInnerHTML={{ __html: userInput }} /> {/* ⚠️ WARNED */}
```

**Correct approach**:
```tsx
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} /> {/* ✅ PASS */}
```

## Configuration

### Adjusting Severity

Edit individual rule files to change severity:

```yaml
# rules/no-xss.md
severity: error  # Change from 'warn' to 'error' to make blocking
```

### Customizing File Patterns

Override the parent matcher in a rule file:

```yaml
# rules/no-secrets.md
match:
  files: ["src/**/*.ts", "src/**/*.js"]  # Only check src directory
```

### Disabling Rules

To disable a rule, either:

1. **Remove the file** from the `rules/` directory
2. **Rename with different extension** (e.g., `no-xss.md.disabled` or `no-xss.md.off`)
3. **Move outside rules/** (e.g., to `disabled/` at root level)

```bash
# Option 1: Remove the file
rm rules/no-xss.md

# Option 2: Rename to disable
mv rules/no-xss.md rules/no-xss.md.disabled

# Option 3: Move outside rules/ directory
mkdir disabled
mv rules/no-xss.md disabled/
```

:::note
Subdirectories within `rules/` are scanned, so moving to `rules/disabled/` will NOT disable the rule. Move outside the `rules/` directory entirely.
:::

## Version History

### 1.0.0 (2025-01-15)
- Initial release
- Added no-secrets rule
- Added no-sql-injection rule
- Added no-xss rule

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add or modify rules in `rules/`
4. Update metadata.version in VALIDATOR.md
5. Submit a pull request

## License

MIT License. See LICENSE file for details.

## Support

- GitHub Issues: https://github.com/example/security-rules/issues
- Documentation: https://example.com/docs/security
```

## rules/no-secrets.md

Blocking rule for hardcoded credentials:

```yaml
---
name: no-secrets
description: Detects hardcoded secrets like API keys, passwords, and tokens in source code. Blocks commits containing credentials to prevent security leaks.
severity: error
---

# No Secrets Rule

Scan for hardcoded credentials that must never be committed to version control.

## Detection Patterns

### API Keys

Look for patterns commonly used for API keys:

- Prefixes: `sk-`, `pk-`, `api_key=`, `apiKey:`, `api-key:`
- Format: Long alphanumeric strings (20+ chars)
- Context: Variable assignments, config files

**Examples**:
```typescript
const apiKey = "sk-abc123def456";           // ❌ BLOCKED
const stripeKey = "pk_live_abc123";          // ❌ BLOCKED
const config = { apiKey: "abc123def456" };   // ❌ BLOCKED
```

### Passwords

Look for password assignments:

- Patterns: `password=`, `passwd=`, `pwd=`, `pass:`
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
- Variables: `aws_access_key_id`, `aws_secret_access_key`

**Examples**:
```bash
export AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"     # ❌ BLOCKED
aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG..."  # ❌ BLOCKED
```

### Private Keys

PEM-encoded private keys:

- Pattern: `-----BEGIN.*PRIVATE KEY-----`
- Types: RSA, EC, DSA, OPENSSH private keys

**Examples**:
```text
-----BEGIN RSA PRIVATE KEY-----        # ❌ BLOCKED
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----
```

### JWT Tokens

JSON Web Tokens have a distinctive format:

- Pattern: `eyJ...` (base64 encoded JSON)
- Structure: header.payload.signature

**Examples**:
```typescript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";  // ❌ BLOCKED
```

### Database Connections

Connection strings with embedded credentials:

- MongoDB: `mongodb://user:pass@host`
- PostgreSQL: `postgresql://user:pass@host`
- MySQL: `mysql://user:pass@host`

**Examples**:
```python
db_url = "postgresql://admin:secret@localhost/db"    # ❌ BLOCKED
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

### Secret Management Services

```typescript
// ✅ PASS
import { SecretsManager } from 'aws-sdk';
const secret = await secretsManager.getSecretValue({ SecretId: 'api-key' });
```

### Encrypted Storage

```typescript
// ✅ PASS
import { decrypt } from './crypto';
const apiKey = decrypt(encryptedKey, process.env.ENCRYPTION_KEY);
```

## Exceptions

The following are **not** flagged:

- Example values in documentation: `password = "your-password-here"`
- Test fixtures: `test/fixtures/fake-credentials.ts`
- Comments explaining patterns: `// API key format: sk-...`
- Fake/placeholder values: `password = "changeme"`

## References

See `scripts/detect-secrets.py` for the complete detection implementation.
```

## rules/no-sql-injection.md

Blocking rule for SQL injection:

```yaml
---
name: no-sql-injection
description: Detects SQL injection vulnerabilities from string concatenation and unparameterized queries.
severity: error
match:
  files: ["**/*.ts", "**/*.js", "**/*.py", "**/*.java"]
---

# SQL Injection Prevention

Scan for unsafe SQL query construction that could lead to SQL injection vulnerabilities.

## Unsafe Patterns

### String Concatenation

Never build SQL queries with string concatenation:

```typescript
// ❌ BLOCKED
const query = "SELECT * FROM users WHERE id = " + userId;
const query = `SELECT * FROM users WHERE name = '${userName}'`;
```

### Template Literals with User Input

Template literals are unsafe when including user-controlled data:

```typescript
// ❌ BLOCKED
const query = `
  SELECT * FROM products
  WHERE category = '${userInput}'
`;
```

### Unparameterized Queries

Raw query execution without parameters:

```python
# ❌ BLOCKED
cursor.execute("SELECT * FROM users WHERE email = '" + email + "'")
```

## Safe Alternatives

### Parameterized Queries

Use placeholders and bind parameters:

```typescript
// ✅ PASS - PostgreSQL
const query = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ✅ PASS - MySQL
const query = await db.query(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);
```

### ORM Query Builders

Use ORM query builders that handle escaping:

```typescript
// ✅ PASS - TypeORM
const user = await userRepository.findOne({
  where: { id: userId }
});

// ✅ PASS - Prisma
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

### Prepared Statements

Use prepared statements with parameter binding:

```python
# ✅ PASS - Python
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
```

## Static Queries

Static queries without user input are safe:

```typescript
// ✅ PASS - No user input
const query = "SELECT COUNT(*) FROM users";
const query = "SELECT * FROM products WHERE active = true";
```

## References

See `references/owasp-top-10.md` for OWASP SQL Injection Prevention guidelines.
```

## rules/no-xss.md

Warning-level rule for XSS vulnerabilities:

```yaml
---
name: no-xss
description: Detects potential XSS (Cross-Site Scripting) vulnerabilities in frontend code.
severity: warn
match:
  files: ["**/*.tsx", "**/*.jsx", "**/*.html", "**/*.vue"]
---

# XSS Prevention

Check for unsafe HTML rendering patterns that could lead to Cross-Site Scripting vulnerabilities.

## Unsafe Patterns

### dangerouslySetInnerHTML

React's `dangerouslySetInnerHTML` without sanitization:

```tsx
// ⚠️ WARNED
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Direct DOM Manipulation

Using `innerHTML` with user data:

```typescript
// ⚠️ WARNED
element.innerHTML = userInput;
document.write(userContent);
```

### Unsafe eval()

Code execution from strings:

```typescript
// ⚠️ WARNED
eval(userInput);
new Function(userCode)();
```

### Unescaped Attributes

User input in HTML attributes:

```html
<!-- ⚠️ WARNED -->
<a href="${userUrl}">Link</a>
<img src="${userImage}" />
```

## Safe Alternatives

### Sanitization Libraries

Use DOMPurify or similar:

```tsx
// ✅ PASS
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

### React Text Rendering

Let React handle escaping:

```tsx
// ✅ PASS
<div>{userInput}</div>
```

### Safe DOM Manipulation

Use `textContent` instead of `innerHTML`:

```typescript
// ✅ PASS
element.textContent = userInput;
```

### URL Validation

Validate and sanitize URLs:

```typescript
// ✅ PASS
import { isValidUrl } from './validation';

const url = isValidUrl(userUrl) ? userUrl : '/default';
<a href={url}>Link</a>
```

## Static Content

Static HTML without user input is safe:

```tsx
// ✅ PASS - Static content
<div dangerouslySetInnerHTML={{
  __html: '<strong>Welcome</strong>'
}} />
```

## References

See `references/owasp-top-10.md` for OWASP XSS Prevention guidelines.
```

## Using This Example

1. **Create the directory structure**:
   ```bash
   mkdir -p .avp/validators/security-rules/{rules,scripts,references}
   ```

2. **Copy the files**:
   - Create VALIDATOR.md with the RuleSet configuration
   - Create each rule file in rules/
   - Add README.md for documentation
   - Optionally add favicon.png (16x16 or 32x32)

3. **Test the validator**:
   ```bash
   # Make a change that violates a rule
   echo 'const apiKey = "sk-test123";' > test.ts

   # The validator will trigger and block the change
   ```

4. **Customize**:
   - Adjust severity levels in individual rules
   - Add or remove rules from the `rules` array
   - Override file matchers for specific rules
   - Add custom scripts in scripts/

## Key Takeaways

- **RuleSets organize related rules** — Security checks belong together
- **Rule-level severity** — Some rules block (error), others warn
- **Inheritance with overrides** — Rules inherit from parent but can customize
- **Progressive disclosure** — README.md for detailed docs, rules/ for specific logic
- **Versioning** — Track changes with semantic versioning
- **Extensible** — Add scripts, references, assets as needed
