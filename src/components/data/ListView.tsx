import { useState, type ReactNode, type KeyboardEvent } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui'
import { colors, typography, spacing, radii } from '../../edu-ui/tokens'

export interface ListViewStat {
  label: string
  value: string
  /** 0–100; when set, renders a mini progress bar under the value */
  progress?: number
}

export interface ListViewItem {
  id: string
  /** Leading visual — an emoji, an <svg>, an <img>, anything */
  icon?: ReactNode
  title: string
  subtitle?: string
  /** Right-aligned stat columns, e.g. percent complete, avg reading speed */
  stats?: ListViewStat[]
  /** When set, an ⓘ button opens this content in a popover */
  info?: ReactNode
}

export interface ListViewProps {
  items: ListViewItem[]
  /** Drill-down handler — the whole row is clickable when provided */
  onItemClick?: (item: ListViewItem) => void
  'aria-label'?: string
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5" r="1" fill="currentColor" />
      <rect x="7.25" y="7" width="1.5" height="5" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCell({ stat }: { stat: ListViewStat }) {
  return (
    <div style={{ width: '110px', textAlign: 'right', flexShrink: 0 }}>
      <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.textPrimary }}>
        {stat.value}
      </div>
      {stat.progress !== undefined ? (
        <div
          role="progressbar"
          aria-valuenow={stat.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={stat.label}
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: colors.neutral100,
            borderRadius: radii.full,
            overflow: 'hidden',
            margin: `${spacing.xs} 0`,
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, stat.progress))}%`,
              height: '100%',
              backgroundColor: colors.primary,
            }}
          />
        </div>
      ) : null}
      <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{stat.label}</div>
    </div>
  )
}

function ListViewRow({
  item,
  onItemClick,
}: {
  item: ListViewItem
  onItemClick?: (item: ListViewItem) => void
}) {
  const [hovered, setHovered] = useState(false)
  const clickable = Boolean(onItemClick)

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onItemClick?.(item)
    }
  }

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onItemClick?.(item) : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: `${spacing.md} ${spacing.lg}`,
        backgroundColor: hovered && clickable ? colors.neutral50 : 'transparent',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'background-color 150ms',
        outline: 'none',
      }}
    >
      {item.icon !== undefined && (
        <div
          aria-hidden
          style={{
            width: '40px',
            height: '40px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.sizes.xl,
            backgroundColor: colors.primaryLight,
            borderRadius: radii.md,
          }}
        >
          {item.icon}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: typography.sizes.md,
            fontWeight: typography.weights.medium,
            color: colors.textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.title}
        </div>
        {item.subtitle && (
          <div style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{item.subtitle}</div>
        )}
      </div>

      {item.stats?.map((stat) => (
        <StatCell key={stat.label} stat={stat} />
      ))}

      {item.info !== undefined && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label={`More info about ${item.title}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                flexShrink: 0,
                border: 'none',
                backgroundColor: 'transparent',
                color: colors.neutral500,
                borderRadius: radii.full,
                cursor: 'pointer',
              }}
            >
              <InfoIcon />
            </button>
          </PopoverTrigger>
          <PopoverContent onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: typography.sizes.sm, color: colors.textPrimary }}>{item.info}</div>
          </PopoverContent>
        </Popover>
      )}

      {clickable && (
        <span aria-hidden style={{ display: 'flex', color: colors.neutral500, flexShrink: 0 }}>
          <ChevronIcon />
        </span>
      )}
    </div>
  )
}

/**
 * Standardized list view: leading icon, title/subtitle, right-aligned stat
 * columns, optional info popover, and row-level drill-down. Used for the
 * student's book list and the teacher's student roster alike.
 */
export function ListView({ items, onItemClick, 'aria-label': ariaLabel }: ListViewProps) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.neutral300}`,
        borderRadius: radii.lg,
        overflow: 'hidden',
      }}
    >
      {items.map((item, i) => (
        <div key={item.id} role="listitem" style={i > 0 ? { borderTop: `1px solid ${colors.neutral100}` } : undefined}>
          <ListViewRow item={item} onItemClick={onItemClick} />
        </div>
      ))}
    </div>
  )
}
