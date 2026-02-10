---
sidebar_position: 2
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
avp init
```

This creates the `.avp/validators/` directory with a starter set of validators. Your agent will now run these validators automatically when it modifies code.

## Installing Validators from the Registry

You can search the AVP registry for community-maintained validator packages and install them directly:

```bash
avp search dtolnay
```

```text
Found 1 package(s) matching "dtolnay":

┌─────────┬─────────┬──────────────────────────────────────────────────────────────┬───────────┐
│ Name    ┆ Version ┆ Description                                                  ┆ Downloads │
╞═════════╪═════════╪══════════════════════════════════════════════════════════════╪═══════════╡
│ dtolnay ┆ 0.1.1   ┆ Enforces Rust coding style inspired by dtolnay (David Tol... ┆ 1         │
└─────────┴─────────┴──────────────────────────────────────────────────────────────┴───────────┘
```

Install the package into your project:

```bash
avp install dtolnay
```

This downloads the `dtolnay` RuleSet into `.avp/validators/` where it will be picked up automatically on the next agent run. You can also pin a specific version:

```bash
avp install dtolnay@0.1.1
```

See the full [CLI Reference](/reference/cli) for all available commands.

## Removing AVP

To remove AVP from a project:

```bash
avp deinit
```

This removes the `.avp/` directory and any agent integrations.

## Supported Agents

AVP currently supports:

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — Anthropic's CLI for Claude

Support for additional agents is planned.
