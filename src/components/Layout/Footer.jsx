import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink mt-auto">
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-6">

        {/* Brand + Tagline */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11.5px] font-bold uppercase tracking-widest text-ink">
            Assistenz-Ranking
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
            Unabhängig · Peer-to-peer · Kostenlos · DE / AT / CH
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-ink/60">
          <Link to="/faq"         className="hover:text-ink transition-colors">FAQ</Link>
          <span className="text-ink/20">|</span>
          <Link to="/datenschutz" className="hover:text-ink transition-colors">Datenschutz</Link>
          <span className="text-ink/20">|</span>
          <Link to="/agb"         className="hover:text-ink transition-colors">AGB</Link>
          <span className="text-ink/20">|</span>
          <span className="text-ink/40">© {year}</span>
        </nav>

      </div>
    </footer>
  )
}
