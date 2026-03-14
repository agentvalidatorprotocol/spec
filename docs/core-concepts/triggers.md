---
sidebar_position: 2
title: Triggers
---

# Triggers Reference

Triggers determine when a validator runs. They correspond to agent hook events and can be combined with matchers for precise control.

:::note
Triggers map directly to [Claude Code hook events](https://code.claude.com/docs/en/hooks#hook-events). The schema is designed for exact compatibility.
:::

## Decision Control

Validators return decisions in natural language. The sub-agent's response should clearly indicate one of:

| Decision | Meaning |
|----------|---------|
| **allow** | Validation passed — no issues found |
| **deny** | Validation failed — issues found |
| **ask** | Prompt the user for confirmation |
| **block** | Validation failed — issues found |

The framework parses the sub-agent's natural language response to determine the decision. For example, a response might say "DENY - this command would delete system files" or "ALLOW - the code looks safe".

**How decisions and severity interact**:
- The sub-agent decides if validation **passed** (allow) or **failed** (deny/block)
- When validation fails, the **rule's severity** determines the consequence:
  - `error` severity → block until fixed
  - `warn` severity → log warning, continue
  - `info` severity → log only

**Pre vs Post behavior**:
- **PreToolUse**: `deny` prevents the action entirely (tool doesn't execute)
- **PostToolUse**: The tool has already executed. If validation fails with `error` severity, the agent must fix the issues before continuing.

## Hook Lifecycle

Hooks fire at specific points during an agent session:

```
InstructionsLoaded → SessionStart → UserPromptSubmit → [Agentic Loop] → Stop → SessionEnd
                                                            ↓
                                               PreToolUse → Tool Execution → PostToolUse
                                                            ↓
                                               SubagentStart → [Subagent] → SubagentStop
                                                            ↓
                                               Elicitation → [User Input] → ElicitationResult
                                                            ↓
                                               TeammateIdle    TaskCompleted

ConfigChange ─── fires on config file changes (any point during session)
PreCompact → [Compaction] → PostCompact
WorktreeCreate / WorktreeRemove ─── fires on worktree operations
```

## Available Triggers

### Tool Execution Triggers

These triggers fire around tool execution and support tool/file matchers.

#### PreToolUse
After the agent creates tool parameters, before processing the tool call.

**Use case**: Validate tool inputs, block dangerous operations, modify inputs.

**Supports matchers**: Tool names, regex patterns

**Decision control**: `allow`, `deny`, `ask`

#### PostToolUse
Immediately after a tool completes successfully.

**Use case**: Most common - validate file changes, check code quality.

**Supports matchers**: Tool names, regex patterns

**Decision control**: `block` or continue

#### PostToolUseFailure
After a tool fails.

**Use case**: Handle tool failures, suggest fixes, provide context.

**Supports matchers**: Tool names, regex patterns

#### PermissionRequest
When a permission dialog appears to the user.

**Use case**: Auto-approve or deny permissions programmatically.

**Supports matchers**: Tool names, regex patterns

**Decision control**: `allow`, `deny`

### Prompt & Response Triggers

#### UserPromptSubmit
When user submits a prompt, before the agent processes it.

**Use case**: Validate prompts, add context, block sensitive content.

**Decision control**: `block` or add context

#### Stop
When the main agent finishes responding.

**Use case**: Final validation, comprehensive review, summary checks.

**Decision control**: `block` to force continuation

#### SubagentStart
When spawning a subagent (Task tool).

**Use case**: Monitor subagent creation, add context.

*New in Claude Code*

#### SubagentStop
When a subagent finishes.

**Use case**: Evaluate subagent work, decide if more work needed.

**Decision control**: `block` to force continuation

### MCP Interaction Triggers

These triggers fire during MCP server elicitation flows. Command hooks only.

#### Elicitation
When an MCP server requests user input via the elicitation protocol.

**Use case**: Validate or deny elicitation requests from MCP servers, enforce policies on which servers can prompt users.

**Supports matchers**: MCP server name

**Decision control**: `allow`, `deny`

#### ElicitationResult
When a user responds to an MCP elicitation request.

**Use case**: Validate user responses before they reach the MCP server, block sensitive data from being sent.

**Supports matchers**: MCP server name

**Decision control**: `allow`, `block`

### Agent Team Triggers

These triggers fire during multi-agent collaboration. No matcher support.

#### TeammateIdle
When an agent teammate goes idle.

**Use case**: Prevent teammates from idling when work remains, assign new tasks.

**Decision control**: `allow`, `block` to prevent idling

#### TaskCompleted
When a task is marked complete.

**Use case**: Validate task completion, ensure acceptance criteria are met before allowing completion.

**Decision control**: `allow`, `block` to prevent completion

### Session Lifecycle Triggers

#### SessionStart
When session begins or resumes.

**Use case**: Load context, set environment variables.

**Trigger matchers**:
- `startup` - Fresh session start
- `resume` - Resuming previous session
- `clear` - After `/clear` command
- `compact` - After context compaction

#### SessionEnd
When session terminates.

**Use case**: Cleanup, logging, save state.

**Trigger matchers**:
- `clear` - Session cleared
- `logout` - User logged out
- `prompt_input_exit` - User exited at prompt
- `other` - Other exit reasons

#### Setup
During repository setup or maintenance (explicit flags only).

**Use case**: Initialize environment, run migrations, install dependencies.

**Trigger matchers**:
- `init` - From `--init` or `--init-only` flags
- `maintenance` - From `--maintenance` flag

#### PreCompact
Before context compaction.

**Use case**: Preserve important context, add summary information.

**Trigger matchers**:
- `manual` - User invoked `/compact`
- `auto` - Automatic compaction (context limit)

#### PostCompact
After context compaction completes. Command hooks only. Cannot block.

**Use case**: Log compaction events, update external state after compaction.

#### InstructionsLoaded
When CLAUDE.md or rules files are loaded. Command hooks only. Cannot block.

**Use case**: Track which instruction files are loaded, log for auditing.

**Supports matchers**: File path

#### ConfigChange
When configuration files change. Command hooks only.

**Use case**: Validate config changes, block dangerous settings, audit configuration updates.

**Supports matchers**: Source type

**Decision control**: `allow`, `block`

**Trigger matchers**:
- `user_settings` - User-level settings changed
- `project_settings` - Project-level settings changed
- `local_settings` - Local settings changed
- `policy_settings` - Policy settings changed
- `skills` - Skills configuration changed

#### WorktreeCreate
When a git worktree is created. Command hooks only.

**Use case**: Validate worktree creation, enforce branch naming conventions.

**Decision control**: `allow`, `deny` to prevent creation

#### WorktreeRemove
When a git worktree is removed. Command hooks only. Cannot block.

**Use case**: Cleanup, logging, track worktree lifecycle.

### Notification Trigger

#### Notification
When the agent sends notifications.

**Use case**: Handle permission prompts, alerts, custom notifications.

**Trigger matchers**:
- `permission_prompt` - Permission requests
- `idle_prompt` - Waiting for user input (60+ seconds)
- `auth_success` - Authentication success
- `elicitation_dialog` - MCP tool elicitation (legacy — prefer the first-class `Elicitation` trigger)

## Common Patterns

### Code Quality on File Changes

Use `PostToolUse` with a matcher for Write/Edit tools to validate code changes as they happen.

```yaml
trigger: PostToolUse
match:
  tools: [Write, Edit]
  files: ["*.ts", "*.tsx"]
```

### Security Checks

Use `PostToolUse` for blocking validators that prevent security issues from being committed.

```yaml
trigger: PostToolUse
severity: error
match:
  tools: [Write, Edit]
```

### Final Review

Use `Stop` to run a comprehensive review when the agent finishes a response.

```yaml
trigger: Stop
```

### Pre-flight Input Validation

Use `PreToolUse` to validate and potentially modify tool inputs before execution.

```yaml
trigger: PreToolUse
match:
  tools: [Bash]
```

### Session Context Loading

Use `SessionStart` with a trigger matcher to load context at appropriate times.

```yaml
trigger: SessionStart
triggerMatcher: startup
```

## Matchers

When both `tools` and `files` matchers are specified, **both must match** (AND logic). If a tool doesn't operate on a file (e.g., `Bash`), the `files` matcher is ignored.

### Tool Matchers

For tool-related triggers (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`):

```yaml
match:
  tools: [Write, Edit, MultiEdit]  # Array of tool names
  # OR
  tools: ["Write|Edit"]            # Regex pattern
```

Tool names shown here are Claude Code specific. Use regex patterns like `.*edit.*` or `.*write.*` to match tools in other agents.

Common Claude Code tool names:
- `Write`, `Edit`, `MultiEdit` - File operations
- `Bash` - Shell commands
- `Read`, `Glob`, `Grep` - File reading/search
- `Task` - Subagent spawning
- `WebFetch`, `WebSearch` - Web operations
- `mcp__<server>__<tool>` - MCP tools (e.g., `mcp__memory__create_entities`)

### File Matchers

Filter by file path patterns. Patterns are matched against the **full path**, not just the filename.

```yaml
match:
  files: ["*.ts", "*.tsx", "src/**/*.js"]
```

The pattern `*.ts` will match `src/utils/helper.ts`.

### Trigger Matchers

For session/lifecycle triggers, use `triggerMatcher`:

```yaml
trigger: SessionStart
triggerMatcher: startup  # Only on fresh starts, not resumes
```

```yaml
trigger: Notification
triggerMatcher: permission_prompt  # Only permission notifications
```
