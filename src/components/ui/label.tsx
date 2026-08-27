import React, { type ComponentProps } from 'react'
import * as LabelPrimitive from 'radix-ui/label'
import { typography, spacing } from '../../edu-ui/tokens'

export interface LabelProps extends ComponentProps<typeof LabelPrimitive.Root> {}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      cursor: 'pointer',
      userSelect: 'none',
    }}
    {...props}
  />
))

Label.displayName = 'Label'
