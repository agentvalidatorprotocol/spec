import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/validators/no-secrets.md?raw'

export function NoSecrets() {
  return (
    <div>
      <Link
        to="/validators/overview"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary dark:hover:text-white no-underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to validators
      </Link>

      <Markdown content={content} />
    </div>
  )
}
