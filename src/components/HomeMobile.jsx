import { Link } from 'react-router-dom'
import { Sparkles, Copy, Check } from 'lucide-react'
import WhatYouWillFind from './WhatYouWillFind'

function fmt(slug) { return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

const categoryBadge = {
  'Quick Understanding': { label: 'Learn',          cls: 'text-green-600 bg-green-50 border-green-200' },
  'Practice Questions':  { label: 'Practice',       cls: 'text-blue-600 bg-blue-50 border-blue-200'   },
  'Quick Review':        { label: 'Quick Revision', cls: 'text-orange-600 bg-orange-50 border-orange-200' },
  'Find My Mistake':     { label: 'Find My Mistake',cls: 'text-red-600 bg-red-50 border-red-200'      },
  'Exam Prep':           { label: 'Exam Prep',      cls: 'text-purple-600 bg-purple-50 border-purple-200' },
}

export default function HomeMobile({ subjects, randomPrompt, loading, copied, base, onGenerate, onCopy, onOpenWithPrompt }) {
  return (
    <div className="px-4 py-6 flex flex-col gap-6">

      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
          CBSE Class 8<br />Most Effective<br />
          <span className="text-blue-600">Prompts</span>
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Free chapter-wise NCERT prompts, structured by subject, book, and chapter for CBSE Class 8 students
        </p>
      </div>

      {/* What You Will Find */}
      <WhatYouWillFind />

      {/* Subjects */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Subjects</h2>
        <div className="flex flex-col gap-3">
          {subjects.map(({ id, label, Icon, edzyColor, subjectSvgIcon, desc }) => {
            const fg = edzyColor?.light?.foreground || '#6366F1'
            return (
              <Link key={id} to={`/subjects/${id}`} className="no-underline">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: fg }}>
                    {subjectSvgIcon
                      ? <img src={subjectSvgIcon} alt="" className="w-7 h-7 object-contain" onError={e => e.target.style.display = 'none'} />
                      : <Icon size={24} style={{ color: '#fff' }} />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold mb-1" style={{ color: fg }}>{label}</div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-2">{desc}</p>
                    <div className="text-xs font-semibold" style={{ color: fg }}>Explore →</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Random Prompt Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900">
            <Sparkles size={14} className="text-blue-500 shrink-0" />
            <span>Try a random AI Prompt</span>
          </div>

          <div className="flex items-center gap-1 flex-nowrap shrink-0 pt-0.5">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mr-1 whitespace-nowrap shrink-0">
              Use in
            </span>

            {[
              { name: 'ChatGPT', svg: 'openai.svg', url: 'https://chat.openai.com' },
              { name: 'Gemini', svg: 'gemini-color.svg', url: 'https://gemini.google.com' },
              { name: 'Claude', svg: 'claude-color.svg', url: 'https://claude.ai' },
            ].map(({ name, svg, url }) => (
              <button
                key={name}
                onClick={() => randomPrompt && onOpenWithPrompt(url, randomPrompt.prompt)}
                className="cursor-pointer bg-transparent border-none p-0 shrink-0"
                title={name}
              >
                <img src={`${base}${svg}`} alt={name} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-3">Preview the kind of prompts you'll find inside.</p>

        {randomPrompt && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-3">
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">{randomPrompt.prompt}</p>
            {(() => {
              const chapterUrl = `/subjects/${randomPrompt.subjectSlug}/books/${randomPrompt.bookSlug}/chapters/${randomPrompt.chapterSlug}?prompt=${randomPrompt.index ?? 0}`
              const badge = categoryBadge[randomPrompt.heading]
              return (
                <div className="mt-2.5 flex gap-1.5 flex-wrap">
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
          onClick={onGenerate}
          disabled={loading}
          className="w-full bg-[#1D4ED8] hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-colors"
        >
          <img src={`${base}Dice.svg`} alt="" className="w-5 h-5" /> {loading ? 'Generating...' : 'Generate Random Prompt'}
        </button>

        {randomPrompt && (
          <button
            onClick={onCopy}
            className="w-full mt-2 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-500 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-50 transition-colors bg-white"
          >
            {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Prompt</>}
          </button>
        )}
      </div>

    </div>
  )
}
