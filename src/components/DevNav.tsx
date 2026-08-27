import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, type NavItem } from '../types/navigation'
import { colors, typography, spacing, radii, shadows } from '../edu-ui/tokens'

const GROUP_LABELS: Record<'student' | 'teacher', string> = {
  student: 'Student',
  teacher: 'Teacher',
}

function NavGroup({ label, items, onNavigate }: { label: string; items: NavItem[]; onNavigate: () => void }) {
  return (
    <div style={{ marginBottom: spacing.md }}>
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
            onClick={onNavigate}
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

/**
 * Internal dev tool for jumping between pages — not part of the product UI.
 * A floating code-icon button in the bottom-left toggles a small nav panel.
 */
export function DevNav() {
  const [open, setOpen] = useState(false)

  const visibleItems = NAV_ITEMS.filter((item) => !item.hidden)
  const studentItems = visibleItems.filter((item) => item.group === 'student')
  const teacherItems = visibleItems.filter((item) => item.group === 'teacher')

  const close = () => setOpen(false)

  return (
    <>
      {/* Nav panel — kept mounted so it can fade/slide in and out */}
      <div
        style={{
          position: 'fixed',
          bottom: `calc(${spacing.lg} + 44px + ${spacing.sm})`,
          left: spacing.lg,
          width: '240px',
          maxHeight: `calc(100vh - ${spacing.xl} - 44px - ${spacing.sm})`,
          overflowY: 'auto',
          padding: spacing.md,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.neutral300}`,
          borderRadius: radii.lg,
          boxShadow: shadows.lg,
          zIndex: 100,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms, transform 200ms',
        }}
      >
        <div style={{ marginBottom: spacing.md, paddingLeft: spacing.md }}>
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
            Dev navigation
          </p>
        </div>

        <NavGroup label={GROUP_LABELS.student} items={studentItems} onNavigate={close} />
        <NavGroup label={GROUP_LABELS.teacher} items={teacherItems} onNavigate={close} />
      </div>

      {/* Floating toggle button */}
      <button
        aria-label="Toggle dev navigation"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: spacing.lg,
          left: spacing.lg,
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: open ? colors.primary : colors.surface,
          color: open ? colors.textInverse : colors.textSecondary,
          border: `1px solid ${open ? colors.primary : colors.neutral300}`,
          borderRadius: radii.full,
          boxShadow: shadows.md,
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 200ms',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </button>
    </>
  )
}
