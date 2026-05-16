import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Copy, Check, Calculator, FlaskConical, Languages, Landmark, BookMarked, Sparkles, GraduationCap, Scroll, HeartPulse, PenLine, BookOpen, Palette } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatYouWillFind from '../components/WhatYouWillFind'
import HomeMobile from '../components/HomeMobile'
import SEO from '../components/SEO'

const subjectConfig = {
  mathematics:                          { Icon: Calculator,   desc: 'Rational Numbers, Algebra, Geometry, Mensuration, Data Handling and more.' },
  science:                              { Icon: FlaskConical, desc: 'Crop Production, Microorganisms, Metals, Light, Sound and more.' },
  english:                              { Icon: Languages,    desc: 'Honeydew, It So Happened — prose, poetry, and supplementary readers.' },
  'social-science':                     { Icon: Landmark,     desc: 'History, Geography, Political Science, and Economics.' },
  hindi:                                { Icon: BookMarked,   desc: 'Vasant, Durva, Bharat Ki Khoj — all Hindi books.' },
  sanskrit:                             { Icon: Scroll,       desc: 'Ruchira — Sanskrit textbook for Class 8.' },
  'physical-education-and-well-being':  { Icon: HeartPulse,   desc: 'Physical education, yoga, sports and health.' },
  urdu:                                 { Icon: PenLine,      desc: 'Urdu textbooks and supplementary readers.' },
  arts:                                 { Icon: Palette,      desc: 'Visual arts, craft, and creative expression.' },
  'vocational-education':               { Icon: GraduationCap,desc: 'Kaushal Bodh — vocational skills and practical learning.' },
}

