import { useEffect, useRef, useState } from 'react'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  title: string
  href: string
  category: string
  excerpt?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockResults: SearchResult[] = [
  { title: 'no-secrets', href: '/validators/security/no-secrets', category: 'Security' },
  { title: 'Triggers Reference', href: '/reference/triggers', category: 'Reference' },
  { title: 'Creating Validators', href: '/validators/creating/format', category: 'Validators' },
  { title: 'Severity Levels', href: '/validators/severity', category: 'Validators' },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredResults = query
    ? mockResults.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      )
    : mockResults

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => Math.min(i + 1, filteredResults.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          if (filteredResults[selectedIndex]) {
            window.location.href = filteredResults[selectedIndex].href
            onClose()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, filteredResults, selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              placeholder="Search documentation..."
              className="flex-1 bg-transparent text-primary dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredResults.length > 0 ? (
              <ul className="py-2">
                {filteredResults.map((result, index) => (
                  <li key={result.href}>
                    <a
                      href={result.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 transition-colors',
                        index === selectedIndex
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      )}
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary dark:text-white">{result.title}</p>
                        <p className="text-xs text-gray-500">{result.category}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No results found for "{query}"
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
