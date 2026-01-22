import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 100 100">
              <rect width="100" height="100" rx="20" fill="currentColor" className="text-primary dark:text-white" />
              <path d="M30 70 L50 30 L70 70" stroke="#D4A27F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="50" cy="55" r="5" fill="#10B981" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Agent Validator Protocol Documentation
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link to="/docs/getting-started" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
              Specification
            </Link>
            <Link to="/reference/schema" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
              VALIDATOR.md
            </Link>
            <Link to="/validators/overview" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
              Examples
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
