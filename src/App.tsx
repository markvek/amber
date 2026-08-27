import { useState, type ReactNode } from 'react'
import { LeftSidebar } from './components/LeftSidebar'
import { StudentBooksPage } from './pages/StudentBooksPage'
import { StudentReadingPage } from './pages/StudentReadingPage'
import { TeacherBooksPage } from './pages/TeacherBooksPage'
import { TeacherAnalyticsPage } from './pages/TeacherAnalyticsPage'
import { EduGlobals } from './pages/EduGlobals'
import { type PageId } from './types/navigation'
import { colors } from './edu-ui/tokens'

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('student-books')

  function renderPage(pageId: PageId): ReactNode {
    switch (pageId) {
      case 'student-books':
        return <StudentBooksPage />
      case 'student-reading':
        return <StudentReadingPage />
      case 'teacher-books':
        return <TeacherBooksPage />
      case 'teacher-analytics':
        return <TeacherAnalyticsPage />
      case 'globals':
        return <EduGlobals />
      default:
        return <StudentBooksPage />
    }
  }

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
        {renderPage(currentPage)}
      </main>
    </div>
  )
}

export default App
