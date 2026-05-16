import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import promptCategories from '../data/promptCategories'

export default function AIPrompts() {
  const { subject, book, chapter, aiType } = useParams()
  const [prompts, setPrompts] = useState([])
  const [copied, setCopied] = useState(null)
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    fetch(`${base}subjects/${subject}/books/${book}/chapters/${chapter}/ai/${aiType}.md`)
      .then(r => r.text())
      .then(raw => {
        const text = raw.replace(/^---[\s\S]*?---\r?\n/, '')
        const blocks = []
        const lines = text.split('\n')
        let i = 0
        while (i < lines.length) {
          if (lines[i].startsWith('## ')) {
            const heading = lines[i].replace('## ', '').trim()
            let promptText = ''
            i++
            while (i < lines.length && !lines[i].startsWith('## ') && !lines[i].startsWith('# ')) {
              if (lines[i].trim()) promptText += lines[i].trim() + ' '
              i++
            }
            if (promptText.trim()) blocks.push({ heading, prompt: promptText.trim() })
          } else {
            i++
          }
        }
        setPrompts(blocks)
      })
  }, [subject, book, chapter, aiType])

  function getCategory(prompt) {
    const entry = promptCategories.find(c => {
      const staticPrefix = c.template.split('{{')[0].trim()
      return prompt.startsWith(staticPrefix)
    })
    return entry ? entry.label : null
  }

  function copy(text, idx) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx); setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="text-sm text-slate-500 mb-4 flex flex-wrap gap-1 items-center">
        <Link to="/" className="text-slate-500 hover:underline">Home</Link> <span>→</span>
        <Link to={`/subjects/${subject}/books/${book}/chapters/${chapter}`} className="text-slate-500 hover:underline capitalize">{chapter.replace(/-/g, ' ')}</Link> <span>→</span>
        <span className="capitalize">{aiType.replace(/-/g, ' ')}</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 capitalize mb-6">{aiType.replace(/-/g, ' ')}</h1>
      {prompts.map((p, idx) => (
        <div key={idx} className="relative bg-white border border-slate-200 rounded-2xl p-5 pr-24 mb-4">
          {getCategory(p.prompt) && (
            <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-0.5 mb-2">
              {getCategory(p.prompt)}
            </span>
          )}
          <h2 className="text-lg font-semibold text-slate-800 mb-2">{p.heading}</h2>
          <p className="text-slate-600 leading-relaxed">{p.prompt}</p>
          <button
            onClick={() => copy(p.prompt, idx)}
            className="absolute top-4 right-4 bg-blue-50 border border-blue-200 text-blue-600 text-sm px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            {copied === idx ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ))}
    </div>
  )
}
