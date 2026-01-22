# Triggers Reference

Triggers determine when a validator runs. They correspond to agent hook events and can be combined with matchers for precise control.

> **Note**: Triggers map directly to hook events. The examples below use Claude Code hook names, but the concept applies to any agent with a hook system.

## Available Triggers

### PreToolUse
After the agent creates tool parameters, before processing the tool call.
**Use case**: Validate tool inputs, block dangerous operations.
*Supports matchers*

### PostToolUse
Immediately after a tool completes successfully.
**Use case**: Most common - validate file changes, check code quality.
*Supports matchers*

### PostToolUseFailure
After a tool fails.
**Use case**: Handle tool failures, suggest fixes.
*Supports matchers*

### UserPromptSubmit
When user submits a prompt, before the agent processes it.
**Use case**: Validate prompts, add context.

### Stop
When the agent finishes responding.
**Use case**: Final validation, summary checks.

### SubagentStop
When a subagent finishes.
**Use case**: Evaluate subagent work, decide if more work needed.

### SessionStart
When session begins or resumes.
**Use case**: Load context, set environment.

### SessionEnd
When session terminates.
**Use case**: Cleanup, logging, save state.

### PreCompact
Before context compaction.
**Use case**: Preserve important context.

### Setup
During repository setup or maintenance.
**Use case**: Initialize environment, run migrations.

### Notification
When the agent sends notifications.
**Use case**: Handle permission prompts, alerts.
*Supports matchers*

### PermissionRequest
When permission dialog appears.
**Use case**: Auto-approve or deny permissions.
*Supports matchers*

## Common Patterns

### Code Quality on File Changes

Use `PostToolUse` with a matcher for Write/Edit tools to validate code changes as they happen.

### Security Checks

Use `PostToolUse` for blocking validators that prevent security issues from being committed.

### Final Review

Use `Stop` to run a comprehensive review when the agent finishes a response, ensuring all changes meet standards.

## Matchers

Some triggers support matchers to filter which tool calls they respond to:

- **Tool matchers**: `Write|Edit|MultiEdit`
- **File patterns**: `*.ts`, `src/**/*.js`
- **Regex patterns**: For complex matching needs
