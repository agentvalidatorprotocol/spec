import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import { MermaidDiagram } from './MermaidDiagram'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, node, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const content = String(children)
            const isBlock = match || content.includes('\n')

            // Handle mermaid diagrams
            if (match?.[1] === 'mermaid') {
              return <MermaidDiagram chart={content.replace(/\n$/, '')} />
            }

            if (!isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock
                code={content.replace(/\n$/, '')}
                language={match?.[1] || 'text'}
              />
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
          h1({ children }) {
            return <h1>{children}</h1>
          },
          h2({ children, ...props }) {
            const id = String(children)
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, '')
            return <h2 id={id} className="scroll-mt-nav" {...props}>{children}</h2>
          },
          h3({ children, ...props }) {
            const id = String(children)
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, '')
            return <h3 id={id} {...props}>{children}</h3>
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-accent-mint pl-4 italic text-gray-600 dark:text-gray-400">
                {children}
              </blockquote>
            )
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table>{children}</table>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
