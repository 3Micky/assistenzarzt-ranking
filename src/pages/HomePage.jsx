import { Helmet } from 'react-helmet-async'
import SearchWidget from '../components/Search/SearchWidget.jsx'
import GeoMap from '../components/GeoMap/GeoMap.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function HomePage() {
  return (
    <div>
      <Helmet>
        <title>Assistenzarzt-Ranking | Anonyme Bewertungen DACH</title>
        <meta name="description" content="Anonyme Bewertungen von Assistenzarztstellen in Deutschland, Österreich und der Schweiz. Kliniken vergleichen, Erfahrungen lesen und schreiben." />
        <link rel="canonical" href="https://assistenz-ranking.de/" />
        <meta property="og:url" content="https://assistenz-ranking.de/" />
        <meta property="og:title" content="Assistenzarzt-Ranking | Anonyme Bewertungen DACH" />
        <meta property="og:description" content="Anonyme Bewertungen von Assistenzarztstellen in Deutschland, Österreich und der Schweiz. Kliniken ehrlich vergleichen." />
      </Helmet>
      {/* Hero */}
      <div className="border-b border-ink px-6 pt-8 pb-6">
        <div className="mono-label-red mb-2">[ TRANSPARENT. ANONYM. FÜR ALLE. ]</div>
        <h1 className="font-display text-4xl text-ink uppercase tracking-tight leading-none mb-3">
          Ärzt*innen helfen<br />Ärzt*innen
        </h1>
        <p className="text-sm text-ink/80 max-w-xl leading-relaxed">
          Anonyme Bewertungen von Assistenzärzt*innen aus Deutschland, Österreich und der Schweiz.
        </p>
      </div>

      {/* Search */}
      <div className="border-b border-ink px-6 py-4">
        <div className="max-w-xl">
          <SearchWidget defaultMode="lesen" />
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Map */}
      <div className="border-b border-ink">
        <div className="px-6 py-2 border-b border-ink">
          <span className="mono-label">/// DACH-HEATMAP</span>
        </div>
        <GeoMap />
      </div>
    </div>
  )
}
