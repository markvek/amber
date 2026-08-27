export type PageId =
  | 'student-books'
  | 'student-reading'
  | 'teacher-books'
  | 'teacher-analytics'
  | 'globals'

export interface NavItem {
  id: PageId
  label: string
  path: string
  group: 'student' | 'teacher'
  hidden?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'student-books', label: 'List of Books', path: '/student/books', group: 'student' },
  { id: 'student-reading', label: 'Reading Experience', path: '/student/reading', group: 'student' },
  { id: 'teacher-books', label: 'List of Books', path: '/teacher/books', group: 'teacher' },
  { id: 'teacher-analytics', label: 'Analytics View', path: '/teacher/analytics', group: 'teacher' },
  { id: 'globals', label: 'Design Globals', path: '/globals', group: 'student', hidden: true },
]
