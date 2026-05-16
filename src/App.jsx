import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import SubjectList from './pages/SubjectList'
import BookList from './pages/BookList'
import ChapterView from './pages/ChapterView'
import AIPrompts from './pages/AIPrompts'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects/:subject" element={<SubjectList />} />
        <Route path="/subjects/:subject/books/:book" element={<BookList />} />
        <Route path="/subjects/:subject/books/:book/chapters/:chapter" element={<ChapterView />} />
        <Route path="/subjects/:subject/books/:book/chapters/:chapter/prompts" element={<AIPrompts />} />
      </Routes>
    </Router>
  )
}

export default App
