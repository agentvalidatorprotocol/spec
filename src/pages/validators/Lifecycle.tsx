import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/validators/lifecycle.md?raw'

export function ValidatorsLifecycle() {
  return <Markdown content={content} />
}
