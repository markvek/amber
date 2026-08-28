import { getPool } from './db'

/**
 * Server-side data access for the Vite dev API. This module runs in Node
 * inside the dev server — never in the browser — so the Postgres credentials
 * from .env.local stay out of the client bundle.
 */

export interface BookRow {
  id: number
  title: string
  author: string | null
  total_pages: number
  total_words: number | null
  created_at: string
}

export async function fetchBooks(env: Record<string, string>): Promise<BookRow[]> {
  const { rows } = await getPool(env).query<BookRow>(
    `SELECT id, title, author, total_pages, total_words, created_at
       FROM amber.books
      ORDER BY id`,
  )
  return rows
}
