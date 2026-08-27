import { colors, typography, spacing, radii, shadows } from '../edu-ui/tokens'

export function StudentReadingPage() {
  return (
    <div
      style={{
        padding: spacing.xl,
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: typography.sizes['3xl'],
          fontWeight: typography.weights.bold,
          color: colors.textPrimary,
          marginBottom: spacing.md,
        }}
      >
        Reading Experience
      </h1>
      <p
        style={{
          fontSize: typography.sizes.md,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        }}
      >
        Immerse yourself in your current read
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: spacing.lg,
        }}
      >
        {/* Main reading area */}
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            border: `1px solid ${colors.neutral300}`,
            boxShadow: shadows.sm,
          }}
        >
          <h2 style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.semibold, marginBottom: spacing.md }}>
            Chapter 5: The Beginning
          </h2>
          <div style={{ lineHeight: '1.8', color: colors.textPrimary }}>
            <p style={{ marginBottom: spacing.md }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {/* Progress */}
          <div
            style={{
              padding: spacing.md,
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              border: `1px solid ${colors.neutral300}`,
            }}
          >
            <p style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm }}>
              Progress
            </p>
            <div style={{ width: '100%', height: '8px', backgroundColor: colors.neutral100, borderRadius: radii.md, overflow: 'hidden' }}>
              <div style={{ width: '42%', height: '100%', backgroundColor: colors.primary }} />
            </div>
            <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.sm }}>
              Chapter 5 of 12
            </p>
          </div>

          {/* Actions */}
          <div
            style={{
              padding: spacing.md,
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              border: `1px solid ${colors.neutral300}`,
            }}
          >
            <p style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm }}>
              Reading Settings
            </p>
            <button
              style={{
                width: '100%',
                padding: spacing.sm,
                fontSize: typography.sizes.sm,
                backgroundColor: colors.primaryLight,
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: radii.md,
                cursor: 'pointer',
                marginBottom: spacing.sm,
              }}
            >
              Adjust Font
            </button>
            <button
              style={{
                width: '100%',
                padding: spacing.sm,
                fontSize: typography.sizes.sm,
                backgroundColor: colors.primaryLight,
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: radii.md,
                cursor: 'pointer',
              }}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
