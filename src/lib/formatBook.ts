import type { Book } from '../types/book'

export function formatCount(n: number | null): string {
  return n === null ? '—' : n.toLocaleString('en-US')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** The detail popover content — every remaining amber.books column for the row. */
export function bookInfo(book: Book): string {
  const parts = [
    book.author ? `By ${book.author}.` : 'Author unknown.',
    `${formatCount(book.total_pages)} pages`,
    book.total_words !== null ? `${formatCount(book.total_words)} words.` : 'word count unavailable.',
  ]
  return `${parts[0]} ${parts[1]}, ${parts[2]} Added ${formatDate(book.created_at)}.`
}
