import { useNavigate } from 'react-router-dom'
import { colors, typography, spacing } from '../edu-ui/tokens'
import { ListView, type ListViewItem } from '../components/data/ListView'

const books: ListViewItem[] = [
  {
    id: 'charlottes-web',
    icon: '📕',
    title: "Charlotte's Web",
    subtitle: 'E.B. White',
    stats: [
      { label: 'complete', value: '64%', progress: 64 },
      { label: 'avg speed', value: '182 wpm' },
    ],
    info: 'Assigned for Unit 3. Due Friday, Sep 12.',
  },
  {
    id: 'the-giver',
    icon: '📗',
    title: 'The Giver',
    subtitle: 'Lois Lowry',
    stats: [
      { label: 'complete', value: '12%', progress: 12 },
      { label: 'avg speed', value: '164 wpm' },
    ],
    info: 'Independent reading pick.',
  },
  {
    id: 'hatchet',
    icon: '📘',
    title: 'Hatchet',
    subtitle: 'Gary Paulsen',
    stats: [
      { label: 'complete', value: '89%', progress: 89 },
      { label: 'avg speed', value: '175 wpm' },
    ],
    info: 'Assigned for Unit 2. Book report due Monday, Sep 22.',
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
    id: 'holes',
    icon: '📔',
    title: 'Holes',
    subtitle: 'Louis Sachar',
    stats: [
      { label: 'complete', value: '100%', progress: 100 },
      { label: 'avg speed', value: '190 wpm' },
    ],
    info: 'Finished! Quiz available in the Reading Experience.',
  },
  {
    id: 'because-of-winn-dixie',
    icon: '📓',
    title: 'Because of Winn-Dixie',
    subtitle: 'Kate DiCamillo',
    stats: [
      { label: 'complete', value: '5%', progress: 5 },
      { label: 'avg speed', value: '170 wpm' },
    ],
    info: 'Just started. Assigned for Unit 4, due Friday, Oct 10.',
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
