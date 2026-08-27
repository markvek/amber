import { colors, typography, spacing, radii, shadows } from '../edu-ui/tokens'

export function TeacherAnalyticsPage() {
  return (
    <div
      style={{
        padding: spacing.xl,
        maxWidth: '1200px',
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
        Analytics
      </h1>
      <p
        style={{
          fontSize: typography.sizes.md,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        }}
      >
        Track student progress and engagement
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing.xl,
        }}
      >
        {/* Stat cards */}
        {[
          { label: 'Active Students', value: '24' },
          { label: 'Avg. Reading Time', value: '2h 15m' },
          { label: 'Completion Rate', value: '78%' },
          { label: 'Avg. Score', value: '8.2/10' },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: spacing.lg,
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              border: `1px solid ${colors.neutral300}`,
              boxShadow: shadows.sm,
            }}
          >
            <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.sm }}>
              {label}
            </p>
            <p style={{ fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.primary }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {['Student Progress', 'Reading Frequency', 'Class Performance'].map((chartName) => (
          <div
            key={chartName}
            style={{
              padding: spacing.lg,
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              border: `1px solid ${colors.neutral300}`,
              boxShadow: shadows.sm,
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.textSecondary }}>
                {chartName}
              </p>
              <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.sm }}>
                Chart placeholder
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
