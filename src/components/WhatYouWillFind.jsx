import { BookOpen, List, FileText, Lightbulb } from 'lucide-react'

const features = [
  { Icon: BookOpen,  color: 'text-white', bg: 'bg-blue-500',   cardBg: 'bg-blue-50',   title: 'Book-wise structure', desc: 'Students Can Browse Resources By Subject, Then By Book, Then By Chapter.' },
  { Icon: List,      color: 'text-white', bg: 'bg-green-500',  cardBg: 'bg-green-50',  title: 'Chapter Number',      desc: 'Book And Chapter Order Are Preserved For Textbook Alignment.' },
  { Icon: FileText,  color: 'text-white', bg: 'bg-orange-500', cardBg: 'bg-orange-50', title: 'Page references',     desc: 'Where Available, Chapter Pages Include NCERT Page Details.' },
  { Icon: Lightbulb, color: 'text-white', bg: 'bg-purple-500', cardBg: 'bg-purple-50', title: 'AI prompts',          desc: 'Every Chapter Includes Claude, ChatGPT, And Codex Prompts For Self-Study.' },
]

export default function WhatYouWillFind() {
  return (
    <section className="py-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">What you will find</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {features.map(({ Icon, color, bg, cardBg, title, desc }) => (
          <div key={title} className={`${cardBg} rounded-2xl p-3.5 flex items-start gap-2.5`}>
            <div className={`w-13 ${bg} rounded-lg flex items-center justify-center shrink-0 self-stretch px-1.5`}>
              <Icon size={15} className={color} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 mb-0.5">{title}</div>
              <div className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
