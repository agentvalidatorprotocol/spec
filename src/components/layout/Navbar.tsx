import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Moon, Sun, Github, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { topNavTabs } from '@/data/navigation'
import { SearchModal } from '@/components/ui/SearchModal'

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const isActiveTab = (href: string) => {
    return location.pathname.startsWith(href.split('/').slice(0, 2).join('/'))
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 100 100">
                  <rect width="100" height="100" rx="20" fill="currentColor" className="text-primary dark:text-white" />
                  <path d="M30 70 L50 30 L70 70" stroke="#D4A27F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="50" cy="55" r="5" fill="#10B981" />
                </svg>
                <span className="font-semibold text-primary dark:text-white">Agent Validator Protocol</span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {topNavTabs.map(tab => (
                  <Link
                    key={tab.href}
                    to={tab.href}
                    className={cn(
                      'nav-link',
                      isActiveTab(tab.href) && 'active'
                    )}
                  >
                    {tab.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">⌘K</kbd>
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/anthropics/agent-validator-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
            <div className="px-4 py-2 space-y-1">
              {topNavTabs.map(tab => (
                <Link
                  key={tab.href}
                  to={tab.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm',
                    isActiveTab(tab.href)
                      ? 'bg-gray-100 dark:bg-gray-800 text-primary dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {tab.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
