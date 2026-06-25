import { useMemo } from 'react'
import { Head } from 'vite-react-ssg'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { averageScoreForRatings, avgByHospital, scoreColor, scoreLabel } from '../utils/calculations.js'
import { slugify } from '../utils/slugify.js'
import { getCitiesForFilters } from '../utils/hospitalSearch.js'

const COUNTRY_LABEL = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }

export default function StadtPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const ratings = useRatingsStore((s) => s.ratings)
  const isLoading = useRatingsStore((s) => s.isLoading)

  // Rückübersetzung slug → Stadtname
  const cityName = useMemo(() => {
    const all = getCitiesForFilters()
    return all.find(c => slugify(c) === slug) ?? null
  }, [slug])

  const cityRatings = useMemo(
    () => (cityName ? ratings.filter(r => r.city === cityName) : []),
    [cityName, ratings]
  )

  const ranked = useMemo(() => {
    if (!cityRatings.length) return []
    return avgByHospital(cityRatings)
  }, [cityRatings])

  const avgScore = useMemo(() => {
    if (!cityRatings.length) return null
    return averageScoreForRatings(cityRatings)
  }, [cityRatings])

  const country = cityRatings[0]?.country ?? null

  const metaTitle = cityName
    ? `Assistenzarzt-Bewertungen in ${cityName} — ${cityRatings.length} Berichte | assistenz-ranking.de`
    : 'Stadt nicht gefunden | assistenz-ranking.de'
  const metaDesc = cityName && avgScore
    ? `${cityRatings.length} Bewertungen aus ${cityName}: Ø ${avgScore}/10. Vergleiche Kliniken in ${cityName} — anonyme Assistenzarzt-Erfahrungen.`
    : cityName
    ? `Alle Assistenzarzt-Kliniken in ${cityName} auf einen Blick. Jetzt Erfahrungen lesen oder eigene Bewertung abgeben.`
    : ''

  const breadcrumbSchema = cityName ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://assistenz-ranking.de/' },
      { '@type': 'ListItem', position: 2, name: cityName, item: `https://assistenz-ranking.de/stadt/${slug}` },
    ],
  } : null

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// STADTPROFIL</div>
        <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60 animate-pulse">
          /// LADE DATEN...
        </div>
      </div>
    )
  }

  if (!cityName) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// STADTPROFIL</div>
        <div className="p-12 text-center">
          <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 mb-4">
            /// STADT NICHT GEFUNDEN
          </div>
          <Link to="/berichte" className="btn-hazard">ZU DEN BERICHTEN</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto my-6 border border-ink">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://assistenz-ranking.de/stadt/${slug}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="robots" content={cityRatings.length > 0 ? 'index, follow' : 'noindex'} />
        {breadcrumbSchema && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        )}
      </Head>

      {/* Register Strip */}
      <div className="register-strip border-b border-ink flex justify-between items-center">
        <Link to="/berichte" className="hover:text-hazard transition-colors">&lt;&lt;&lt; BERICHTE</Link>
        <span className="text-canvas/60">STADTPROFIL</span>
      </div>

      {/* CTA Bar */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Link
          to={`/bewerten?city=${encodeURIComponent(cityName)}${country ? `&country=${country}` : ''}`}
          className="btn-hazard text-center py-3"
        >
          [ + BEWERTUNG ]
        </Link>
        <Link to={`/berichte?q=${encodeURIComponent(cityName)}&type=stadt`} className="btn-ghost-ink text-center py-3">
          ALLE BERICHTE
        </Link>
      </div>

      {/* Hero */}
      <div className="border-b border-ink p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mono-label text-hazard mb-1">/// STADT</div>
            <h1 className="font-display text-2xl text-ink uppercase tracking-tight leading-none mb-2">
              {cityName}
            </h1>
            {country && (
              <span className="mono-label">{country} · {COUNTRY_LABEL[country] ?? country}</span>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            {avgScore ? (
              <>
                <div className="font-mono text-5xl font-bold" style={{ color: scoreColor(avgScore) }}>
                  {avgScore}
                </div>
                <div className="mono-label mt-0.5">{scoreLabel(avgScore).toUpperCase()}</div>
                <div className="mono-label text-ink/50 mt-0.5">{cityRatings.length} BEW.</div>
              </>
            ) : (
              <div className="font-mono text-sm font-bold text-ink/40 uppercase tracking-widest">
                NOCH KEINE<br />BEWERTUNGEN
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {cityRatings.length > 0 && (
        <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">BEWERTUNGEN</div>
            <div className="font-mono text-2xl font-bold text-ink">{cityRatings.length}</div>
          </div>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">Ø-SCORE</div>
            <div className="font-mono text-2xl font-bold" style={{ color: scoreColor(avgScore) }}>{avgScore}</div>
          </div>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">KLINIKEN</div>
            <div className="font-mono text-2xl font-bold text-ink">{ranked.length}</div>
          </div>
        </div>
      )}

      {/* Klinik-Ranking */}
      <div>
        <div className="register-strip border-b border-ink">
          <span>/// KLINIKEN IN {cityName.toUpperCase()}</span>
          <span className="text-canvas/60">{ranked.length} EINTRÄGE</span>
        </div>
        {ranked.length > 0 ? (
          <div>
            {ranked.map((h, i) => (
              <div
                key={h.hospital}
                onClick={() => navigate(`/klinik/${slugify(h.hospital)}`)}
                className="flex items-center gap-4 p-4 border-b border-ink/10 cursor-pointer hover:bg-canvas-alt transition-colors"
              >
                <div className="font-mono text-lg font-bold text-ink/30 w-8 text-right flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-shrink-0 text-right w-12">
                  <div className="font-mono text-xl font-bold" style={{ color: scoreColor(h.avg) }}>
                    {h.avg}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink truncate">{h.hospital}</div>
                  <div className="mono-label text-ink/50 mt-0.5">{h.count} BEW.</div>
                </div>
                <div className="font-mono text-[11.5px] text-hazard hidden sm:block">PROFIL →</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 mb-4">
              [ NOCH KEINE BEWERTUNGEN FÜR {cityName.toUpperCase()} ]
            </div>
            <p className="text-sm text-ink/70 mb-4 max-w-md mx-auto">
              Sei der*die Erste und teile deine Erfahrung aus einer Klinik in {cityName}.
            </p>
            <Link
              to={`/bewerten?city=${encodeURIComponent(cityName)}`}
              className="btn-hazard"
            >
              JETZT BEWERTEN
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
