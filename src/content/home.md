# Agent Validator Protocol

AI agents make mistakes. AVP lets you constantly review the work of an agent — catching security issues, enforcing quality standards, and ensuring your conventions are followed.

## Why AVP?

Agent hook systems already let you run scripts after tool calls. AVP builds on hooks to provide a better architecture for validation:

- **Pluggable rules** — Each validator is a separate file. Add one by dropping in a VALIDATOR.md, remove one by deleting it. No hook script surgery required.
- **Parallel execution** — Validators run concurrently. Your security checks, complexity analysis, and documentation validation all execute at once, dramatically reducing validation overhead.
- **Portable** — VALIDATOR.md files are self-contained. Share them across projects, publish them for others, or pull in community validators.
