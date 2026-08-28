import { useEffect, useMemo, useRef, useState } from 'react'
import { colors, typography, spacing, radii, shadows } from '../edu-ui/tokens'
import { ListView, type ListViewItem } from '../components/data/ListView'

/* ── shapes returned by /api/* (see server/analytics.ts) ──────────────────── */

interface StudentRow {
  id: number
  name: string
  classroom: string
  book: string
  progress_percent: number
  struggle_rate: number
  comprehension_score: number
  avg_session_minutes: number
  current_streak_days: number
  overall_rating: string
}

interface WordRow {
  word: string
  students: number
  total_struggles: number
  struggling: number
  improving: number
  conquered: number
}

interface Summary {
  students: number
  classrooms: number
  avg_progress: number
  avg_comprehension: number
  avg_minutes: number
  events: number
  tracked_words: number
}

type Tab = 'students' | 'words'

/* ── helpers ──────────────────────────────────────────────────────────────── */

const pct = (n: number) => `${Math.round(n)}%`

/** Difficulty glyph keyed to how much trouble a word is causing. */
function wordIcon(w: WordRow) {
  if (w.struggling > 0) return '🔴'
  if (w.improving > w.conquered) return '🟡'
  return '🟢'
}

const RATING_COLOR: Record<string, string> = {
  thriving: colors.success,
  steady: colors.info,
  'needs support': colors.warning,
}

/** Status glyph mirroring the Words tab: red needs help, green is thriving. */
const RATING_ICON: Record<string, string> = {
  'needs support': '🔴',
  steady: '🟡',
  thriving: '🟢',
}

function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetch(path)
      .then((r) => (r.ok ? r.json() : r.json().then((j) => Promise.reject(new Error(j.error)))))
      .then((j) => live && setData(j))
      .catch((e) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [path])

  return { data, error }
}

/* ── stat strip ───────────────────────────────────────────────────────────── */

function StatStrip({ summary }: { summary: Summary | null }) {
  const cells = summary
    ? [
        { label: 'Students', value: String(summary.students) },
        { label: 'Avg. progress', value: pct(summary.avg_progress) },
        { label: 'Avg. comprehension', value: pct(summary.avg_comprehension * 100) },
        { label: 'Avg. session', value: `${Math.round(summary.avg_minutes)}m` },
        { label: 'Words tracked', value: String(summary.tracked_words) },
      ]
    : []

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(cells.length, 1)}, 1fr)`,
        gap: spacing.md,
        marginBottom: spacing.lg,
      }}
    >
      {cells.map(({ label, value }) => (
        <div
          key={label}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.neutral300}`,
            borderRadius: radii.lg,
            boxShadow: shadows.sm,
          }}
        >
          <div style={{ fontSize: typography.sizes.xs, color: colors.textSecondary }}>{label}</div>
          <div
            style={{
              fontSize: typography.sizes['2xl'],
              fontWeight: typography.weights.bold,
              color: colors.textPrimary,
              lineHeight: typography.lineHeights.tight,
            }}
          >
            {value}
          </div>
        </div>
      ))}
      {!summary &&
        Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              height: '76px',
              backgroundColor: colors.neutral100,
              borderRadius: radii.lg,
            }}
          />
        ))}
    </div>
  )
}

/* ── chat rail ────────────────────────────────────────────────────────────── */

interface Message {
  role: 'user' | 'bot'
  text: string
}

/**
 * Answers from the data already on screen. This is a local responder over the
 * live rows — there is no model call behind it.
 */
