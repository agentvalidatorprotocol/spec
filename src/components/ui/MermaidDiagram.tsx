import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#10B981',
    primaryTextColor: '#fff',
    primaryBorderColor: '#059669',
    lineColor: '#6B7280',
    secondaryColor: '#D4A27F',
    tertiaryColor: '#F3F4F6',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
})

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        try {
          const { svg } = await mermaid.render(id, chart)
          containerRef.current.innerHTML = svg
        } catch (e) {
          console.error('Mermaid rendering error:', e)
          containerRef.current.innerHTML = `<pre>${chart}</pre>`
        }
      }
    }
    renderChart()
  }, [chart])

  return (
    <div
      ref={containerRef}
      className={`my-8 flex justify-center ${className}`}
    />
  )
}
