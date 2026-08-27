import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { LeftSidebar } from './components/LeftSidebar'
import { GrainOverlay } from './components/layout/GrainOverlay'
import { StudentBooksPage } from './pages/StudentBooksPage'
import { StudentReadingPage } from './pages/StudentReadingPage'
import { TeacherBooksPage } from './pages/TeacherBooksPage'
import { TeacherAnalyticsPage } from './pages/TeacherAnalyticsPage'
import { EduGlobals } from './pages/EduGlobals'
import { colors } from './edu-ui/tokens'

function AppLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: colors.background }}>
      <GrainOverlay intensity={0.5} />
      <LeftSidebar />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/student/books" element={<StudentBooksPage />} />
          <Route path="/student/reading" element={<StudentReadingPage />} />
          <Route path="/teacher/books" element={<TeacherBooksPage />} />
          <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
          <Route path="/globals" element={<EduGlobals />} />
          <Route path="*" element={<Navigate to="/student/books" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
