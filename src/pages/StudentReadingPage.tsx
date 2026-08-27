import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent, Label, Separator } from '../components/ui'
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

const LINE_HEIGHT = 1.8

/**
 * Scroll-scrubbed focus band (after GSAP's SplitText + ScrollTrigger word-opacity
 * technique): the two lines crossing the middle of the reader sit at full ink,
 * everything above and below drops to DIM_OPACITY. Opacity is recomputed from each
 * word's live position on every scroll frame, so the band is tied to the scroll
 * position exactly like a scrubbed timeline.
 */
const DIM_OPACITY = 0.25
const WORD_TRANSITION_MS = 180

/** Height of the scrub dial track, in px — knob and fill are positioned against it */
const RAIL_HEIGHT = 460
const KNOB_HEIGHT = 32
/** Where the dial shows a chapter tick, as a fraction of the book */
const CHAPTER_MARK_FRACTIONS = [0.35, 0.55, 0.75]
/** Assumed pace used only to estimate the time left — the app doesn't measure real speed yet */
const ASSUMED_WPM = 148

const PARAGRAPHS: string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
  'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
  'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
]

const PARAGRAPH_WORDS: string[][] = PARAGRAPHS.map((paragraph) => paragraph.split(/\s+/).filter(Boolean))
const TOTAL_WORDS = PARAGRAPH_WORDS.reduce((sum, words) => sum + words.length, 0)

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={direction === 'up' ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StudentReadingPage() {
  const navigate = useNavigate()

  const [fontSize, setFontSize] = useState(21)
  const [font, setFont] = useState<FontFamily>('georgia')
  const [pageWidth, setPageWidth] = useState(760)
  const [progress, setProgress] = useState(0)

  const scrollerRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const frameRef = useRef<number | undefined>(undefined)

  // Stable flat index per word so refs line up across renders
  const wordOffsets = useMemo(() => {
    const offsets: number[] = []
    let running = 0
    for (const words of PARAGRAPH_WORDS) {
      offsets.push(running)
      running += words.length
    }
    return offsets
  }, [])

  const lineHeightPx = fontSize * LINE_HEIGHT

  // Repaint every word's opacity from its live position: exactly the two text lines
  // nearest the frame's midline are at full ink, every other line is dimmed.
  const paint = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const rect = scroller.getBoundingClientRect()
    const centerY = rect.top + rect.height / 2

    // Group words into lines by their rounded vertical centre
    const lineOf: number[] = []
    const lineYs: number[] = []
    wordRefs.current.forEach((span, i) => {
      if (!span) return
      const r = span.getBoundingClientRect()
      const mid = Math.round(r.top + r.height / 2)
      let line = lineYs.indexOf(mid)
      if (line === -1) {
        line = lineYs.length
        lineYs.push(mid)
      }
      lineOf[i] = line
    })

    // Keep only lines within a line-height of the midline in play, then take the
    // two nearest — so far-away text never lights up when the frame is at its ends
    const focused = new Set(
      lineYs
        .map((y, line) => ({ line, d: Math.abs(y - centerY) }))
        .filter(({ d }) => d <= 2 * lineHeightPx)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .map(({ line }) => line),
    )

    wordRefs.current.forEach((span, i) => {
      if (!span) return
      span.style.opacity = focused.has(lineOf[i]) ? '1' : String(DIM_OPACITY)
    })

    const maxScroll = scroller.scrollHeight - scroller.clientHeight
    setProgress(maxScroll > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / maxScroll)) : 0)
  }
  const paintRef = useRef(paint)
  paintRef.current = paint

  const schedulePaint = () => {
    if (frameRef.current !== undefined) return
    const run = () => {
      frameRef.current = undefined
      paintRef.current()
    }
    // rAF never fires while the document is hidden, so fall back to a timeout there
    frameRef.current =
      document.visibilityState === 'visible' ? requestAnimationFrame(run) : window.setTimeout(run, 32)
  }

  useEffect(() => {
    schedulePaint()
    // A late-loading font reflows every line, so repaint once the fonts settle
    document.fonts?.ready.then(schedulePaint)
    window.addEventListener('resize', schedulePaint)
    return () => {
      window.removeEventListener('resize', schedulePaint)
      if (frameRef.current !== undefined) {
        // The pending id may be either a rAF or a timeout — cancel both ways
        cancelAnimationFrame(frameRef.current)
        window.clearTimeout(frameRef.current)
        frameRef.current = undefined
      }
    }
    // Re-run whenever a setting reflows the text
  }, [font, fontSize, pageWidth])

  const scrollByLines = (lines: number) => {
    scrollerRef.current?.scrollBy({ top: lines * lineHeightPx, behavior: 'smooth' })
  }

  // The footer advertises the space bar, so it has to actually drift the page
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.isContentEditable)) return
      if (e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        scrollerRef.current?.scrollBy({ top: 3 * fontSize * LINE_HEIGHT, behavior: 'smooth' })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        scrollerRef.current?.scrollBy({ top: -3 * fontSize * LINE_HEIGHT, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fontSize])

  // Drag or click anywhere on the dial to travel through the chapter
  const scrubToClientY = (clientY: number) => {
    const rail = railRef.current
    const scroller = scrollerRef.current
    if (!rail || !scroller) return
    const rect = rail.getBoundingClientRect()
    const fraction = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
    scroller.scrollTop = fraction * (scroller.scrollHeight - scroller.clientHeight)
  }

  const handleRailPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    scrubToClientY(e.clientY)
  }

  const handleRailPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return
    scrubToClientY(e.clientY)
  }

  const wordsLeft = Math.round(TOTAL_WORDS * (1 - progress))
  const minutesLeft = Math.max(1, Math.round(wordsLeft / ASSUMED_WPM))

  const metaTextStyle: CSSProperties = {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    width: '220px',
    flexShrink: 0,
  }

  // DevNav parks a fixed 44px button in the bottom-left corner on every page; inset the
  // left label past it rather than widening the footer, so the pager stays centred.
  const footerLeftInset = `calc(${spacing.lg} + 44px + ${spacing.sm} - ${spacing.xl})`

  const railLabelStyle: CSSProperties = {
    fontSize: '11px',
    fontWeight: typography.weights.semibold,
    letterSpacing: '0.1em',
    color: colors.neutral500,
  }

  const scrollButtonStyle = (variant: 'quiet' | 'primary'): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    flexShrink: 0,
    padding: 0,
    border: 'none',
    borderRadius: radii.full,
    backgroundColor: variant === 'primary' ? colors.primary : colors.surface,
    color: variant === 'primary' ? colors.textInverse : colors.neutral500,
    boxShadow: variant === 'primary' ? shadows.md : shadows.sm,
    cursor: 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
      {/* Chrome — deliberately thin so the page itself carries the screen */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '72px',
          flexShrink: 0,
          padding: `0 ${spacing.xl}`,
        }}
      >
        <button
          aria-label="Close reader"
          onClick={() => navigate('/student/books')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            flexShrink: 0,
            padding: 0,
            border: 'none',
            borderRadius: radii.full,
            backgroundColor: colors.neutral100,
            color: colors.neutral700,
            cursor: 'pointer',
          }}
        >
          <CloseIcon />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div style={{ fontSize: '13px', fontWeight: typography.weights.semibold, color: colors.neutral700 }}>
            The Salt Road
          </div>
          <div style={railLabelStyle}>CHAPTER 4</div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '34px',
                padding: `0 ${spacing.md}`,
                border: 'none',
                borderRadius: radii.md,
                backgroundColor: colors.surface,
                boxShadow: shadows.sm,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.medium,
                color: colors.neutral700,
                cursor: 'pointer',
              }}
            >
              Select Font
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={8} style={{ width: '320px' }}>
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

            <div style={{ paddingTop: spacing.md }}>
              <Separator />
            </div>

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
          </PopoverContent>
        </Popover>
      </div>

      {/* The page itself never scrolls: the card is a fixed frame that scrolls its own
          text, and the dial on the right visualizes how far down the chapter you are */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, width: '100%', padding: `0 ${spacing.xl}` }}>
        <div style={{ display: 'flex', flex: 1, minHeight: 0, justifyContent: 'center' }}>
          <div
            ref={scrollerRef}
            onScroll={schedulePaint}
            style={{
              width: '100%',
              maxWidth: `${pageWidth}px`,
              height: '100%',
              minHeight: 0,
              overflowY: 'auto',
              // The dial is the progress read-out, so hide the frame's own scrollbar
              scrollbarWidth: 'none',
              padding: `0 ${spacing['2xl']}`,
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              boxShadow: shadows.lg,
            }}
          >
          {/* A slim top spacer keeps the opening tight; the bottom one lets the
              last lines still reach the focus band at the frame's midline */}
          <div style={{ height: `${spacing['2xl']}` }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.lg,
              width: '100%',
              fontFamily: fontFamilies[font].stack,
              fontSize: `${fontSize}px`,
              lineHeight: LINE_HEIGHT,
              color: colors.textPrimary,
            }}
          >
            {PARAGRAPH_WORDS.map((words, paragraphIdx) => (
              <p key={paragraphIdx}>
                {words.map((word, wordIdx) => {
                  const idx = wordOffsets[paragraphIdx] + wordIdx
                  return (
                    <span
                      key={idx}
                      ref={(el) => {
                        wordRefs.current[idx] = el
                      }}
                      style={{ opacity: DIM_OPACITY, transition: `opacity ${WORD_TRANSITION_MS}ms linear` }}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
              </p>
            ))}
          </div>
          <div style={{ height: '50%' }} />
          </div>
        </div>

        {/* Scrub dial — drag the knob to travel through the chapter */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '132px',
            flexShrink: 0,
            gap: spacing.md,
          }}
        >
          <div style={railLabelStyle}>START</div>
          <div
            ref={railRef}
            role="slider"
            aria-label="Chapter position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onPointerDown={handleRailPointerDown}
            onPointerMove={handleRailPointerMove}
            style={{
              position: 'relative',
              width: '6px',
              height: `${RAIL_HEIGHT}px`,
              flexShrink: 0,
              borderRadius: radii.full,
              backgroundColor: colors.neutral100,
              cursor: 'pointer',
              touchAction: 'none',
            }}
          >
            <div
              style={{
                width: '6px',
                height: `${progress * RAIL_HEIGHT}px`,
                borderRadius: radii.full,
                backgroundColor: colors.primary,
              }}
            />
            {CHAPTER_MARK_FRACTIONS.map((fraction) => (
              <div
                key={fraction}
                style={{
                  position: 'absolute',
                  left: '-5px',
                  top: `${fraction * RAIL_HEIGHT}px`,
                  width: '16px',
                  height: '2px',
                  borderRadius: radii.full,
                  backgroundColor: colors.neutral300,
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                left: '-40px',
                top: `${progress * (RAIL_HEIGHT - KNOB_HEIGHT)}px`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: `${KNOB_HEIGHT}px`,
                  padding: `0 ${spacing.sm}`,
                  flexShrink: 0,
                  borderRadius: radii.full,
                  backgroundColor: colors.primary,
                  boxShadow: shadows.md,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.semibold,
                  color: colors.textInverse,
                }}
              >
                {Math.round(progress * 100)}%
              </div>
              <div
                style={{
                  width: '14px',
                  height: `${KNOB_HEIGHT}px`,
                  flexShrink: 0,
                  borderRadius: radii.full,
                  backgroundColor: colors.primary,
                }}
              />
            </div>
          </div>
          <div style={railLabelStyle}>END</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '96px',
          flexShrink: 0,
          padding: `0 ${spacing.xl}`,
        }}
      >
        <div style={{ ...metaTextStyle, paddingLeft: footerLeftInset }}>
          {TOTAL_WORDS} words in this chapter
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <button aria-label="Drift up" onClick={() => scrollByLines(-3)} style={scrollButtonStyle('quiet')}>
            <ChevronIcon direction="up" />
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '38px',
              padding: `0 ${spacing.lg}`,
              flexShrink: 0,
              borderRadius: radii.md,
              backgroundColor: colors.surface,
              borderBottom: `3px solid ${colors.neutral300}`,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.semibold,
              color: colors.neutral700,
            }}
          >
            space &nbsp;·&nbsp; drift down the page
          </div>
          <button aria-label="Drift down" onClick={() => scrollByLines(3)} style={scrollButtonStyle('primary')}>
            <ChevronIcon direction="down" />
          </button>
        </div>

        <div style={{ ...metaTextStyle, textAlign: 'right' }}>
          {minutesLeft} min left · {Math.round(progress * 100)}% read
        </div>
      </div>
    </div>
  )
}
