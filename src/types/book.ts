/** A row from amber.books, as served by GET /api/books. */
export interface Book {
  id: number
  title: string
  author: string | null
  total_pages: number
  total_words: number | null
  created_at: string
}
