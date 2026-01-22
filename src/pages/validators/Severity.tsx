import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/validators/severity.md?raw'

export function ValidatorsSeverity() {
  return <Markdown content={content} />
}
