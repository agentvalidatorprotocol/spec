import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/reference/schema.md?raw'

export function SchemaReference() {
  return <Markdown content={content} />
}
