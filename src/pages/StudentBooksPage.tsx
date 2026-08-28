import { useNavigate } from 'react-router-dom'
import { colors, typography, spacing } from '../edu-ui/tokens'
import { ListView, type ListViewItem } from '../components/data/ListView'

const books: ListViewItem[] = [
  {
    id: 'to-kill-a-mockingbird',
    icon: '📕',
    title: 'To Kill a Mockingbird',
    subtitle: 'Harper Lee',
    stats: [
      { label: 'complete', value: '45%', progress: 45 },
      { label: 'avg speed', value: '168 wpm' },
    ],
    info: 'Unit 5 core text. Discussion sections begin next Monday.',
  },
  {
    id: 'the-outsiders',
    icon: '📗',
    title: 'The Outsiders',
    subtitle: 'S.E. Hinton',
    stats: [
      { label: 'complete', value: '78%', progress: 78 },
      { label: 'avg speed', value: '185 wpm' },
    ],
    info: 'Nearly finished! Analysis essay due Friday, Oct 5.',
  },
  {
    id: 'the-odyssey',
    icon: '📘',
    title: 'The Odyssey',
    subtitle: 'Homer',
    stats: [
      { label: 'complete', value: '22%', progress: 22 },
      { label: 'avg speed', value: '145 wpm' },
    ],
    info: 'Classical literature elective. Comprehensive study guide available.',
  },
  {
    id: 'wrinkle-in-time',
    icon: '📙',
    title: 'A Wrinkle in Time',
    subtitle: "Madeleine L'Engle",
    stats: [
      { label: 'complete', value: '37%', progress: 37 },
      { label: 'avg speed', value: '158 wpm' },
    ],
    info: 'Book club selection. Discussion every Thursday.',
  },
  {
    id: 'lord-of-the-flies',
    icon: '📔',
    title: 'Lord of the Flies',
    subtitle: 'William Golding',
    stats: [
      { label: 'complete', value: '91%', progress: 91 },
      { label: 'avg speed', value: '175 wpm' },
    ],
    info: 'Nearly complete. Thematic analysis due Wednesday.',
  },
  {
    id: 'the-hunger-games',
    icon: '📓',
    title: 'The Hunger Games',
    subtitle: 'Suzanne Collins',
    stats: [
      { label: 'complete', value: '8%', progress: 8 },
      { label: 'avg speed', value: '172 wpm' },
    ],
    info: 'Just started. Contemporary dystopian fiction unit.',
  },
]

export function StudentBooksPage() {
  const navigate = useNavigate()

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
        My Books
      </h1>
      <p
        style={{
          fontSize: typography.sizes.md,
          color: colors.textSecondary,
          marginBottom: spacing.lg,
        }}
      >
        Browse and manage your reading list
      </p>

      <ListView
        aria-label="My books"
        items={books}
        onItemClick={() => navigate('/student/reading')}
      />
    </div>
  )
}
