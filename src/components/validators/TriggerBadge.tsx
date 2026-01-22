import { cn } from '@/lib/utils'
import type { Trigger } from '@/types'

interface TriggerBadgeProps {
  trigger: Trigger
  size?: 'sm' | 'md'
}

const triggerDescriptions: Record<Trigger, string> = {
  PreToolUse: 'Before tool execution',
  PostToolUse: 'After tool completes',
  PostToolUseFailure: 'After tool fails',
  UserPromptSubmit: 'When user submits prompt',
  Stop: 'When Claude stops',
  SubagentStop: 'When subagent finishes',
  SessionStart: 'Session begins',
  SessionEnd: 'Session ends',
  PreCompact: 'Before compaction',
  Setup: 'During setup',
  Notification: 'On notification',
  PermissionRequest: 'Permission dialog',
}

export function TriggerBadge({ trigger, size = 'sm' }: TriggerBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
      title={triggerDescriptions[trigger]}
    >
      {trigger}
    </span>
  )
}
