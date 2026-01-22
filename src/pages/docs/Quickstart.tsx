import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/reference/response-format.md?raw'

export function Quickstart() {
  return <Markdown content={content} />
}
