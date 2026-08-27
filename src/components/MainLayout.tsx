import { useState, type ReactNode } from 'react'
import { LeftSidebar } from './LeftSidebar'
import { type PageId } from '../types/navigation'
import { colors } from '../edu-ui/tokens'

interface MainLayoutProps {
  children: (currentPage: PageId) => ReactNode
  defaultPage?: PageId
}

export function MainLayout({ children, defaultPage = 'student-books' }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<PageId>(defaultPage)

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: colors.background }}>
      <LeftSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children(currentPage)}
      </main>
    </div>
  )
}
