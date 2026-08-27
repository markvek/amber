import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Label, Separator } from '../components/ui'
import { colors, typography, spacing, radii, shadows } from '../edu-ui/tokens'

type FontFamily = 'inter' | 'georgia' | 'opendyslexic'

const fontFamilies: Record<FontFamily, { label: string; stack: string }> = {
  inter: { label: 'Inter', stack: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  georgia: { label: 'Georgia', stack: "'Georgia', 'Garamond', serif" },
  opendyslexic: { label: 'OpenDyslexic', stack: "'OpenDyslexic', sans-serif" },
}

const MIN_FONT_SIZE = 14
const MAX_FONT_SIZE = 28

export function StudentReadingPage() {
  const [fontSize, setFontSize] = useState(16)
  const [font, setFont] = useState<FontFamily>('inter')

  return (
    <div
      style={{
        padding: spacing.xl,
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: spacing.md,
          marginBottom: spacing.xl,
        }}
      >
        <div>
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
            }}
          >
            Immerse yourself in your current read
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="primary">Edit</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit Reading Experience</SheetTitle>
              <SheetDescription>
                Adjust how the text looks. Changes apply instantly.
              </SheetDescription>
            </SheetHeader>

            <Separator />

            {/* Font size */}
            <div style={{ paddingTop: spacing.md }}>
              <Label htmlFor="font-size-slider">Font size</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm }}>
                <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>A</span>
                <input
                  id="font-size-slider"
                  type="range"
                  min={MIN_FONT_SIZE}
                  max={MAX_FONT_SIZE}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ flex: 1, accentColor: colors.primary, cursor: 'pointer' }}
                />
                <span style={{ fontSize: typography.sizes.lg, color: colors.textSecondary }}>A</span>
              </div>
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
                {fontSize}px
              </p>
            </div>

            {/* Font family */}
            <div style={{ paddingTop: spacing.md }}>
              <Label>Font</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginTop: spacing.sm }}>
                {(Object.keys(fontFamilies) as FontFamily[]).map((fontOption) => {
                  const isSelected = font === fontOption
                  return (
                    <button
                      key={fontOption}
                      onClick={() => setFont(fontOption)}
                      style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        fontSize: typography.sizes.md,
                        fontFamily: fontFamilies[fontOption].stack,
                        fontWeight: typography.weights.medium,
                        textAlign: 'left',
                        border: `2px solid ${isSelected ? colors.primary : colors.neutral300}`,
                        backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                        color: isSelected ? colors.primary : colors.textPrimary,
                        borderRadius: radii.md,
                        cursor: 'pointer',
                        transition: 'all 200ms',
                      }}
                    >
                      {fontFamilies[fontOption].label}
                    </button>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

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
            fontFamily: fontFamilies[font].stack,
          }}
        >
          <h2 style={{ fontSize: typography.sizes.xl, fontWeight: typography.weights.semibold, marginBottom: spacing.md }}>
            Chapter 5: The Beginning
          </h2>
          <div style={{ lineHeight: '1.8', color: colors.textPrimary, fontSize: `${fontSize}px` }}>
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
              Notes
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
