import { Markdown } from '@/components/ui/Markdown'
import content from '@/content/docs/introduction.md?raw'

export function GettingStarted() {
  return <Markdown content={content} />
}
