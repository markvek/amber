import { useState, type ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { Label, Input, Card, CardHeader, CardTitle, CardContent, Badge, Textarea, Separator, Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, Popover, PopoverTrigger, PopoverContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/ui'
import { colors, typography, spacing, radii, shadows } from '../edu-ui/tokens'
import { GrainOverlay } from '../components/layout/GrainOverlay'
import { ListView } from '../components/data/ListView'

type FontFamily = 'inter' | 'georgia' | 'opendyslexic'

const fontFamilies: Record<FontFamily, string> = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  georgia: "'Georgia', 'Garamond', serif",
  opendyslexic: "'OpenDyslexic', sans-serif",
}

// Page-specific helpers — not reusable, co-located per placement rule 3

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: spacing['2xl'] }}>
      <h2
        style={{
          fontSize: typography.sizes.xl,
          fontWeight: typography.weights.semibold,
          color: colors.textPrimary,
          marginBottom: spacing.md,
          paddingBottom: spacing.sm,
          borderBottom: `1px solid ${colors.neutral300}`,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ width: '120px' }}>
      <div
        style={{
          height: '64px',
          backgroundColor: value,
          borderRadius: radii.md,
          border: `1px solid ${colors.neutral300}`,
          marginBottom: spacing.xs,
        }}
      />
      <div style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.textPrimary }}>
        {name}
      </div>
      <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{value}</div>
    </div>
  )
}

function SwatchGroup({ label, entries }: { label: string; entries: [string, string][] }) {
  return (
    <div style={{ marginBottom: spacing.lg }}>
      <h3
        style={{
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.medium,
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: spacing.sm,
        }}
      >
        {label}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
        {entries.map(([name, value]) => (
          <Swatch key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  )
}

function TypeSpecimen({ name, size }: { name: string; size: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.md, marginBottom: spacing.sm }}>
      <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, width: '80px', flexShrink: 0 }}>
        {name} · {size}
      </span>
      <span style={{ fontSize: size, color: colors.textPrimary, lineHeight: typography.lineHeights.tight }}>
        Learning made delightful
      </span>
    </div>
  )
}


const brandEntries: [string, string][] = [
  ['primary', colors.primary],
  ['primaryHover', colors.primaryHover],
  ['primaryLight', colors.primaryLight],
  ['accent', colors.accent],
  ['accentLight', colors.accentLight],
]

const semanticEntries: [string, string][] = [
  ['success', colors.success],
  ['warning', colors.warning],
  ['error', colors.error],
  ['info', colors.info],
  ['select', colors.select],
]

const neutralEntries: [string, string][] = [
  ['neutral900', colors.neutral900],
  ['neutral700', colors.neutral700],
  ['neutral500', colors.neutral500],
  ['neutral300', colors.neutral300],
  ['neutral100', colors.neutral100],
  ['neutral50', colors.neutral50],
]

