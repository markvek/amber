import { useNavigate } from 'react-router-dom'
import { colors, typography, spacing } from '../edu-ui/tokens'
import { ListView, type ListViewItem } from '../components/data/ListView'

const libraryBooks: ListViewItem[] = [
  {
    id: 'to-kill-a-mockingbird',
    icon: '📕',
    title: 'To Kill a Mockingbird',
    subtitle: 'Harper Lee',
    stats: [
      { label: 'class avg', value: '42%', progress: 42 },
      { label: 'reading', value: '18 students' },
    ],
    info: 'Unit 5 core text. Class discussion sessions scheduled for next week.',
  },
  {
    id: 'the-outsiders',
    icon: '📗',
    title: 'The Outsiders',
    subtitle: 'S.E. Hinton',
    stats: [
      { label: 'class avg', value: '68%', progress: 68 },
      { label: 'reading', value: '21 students' },
    ],
    info: 'Most students approaching completion. Essays graded and returned.',
  },
  {
    id: 'the-odyssey',
    icon: '📘',
    title: 'The Odyssey',
    subtitle: 'Homer',
    stats: [
      { label: 'class avg', value: '35%', progress: 35 },
      { label: 'reading', value: '15 students' },
    ],
    info: 'Classical literature track. Study guide and annotations shared.',
  },
  {
    id: 'wrinkle-in-time',
    icon: '📙',
    title: 'A Wrinkle in Time',
    subtitle: "Madeleine L'Engle",
    stats: [
      { label: 'class avg', value: '44%', progress: 44 },
      { label: 'reading', value: '12 students' },
    ],
    info: 'Book club selection. Discussion groups meet Thursdays.',
  },
  {
    id: 'lord-of-the-flies',
    icon: '📔',
    title: 'Lord of the Flies',
    subtitle: 'William Golding',
    stats: [
      { label: 'class avg', value: '86%', progress: 86 },
      { label: 'reading', value: '20 students' },
    ],
    info: 'High engagement across the class. Analysis essays due Wednesday.',
  },
  {
    id: 'the-hunger-games',
    icon: '📓',
    title: 'The Hunger Games',
    subtitle: 'Suzanne Collins',
    stats: [
      { label: 'class avg', value: '15%', progress: 15 },
      { label: 'reading', value: '24 students' },
    ],
    info: 'Newly assigned contemporary fiction unit. Full class participation.',
  },
]

export function TeacherBooksPage() {
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

      <ListView
        aria-label="Class library books"
        items={libraryBooks}
        onItemClick={() => navigate('/teacher/analytics')}
      />
    </div>
  )
}
