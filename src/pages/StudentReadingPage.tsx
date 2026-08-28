import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
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

/** Gap above the text, in px — a plain number (not the rem-based spacing token) because
 *  the sticky pin, the spacer div, and the frontier math must all agree on it exactly */
const TOP_GAP_PX = 48

/**
 * Scroll-scrubbed reveal frontier (after GSAP's SplitText + ScrollTrigger word-opacity
 * technique): everything the reader has scrolled past sits at full ink, everything ahead
 * at DIM_OPACITY, and within the frontier's own line words light left-to-right so the
 * reveal is tied to the scroll position exactly like a scrubbed timeline. The page opens
 * fully dim with the frontier on row 1; a sticky-release ramp holds the text frozen while
 * the frontier walks down to mid-frame, then the text scrolls beneath the locked frontier.
 */
const DIM_OPACITY = 0.25
const WORD_TRANSITION_MS = 180

/** Double-click definition card, after the Paper "Definition popover" spec */
const DEFINITION_CARD_WIDTH = 320
/** Placeholder copy shown for every word until real dictionary lookups are wired up */
const DEFINITION_PLACEHOLDER = {
  partOfSpeech: 'noun',
  text: 'A group of people and pack animals travelling together across a desert or other hard country.',
}

/** The marked word, per the design: a pale blue chip with a dashed underline. Negative
 *  margins cancel the chip padding so surrounding words don't shift when it appears. */
const vocabChipStyle: CSSProperties = {
  backgroundColor: '#EBF2FC',
  borderRadius: '4px',
  borderBottom: '2px dashed #1360C4',
  color: '#0E4E9E',
  padding: '1px 5px',
  margin: '-1px -5px',
}

/** Height of the scrub dial track, in px — knob and fill are positioned against it */
const RAIL_HEIGHT = 460
const KNOB_HEIGHT = 32
/** Where the dial shows a chapter tick, as a fraction of the book */
const CHAPTER_MARK_FRACTIONS = [0.35, 0.55, 0.75]
/** Assumed pace used only to estimate the time left — the app doesn't measure real speed yet */
const ASSUMED_WPM = 148

