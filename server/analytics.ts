import { getPool } from './db'

/**
 * Analytics reads for the teacher view. Every number here is aggregated in
 * Postgres from the raw reading_events / reading_sessions / comprehension
 * tables by db/seed.sql — nothing is computed in the browser.
 */

export interface StudentRow {
  id: number
  name: string
  classroom: string
  book: string
  progress_percent: number
  struggle_rate: number
  reread_rate: number
  comprehension_score: number
  avg_session_minutes: number
  sessions_per_week: number
  current_streak_days: number
  current_page: number
  overall_rating: string
}

export interface WordRow {
  word: string
  students: number
  total_struggles: number
  struggling: number
  improving: number
  conquered: number
  last_seen: string
}

export interface SummaryRow {
  students: number
  classrooms: number
  avg_progress: number
  avg_comprehension: number
  avg_minutes: number
  events: number
  tracked_words: number
}

export async function fetchStudents(env: Record<string, string>): Promise<StudentRow[]> {
  const { rows } = await getPool(env).query<StudentRow>(
    `SELECT s.id,
            s.name,
            c.name                       AS classroom,
            b.title                      AS book,
            s.progress_percent::float    AS progress_percent,
            s.struggle_rate::float       AS struggle_rate,
            s.reread_rate::float         AS reread_rate,
            s.comprehension_score::float AS comprehension_score,
            s.avg_session_minutes::float AS avg_session_minutes,
            s.sessions_per_week::float   AS sessions_per_week,
            s.current_streak_days,
            s.current_page,
            s.overall_rating
       FROM amber.students s
       JOIN amber.classrooms c ON c.id = s.classroom_id
       JOIN amber.books b      ON b.id = ((s.id - 1) % 6) + 1
      ORDER BY s.progress_percent DESC, s.name`,
  )
  return rows
}

export async function fetchWords(env: Record<string, string>): Promise<WordRow[]> {
  const { rows } = await getPool(env).query<WordRow>(
    `SELECT word,
            count(DISTINCT student_id)::int                       AS students,
            sum(times_struggled)::int                             AS total_struggles,
            count(*) FILTER (WHERE status = 'struggling')::int    AS struggling,
            count(*) FILTER (WHERE status = 'improving')::int     AS improving,
            count(*) FILTER (WHERE status = 'conquered')::int     AS conquered,
            max(last_struggled_at)                                AS last_seen
       FROM amber.student_word_status
      GROUP BY word
      ORDER BY total_struggles DESC, students DESC, word`,
  )
  return rows
}

export async function fetchSummary(env: Record<string, string>): Promise<SummaryRow> {
  const { rows } = await getPool(env).query<SummaryRow>(
    `SELECT (SELECT count(*) FROM amber.students)::int                          AS students,
            (SELECT count(*) FROM amber.classrooms)::int                        AS classrooms,
            (SELECT round(avg(progress_percent), 1) FROM amber.students)::float AS avg_progress,
            (SELECT round(avg(comprehension_score), 3) FROM amber.students)::float AS avg_comprehension,
            (SELECT round(avg(avg_session_minutes), 1) FROM amber.students)::float AS avg_minutes,
            (SELECT count(*) FROM amber.reading_events)::int                    AS events,
            (SELECT count(DISTINCT word) FROM amber.student_word_status)::int   AS tracked_words`,
  )
  return rows[0]
}
