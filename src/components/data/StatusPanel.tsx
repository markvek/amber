import { colors, typography, spacing, radii } from '../../edu-ui/tokens'

/** Card-shaped placeholder that stands in for a ListView while loading or on error. */
export function StatusPanel({ message, tone = 'muted' }: { message: string; tone?: 'muted' | 'error' }) {
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.neutral300}`,
        borderRadius: radii.lg,
        padding: spacing.lg,
        fontSize: typography.sizes.sm,
        color: tone === 'error' ? colors.error : colors.textSecondary,
      }}
    >
      {message}
    </div>
  )
}