const PARAGRAPHS: string[] = [
  '"TOY STORY" — FADE IN: INT. ANDY\'S BEDROOM. A row of moving boxes lie on the floor of the room. They are drawn up in crayon to look like a miniature Western town. The bedroom is lined with cloud wallpaper giving the impression of sky. One of the boxes has a children\'s illustrated "WANTED" poster of a Mr. Potato Head taped to it. A MR. POTATO HEAD DOLL is set in front of the poster. The VOICE OVER of ANDY, a 6-year-old boy, can be heard acting out all the voices of the scene.',
  'ANDY (AS POTATO HEAD): Alright everyone, this is a stick-up! Don\'t anybody move! Now empty that safe! A GROUP OF TOYS have been crowded together in front of the "BANK" box. Andy\'s hand lowers a CERAMIC PIGGY BANK in front of Mr. Potato Head and shakes out a pile of coins to the floor. Mr. Potato Head kisses the coins. ANDY (AS POTATO HEAD): Ooh! Money. Money. Money. (kissing noises)',
  'A porcelain figurine of the shepherdess, BO PEEP, is brought into the scene. ANDY (AS BO PEEP): Stop it! Stop it, you mean old potato! ANDY (AS POTATO HEAD): Quiet Bo Peep, or your sheep get run over! The companion porcelain sheep are placed in the center of a Hot Wheels track loop. ANDY (AS SHEEP): Heeeeelp! BAAAAA! Heeeelp us! ANDY (AS BO PEEP): Oh, no! Not my sheep! Somebody do something!',
  'WOODY, a pull-string doll cowboy, enters into the scene opposite the inanimate spud. Andy\'s hand pulls on the ring in the center of Woody\'s back. WOODY (VOICE BOX): Reach for the sky. ANDY (AS POTATO HEAD): Oh, no! Sheriff Woody!! ANDY (AS WOODY): I\'m here to stop you, One-Eyed Bart. Andy\'s hand pulls out one of Mr. Potato Head\'s eyes. ANDY (AS POTATO HEAD): Doooooh! How\'d you know it was me! ANDY (AS WOODY): Are you gonna come quietly?',
  'ANDY (AS POTATO HEAD): You can\'t touch me Sheriff! I brought my attack dog with a built-in force field! Andy places a TOY DOG, with a SLINKY for a mid-section, in front of Mr. Potato Head and stretches him out. ANDY (AS WOODY): Well I brought my DINOSAUR, who eats force field dogs!! Andy reveals a PLASTIC TYRANNOSAURUS REX, who stomps on the Slinky Dog. ANDY (AS DINOSAUR): AAAAR! ROAR-ROAR-ROAR! ANDY (AS SLINKY DOG): YIPE! YIPE-YIPE-YIPE!',
  'ANDY (AS WOODY): You\'re goin\' to jail, Bart. Andy picks up Mr. Potato Head and places him in a baby crib in the room. A cardboard sign is taped to the bars with the word "JAIL" written in crayon. ANDY (AS WOODY): Say good-bye to the wife and tatertots.',
  'Andy\'s 1-year-old sister, MOLLY, crawls over and picks up Mr. Potato Head. She sucks on him for a beat then proceeds to pound the toy repeatedly against the rail of her crib, forcing some of his parts loose. Andy, wearing a cowboy hat himself, picks up Woody off the floor.',
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

function SpeakerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 9a4 4 0 010 6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Placeholder definition card hung under a double-clicked word. Fixed-positioned so the
 *  reading frame can't clip it — any scroll dismisses it instead of dragging it along. */
function DefinitionPopover({ word, x, y }: { word: string; x: number; y: number }) {
  const edgeMargin = 12
  // Aim the card so its caret sits under the word, but never off the viewport
  const left = Math.min(Math.max(x - 30, edgeMargin), window.innerWidth - DEFINITION_CARD_WIDTH - edgeMargin)
  const caretLeft = Math.min(Math.max(x - left - 8, 12), DEFINITION_CARD_WIDTH - 28)

  const sayIt = () => {
    try {
      speechSynthesis.cancel()
      speechSynthesis.speak(new SpeechSynthesisUtterance(word))
    } catch {
      // No speech synthesis on this browser — the pill is just decorative then
    }
  }

  return (
    <div
      data-definition-popover
      role="dialog"
      aria-label={`Definition of ${word}`}
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${y + 9}px`,
        width: `${DEFINITION_CARD_WIDTH}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '14px 16px',
        backgroundColor: '#242526',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px #00000038, 0 4px 6px -4px #0000002E',
        fontFamily: "'Inter', system-ui, sans-serif",
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600, lineHeight: '18px' }}>
            {word.toLowerCase()}
          </span>
          <span style={{ color: '#CED0D4', fontSize: '12px', fontStyle: 'italic', lineHeight: '16px' }}>
            {DEFINITION_PLACEHOLDER.partOfSpeech}
          </span>
        </div>
        <button
          onClick={sayIt}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '24px',
            padding: '0 9px',
            flexShrink: 0,
            backgroundColor: '#3E4042',
            border: 'none',
            borderRadius: '999px',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <SpeakerIcon />
          Say it
        </button>
      </div>
      <p style={{ color: '#E4E6EB', fontSize: '13px', lineHeight: '19px' }}>{DEFINITION_PLACEHOLDER.text}</p>
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        aria-hidden
        style={{ position: 'absolute', top: '-7px', left: `${caretLeft}px` }}
      >
        <path d="M8 0 L16 8 L0 8 Z" fill="#242526" />
      </svg>
    </div>
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
  // Word the reader double-clicked: its flat index plus where to hang the definition card
  const [definedWord, setDefinedWord] = useState<{ idx: number; word: string; x: number; y: number } | null>(null)
  // How far the frontier travels before locking mid-frame; doubles as the sticky travel room
  const [rampPx, setRampPx] = useState(0)

  const scrollerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const frameRef = useRef<number | undefined>(undefined)
  const definedIdxRef = useRef<number | null>(null)
  definedIdxRef.current = definedWord?.idx ?? null

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

  // Measure how far the frontier can travel before mid-frame. The layout effect keeps the
  // sticky travel spacer in sync with the frame before the browser paints the first frame.
  useLayoutEffect(() => {
    const measure = () => {
      const scroller = scrollerRef.current
      if (scroller) setRampPx(Math.max(0, scroller.clientHeight / 2 - TOP_GAP_PX))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Repaint every word's opacity from its live position: everything behind the reveal
  // frontier is at full ink, everything ahead is dimmed, and the frontier's own line
  // fills left-to-right as the scroll advances through it.
  const paint = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const rect = scroller.getBoundingClientRect()
    // The frontier rides down with the scroll while the sticky text holds still, then
    // locks where the sticky releases — the same rampPx, so the hand-off is seamless
    const focusY = rect.top + Math.min(TOP_GAP_PX + scroller.scrollTop, TOP_GAP_PX + rampPx)
    const textRect = textRef.current?.getBoundingClientRect()
    const textLeft = textRect?.left ?? rect.left
    const textWidth = textRect?.width || 1

    // Group words into lines by their rounded vertical centre, and record each word's
    // horizontal centre from the same measurement pass
    const lineOf: number[] = []
    const lineYs: number[] = []
    const wordCenterX: number[] = []
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
      wordCenterX[i] = r.left + r.width / 2
    })

    // Fraction of each line the frontier has crossed: 1 above it, 0 below, partial within
    const lineT = lineYs.map((y) =>
      Math.min(1, Math.max(0, (focusY - (y - lineHeightPx / 2)) / lineHeightPx)),
    )

    wordRefs.current.forEach((span, i) => {
      if (!span) return
      const t = lineT[lineOf[i]]
      // One shared denominator so the sweep pace is uniform; short last lines finish
      // early. A word with its definition open stays at full ink even when unread.
      const lit =
        i === definedIdxRef.current ||
        t >= 1 ||
        (t > 0 && (wordCenterX[i] - textLeft) / textWidth <= t)
      span.style.opacity = lit ? '1' : String(DIM_OPACITY)
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
    // Re-run whenever a setting reflows the text or the ramp is re-measured
  }, [font, fontSize, pageWidth, rampPx])

  const scrollByLines = (lines: number) => {
    scrollerRef.current?.scrollBy({ top: lines * lineHeightPx, behavior: 'smooth' })
  }

  // Double-clicking a word raises the definition card under it
  const onWordDoubleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const span = (e.target as HTMLElement).closest('span')
    if (!span) return
    const idx = wordRefs.current.indexOf(span)
    if (idx === -1) return
    const word = (span.textContent ?? '').trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    if (!word) return
    // The chip is the highlight here, so drop the browser's own double-click selection
    window.getSelection()?.removeAllRanges()
    const rect = span.getBoundingClientRect()
    setDefinedWord({ idx, word, x: rect.left + rect.width / 2, y: rect.bottom })
  }

  // The chip re-renders its word span, so repaint opacities around it; while the card is
  // open, Escape or any press outside it dismisses
  useEffect(() => {
    schedulePaint()
    if (!definedWord) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest('[data-definition-popover]')) setDefinedWord(null)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDefinedWord(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [definedWord])

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
            Toy Story Full Script
          </div>
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
            onScroll={() => {
              schedulePaint()
              // The card hangs at fixed viewport coordinates, so scrolling dismisses it
              setDefinedWord(null)
            }}
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
          {/* The text pins under the top gap for the first rampPx of scroll (the in-flow
              spacer below it is the sticky travel room), so the opening rows hold still
              while the frontier walks down to mid-frame before the page starts moving */}
          <div style={{ height: `${TOP_GAP_PX}px` }} />
          <div>
          <div
            ref={textRef}
            onDoubleClick={onWordDoubleClick}
            style={{
              position: 'sticky',
              top: `${TOP_GAP_PX}px`,
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
                  const isDefined = definedWord?.idx === idx
                  return (
                    <span
                      key={idx}
                      ref={(el) => {
                        wordRefs.current[idx] = el
                      }}
                      style={{
                        opacity: isDefined ? 1 : DIM_OPACITY,
                        transition: `opacity ${WORD_TRANSITION_MS}ms linear`,
                      }}
                    >
                      {/* Chip only the word itself, not its trailing space */}
                      {isDefined ? <span style={vocabChipStyle}>{word}</span> : word}{' '}
                    </span>
                  )
                })}
              </p>
            ))}
          </div>
          {/* Sticky travel room: an in-flow spacer (not padding) so the pin has real
              distance to hold before the wrapper's bottom edge releases the text */}
          <div style={{ height: `${rampPx}px` }} />
          </div>
          {/* Sized so the last line's bottom edge can cross the locked frontier at max
              scroll, with a line of slack */}
          <div style={{ height: `calc(50% + ${lineHeightPx}px)` }} />
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

      {definedWord && <DefinitionPopover word={definedWord.word} x={definedWord.x} y={definedWord.y} />}
    </div>
  )
}
