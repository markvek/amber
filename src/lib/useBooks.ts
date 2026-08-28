import { useEffect, useState } from 'react'
import type { Book } from '../types/book'

interface BooksState {
  books: Book[]
  loading: boolean
  error: string | null
}

/** Loads amber.books from the dev API. Shared by the student and teacher lists. */
export function useBooks(): BooksState {
  const [state, setState] = useState<BooksState>({ books: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    fetch('/api/books')
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
        return body as Book[]
      })
      .then((books) => {
        if (!cancelled) setState({ books, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({ books: [], loading: false, error: e instanceof Error ? e.message : String(e) })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
