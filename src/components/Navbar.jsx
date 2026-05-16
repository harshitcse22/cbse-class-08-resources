import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const classes = [
  { label: 'Class 6',  href: 'https://edzy-ai.github.io/cbse-class-06-resources/' },
  { label: 'Class 7',  href: 'https://edzy-ai.github.io/cbse-class-07-resources/' },
  { label: 'Class 8',  href: 'https://edzy-ai.github.io/cbse-class-08-resources/' },
  { label: 'Class 9',  href: 'https://edzy-ai.github.io/cbse-class-09-resources/' },
  { label: 'Class 10', href: 'https://edzy-ai.github.io/cbse-class-10-resources/' },
  { label: 'Class 11', href: 'https://edzy-ai.github.io/cbse-class-11-resources/' },
  { label: 'Class 12', href: 'https://edzy-ai.github.io/cbse-class-12-resources/' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src={`${import.meta.env.BASE_URL}CBSE-Color.svg`} alt="CBSE" className="w-7 h-7" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">CBSE Class 8</span>
        </Link>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3.5 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Classes
            <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-gray-100 rounded-xl shadow-lg min-w-[130px] overflow-hidden z-50">
              {classes.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href === '#' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 no-underline"
                >
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
