import React, { type InputHTMLAttributes } from 'react'
import { colors, typography, spacing, radii } from '../../edu-ui/tokens'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      style={{
        height: '2rem',
        width: '100%',
        minWidth: 0,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
        fontSize: typography.sizes.sm,
        border: `1px solid ${colors.neutral300}`,
        borderRadius: radii.md,
        backgroundColor: colors.surface,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily,
        transition: 'border-color 200ms, box-shadow 200ms',
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = colors.primary
        e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = colors.neutral300
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...props}
    />
  )
)

Input.displayName = 'Input'
