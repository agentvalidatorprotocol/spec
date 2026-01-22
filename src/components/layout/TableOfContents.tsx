import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TableOfContentsItem } from '@/types'

interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    items.forEach(item => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside className="hidden xl:block fixed top-16 right-0 w-56 h-[calc(100vh-4rem)] overflow-y-auto p-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        On this page
      </p>
      <nav>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block text-sm transition-colors',
                  item.level === 3 && 'pl-3',
                  item.level === 4 && 'pl-6',
                  activeId === item.id
                    ? 'text-accent-mint font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white'
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
