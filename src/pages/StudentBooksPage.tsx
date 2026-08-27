import { colors, typography, spacing } from '../edu-ui/tokens'

export function StudentBooksPage() {
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
        My Books
      </h1>
      <p
        style={{
          fontSize: typography.sizes.md,
          color: colors.textSecondary,
          marginBottom: spacing.lg,
        }}
      >
        Browse and manage your reading list
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {/* Placeholder cards */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              padding: spacing.lg,
              backgroundColor: colors.surface,
              borderRadius: '8px',
              border: `1px solid ${colors.neutral300}`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                backgroundColor: colors.primaryLight,
                borderRadius: '4px',
                marginBottom: spacing.md,
              }}
            />
            <p style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium }}>
              Book {i}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
