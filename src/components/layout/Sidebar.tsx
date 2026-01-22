import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navigation } from '@/data/navigation'
import type { NavItem } from '@/types'

interface SidebarItemProps {
  item: NavItem
  depth?: number
}

function SidebarItem({ item, depth = 0 }: SidebarItemProps) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(
    item.children?.some(child =>
      child.href === location.pathname ||
      child.children?.some(c => c.href === location.pathname || c.children?.some(cc => cc.href === location.pathname))
    ) ?? false
  )

  const hasChildren = item.children && item.children.length > 0
  const isActive = item.href === location.pathname

  if (hasChildren) {
    return (
      <div className={cn(depth > 0 && 'ml-3')}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center justify-between w-full px-3 py-1.5 text-sm text-left rounded transition-colors',
            depth === 0
              ? 'font-medium text-primary dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white'
          )}
        >
          <span>{item.title}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.children!.map((child, index) => (
              <SidebarItem key={child.href || index} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.href!}
      className={cn(
        'sidebar-link',
        depth > 0 && 'ml-3',
        isActive && 'active'
      )}
    >
      {item.title}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
      <nav className="p-4 space-y-4">
        {navigation.map((section, index) => (
          <SidebarItem key={index} item={section} />
        ))}
      </nav>
    </aside>
  )
}
