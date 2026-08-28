import { useNavigate } from 'react-router-dom'
import { colors, typography, spacing } from '../edu-ui/tokens'
import { ListView, type ListViewItem } from '../components/data/ListView'
import { BookIcon } from '../components/data/BookIcon'
import { StatusPanel } from '../components/data/StatusPanel'
import { useBooks } from '../lib/useBooks'
import { bookInfo, formatCount } from '../lib/formatBook'

export function TeacherBooksPage() {
  const navigate = useNavigate()
  const { books, loading, error } = useBooks()

  const items: ListViewItem[] = books.map((book) => ({
    id: String(book.id),
    icon: <BookIcon seed={book.id} />,
    title: book.title,
    subtitle: book.author || 'Unknown author',
    stats: [
      { label: 'pages', value: formatCount(book.total_pages) },
      { label: 'words', value: formatCount(book.total_words) },
    ],
    info: bookInfo(book),
  }))

  return (
    <div
      style={{
        padding: spacing.xl,
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: typography.sizes['3xl'],
          fontWeight: typography.weights.bold,
          color: colors.textPrimary,
          marginBottom: spacing.md,
        }}
      >
        Class Library
      </h1>
      <p
        style={{
          fontSize: typography.sizes.md,
          color: colors.textSecondary,
          marginBottom: spacing.lg,
        }}
      >
        Manage books for your classes
      </p>

      {loading ? (
        <StatusPanel message="Loading books…" />
      ) : error ? (
        <StatusPanel tone="error" message={`Couldn't load books: ${error}`} />
      ) : items.length === 0 ? (
        <StatusPanel message="No books in the library yet." />
      ) : (
        <ListView
          aria-label="Class library books"
          items={items}
          onItemClick={() => navigate('/teacher/analytics')}
        />
      )}
    </div>
  )
}
