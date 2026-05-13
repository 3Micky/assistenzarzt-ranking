import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { avgByHospital, overallScore, scoreColor, scoreLabel } from '../utils/calculations.js'
import { slugify } from '../utils/slugify.js'
import { REGIONS, COUNTRY_LABELS } from '../data/criteria.js'

const ALL_REGIONS = [
  ...REGIONS.DE.map(r => ({ name: r, country: 'DE' })),
  ...REGIONS.AT.map(r => ({ name: r, country: 'AT' })),
  ...REGIONS.CH.map(r => ({ name: r, country: 'CH' })),
]

export default function BundeslandPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const ratings = useRatingsStore((s) => s.ratings)
  const isLoading = useRatingsStore((s) => s.isLoading)

  const region = useMemo(
    () => ALL_REGIONS.find(r => slugify(r.name) === slug) ?? null,
    [slug]
  )

  const regionRatings = useMemo(
    () => (region ? ratings.filter(r => r.region === region.name || r.country === region.country && r.region === region.name) : []),
    [region, ratings]
  )

  const ranked = useMemo(() => (regionRatings.length ? avgByHospital(regionRatings) : []), [regionRatings])

  const avgScore = useMemo(() => {
    if (!regionRatings.length) return null
    const scores = regionRatings.map(r => overallScore(r.criteria)).filter(s => s > 0)
    return scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null
  }, [regionRatings])

  // Städte mit Anzahl
  const cities = useMemo(() => {
    const map = {}
    regionRatings.forEach(r => {
      if (!r.city) return
      if (!map[r.city]) map[r.city] = { name: r.city, count: 0 }
      map[r.city].count++
    })
    return Object.values(map).sort((a, b) => b.count - a.count)
  }, [regionRatings])

  const isSwiss = region?.country === 'CH'
  const regionLabel = isSwiss ? 'KANTON' : 'BUNDESLAND'

  const metaTitle = region
    ? `Assistenzarzt-Bewertungen in ${region.name} — ${regionRatings.length} Berichte | assistenz-ranking.de`
    : 'Region nicht gefunden | assistenz-ranking.de'
  const metaDesc = region && avgScore
    ? `${regionRatings.length} Bewertungen aus ${region.name}: Ø ${avgScore}/10. Kliniken in ${region.name} vergleichen — anonyme Assistenzarzt-Erfahrungen.`
    : region
    ? `Alle Assistenzarzt-Kliniken in ${region.name}. Jetzt Erfahrungen lesen oder Bewertung abgeben.`
    : ''

  const breadcrumbSchema = region ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://assistenz-ranking.de/' },
      { '@type': 'ListItem', position: 2, name: region.name, item: `https://assistenz-ranking.de/bundesland/${slug}` },
    ],
  } : null

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// {regionLabel}</div>
        <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60 animate-pulse">
          /// LADE DATEN...
        </div>
      </div>
    )
  }

  if (!region) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// {regionLabel}</div>
        <div className="p-12 text-center">
          <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 mb-4">
            /// REGION NICHT GEFUNDEN
          </div>
          <Link to="/berichte" className="btn-hazard">ZU DEN BERICHTEN</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto my-6 border border-ink">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://assistenz-ranking.de/bundesland/${slug}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        {breadcrumbSchema && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        )}
      </Helmet>

      <div className="register-strip border-b border-ink flex justify-between items-center">
        <Link to="/berichte" className="hover:text-hazard transition-colors">&lt;&lt;&lt; BERICHTE</Link>
        <span className="text-canvas/60">/// {regionLabel}</span>
      </div>

      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Link
          to={`/bewerten?region=${encodeURIComponent(region.name)}&country=${region.country}`}
          className="btn-hazard text-center py-3"
        >
          [ + BEWERTUNG ]
        </Link>
        <Link to={`/berichte?q=${encodeURIComponent(region.name)}&type=bundesland`} className="btn-ghost-ink text-center py-3">
          ALLE BERICHTE
        </Link>
      </div>

      {/* Hero */}
      <div className="border-b border-ink p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mono-label text-hazard mb-1">/// {regionLabel}</div>
            <h1 className="font-display text-2xl text-ink uppercase tracking-tight leading-none mb-2">
              {region.name}
            </h1>
            <span className="mono-label">{region.country} · {COUNTRY_LABELS[region.country]}</span>
          </div>
          <div className="text-right flex-shrink-0">
            {avgScore ? (
              <>
                <div className="font-mono text-5xl font-bold" style={{ color: scoreColor(avgScore) }}>
                  {avgScore}
                </div>
                <div className="mono-label mt-0.5">{scoreLabel(avgScore).toUpperCase()}</div>
                <div className="mono-label text-ink/50 mt-0.5">{regionRatings.length} BEW.</div>
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
      {regionRatings.length > 0 && (
        <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">BEWERTUNGEN</div>
            <div className="font-mono text-2xl font-bold text-ink">{regionRatings.length}</div>
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

      {/* Städte in dieser Region */}
      {cities.length > 0 && (
        <div className="border-b border-ink">
          <div className="register-strip border-b border-ink">
            <span>/// STÄDTE</span>
            <span className="text-canvas/60">{cities.length} ORTE</span>
          </div>
          <div className="flex flex-wrap gap-2 p-4">
            {cities.map(c => (
              <Link
                key={c.name}
                to={`/stadt/${slugify(c.name)}`}
                className="font-mono text-[11px] uppercase tracking-wider border border-ink/30 px-2 py-1 hover:bg-canvas-alt hover:border-ink transition-colors"
              >
                {c.name}
                <span className="text-ink/40 ml-1">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Klinik-Ranking */}
      <div>
        <div className="register-strip border-b border-ink">
          <span>/// KLINIKEN</span>
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
                <div className="font-mono text-lg font-bold text-ink/30 w-8 text-right flex-shrink-0">{i + 1}</div>
                <div className="flex-shrink-0 w-12 text-right">
                  <div className="font-mono text-xl font-bold" style={{ color: scoreColor(h.avg) }}>{h.avg}</div>
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
              [ NOCH KEINE BEWERTUNGEN FÜR {region.name.toUpperCase()} ]
            </div>
            <Link to={`/bewerten?region=${encodeURIComponent(region.name)}&country=${region.country}`} className="btn-hazard">
              JETZT BEWERTEN
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
