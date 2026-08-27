import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 500,
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: '#3b82f6',
        color: 'white',
      },
      secondary: {
        backgroundColor: '#6b7280',
        color: 'white',
      },
      danger: {
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }

    return (
      <button
        ref={ref}
        style={{ ...baseStyles, ...variantStyles[variant], ...style }}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
