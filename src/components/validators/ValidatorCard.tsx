import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { SeverityBadge } from './SeverityBadge'
import { TriggerBadge } from './TriggerBadge'
import type { Validator } from '@/types'

interface ValidatorCardProps {
  validator: Validator
  href: string
}

export function ValidatorCard({ validator, href }: ValidatorCardProps) {
  return (
    <Link to={href}>
      <Card hover className="h-full">
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-mono font-medium text-primary dark:text-white truncate">
                {validator.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {validator.description}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={validator.severity} />
            <TriggerBadge trigger={validator.trigger} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {validator.filePatterns.slice(0, 3).map(pattern => (
              <span
                key={pattern}
                className="px-1.5 py-0.5 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded"
              >
                {pattern}
              </span>
            ))}
            {validator.filePatterns.length > 3 && (
              <span className="px-1.5 py-0.5 text-xs text-gray-500">
                +{validator.filePatterns.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