function fmt(slug) { return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

export default function Home() {
  const [data, setData]                 = useState(null)
  const [subjects, setSubjects]         = useState([])
  const [randomPrompt, setRandomPrompt] = useState(null)
  const [loading, setLoading]           = useState(false)
  const [copied, setCopied]             = useState(false)
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    fetch(`${base}data.json`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setSubjects(Object.keys(d).map(slug => {
          const firstBook = Object.values(d[slug] || {})[0] || {}
          const firstChapter = Object.values(firstBook)[0] || {}
          const edzyColor = firstChapter.meta?.edzyColor || null
          const subjectSvgIcon = firstChapter.meta?.subjectSvgIcon || null
          return { id: slug, label: fmt(slug), edzyColor, subjectSvgIcon, ...(subjectConfig[slug] || { Icon: GraduationCap, desc: '' }) }
        }))
        const all = []
        for (const [subjectSlug, books] of Object.entries(d))
          for (const [bookSlug, chapters] of Object.entries(books))
            for (const [chapterSlug, chapter] of Object.entries(chapters))
              for (const p of chapter.prompts)
                all.push({ ...p, subjectSlug, bookSlug, chapterSlug, chapterTitle: chapter.meta.title })
        if (all.length) setRandomPrompt(all[Math.floor(Math.random() * all.length)])
      })
      .catch(() => {})
  }, [base])

  async function openWithPrompt(url, promptText) {
    await navigator.clipboard.writeText(promptText)
    window.open(url, '_blank')
  }

  function generate() {
    if (!data) return
    setLoading(true)
    const all = []
    for (const [subjectSlug, books] of Object.entries(data))
      for (const [bookSlug, chapters] of Object.entries(books))
        for (const [chapterSlug, chapter] of Object.entries(chapters))
          for (const p of chapter.prompts)
            all.push({ ...p, subjectSlug, bookSlug, chapterSlug, chapterTitle: chapter.meta.title })
    if (all.length) setRandomPrompt(all[Math.floor(Math.random() * all.length)])
    setLoading(false)
  }

  function copy() {
    if (!randomPrompt) return
    navigator.clipboard.writeText(randomPrompt.prompt).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SEO
        title="CBSE Class 8 AI Study Prompts"
        description="Free chapter-wise AI prompts for CBSE Class 8 across all subjects. Use with ChatGPT, Gemini, or Claude to study smarter and score better."
      />
      <Navbar />
      <main className="flex-1">

        {/* Mobile layout */}
        <div className="sm:hidden bg-gray-50">
          <HomeMobile
            subjects={subjects}
            randomPrompt={randomPrompt}
            loading={loading}
            copied={copied}
            base={base}
            onGenerate={generate}
            onCopy={copy}
            onOpenWithPrompt={openWithPrompt}
          />
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:block">

          {/* Hero */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

              {/* Left */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
                  CBSE Class 8<br />Most Effective<br />
                  <span className="text-4xl lg:text-5xl font-bold text-blue-600 leading-tight tracking-tight">
                    Prompts
                  </span>
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
                  Free chapter-wise NCERT prompts, structured by subject, book, and chapter for CBSE Class 8 students
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {[
                    { Icon: BookOpen, bgClass: 'bg-blue-50',   colorClass: 'text-blue-500',   label: 'Chapter-wise', sub: 'ORGANIZED' },
                    { Icon: Zap,      bgClass: 'bg-purple-50', colorClass: 'text-purple-500', label: 'AI Prompts',   sub: 'FOR LEARNING' },
                    { Icon: Check,    bgClass: 'bg-green-50',  colorClass: 'text-green-500',  label: 'Free & Open',  sub: 'FOR EVERYONE' },
                  ].map(b => (
                    <div key={b.label} className={`flex items-center gap-2 ${b.bgClass} border border-gray-100 rounded-xl px-3 py-2`}>
                      <b.Icon size={15} className={b.colorClass} />
                      <div>
                        <div className="text-xs font-bold text-gray-800">{b.label}</div>
                        <div className="text-[11px] text-gray-400">{b.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Random Prompt Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900">
                    <Sparkles size={14} className="text-blue-500" /> Try a Random AI Prompt
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mr-1">USE IN</span>
                    {[
                      { name: 'ChatGPT', svg: 'openai.svg',       url: 'https://chat.openai.com' },
                      { name: 'Gemini',  svg: 'gemini-color.svg', url: 'https://gemini.google.com' },
                      { name: 'Claude',  svg: 'claude-color.svg', url: 'https://claude.ai' },
                    ].map(({ name, svg, url }) => (
                      <button key={name} onClick={() => randomPrompt && openWithPrompt(url, randomPrompt.prompt)} className="cursor-pointer bg-transparent border-none p-0" title={name}>
                        <img src={`${base}${svg}`} alt={name} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Preview the kind of prompts you'll find inside.
                </p>

                {randomPrompt && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-3.5">
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">{randomPrompt.prompt}</p>
                    {(() => {
                      const chapterUrl = `/subjects/${randomPrompt.subjectSlug}/books/${randomPrompt.bookSlug}/chapters/${randomPrompt.chapterSlug}?prompt=${randomPrompt.index ?? 0}`
                      const categoryBadge = {
                        'Quick Understanding': { label: 'Learn',           cls: 'text-green-600 bg-green-50 border-green-200' },
                        'Practice Questions':  { label: 'Practice',        cls: 'text-blue-600 bg-blue-50 border-blue-200'   },
                        'Quick Review':        { label: 'Quick Revision',  cls: 'text-orange-600 bg-orange-50 border-orange-200' },
                        'Find My Mistake':     { label: 'Find My Mistake', cls: 'text-red-600 bg-red-50 border-red-200'     },
                        'Exam Prep':           { label: 'Exam Prep',       cls: 'text-purple-600 bg-purple-50 border-purple-200' },
                      }
                      const badge = categoryBadge[randomPrompt.heading]
                      return (
                        <div className="mt-2.5 flex gap-1.5 flex-wrap justify-center">
                          <Link to={`/subjects/${randomPrompt.subjectSlug}`} className="no-underline text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5 hover:bg-blue-100 transition-colors">
                            {fmt(randomPrompt.subjectSlug)}
                          </Link>
                          <Link to={`/subjects/${randomPrompt.subjectSlug}/books/${randomPrompt.bookSlug}/chapters/${randomPrompt.chapterSlug}`} className="no-underline text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 hover:bg-gray-100 transition-colors">
                            {randomPrompt.chapterTitle || fmt(randomPrompt.chapterSlug)}
                          </Link>
                          {badge && (
                            <Link to={chapterUrl} className={`no-underline text-[10px] font-semibold border rounded-full px-2.5 py-0.5 hover:opacity-80 transition-opacity ${badge.cls}`}>
                              {badge.label}
                            </Link>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}

                <button
                  onClick={generate}
                  disabled={loading || !data}
                  className="w-full bg-[#1D4ED8] hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <img src={`${base}Dice.svg`} alt="" className="w-5 h-5" /> {loading ? 'Generating...' : 'Generate Random Prompt'}
                </button>

                {randomPrompt && (
                  <button
                    onClick={copy}
                    className="w-full mt-2 border border-gray-200 rounded-xl py-2 text-xs font-medium text-gray-500 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-50 transition-colors bg-white"
                  >
                    {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Prompt</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="max-w-6xl mx-auto px-6">
            <section className="pt-10 pb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Subjects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {subjects.map(({ id, label, Icon, edzyColor, subjectSvgIcon, desc }) => {
                  const fg = edzyColor?.light?.foreground || '#6366F1'
                  return (
                    <Link key={id} to={`/subjects/${id}`} className="no-underline group">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: fg }}>
                          {subjectSvgIcon
                            ? <img src={subjectSvgIcon} alt="" className="w-7 h-7 object-contain" onError={e => e.target.style.display = 'none'} />
                            : <Icon size={22} style={{ color: '#fff' }} />
                          }
                        </div>
                        <div className="text-sm font-bold mb-1.5" style={{ color: fg }}>{label}</div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">{desc}</p>
                        <div className="text-xs font-semibold" style={{ color: fg }}>Explore →</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
            <WhatYouWillFind />
          </div>
        </div>{/* end desktop */}
      </main>
      <Footer />
    </div>
  )
}
