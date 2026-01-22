import type { Validator } from '@/types'

export const validators: Validator[] = [
  // Security validators
  {
    name: 'no-secrets',
    displayName: 'No Secrets',
    description: 'Detect hardcoded secrets, API keys, and credentials',
    severity: 'error',
    trigger: 'PostToolUse',
    category: 'security',
    filePatterns: ['*'],
    rules: ['api-keys', 'passwords', 'aws-credentials', 'private-keys', 'connection-strings'],
    autoFix: false,
  },
  {
    name: 'no-eval',
    displayName: 'No Eval',
    description: 'Prevent use of eval(), Function(), and similar dangerous functions',
    severity: 'error',
    trigger: 'PostToolUse',
    category: 'security',
    filePatterns: ['*.js', '*.ts', '*.jsx', '*.tsx'],
    rules: ['no-eval', 'no-function-constructor', 'no-implied-eval'],
    autoFix: false,
  },
  {
    name: 'sql-injection',
    displayName: 'SQL Injection',
    description: 'Detect potential SQL injection vulnerabilities',
    severity: 'error',
    trigger: 'PostToolUse',
    category: 'security',
    filePatterns: ['*.js', '*.ts', '*.py', '*.php'],
    rules: ['parameterized-queries', 'no-string-concat', 'orm-usage'],
    autoFix: false,
  },

  // Quality validators
  {
    name: 'no-console',
    displayName: 'No Console',
    description: 'Remove console.log statements from production code',
    severity: 'warn',
    trigger: 'PostToolUse',
    category: 'quality',
    filePatterns: ['*.js', '*.ts', '*.jsx', '*.tsx'],
    rules: ['no-console-log', 'no-console-warn', 'no-console-error'],
    autoFix: true,
  },
  {
    name: 'function-length',
    displayName: 'Function Length',
    description: 'Ensure functions stay under a configurable line limit',
    severity: 'warn',
    trigger: 'PostToolUse',
    category: 'quality',
    filePatterns: ['*.js', '*.ts', '*.jsx', '*.tsx', '*.py'],
    rules: ['max-lines-per-function'],
    autoFix: false,
    estimatedTokens: '200-400',
  },
  {
    name: 'complexity',
    displayName: 'Complexity',
    description: 'Check cyclomatic complexity of functions',
    severity: 'warn',
    trigger: 'PostToolUse',
    category: 'quality',
    filePatterns: ['*.js', '*.ts', '*.jsx', '*.tsx', '*.py'],
    rules: ['max-complexity', 'cognitive-complexity'],
    autoFix: false,
    estimatedTokens: '300-500',
  },

  // Documentation validators
  {
    name: 'jsdoc-required',
    displayName: 'JSDoc Required',
    description: 'Ensure exported functions have JSDoc comments',
    severity: 'info',
    trigger: 'PostToolUse',
    category: 'docs',
    filePatterns: ['*.js', '*.ts', '*.jsx', '*.tsx'],
    rules: ['require-jsdoc', 'valid-jsdoc'],
    autoFix: true,
    estimatedTokens: '100-200',
  },
  {
    name: 'readme-updated',
    displayName: 'README Updated',
    description: 'Check if README reflects recent changes',
    severity: 'info',
    trigger: 'Stop',
    category: 'docs',
    filePatterns: ['README.md', 'README.rst'],
    rules: ['readme-exists', 'readme-current'],
    autoFix: false,
    estimatedTokens: '500-1000',
  },

  // Testing validators
  {
    name: 'coverage-check',
    displayName: 'Coverage Check',
    description: 'Verify test coverage meets thresholds',
    severity: 'warn',
    trigger: 'PostToolUse',
    category: 'testing',
    filePatterns: ['*.test.ts', '*.spec.ts', '*.test.js', '*.spec.js'],
    rules: ['min-coverage', 'branch-coverage', 'function-coverage'],
    autoFix: false,
  },
]

export const validatorsByCategory = validators.reduce((acc, validator) => {
  if (!acc[validator.category]) {
    acc[validator.category] = []
  }
  acc[validator.category].push(validator)
  return acc
}, {} as Record<string, Validator[]>)

export const getValidatorByName = (name: string): Validator | undefined => {
  return validators.find(v => v.name === name)
}