function answer(q: string, students: StudentRow[], words: WordRow[]): string {
  const t = q.toLowerCase()

  if (/struggl|hard|difficult|word/.test(t) && words.length) {
    const top = words.slice(0, 3)
    return `The hardest words across the class right now: ${top
      .map((w) => `“${w.word}” (${w.students} students, ${w.total_struggles} struggles)`)
      .join(', ')}.`
  }
  if (/behind|support|struggling student|worst|lowest/.test(t) && students.length) {
    const need = students.filter((s) => s.overall_rating === 'needs support')
    return need.length
      ? `${need.length} student${need.length > 1 ? 's need' : ' needs'} support: ${need
          .slice(0, 5)
          .map((s) => s.name)
          .join(', ')}${need.length > 5 ? '…' : ''}.`
      : 'No students are currently flagged as needing support.'
  }
  if (/top|best|ahead|thriving|highest/.test(t) && students.length) {
    const top = students.slice(0, 3)
    return `Furthest along: ${top.map((s) => `${s.name} (${pct(s.progress_percent)})`).join(', ')}.`
  }
  if (/progress|average|avg/.test(t) && students.length) {
    const avg = students.reduce((a, s) => a + s.progress_percent, 0) / students.length
    return `Class average progress is ${pct(avg)} across ${students.length} students.`
  }
  if (/time|minute|session/.test(t) && students.length) {
    const avg = students.reduce((a, s) => a + s.avg_session_minutes, 0) / students.length
    return `Average session length is ${Math.round(avg)} minutes.`
  }
  return 'Ask me about class progress, students needing support, top readers, session length, or the hardest words.'
}

const PROMPTS = ['Who needs support?', 'Hardest words?', 'Top readers?', 'Average progress?']

