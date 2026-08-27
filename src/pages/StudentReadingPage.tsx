import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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

const MIN_PAGE_WIDTH = 400
const MAX_PAGE_WIDTH = 900
const MIN_PAGE_HEIGHT = 300
const MAX_PAGE_HEIGHT = 800
const MIN_WORDS_PER_PAGE = 40
const MAX_WORDS_PER_PAGE = 200
const WORDS_PER_PAGE_STEP = 10

const WORD_FADE_MS = 200
const HALF_TRANSITION_MS = 600
const MAX_STAGGER_MS = 30
const PHASE_BUFFER_MS = 50

const WHEEL_THRESHOLD = 120
const WHEEL_COOLDOWN_MS = 400

const PARAGRAPHS: string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
  'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
]

type Token = { word: string; endsParagraph: boolean }

const TOKENS: Token[] = PARAGRAPHS.flatMap((paragraph) => {
  const words = paragraph.split(/\s+/).filter(Boolean)
  return words.map((word, i) => ({ word, endsParagraph: i === words.length - 1 }))
})

const chunkPages = (tokens: Token[], wordsPerPage: number): Token[][] => {
  const pages: Token[][] = []
  for (let i = 0; i < tokens.length; i += wordsPerPage) {
    pages.push(tokens.slice(i, i + wordsPerPage))
  }
  return pages
}

// Paragraph runs within a page; flatIdx drives the animation stagger in reading order
const groupIntoParagraphs = (tokens: Token[]): { token: Token; flatIdx: number }[][] => {
  const paragraphs: { token: Token; flatIdx: number }[][] = []
  let run: { token: Token; flatIdx: number }[] = []
  tokens.forEach((token, flatIdx) => {
    run.push({ token, flatIdx })
    if (token.endsParagraph) {
      paragraphs.push(run)
      run = []
    }
  })
  if (run.length > 0) paragraphs.push(run)
  return paragraphs
}

// Stagger shrinks as pages grow so a full fade phase always fits the HALF_TRANSITION_MS budget
const staggerFor = (wordCount: number) =>
  wordCount <= 1 ? 0 : Math.min(MAX_STAGGER_MS, (HALF_TRANSITION_MS - WORD_FADE_MS) / (wordCount - 1))

const phaseDurationFor = (wordCount: number) =>
  WORD_FADE_MS + staggerFor(wordCount) * Math.max(0, wordCount - 1)

type Phase = 'idle' | 'out' | 'in'

