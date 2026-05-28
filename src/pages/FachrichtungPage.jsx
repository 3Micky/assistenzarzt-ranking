import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { avgByHospital, overallScore, scoreColor, scoreLabel } from '../utils/calculations.js'
import { slugify } from '../utils/slugify.js'
import { SPECIALTIES } from '../data/criteria.js'

export default function FachrichtungPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const ratings = useRatingsStore((s) => s.ratings)
  const isLoading = useRatingsStore((s) => s.isLoading)

  const specialty = useMemo(
    () => SPECIALTIES.find(s => slugify(s) === slug) ?? null,
    [slug]
  )

  const specRatings = useMemo(
    () => (specialty ? ratings.filter(r => r.specialty === specialty) : []),
    [specialty, ratings]
  )

  const ranked = useMemo(() => (specRatings.length ? avgByHospital(specRatings) : []), [specRatings])

  const avgScore = useMemo(() => {
    if (!specRatings.length) return null
    const scores = specRatings.map(r => overallScore(r.criteria)).filter(s => s > 0)
    return scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null
  }, [specRatings])

  const metaTitle = specialty
    ? `${specialty} — Klinik-Bewertungen Assistenzarzt | assistenz-ranking.de`
    : 'Fachrichtung nicht gefunden | assistenz-ranking.de'
  const metaDesc = specialty && avgScore
    ? `${specRatings.length} Bewertungen für ${specialty}: Ø ${avgScore}/10. Die besten Kliniken für Assistenzärzt*innen in ${specialty} — anonym bewertet.`
    : specialty
    ? `Alle Assistenzarzt-Bewertungen für ${specialty}. Finde die beste Klinik für deine Weiterbildung.`
    : ''

  const breadcrumbSchema = specialty ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://assistenz-ranking.de/' },
      { '@type': 'ListItem', position: 2, name: specialty, item: `https://assistenz-ranking.de/fachrichtung/${slug}` },
    ],
  } : null

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// FACHRICHTUNG</div>
        <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60 animate-pulse">
          /// LADE DATEN...
        </div>
      </div>
    )
  }

  if (!specialty) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// FACHRICHTUNG</div>
        <div className="p-12 text-center">
          <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 mb-4">
            /// FACHRICHTUNG NICHT GEFUNDEN
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
        <link rel="canonical" href={`https://assistenz-ranking.de/fachrichtung/${slug}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="robots" content={specRatings.length > 0 ? 'index, follow' : 'noindex'} />
        {breadcrumbSchema && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        )}
      </Helmet>

      <div className="register-strip border-b border-ink flex justify-between items-center">
        <Link to="/berichte" className="hover:text-hazard transition-colors">&lt;&lt;&lt; BERICHTE</Link>
        <span className="text-canvas/60">FACHRICHTUNG</span>
      </div>

      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Link
          to={`/bewerten?specialty=${encodeURIComponent(specialty)}`}
          className="btn-hazard text-center py-3"
        >
          [ + BEWERTUNG ]
        </Link>
        <Link to={`/berichte?q=${encodeURIComponent(specialty)}`} className="btn-ghost-ink text-center py-3">
          ALLE BERICHTE
        </Link>
      </div>

      {/* Hero */}
      <div className="border-b border-ink p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mono-label text-hazard mb-1">/// FACHRICHTUNG</div>
            <h1 className="font-display text-2xl text-ink uppercase tracking-tight leading-none mb-2">
              {specialty}
            </h1>
            <span className="mono-label text-ink/60">WEITERBILDUNGSSTELLEN DACH</span>
          </div>
          <div className="text-right flex-shrink-0">
            {avgScore ? (
              <>
                <div className="font-mono text-5xl font-bold" style={{ color: scoreColor(avgScore) }}>
                  {avgScore}
                </div>
                <div className="mono-label mt-0.5">{scoreLabel(avgScore).toUpperCase()}</div>
                <div className="mono-label text-ink/50 mt-0.5">{specRatings.length} BEW.</div>
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
      {specRatings.length > 0 && (
        <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">BEWERTUNGEN</div>
            <div className="font-mono text-2xl font-bold text-ink">{specRatings.length}</div>
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

      {/* Andere Fachrichtungen */}
      <div className="border-b border-ink">
        <div className="register-strip border-b border-ink">/// WEITERE FACHRICHTUNGEN</div>
        <div className="flex flex-wrap gap-2 p-4">
          {SPECIALTIES.filter(s => s !== specialty).map(s => (
            <Link
              key={s}
              to={`/fachrichtung/${slugify(s)}`}
              className="font-mono text-[11px] uppercase tracking-wider border border-ink/30 px-2 py-1 hover:bg-canvas-alt hover:border-ink transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Klinik-Ranking */}
      <div>
        <div className="register-strip border-b border-ink">
          <span>/// TOP-KLINIKEN: {specialty.toUpperCase()}</span>
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
              [ NOCH KEINE BEWERTUNGEN FÜR {specialty.toUpperCase()} ]
            </div>
            <p className="text-sm text-ink/70 mb-4 max-w-md mx-auto">
              Sei der*die Erste und teile deine Erfahrung in der {specialty}.
            </p>
            <Link to={`/bewerten?specialty=${encodeURIComponent(specialty)}`} className="btn-hazard">
              JETZT BEWERTEN
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
