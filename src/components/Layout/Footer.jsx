import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink mt-auto">
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-ink/70">
        <span className="mono-label">
          ASSISTENZDOC /// ANONYME BEWERTUNGSPLATTFORM /// DE · AT · CH
        </span>
        <nav className="flex gap-4">
          <Link to="/datenschutz" className="hover:text-ink transition-colors">Datenschutz</Link>
          <Link to="/agb"         className="hover:text-ink transition-colors">AGB</Link>
        </nav>
      </div>
    </footer>
  )
}
