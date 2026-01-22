import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E0E0E',
          light: '#1A1A1A',
        },
        accent: {
          warm: '#D4A27F',
          mint: '#10B981',
        },
        severity: {
          info: '#3B82F6',
          warn: '#F59E0B',
          error: '#EF4444',
        },
        background: {
          light: '#FDFDF7',
          dark: '#09090B',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
