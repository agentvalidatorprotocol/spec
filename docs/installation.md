---
sidebar_position: 1
title: Installation
---

# Installation

AVP lets you write validation rules for AI coding agents in plain English. Instead of shell scripts or custom code, you describe what to check — and a sub-agent enforces it. Catch hardcoded secrets, enforce code standards, require tests, or anything else you can describe in a prompt.

Install the AVP CLI using Homebrew:

```bash
brew tap swissarmyhammer/tap
brew install avp-cli
```

This makes the `avp` command available in your terminal.

## Try It Out

Navigate to your project directory and run:

```bash
cd your-project
avp install project
```

This creates the `.avp/validators/` directory with a starter set of validators. Your agent will now run these validators automatically when it modifies code.

## Supported Agents

AVP currently supports:

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — Anthropic's CLI for Claude

Support for additional agents is planned.
