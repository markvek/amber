import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { colors } from '../../../edu-ui/tokens'

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
        backgroundColor: colors.primary,
        color: colors.textInverse,
      },
      secondary: {
        backgroundColor: colors.neutral500,
        color: colors.textInverse,
      },
      danger: {
        backgroundColor: colors.error,
        color: colors.textInverse,
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
