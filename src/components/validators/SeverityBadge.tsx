import { cn } from '@/lib/utils'
import type { Severity } from '@/types'

interface SeverityBadgeProps {
  severity: Severity
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const severityConfig = {
  info: {
    label: 'Info',
    icon: '🔵',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  warn: {
    label: 'Warning',
    icon: '🟡',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  error: {
    label: 'Error',
    icon: '🔴',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
}

export function SeverityBadge({ severity, showLabel = true, size = 'sm' }: SeverityBadgeProps) {
  const config = severityConfig[severity]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
