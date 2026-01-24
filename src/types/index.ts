export type Severity = 'info' | 'warn' | 'error'

export type Trigger =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PostToolUseFailure'
  | 'UserPromptSubmit'
  | 'Stop'
  | 'SubagentStop'
  | 'SessionStart'
  | 'SessionEnd'
  | 'PreCompact'
  | 'Setup'
  | 'Notification'
  | 'PermissionRequest'

export interface Validator {
  name: string
  displayName: string
  description: string
  severity: Severity
  trigger: Trigger
  tags: string[]
  filePatterns: string[]
  rules: string[]
  autoFix: boolean
  estimatedTokens?: string
}

export interface NavItem {
  title: string
  href?: string
  children?: NavItem[]
  isExpanded?: boolean
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
}
