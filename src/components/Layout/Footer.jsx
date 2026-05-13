import { Link } from 'react-router-dom'
import { slugify } from '../../utils/slugify.js'

const TOP_CITIES = ['Berlin', 'München', 'Hamburg', 'Köln', 'Wien', 'Zürich']
const TOP_SPECS  = ['Innere Medizin', 'Chirurgie (Allgemein)', 'Anästhesiologie', 'Allgemeinmedizin', 'Psychiatrie', 'Neurologie']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink mt-auto">
      {/* 2 cols mobile → 4 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-ink divide-x divide-ink">

        {/* Plattform */}
        <div className="p-3">
          <div className="mono-label text-canvas/60 mb-2">/// PLATTFORM</div>
          <nav className="flex flex-col gap-1.5">
            {[
              { to: '/berichte',  label: 'Berichte'  },
              { to: '/ranking',   label: 'Ranking'   },
              { to: '/vergleich', label: 'Vergleich' },
              { to: '/karte',     label: 'Karte'     },
              { to: '/bewerten',  label: 'Bewerten'  },
              { to: '/faq',       label: 'FAQ'       },
              { to: '/ueber-uns', label: 'Über uns'  },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="font-mono text-[10px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Städte */}
        <div className="p-3">
          <div className="mono-label text-canvas/60 mb-2">/// STÄDTE</div>
          <nav className="flex flex-col gap-1.5">
            {TOP_CITIES.map(c => (
              <Link key={c} to={`/stadt/${slugify(c)}`} className="font-mono text-[10px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                {c}
              </Link>
            ))}
          </nav>
        </div>

        {/* Fachrichtungen — auf Mobile ausgeblendet, auf Desktop sichtbar */}
        <div className="p-3 hidden sm:block">
          <div className="mono-label text-canvas/60 mb-2">/// FACHRICHTUNGEN</div>
          <nav className="flex flex-col gap-1.5">
            {TOP_SPECS.map(s => (
              <Link key={s} to={`/fachrichtung/${slugify(s)}`} className="font-mono text-[10px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                {s}
              </Link>
            ))}
          </nav>
        </div>

        {/* Rechtliches + Brand */}
        <div className="p-3 flex flex-col justify-between">
          <div>
            <div className="mono-label text-canvas/60 mb-2">/// RECHTLICHES</div>
            <nav className="flex flex-col gap-1.5">
              {[
                { to: '/datenschutz', label: 'Datenschutz' },
                { to: '/agb',         label: 'AGB'         },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="font-mono text-[10px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink mb-0.5">
              Assistenz-Ranking
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 leading-relaxed">
              DE / AT / CH · © {year}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-1.5 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30">
          assistenz-ranking.de
        </span>
        <a
          href="mailto:kontakt@assistenz-ranking.de"
          className="font-mono text-[9px] uppercase tracking-widest text-ink/30 hover:text-ink/60 transition-colors"
        >
          kontakt@assistenz-ranking.de
        </a>
      </div>
    </footer>
  )
}
