import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, type NavItem } from '../types/navigation'
import { colors, typography, spacing, radii } from '../edu-ui/tokens'

const GROUP_LABELS: Record<'student' | 'teacher', string> = {
  student: 'Student',
  teacher: 'Teacher',
}

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <h3
        style={{
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.semibold,
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: spacing.sm,
          paddingLeft: spacing.md,
        }}
      >
        {label}
      </h3>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              color: isActive ? colors.primary : colors.textSecondary,
              backgroundColor: isActive ? colors.primaryLight : 'transparent',
              borderRadius: radii.md,
              textAlign: 'left',
              textDecoration: 'none',
              transition: 'all 200ms',
              borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent',
              paddingLeft: `calc(${spacing.md} - 3px)`,
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = colors.neutral100
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function LeftSidebar() {
  const visibleItems = NAV_ITEMS.filter((item) => !item.hidden)
  const studentItems = visibleItems.filter((item) => item.group === 'student')
  const teacherItems = visibleItems.filter((item) => item.group === 'teacher')

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.neutral300}`,
        padding: spacing.lg,
        overflowY: 'auto',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ marginBottom: spacing.xl }}>
        <h1
          style={{
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.bold,
            color: colors.textPrimary,
            marginBottom: spacing.xs,
          }}
        >
          Amber
        </h1>
        <p
          style={{
            fontSize: typography.sizes.xs,
            color: colors.textSecondary,
          }}
        >
          Learning platform
        </p>
      </div>

      <NavGroup label={GROUP_LABELS.student} items={studentItems} />
      <NavGroup label={GROUP_LABELS.teacher} items={teacherItems} />
    </aside>
  )
}