export function StudentReadingPage() {
  const [fontSize, setFontSize] = useState(16)
  const [font, setFont] = useState<FontFamily>('inter')
  const [pageWidth, setPageWidth] = useState(640)
  const [pageHeight, setPageHeight] = useState(480)
  const [wordsPerPage, setWordsPerPage] = useState(80)
  const [pageIndex, setPageIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')

  const timeoutRef = useRef<number | undefined>(undefined)
  const wheelAccumRef = useRef(0)
  const cooldownUntilRef = useRef(0)
  const turnPageRef = useRef<(dir: 1 | -1) => void>(() => {})
  const readingCardRef = useRef<HTMLDivElement>(null)

  const pages = useMemo(() => chunkPages(TOKENS, wordsPerPage), [wordsPerPage])
  const pageCount = pages.length
  const current = Math.min(pageIndex, pageCount - 1)
  const pageTokens = pages[current]
  const stagger = staggerFor(pageTokens.length)

  const turnPage = (dir: 1 | -1) => {
    if (phase !== 'idle') return
    const target = current + dir
    if (target < 0 || target >= pageCount) return
    const outMs = phaseDurationFor(pages[current].length) + PHASE_BUFFER_MS
    const inMs = phaseDurationFor(pages[target].length) + PHASE_BUFFER_MS
    cooldownUntilRef.current = Date.now() + outMs + inMs + WHEEL_COOLDOWN_MS
    setPhase('out')
    timeoutRef.current = window.setTimeout(() => {
      setPageIndex(target)
      setPhase('in')
      timeoutRef.current = window.setTimeout(() => setPhase('idle'), inMs)
    }, outMs)
  }
  turnPageRef.current = turnPage

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  useEffect(() => {
    const el = readingCardRef.current
    if (!el) return
    // Native listener: React's synthetic onWheel is passive, so preventDefault would be a no-op
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Date.now() < cooldownUntilRef.current) {
        wheelAccumRef.current = 0
        return
      }
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      wheelAccumRef.current += delta
      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        const dir = wheelAccumRef.current > 0 ? 1 : -1
        wheelAccumRef.current = 0
        turnPageRef.current(dir)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const prevDisabled = phase !== 'idle' || current === 0
  const nextDisabled = phase !== 'idle' || current === pageCount - 1

  const pagerButtonStyle = (disabled: boolean): CSSProperties => ({
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.sizes.sm,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    borderRadius: radii.md,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 200ms',
  })

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

            <div style={{ paddingTop: spacing.md }}>
              <Separator />
            </div>

            {/* Page width */}
            <div style={{ paddingTop: spacing.md }}>
              <Label htmlFor="page-width-slider">Page width</Label>
              <input
                id="page-width-slider"
                type="range"
                min={MIN_PAGE_WIDTH}
                max={MAX_PAGE_WIDTH}
                step={10}
                value={pageWidth}
                onChange={(e) => setPageWidth(Number(e.target.value))}
                style={{ width: '100%', accentColor: colors.primary, cursor: 'pointer', marginTop: spacing.sm }}
              />
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
                {pageWidth}px
              </p>
            </div>

            {/* Page height */}
            <div style={{ paddingTop: spacing.md }}>
              <Label htmlFor="page-height-slider">Page height</Label>
              <input
                id="page-height-slider"
                type="range"
                min={MIN_PAGE_HEIGHT}
                max={MAX_PAGE_HEIGHT}
                step={10}
                value={pageHeight}
                onChange={(e) => setPageHeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: colors.primary, cursor: 'pointer', marginTop: spacing.sm }}
              />
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
                {pageHeight}px
              </p>
            </div>

            {/* Words per page */}
            <div style={{ paddingTop: spacing.md }}>
              <Label htmlFor="words-per-page-slider">Words per page</Label>
              <input
                id="words-per-page-slider"
                type="range"
                min={MIN_WORDS_PER_PAGE}
                max={MAX_WORDS_PER_PAGE}
                step={WORDS_PER_PAGE_STEP}
                value={wordsPerPage}
                onChange={(e) => {
                  const next = Number(e.target.value)
                  const firstWord = current * wordsPerPage
                  setWordsPerPage(next)
                  setPageIndex(Math.floor(firstWord / next))
                }}
                style={{ width: '100%', accentColor: colors.primary, cursor: 'pointer', marginTop: spacing.sm }}
              />
              <p style={{ fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
                {wordsPerPage} words
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main reading area */}
      <div
        ref={readingCardRef}
        style={{
          width: '100%',
          maxWidth: `${pageWidth}px`,
          margin: '0 auto',
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
        <div
          style={{
            height: `${pageHeight}px`,
            overflow: 'hidden',
            lineHeight: '1.8',
            color: colors.textPrimary,
            fontSize: `${fontSize}px`,
          }}
        >
          {groupIntoParagraphs(pageTokens).map((paragraph, paragraphIdx, allParagraphs) => (
            <p
              key={`${current}-p${paragraphIdx}`}
              style={{ marginBottom: paragraphIdx < allParagraphs.length - 1 ? spacing.md : undefined }}
            >
              {paragraph.map(({ token, flatIdx }) => (
                <span
                  key={`${current}-${flatIdx}`}
                  style={
                    phase === 'idle'
                      ? undefined
                      : {
                          animation: `${phase === 'out' ? 'word-fade-out' : 'word-fade-in'} ${WORD_FADE_MS}ms ease both`,
                          animationDelay: `${Math.round(flatIdx * stagger)}ms`,
                        }
                  }
                >
                  {token.word}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* Pager */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
          marginTop: spacing.md,
        }}
      >
        <button
          aria-label="Previous page"
          disabled={prevDisabled}
          onClick={() => turnPage(-1)}
          style={pagerButtonStyle(prevDisabled)}
        >
          ◀
        </button>
        <span
          style={{
            fontSize: typography.sizes.sm,
            color: colors.textSecondary,
            minWidth: '110px',
            textAlign: 'center',
          }}
        >
          Page {current + 1} of {pageCount}
        </span>
        <button
          aria-label="Next page"
          disabled={nextDisabled}
          onClick={() => turnPage(1)}
          style={pagerButtonStyle(nextDisabled)}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
