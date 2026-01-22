import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-primary text-white hover:bg-primary-light focus:ring-primary dark:bg-white dark:text-primary dark:hover:bg-gray-200': variant === 'primary',
          'bg-gray-100 text-primary hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700': variant === 'secondary',
          'text-gray-600 hover:text-primary hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800': variant === 'ghost',
          'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
          'px-4 py-2 text-sm gap-2': size === 'md',
          'px-6 py-3 text-base gap-2': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
