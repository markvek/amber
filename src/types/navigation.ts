export type PageId =
  | 'student-books'
  | 'student-reading'
  | 'teacher-books'
  | 'teacher-analytics'
  | 'globals'

export interface NavItem {
  id: PageId
  label: string
  group: 'student' | 'teacher'
  hidden?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'student-books', label: 'List of Books', group: 'student' },
  { id: 'student-reading', label: 'Reading Experience', group: 'student' },
  { id: 'teacher-books', label: 'List of Books', group: 'teacher' },
  { id: 'teacher-analytics', label: 'Analytics View', group: 'teacher' },
  { id: 'globals', label: 'Design Globals', group: 'student', hidden: true },
]
