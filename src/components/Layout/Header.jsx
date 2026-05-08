import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/berichte',  label: 'BERICHTE'  },
  { to: '/karte',     label: 'KARTE'     },
  { to: '/ranking',   label: 'RANKING'   },
  { to: '/vergleich', label: 'VERGLEICH' },
]

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-ink sticky top-0 z-50 bg-canvas w-full">
      {/* Register Strip */}
      <div className="register-strip overflow-hidden">
        <span className="truncate">ASSISTENZ – RANKING /// DE · AT · CH</span>
        <span className="text-canvas/60 hidden sm:inline flex-shrink-0">ANONYME BEWERTUNGSPLATTFORM</span>
      </div>

      {/* Main Header */}
      <div className="flex items-stretch w-full overflow-hidden">
        {/* Logo */}
        <Link to="/" className="flex items-center px-3 py-2 border-r border-ink hover:bg-canvas-alt transition-colors flex-shrink-0">
          <img src="/Logo_screenshot_ohne_text.png" alt="AssistenzDoc" className="h-10 sm:h-14 flex-shrink-0" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-stretch flex-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 border-r border-ink/10 font-mono text-[11.5px] tracking-wider uppercase transition-colors
                ${pathname === to
                  ? 'text-ink border-b-2 border-b-hazard bg-canvas-alt'
                  : 'text-ink/60 hover:text-ink hover:bg-canvas-alt'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Spacer on mobile */}
        <div className="flex-1 md:hidden" />

        {/* CTA */}
        <Link to="/bewerten" className="btn-hazard px-3 sm:px-6 border-l border-ink flex-shrink-0">
          <span className="hidden sm:inline">[ + BEWERTUNG ]</span>
          <span className="sm:hidden text-[11.5px]">+ NEU</span>
        </Link>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden flex items-center justify-center px-4 border-l border-ink hover:bg-canvas-alt transition-colors"
          aria-label="Menü"
        >
          <div className="flex flex-col gap-1">
            <span className={`block w-5 h-0.5 bg-ink transition-transform duration-200 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-ink transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-ink transition-transform duration-200 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-ink bg-canvas">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-5 py-3 border-b border-ink/10 font-mono text-[11.5px] tracking-wider uppercase transition-colors
                ${pathname === to
                  ? 'text-ink bg-canvas-alt border-l-2 border-l-hazard'
                  : 'text-ink/80 hover:text-ink hover:bg-canvas-alt'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
