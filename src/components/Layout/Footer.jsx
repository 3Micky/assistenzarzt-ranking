import { Link } from 'react-router-dom'
import { slugify } from '../../utils/slugify.js'

const TOP_CITIES = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt am Main', 'Wien', 'Zürich']
const TOP_SPECS  = ['Innere Medizin', 'Chirurgie (Allgemein)', 'Anästhesiologie', 'Allgemeinmedizin', 'Psychiatrie', 'Neurologie']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink mt-auto">
      {/* Multi-column nav */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

        {/* Plattform */}
        <div className="p-4">
          <div className="mono-label text-canvas/60 mb-3">/// PLATTFORM</div>
          <nav className="flex flex-col gap-2">
            {[
              { to: '/berichte',  label: 'Berichte'          },
              { to: '/ranking',   label: 'Ranking'           },
              { to: '/vergleich', label: 'Vergleich'         },
              { to: '/karte',     label: 'Karte'             },
              { to: '/bewerten',  label: 'Bewertung abgeben' },
              { to: '/faq',       label: 'FAQ'               },
              { to: '/ueber-uns', label: 'Über uns'          },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="font-mono text-[11px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Suche nach */}
        <div className="p-4">
          <div className="mono-label text-canvas/60 mb-3">/// SUCHE NACH</div>
          <div className="mb-3">
            <div className="mono-label text-ink/40 mb-1.5" style={{ fontSize: '9px' }}>STÄDTE</div>
            <nav className="flex flex-col gap-1.5">
              {TOP_CITIES.map(c => (
                <Link key={c} to={`/stadt/${slugify(c)}`} className="font-mono text-[11px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                  {c}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <div className="mono-label text-ink/40 mb-1.5" style={{ fontSize: '9px' }}>FACHRICHTUNGEN</div>
            <nav className="flex flex-col gap-1.5">
              {TOP_SPECS.map(s => (
                <Link key={s} to={`/fachrichtung/${slugify(s)}`} className="font-mono text-[11px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                  {s}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Rechtliches + Brand */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            <div className="mono-label text-canvas/60 mb-3">/// RECHTLICHES</div>
            <nav className="flex flex-col gap-2">
              {[
                { to: '/datenschutz', label: 'Datenschutz' },
                { to: '/agb',         label: 'AGB'         },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="font-mono text-[11px] uppercase tracking-wider text-ink/60 hover:text-ink transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-6">
            <div className="font-mono text-[11.5px] font-bold uppercase tracking-widest text-ink mb-1">
              Assistenz-Ranking
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 leading-relaxed">
              Unabhängig · Anonym<br />
              Peer-to-peer · DE / AT / CH<br />
              © {year}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/30">
          assistenz-ranking.de
        </span>
        <a
          href="mailto:kontakt@assistenz-ranking.de"
          className="font-mono text-[10px] uppercase tracking-widest text-ink/30 hover:text-ink/60 transition-colors"
        >
          kontakt@assistenz-ranking.de
        </a>
      </div>
    </footer>
  )
}
