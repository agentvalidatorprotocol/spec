import type { NavItem } from '@/types'

export const navigation: NavItem[] = [
  {
    title: 'About AVP',
    children: [
      { title: 'Introduction', href: '/docs/getting-started' },
    ],
  },
  {
    title: 'Core Concepts',
    children: [
      { title: 'Lifecycle', href: '/validators/lifecycle' },
      { title: 'Triggers', href: '/validators/triggers' },
      { title: 'Severity Levels', href: '/validators/severity' },
    ],
  },
  {
    title: 'Reference',
    children: [
      { title: 'VALIDATOR.md Schema', href: '/reference/schema' },
      { title: 'Response Format', href: '/reference/response-format' },
    ],
  },
  {
    title: 'Examples',
    children: [
      { title: 'Overview', href: '/validators/overview' },
      {
        title: 'Security',
        children: [
          { title: 'no-secrets', href: '/validators/security/no-secrets' },
          { title: 'no-eval', href: '/validators/security/no-eval' },
          { title: 'sql-injection', href: '/validators/security/sql-injection' },
        ],
      },
      {
        title: 'Quality',
        children: [
          { title: 'no-console', href: '/validators/quality/no-console' },
          { title: 'function-length', href: '/validators/quality/function-length' },
          { title: 'complexity', href: '/validators/quality/complexity' },
        ],
      },
      {
        title: 'Documentation',
        children: [
          { title: 'jsdoc-required', href: '/validators/docs/jsdoc-required' },
          { title: 'readme-updated', href: '/validators/docs/readme-updated' },
        ],
      },
    ],
  },
]

export const topNavTabs = [
  { title: 'About', href: '/docs/getting-started' },
  { title: 'Specification', href: '/reference/schema' },
  { title: 'Examples', href: '/validators/overview' },
]
