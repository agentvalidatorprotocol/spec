import { useMemo } from 'react'
import { validators } from '@/data/validators'
import { navigation } from '@/data/navigation'
import type { NavItem } from '@/types'

interface SearchResult {
  title: string
  href: string
  category: string
  excerpt?: string
}

function flattenNav(items: NavItem[], category = ''): SearchResult[] {
  const results: SearchResult[] = []

  for (const item of items) {
    if (item.href) {
      results.push({
        title: item.title,
        href: item.href,
        category: category || 'Docs',
      })
    }
    if (item.children) {
      results.push(...flattenNav(item.children, item.title))
    }
  }

  return results
}

export function useSearch(query: string) {
  const allResults = useMemo(() => {
    const navResults = flattenNav(navigation)
    const validatorResults: SearchResult[] = validators.map(v => ({
      title: v.name,
      href: `/validators/${v.tags[0] || 'other'}/${v.name}`,
      category: 'Validators',
      excerpt: v.description,
    }))

    return [...navResults, ...validatorResults]
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return allResults.slice(0, 5)

    const lowerQuery = query.toLowerCase()
    return allResults.filter(
      r =>
        r.title.toLowerCase().includes(lowerQuery) ||
        r.category.toLowerCase().includes(lowerQuery) ||
        r.excerpt?.toLowerCase().includes(lowerQuery)
    )
  }, [query, allResults])

  return results
}
