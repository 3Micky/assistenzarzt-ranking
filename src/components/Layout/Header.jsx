import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/berichte',  label: 'BERICHTE'  },
  { to: '/karte',     label: 'KARTE'     },
  { to: '/ranking',   label: 'RANKING'   },
  { to: '/vergleich', label: 'VERGLEICH' },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-ink sticky top-0 z-50 bg-canvas">
      {/* Register Strip */}
      <div className="register-strip">
        <span>ASSISTENZARZT-RANKING /// DE · AT · CH</span>
        <span className="text-canvas/40">ANONYME BEWERTUNGSPLATTFORM</span>
      </div>

      {/* Main Header */}
      <div className="flex items-stretch">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-5 py-3 border-r border-ink hover:bg-canvas-alt transition-colors">
          <div className="w-8 h-8 bg-ink flex items-center justify-center text-base flex-shrink-0">
            🏥
          </div>
          <div>
            <div className="font-display text-sm text-ink uppercase leading-none tracking-tight">
              AssistenzDoc
            </div>
            <div className="mono-label mt-0.5">Ranking-Plattform</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-stretch flex-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 border-r border-ink/10 font-mono text-[9px] tracking-wider uppercase transition-colors
                ${pathname === to
                  ? 'text-ink border-b-2 border-b-hazard bg-canvas-alt'
                  : 'text-ink/40 hover:text-ink hover:bg-canvas-alt'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link to="/bewerten" className="btn-hazard px-6 border-l border-ink flex-shrink-0">
          [ + BEWERTUNG ]
        </Link>
      </div>
    </header>
  )
}
