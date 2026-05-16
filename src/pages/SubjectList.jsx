import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Calculator, FlaskConical, Languages, Landmark, BookMarked, Scroll, HeartPulse, PenLine, GraduationCap, ChevronRight, Palette } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatYouWillFind from '../components/WhatYouWillFind'
import SEO from '../components/SEO'

const subjectMeta = {
  mathematics:                         { Icon: Calculator,    colorClass: 'text-blue-500',   bgClass: 'bg-blue-50'   },
  science:                             { Icon: FlaskConical,  colorClass: 'text-green-500',  bgClass: 'bg-green-50'  },
  english:                             { Icon: Languages,     colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
  'social-science':                    { Icon: Landmark,      colorClass: 'text-purple-500', bgClass: 'bg-purple-50' },
  hindi:                               { Icon: BookMarked,    colorClass: 'text-pink-500',   bgClass: 'bg-pink-50'   },
  sanskrit:                            { Icon: Scroll,        colorClass: 'text-yellow-500', bgClass: 'bg-yellow-50' },
  'physical-education-and-well-being': { Icon: HeartPulse,    colorClass: 'text-teal-500',   bgClass: 'bg-teal-50'   },
  urdu:                                { Icon: PenLine,       colorClass: 'text-violet-500', bgClass: 'bg-violet-50' },
  arts:                                { Icon: Palette,       colorClass: 'text-rose-500',   bgClass: 'bg-rose-50'   },
  'vocational-education':              { Icon: GraduationCap, colorClass: 'text-indigo-500', bgClass: 'bg-indigo-50' },
}

function fmt(slug) { return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function SubjectList() {
  const { subject } = useParams()
  const [books, setBooks]         = useState([])
  const [edzyColor, setEdzyColor] = useState(null)
  const { Icon } = subjectMeta[subject] || { Icon: GraduationCap }
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    fetch(`${base}data.json`)
      .then(r => r.json())
      .then(data => {
        const subjectData = data[subject] || {}
        const firstBook = Object.values(subjectData)[0] || {}
        const firstChapter = Object.values(firstBook)[0] || {}
        setEdzyColor(firstChapter.meta?.edzyColor || null)
        setBooks(Object.keys(subjectData).map(bookSlug => {
          const firstBookChapter = Object.values(subjectData[bookSlug])[0] || {}
          return {
            id: bookSlug,
            label: fmt(bookSlug),
            bookSvgIcon: firstBookChapter.meta?.bookSvgIcon || null,
            edzyColor: firstBookChapter.meta?.edzyColor || null,
          }
        }))
      })
      .catch(() => {})
  }, [subject, base])

  const fg = edzyColor?.light?.foreground || '#6366F1'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SEO
        title={`Class 8 ${fmt(subject)} Prompts`}
        description={`Explore all ${fmt(subject)} books and chapters for CBSE Class 8. Access free AI prompts for every chapter to use with ChatGPT, Gemini, and Claude. Perfect for quick understanding, practice questions, and exam preparation.`}
      />
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-gray-100 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <Link to="/" className="text-gray-400 no-underline hover:text-gray-600">Home</Link>
              <ChevronRight size={11} />
              <span style={{ color: fg }} className="font-semibold text-xs">Book: {fmt(subject)}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">CBSE Class 8 {fmt(subject)}</h1>
            <p className="text-xs text-gray-400 mt-1">Subject: {fmt(subject)} › Book: {fmt(subject)}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <section className="pt-8 pb-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {books.map(b => (
                <Link key={b.id} to={`/subjects/${subject}/books/${b.id}`} className="no-underline">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: b.edzyColor?.light?.foreground || fg }}>
                      {b.bookSvgIcon
                        ? <img src={b.bookSvgIcon} alt="" className="w-7 h-7 object-contain" onError={e => e.target.style.display = 'none'} />
                        : <Icon size={22} style={{ color: '#fff' }} />
                      }
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-1.5">{b.label}</div>
                    <p className="text-xs text-gray-400 mb-3">Resources organised by book, chapter, and page.</p>
                    <div className="text-xs font-semibold" style={{ color: fg }}>Explore →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <WhatYouWillFind />
        </div>
      </main>
      <Footer />
    </div>
  )
}