function ChatRail({ students, words }: { students: StudentRow[]; words: WordRow[] }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Ask me about this class — I answer from the data on this page.' },
  ])
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(text: string) {
    const q = text.trim()
    if (!q) return
    setMessages((m) => [...m, { role: 'user', text: q }, { role: 'bot', text: answer(q, students, words) }])
    setDraft('')
  }

  return (
    <aside
      aria-label="Class assistant"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.surface,
        border: `1px solid ${colors.neutral300}`,
        borderRadius: radii.lg,
        boxShadow: shadows.sm,
        overflow: 'hidden',
        height: 'calc(100vh - 200px)',
        position: 'sticky',
        top: spacing.lg,
      }}
    >
      <header
        style={{
          padding: `${spacing.md} ${spacing.lg}`,
          borderBottom: `1px solid ${colors.neutral100}`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <span
          aria-hidden
          style={{
            width: '8px',
            height: '8px',
            borderRadius: radii.full,
            backgroundColor: colors.success,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold }}>
          Class assistant
        </span>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: radii.lg,
              fontSize: typography.sizes.sm,
              lineHeight: typography.lineHeights.normal,
              backgroundColor: m.role === 'user' ? colors.primary : colors.neutral100,
              color: m.role === 'user' ? colors.textInverse : colors.textPrimary,
            }}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: spacing.md, borderTop: `1px solid ${colors.neutral100}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm }}>
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              style={{
                fontSize: typography.sizes.xs,
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: radii.full,
                border: `1px solid ${colors.neutral300}`,
                backgroundColor: colors.surfaceMuted,
                color: colors.textSecondary,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
          style={{ display: 'flex', gap: spacing.sm }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Ask about this class"
            placeholder="Ask about this class…"
            style={{
              flex: 1,
              minWidth: 0,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.sizes.sm,
              border: `1px solid ${colors.neutral300}`,
              borderRadius: radii.md,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              color: colors.textInverse,
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: radii.md,
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </aside>
  )
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export function TeacherAnalyticsPage() {
  const [tab, setTab] = useState<Tab>('students')
  const { data: summary } = useApi<Summary>('/api/summary')
  const { data: students, error: studentsError } = useApi<StudentRow[]>('/api/students')
  const { data: words, error: wordsError } = useApi<WordRow[]>('/api/words')

  const studentItems = useMemo<ListViewItem[]>(
    () =>
      (students ?? []).map((s) => ({
        id: String(s.id),
        icon: RATING_ICON[s.overall_rating] ?? '🟡',
        title: s.name,
        // Rating is spelled out here too — the glyphs differ only by hue, and
        // the icon tile is aria-hidden.
        subtitle: `${s.overall_rating} · ${s.classroom} · ${s.book}`,
        stats: [
          { label: 'progress', value: pct(s.progress_percent), progress: s.progress_percent },
          { label: 'comprehension', value: pct(s.comprehension_score * 100) },
          { label: 'avg session', value: `${Math.round(s.avg_session_minutes)}m` },
        ],
        info: (
          <div style={{ fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.relaxed }}>
            <strong style={{ color: RATING_COLOR[s.overall_rating] ?? colors.textPrimary }}>
              {s.overall_rating}
            </strong>
            <br />
            Struggle rate {pct(s.struggle_rate * 100)} · {s.current_streak_days}-day streak
          </div>
        ),
      })),
    [students],
  )

  const wordItems = useMemo<ListViewItem[]>(
    () =>
      (words ?? []).map((w) => ({
        id: w.word,
        icon: wordIcon(w),
        title: w.word,
        subtitle: `${w.students} student${w.students === 1 ? '' : 's'} affected`,
        stats: [
          { label: 'struggles', value: String(w.total_struggles) },
          {
            label: 'conquered',
            value: `${w.conquered}/${w.students}`,
            progress: w.students ? (w.conquered / w.students) * 100 : 0,
          },
        ],
        info: (
          <div style={{ fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.relaxed }}>
            Still struggling: {w.struggling}
            <br />
            Improving: {w.improving}
            <br />
            Conquered: {w.conquered}
          </div>
        ),
      })),
    [words],
  )

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'students', label: 'Students', count: students?.length },
    { key: 'words', label: 'Words', count: words?.length },
  ]

  const error = tab === 'students' ? studentsError : wordsError
  const items = tab === 'students' ? studentItems : wordItems
  const loading = tab === 'students' ? students === null : words === null

  return (
    <div style={{ padding: spacing.xl, maxWidth: '1400px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: typography.sizes['3xl'],
          fontWeight: typography.weights.bold,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        }}
      >
        Analytics
      </h1>
      <p style={{ fontSize: typography.sizes.md, color: colors.textSecondary, marginBottom: spacing.lg }}>
        Live from the amber schema — {summary ? `${summary.events} reading events` : 'loading'}
      </p>

      <StatStrip summary={summary} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: spacing.lg, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <div role="tablist" aria-label="Analytics views" style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.md }}>
            {tabs.map(({ key, label, count }) => {
              const active = tab === key
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(key)}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    fontSize: typography.sizes.sm,
                    fontWeight: active ? typography.weights.semibold : typography.weights.medium,
                    color: active ? colors.primary : colors.textSecondary,
                    backgroundColor: active ? colors.primaryLight : 'transparent',
                    border: `1px solid ${active ? colors.primary : colors.neutral300}`,
                    borderRadius: radii.full,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                  {count !== undefined && (
                    <span style={{ marginLeft: spacing.xs, color: colors.textSecondary }}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {error ? (
            <div
              role="alert"
              style={{
                padding: spacing.lg,
                border: `1px solid ${colors.error}`,
                borderRadius: radii.lg,
                backgroundColor: colors.surface,
                color: colors.error,
                fontSize: typography.sizes.sm,
              }}
            >
              Couldn’t load {tab}: {error}
            </div>
          ) : loading ? (
            <div
              style={{
                padding: spacing.xl,
                textAlign: 'center',
                color: colors.textSecondary,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.neutral300}`,
                borderRadius: radii.lg,
                fontSize: typography.sizes.sm,
              }}
            >
              Loading {tab}…
            </div>
          ) : (
            <ListView aria-label={tab === 'students' ? 'Student averages' : 'Word difficulty'} items={items} />
          )}
        </div>

        <ChatRail students={students ?? []} words={words ?? []} />
      </div>
    </div>
  )
}