export function EduGlobals() {
  const [font, setFont] = useState<FontFamily>('inter')

  const currentFontFamily = fontFamilies[font]

  return (
    <div
      style={{
        fontFamily: currentFontFamily,
        backgroundColor: colors.background,
        color: colors.textPrimary,
        maxWidth: '960px',
        margin: '0 auto',
        padding: spacing.xl,
      }}
    >
      <header style={{ marginBottom: spacing['2xl'] }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
          }}
        >
          <div>
            <h1 style={{ fontSize: typography.sizes['3xl'], fontWeight: typography.weights.bold, marginBottom: spacing.xs }}>
              edu-ui Globals
            </h1>
            <p style={{ fontSize: typography.sizes.md, color: colors.textSecondary }}>
              The living reference for edu-ui design tokens and components. Every component in the system is registered here.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
              alignItems: 'flex-end',
            }}
          >
            <label style={{ fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.textSecondary }}>
              Font:
            </label>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              {(['inter', 'georgia', 'opendyslexic'] as FontFamily[]).map((fontOption) => (
                <button
                  key={fontOption}
                  onClick={() => setFont(fontOption)}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    border: `2px solid ${font === fontOption ? colors.primary : colors.neutral300}`,
                    backgroundColor: font === fontOption ? colors.primaryLight : colors.surface,
                    color: font === fontOption ? colors.primary : colors.textSecondary,
                    borderRadius: radii.md,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                >
                  {fontOption === 'opendyslexic' ? 'OpenDyslexic' : fontOption.charAt(0).toUpperCase() + fontOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <Section title="Colors">
        <SwatchGroup label="Brand" entries={brandEntries} />
        <SwatchGroup label="Semantic" entries={semanticEntries} />
        <SwatchGroup label="Neutrals" entries={neutralEntries} />
      </Section>

      <Section title="Typography">
        {Object.entries(typography.sizes).map(([name, size]) => (
          <TypeSpecimen key={name} name={name} size={size} />
        ))}
        <div style={{ display: 'flex', gap: spacing.lg, marginTop: spacing.md }}>
          {Object.entries(typography.weights).map(([name, weight]) => (
            <span key={name} style={{ fontWeight: weight, fontSize: typography.sizes.lg }}>
              {name} {weight}
            </span>
          ))}
        </div>
      </Section>

      <Section title="List View">
        <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md }}>
          Standardized list (src/components/data/ListView): leading icon, title, right-aligned stat columns,
          optional ⓘ popover, and row click for drill-down. Same component serves the student's book list
          and the teacher's student roster.
        </p>

        <h3 style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.textPrimary, marginBottom: spacing.sm }}>
          Book list (student reader)
        </h3>
        <div style={{ marginBottom: spacing.lg }}>
          <ListView
            aria-label="Book list example"
            onItemClick={(item) => console.log(`Drill down: ${item.title}`)}
            items={[
              {
                id: 'book-1',
                icon: '📕',
                title: "Charlotte's Web",
                subtitle: 'E.B. White',
                stats: [
                  { label: 'complete', value: '64%', progress: 64 },
                  { label: 'avg speed', value: '182 wpm' },
                ],
                info: 'Assigned for Unit 3. Due Friday, Sep 12.',
              },
              {
                id: 'book-2',
                icon: '📗',
                title: 'The Giver',
                subtitle: 'Lois Lowry',
                stats: [
                  { label: 'complete', value: '12%', progress: 12 },
                  { label: 'avg speed', value: '164 wpm' },
                ],
                info: 'Independent reading pick.',
              },
            ]}
          />
        </div>

        <h3 style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.textPrimary, marginBottom: spacing.sm }}>
          Student roster (teacher view)
        </h3>
        <ListView
          aria-label="Student roster example"
          onItemClick={(item) => console.log(`Drill down: ${item.title}`)}
          items={[
            {
              id: 'student-1',
              icon: '🧑‍🎓',
              title: 'Jordan Alvarez',
              subtitle: 'Reading: The Giver',
              stats: [
                { label: 'complete', value: '78%', progress: 78 },
                { label: 'avg speed', value: '201 wpm' },
              ],
              info: 'Up 14 wpm since last month.',
            },
            {
              id: 'student-2',
              icon: '🧑‍🎓',
              title: 'Sam Osei',
              subtitle: "Reading: Charlotte's Web",
              stats: [
                { label: 'complete', value: '35%', progress: 35 },
                { label: 'avg speed', value: '148 wpm' },
              ],
              info: 'Missed the last two reading sessions.',
            },
          ]}
        />
      </Section>

      <Section title="Grain Overlay">
        <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md }}>
          Paper-grain texture component (src/components/layout/GrainOverlay). Rendered app-wide over the
          canvas and cards; intensity is adjustable.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg }}>
          {[0.15, 0.25, 0.5].map((intensity) => (
            <div key={intensity} style={{ textAlign: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '160px',
                  height: '100px',
                  backgroundColor: colors.background,
                  borderRadius: radii.md,
                  border: `1px solid ${colors.neutral300}`,
                  overflow: 'hidden',
                  marginBottom: spacing.xs,
                }}
              >
                <GrainOverlay position="absolute" intensity={intensity} />
              </div>
              <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>
                intensity {intensity}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radii & Shadows">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg }}>
          {Object.entries(radii).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: colors.primaryLight,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: value,
                  marginBottom: spacing.xs,
                }}
              />
              <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>
                {name} · {value}
              </span>
            </div>
          ))}
          {Object.entries(shadows).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: colors.surface,
                  borderRadius: radii.md,
                  boxShadow: value,
                  marginBottom: spacing.xs,
                }}
              />
              <span style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>shadow {name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons & Components">
        <div style={{ marginBottom: spacing['2xl'] }}>
          <h3
            style={{
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.medium,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
          >
            Primary (Blue #1360C4)
          </h3>
          <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md }}>
            Main CTAs, hero buttons, primary actions. Use for "Start lesson," "Submit answer," "Continue."
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.md,
              padding: spacing.lg,
              backgroundColor: colors.background,
              borderRadius: radii.lg,
              border: `1px solid ${colors.primary}`,
              boxShadow: shadows.sm,
            }}
          >
            <Button variant="primary">Start Lesson</Button>
            <Button variant="secondary">Submit</Button>
            <Button variant="danger">Delete</Button>
          </div>
        </div>

        <div style={{ marginBottom: spacing['2xl'] }}>
          <h3
            style={{
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.medium,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
          >
            Button Variants
          </h3>
          <p style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md }}>
            Buttons for different actions and states. Use primary for main CTAs, secondary for supporting actions, and semantic colors for contextual meaning.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: spacing.lg,
              padding: spacing.lg,
              backgroundColor: colors.background,
              borderRadius: radii.lg,
              border: `1px solid ${colors.primary}`,
              boxShadow: shadows.sm,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <span style={{ fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.textSecondary }}>
                Primary Action
              </span>
              <Button variant="primary">Primary Button</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <span style={{ fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.textSecondary }}>
                Secondary Action
              </span>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <span style={{ fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.textSecondary }}>
                Danger Action
              </span>
              <Button variant="danger">Delete Button</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <span style={{ fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.textSecondary }}>
                Disabled State
              </span>
              <Button variant="primary" disabled>
                Disabled Button
              </Button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: spacing['2xl'] }}>
          <h3
            style={{
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.medium,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
          >
            Semantic Colors
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing.lg,
              padding: spacing.lg,
              backgroundColor: colors.background,
              borderRadius: radii.lg,
              border: `1px solid ${colors.primary}`,
              boxShadow: shadows.sm,
            }}
          >
            <div
              style={{
                padding: spacing.md,
                backgroundColor: colors.success,
                color: colors.textInverse,
                borderRadius: radii.md,
                fontSize: typography.sizes.sm,
              }}
            >
              ✓ Success — "Correct answer"
            </div>
            <div
              style={{
                padding: spacing.md,
                backgroundColor: colors.warning,
                color: colors.textInverse,
                borderRadius: radii.md,
                fontSize: typography.sizes.sm,
              }}
            >
              ⚠ Warning — "Incomplete profile"
            </div>
            <div
              style={{
                padding: spacing.md,
                backgroundColor: colors.error,
                color: colors.textInverse,
                borderRadius: radii.md,
                fontSize: typography.sizes.sm,
              }}
            >
              ✕ Error — "Delete account"
            </div>
            <div
              style={{
                padding: spacing.md,
                backgroundColor: colors.info,
                color: colors.textInverse,
                borderRadius: radii.md,
                fontSize: typography.sizes.sm,
              }}
            >
              ℹ Info — "Course requirement"
            </div>
            <div
              style={{
                padding: spacing.md,
                backgroundColor: colors.select,
                color: colors.textInverse,
                borderRadius: radii.md,
                fontSize: typography.sizes.sm,
              }}
            >
              ◆ Select — "Active selection"
            </div>
          </div>
        </div>

        <div
          style={{
            padding: spacing.lg,
            border: `1px solid ${colors.primary}`,
            borderRadius: radii.lg,
            boxShadow: shadows.sm,
            backgroundColor: colors.background,
          }}
        >
          <h3 style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.medium, marginBottom: spacing.md, color: colors.textPrimary }}>
            Imported UI Components (Radix-based)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg }}>
            <div>
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.sm }}>Input with Label</p>
              <Label htmlFor="demo-input">Email address</Label>
              <Input id="demo-input" placeholder="you@example.com" style={{ marginTop: spacing.sm }} />
            </div>
            <div>
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.sm }}>Card Component</p>
              <Card style={{ backgroundColor: colors.background }}>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                </CardHeader>
                <CardContent>Content goes here</CardContent>
              </Card>
            </div>
            <div>
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.sm }}>Badges</p>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <Badge>Primary</Badge>
                <Badge>Secondary</Badge>
                <Badge>Accent</Badge>
              </div>
            </div>
            <div>
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.sm }}>Textarea</p>
              <Textarea placeholder="Enter your message..." />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: spacing['2xl'] }}>
          <h3 style={{ fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, marginBottom: spacing.md, color: colors.textPrimary }}>
            Component Library Showcase
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: spacing.lg }}>
            {/* Card */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Card</h4>
              <Card>
                <CardHeader>
                  <CardTitle>Card Example</CardTitle>
                </CardHeader>
                <CardContent>Composable content container</CardContent>
              </Card>
            </div>

            {/* Badge */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Badge</h4>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <Badge>New</Badge>
                <Badge>Featured</Badge>
                <Badge>Active</Badge>
              </div>
            </div>

            {/* Button */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Button</h4>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Delete</Button>
              </div>
            </div>

            {/* Input */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Input</h4>
              <Label htmlFor="demo-input">Text input</Label>
              <Input id="demo-input" placeholder="Enter text..." style={{ marginTop: spacing.sm }} />
            </div>

            {/* Label */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Label</h4>
              <Label htmlFor="demo-checkbox">
                <input id="demo-checkbox" type="checkbox" style={{ marginRight: spacing.sm }} />
                Remember me
              </Label>
            </div>

            {/* Textarea */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Textarea</h4>
              <Textarea placeholder="Multi-line input..." style={{ minHeight: '80px' }} />
            </div>

            {/* Separator */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.md, color: colors.textPrimary }}>Separator</h4>
              <div>Content above</div>
              <Separator style={{ margin: `${spacing.md} 0` }} />
              <div>Content below</div>
            </div>

            {/* Sheet */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Sheet (Modal)</h4>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="primary">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Dialog</SheetTitle>
                  </SheetHeader>
                  <div style={{ marginTop: spacing.md }}>Modal content here</div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Popover */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Popover (Definition)</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary">Hover for definition</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div style={{ fontSize: typography.sizes.sm }}>
                    <strong>Definition:</strong> A popover provides additional info in a floating panel
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Collapsible */}
            <div style={{ padding: spacing.lg, border: `1px solid ${colors.primary}`, borderRadius: radii.lg, backgroundColor: colors.background, boxShadow: shadows.sm }}>
              <h4 style={{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginBottom: spacing.sm, color: colors.textPrimary }}>Collapsible</h4>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="secondary">▶ Expand Section</Button>
                </CollapsibleTrigger>
                <CollapsibleContent style={{ marginTop: spacing.sm }}>
                  Hidden content revealed on expand
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
