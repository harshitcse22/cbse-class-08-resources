import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const subjectColorClass = {
  mathematics: 'text-blue-500',
  science: 'text-green-500',
  english: 'text-orange-500',
  'social-science': 'text-purple-500',
  hindi: 'text-pink-500',
  sanskrit: 'text-yellow-500',
  'physical-education-and-well-being': 'text-teal-500',
  urdu: 'text-violet-500',
  arts: 'text-rose-500',
  'vocational-education': 'text-indigo-500',
}

function fmt(slug) { return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function BookList() {
  const { subject, book } = useParams()
  const [chapters, setChapters] = useState([])
  const [search, setSearch]     = useState('')
  const colorClass = subjectColorClass[subject] || 'text-blue-500'
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    fetch(`${base}data.json`)
      .then(r => r.json())
      .then(data => {
        const bookData = (data[subject] || {})[book] || {}
        setChapters(Object.entries(bookData).map(([slug, chapter]) => ({
          id: slug,
          title: chapter.meta.title || fmt(slug),
          bookName: chapter.meta.bookName,
          svgIcon: chapter.meta.svgIcon,
          topicCount: (chapter.meta.topics || []).length,
          startsOnPage: chapter.meta.startsOnPage ?? null,
          endsOnPage:   chapter.meta.endsOnPage   ?? null,
          promptCount: chapter.prompts.length,
          edzyColor: chapter.meta.edzyColor || null,
        })))
      })
      .catch(() => {})
  }, [subject, book, base])

  const filtered = chapters.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SEO
        title={`Class 8 ${fmt(subject)} – ${fmt(book)}`}
        description={`Browse all ${fmt(book)} chapters for CBSE Class 8 ${fmt(subject)}. Access free AI prompts for every chapter — Quick Understanding, Practice Questions, Quick Review, Find My Mistake, and Exam Prep — to use with ChatGPT, Gemini, or Claude.`}
      />
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-gray-100 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2 flex-wrap">
              <Link to="/" className="text-gray-400 no-underline hover:text-gray-600">Home</Link>
              <ChevronRight size={11} />
              <Link to={`/subjects/${subject}`} className="text-gray-400 no-underline hover:text-gray-600">{fmt(subject)}</Link>
              <ChevronRight size={11} />
              <span className={`font-semibold ${colorClass}`}>Chapters</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">CBSE Class 8 {fmt(subject)}</h1>
            <p className="text-xs text-gray-400 mt-1">Subject: {fmt(subject)} › Book: {fmt(book)}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-7">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Chapters</h2>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search chapters..."
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none w-full bg-white text-gray-700 placeholder-gray-400 focus:border-indigo-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filtered.map(c => (
              <Link key={c.id} to={`/subjects/${subject}/books/${book}/chapters/${c.id}`} className="no-underline">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                  {c.svgIcon && (
                    <img
                      src={c.svgIcon}
                      alt=""
                      className="w-14 h-14 rounded-2xl mb-3 object-contain p-2"
                      style={{ backgroundColor: c.edzyColor?.light?.foreground || '#6366F1' }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  )}
                  <div className="text-sm font-bold text-gray-900 mb-1 leading-snug">{c.title}</div>
                  {c.bookName && (
                    <div className="text-xs font-medium mb-1" style={{ color: c.edzyColor?.light?.foreground || '#6366F1' }}>
                      {c.bookName}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mb-3">
                    {c.startsOnPage != null ? `Starts on page ${c.startsOnPage} · Ends on page ${c.endsOnPage ?? '?'}` : ''}
                  </div>
                  <div className="text-xs font-semibold mt-auto" style={{ color: c.edzyColor?.light?.foreground || '#6366F1' }}>Go to prompts →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
