import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/validators/triggers.md?raw'

export function ValidatorsTriggers() {
  return <Markdown content={content} />
}
