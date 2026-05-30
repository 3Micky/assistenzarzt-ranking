import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
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
          <span className="sr-only">Assistenzarzt Bewertung – </span>
          Ärzt*innen helfen<br />Ärzt*innen
        </h1>
        <p className="text-sm text-ink/80 max-w-xl leading-relaxed">
          Anonyme Bewertungen von Assistenzärzt*innen aus Deutschland, Österreich und der Schweiz.
        </p>
      </div>

      {/* Search — full-bleed so bottom border reaches viewport edges */}
      <div className="border-b border-ink py-4 mx-[-0.75rem] sm:mx-[-1rem] md:mx-[-1.5rem] lg:mx-[-2rem] px-9 sm:px-10 md:px-12 lg:px-14">
        <div className="max-w-xl">
          <SearchWidget defaultMode="lesen" />
        </div>
      </div>

      {/* Stats — full-bleed wrapper so top/bottom borders reach viewport edges */}
      <div className="mx-[-0.75rem] sm:mx-[-1rem] md:mx-[-1.5rem] lg:mx-[-2rem]">
        <StatsBar />
      </div>

      {/* Map — full-bleed, breaks out of main padding */}
      <div className="border-b border-ink mx-[-0.75rem] sm:mx-[-1rem] md:mx-[-1.5rem] lg:mx-[-2rem]">
        <div className="register-strip border-b border-ink w-full">
          <span>/// DACH-HEATMAP</span>
          <span className="text-canvas/60">BEWERTUNGEN NACH REGION</span>
        </div>
        <GeoMap />
      </div>

      {/* FAQ — Top 3 für AI-Extraktion + Featured Snippets */}
      <div className="border-b border-ink px-6 py-8">
        <div className="mono-label mb-6">/// HÄUFIGE FRAGEN</div>
        <dl className="max-w-2xl space-y-6 mb-6">
          <div>
            <dt className="font-semibold text-ink mb-1">Was ist das Assistenz-Ranking?</dt>
            <dd className="text-sm text-ink/80 leading-relaxed">
              Das Assistenz-Ranking ist eine anonyme Bewertungsplattform für Assistenzarztstellen in Deutschland, Österreich und der Schweiz. Ärzt*innen bewerten Kliniken anhand von sechs Kriterien-Dimensionen — für ein ausgewogenes, datenbasiertes Gesamtbild jeder Station.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink mb-1">Sind die Bewertungen wirklich anonym?</dt>
            <dd className="text-sm text-ink/80 leading-relaxed">
              Ja. Es werden keine personenbezogenen Daten gespeichert oder veröffentlicht. Die Anonymität ist technisch sichergestellt — weder Name, noch Approbationsnummer, noch E-Mail-Adresse werden erhoben.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink mb-1">Nach welchen Kriterien werden Kliniken bewertet?</dt>
            <dd className="text-sm text-ink/80 leading-relaxed">
              Jede Bewertung durchläuft sechs Dimensionen, die im Spider-Chart verglichen werden: Weiterbildung (Supervision, Logbuch, Weiterbildungsdauer), Autonomie (Selbstständigkeit im Alltag), Work-Life (Arbeitsbelastung, Dienste, Überstunden), Teamklima (Atmosphäre, Familienfreundlichkeit, Begleitung), Struktur (Rotationspläne, Fortbildung, Mitarbeitergespräche) und Infrastruktur (Parkplatz, Dokumentationsaufwand). Aus diesen sechs Faktoren errechnet sich ein gewichteter Gesamt-Score.
            </dd>
          </div>
        </dl>
        <Link to="/faq" className="btn-ghost-ink inline-block text-center">
          ALLE FRAGEN →
        </Link>
      </div>
    </div>
  )
}
