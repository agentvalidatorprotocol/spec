import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type: 'info' | 'warn' | 'error' | 'tip'
  title?: string
  children: React.ReactNode
  className?: string
}

const icons = {
  info: Info,
  warn: AlertTriangle,
  error: XCircle,
  tip: AlertCircle,
}

const titles = {
  info: 'Info',
  warn: 'Warning',
  error: 'Error',
  tip: 'Tip',
}

export function Callout({ type, title, children, className }: CalloutProps) {
  const Icon = icons[type]
  const defaultTitle = titles[type]

  return (
    <div
      className={cn(
        'callout',
        {
          info: type === 'info' || type === 'tip',
          warn: type === 'warn',
          error: type === 'error',
        },
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn('w-5 h-5 flex-shrink-0 mt-0.5', {
            'text-severity-info': type === 'info' || type === 'tip',
            'text-severity-warn': type === 'warn',
            'text-severity-error': type === 'error',
          })}
        />
        <div className="flex-1">
          <p
            className={cn('font-medium mb-1', {
              'text-blue-800 dark:text-blue-400': type === 'info' || type === 'tip',
              'text-amber-800 dark:text-amber-400': type === 'warn',
              'text-red-800 dark:text-red-400': type === 'error',
            })}
          >
            {title || defaultTitle}
          </p>
          <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  )
}
