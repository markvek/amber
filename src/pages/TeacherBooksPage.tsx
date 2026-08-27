import { useNavigate } from 'react-router-dom'
import { colors, typography, spacing } from '../edu-ui/tokens'
import { ListView, type ListViewItem } from '../components/data/ListView'

const libraryBooks: ListViewItem[] = [
  {
    id: 'charlottes-web',
    icon: '📕',
    title: "Charlotte's Web",
    subtitle: 'E.B. White',
    stats: [
      { label: 'class avg', value: '58%', progress: 58 },
      { label: 'reading', value: '24 students' },
    ],
    info: 'Unit 3 core text. Whole-class assignment, due Friday, Sep 12.',
  },
  {
    id: 'the-giver',
    icon: '📗',
    title: 'The Giver',
    subtitle: 'Lois Lowry',
    stats: [
      { label: 'class avg', value: '31%', progress: 31 },
      { label: 'reading', value: '9 students' },
    ],
    info: 'Independent reading option for advanced readers.',
  },
  {
    id: 'hatchet',
    icon: '📘',
    title: 'Hatchet',
    subtitle: 'Gary Paulsen',
    stats: [
      { label: 'class avg', value: '82%', progress: 82 },
      { label: 'reading', value: '18 students' },
    ],
    info: 'Unit 2 text. Book reports due Monday, Sep 22.',
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
    id: 'holes',
    icon: '📔',
    title: 'Holes',
    subtitle: 'Louis Sachar',
    stats: [
      { label: 'class avg', value: '95%', progress: 95 },
      { label: 'reading', value: '21 students' },
    ],
    info: 'Nearly all students finished. Quiz results in Analytics.',
  },
  {
    id: 'because-of-winn-dixie',
    icon: '📓',
    title: 'Because of Winn-Dixie',
    subtitle: 'Kate DiCamillo',
    stats: [
      { label: 'class avg', value: '8%', progress: 8 },
      { label: 'reading', value: '24 students' },
    ],
    info: 'Unit 4 text, just assigned. Due Friday, Oct 10.',
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
