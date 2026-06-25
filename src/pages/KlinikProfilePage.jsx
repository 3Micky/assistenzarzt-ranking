import { useMemo } from 'react'
import { Head } from 'vite-react-ssg'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { scoreColor, scoreLabel, overallScore, avgByHospital, operativeTrainingScore } from '../utils/calculations.js'
import { getHospitalBySlug, aggregateHospitalData, hospitalProfileSchema } from '../utils/hospitalProfile.js'
import { slugify } from '../utils/slugify.js'
import {
  CRITERIA_CORE_V3,
  CRITERIA_ESSENTIAL,
  CRITERIA_MEDICAL,
  CRITERIA_NICE,
} from '../data/criteria.js'
import MiniRadar from '../components/Charts/MiniRadar.jsx'

const COUNTRY_NAMES = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }

function appendCityIfMissing(name, city) {
  if (!city) return name
  return name.toLowerCase().includes(city.toLowerCase()) ? name : `${name} ${city}`
}

function CriteriaValue({ type, value }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-ink/50">—</span>
  }

  if (type === 'boolean') {
    const color = value >= 50 ? 'text-score-high' : value >= 30 ? 'text-score-mid' : 'text-score-low'
    return (
      <span className={`font-bold ${color}`}>
        {value >= 50 ? 'JA' : 'NEIN'} {value}%
      </span>
    )
  }

  if (type === 'number') {
    const color = value >= 7.5 ? 'text-score-high' : value >= 5 ? 'text-score-mid' : 'text-score-low'
    return (
      <span className={`font-bold ${color}`}>
        {value}
        <span className="text-ink/40 font-normal ml-1 text-xs">/ 10</span>
      </span>
    )
  }
  if (type === 'scale5') {
    const scaled = value * 2
    return (
      <span className="font-bold" style={{ color: scoreColor(scaled) }}>
        {value}
        <span className="text-ink/40 font-normal ml-1 text-xs">/ 5</span>
      </span>
    )
  }

  return <span>{value}</span>
}

function CriteriaBar({ value, max = 10 }) {
  if (typeof value !== 'number') return null
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const colorValue = max === 5 ? value * 2 : value
  return (
    <div className="mt-1.5 h-1 bg-ink/10 w-full">
      <div
        className="h-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: scoreColor(colorValue) }}
      />
    </div>
  )
}

function CriteriaSection({ title, criteria, averages }) {
  const items = criteria.filter((c) => averages[c.key] != null)
  if (items.length === 0) return null

  return (
    <div className="border-b border-ink">
      <div className="register-strip border-b border-ink">{title}</div>
      <div className="ink-grid grid-cols-1 sm:grid-cols-2">
        {items.map((c) => {
          const avg = averages[c.key]
          return (
            <div key={c.key} className="bg-canvas p-3">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="mono-label mb-1 break-words flex-1 min-w-0">{c.label}</div>
                <div className="text-sm text-right flex-shrink-0">
                  <CriteriaValue type={avg.type} value={avg.value} />
                </div>
              </div>
              {(avg.type === 'number' || avg.type === 'scale5') && (
                <CriteriaBar value={avg.value} max={avg.type === 'scale5' ? 5 : 10} />
              )}
            </div>
          )
        })}
        {items.length % 2 !== 0 && <div className="bg-canvas" />}
      </div>
    </div>
  )
}

function ReviewRow({ rating }) {
  const navigate = useNavigate()
  const score = overallScore(rating.criteria)
  const opScore = operativeTrainingScore(rating.criteria, rating.specialty)
  const date = rating.timestamp
    ? new Date(rating.timestamp).toLocaleDateString('de-DE', { year: 'numeric', month: 'short' })
    : null

  return (
    <div
      onClick={() => navigate(`/berichte/${slugify(rating.hospital)}/${rating.id}`)}
      className="flex items-start gap-4 p-4 border-b border-ink/10 cursor-pointer hover:bg-canvas-alt transition-colors"
    >
      <div className="flex-shrink-0 text-right w-12">
        <div className="font-mono text-xl font-bold" style={{ color: scoreColor(score) }}>
          {score}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1">
          {rating.specialty && (
            <span className="mono-label text-hazard break-words max-w-full">{rating.specialty}</span>
          )}
          {opScore != null && (
            <span className="mono-label text-ink/70 border border-ink/20 px-1.5 py-0.5" title="OP-/Interventions-Ausbildungs-Score">
              OP {opScore}
            </span>
          )}
          {date && <span className="mono-label text-ink/50">{date}</span>}
        </div>
        {rating.comment && (
          <p className="text-sm text-ink/70 leading-relaxed truncate">{rating.comment}</p>
        )}
      </div>
    </div>
  )
}

export default function KlinikProfilePage() {
  const { slug } = useParams()
  const ratings = useRatingsStore((s) => s.ratings)
  const isLoading = useRatingsStore((s) => s.isLoading)

  const hospital = useMemo(() => getHospitalBySlug(slug, ratings), [slug, ratings])

  const data = useMemo(
    () => (hospital ? aggregateHospitalData(hospital.name, ratings) : null),
    [hospital, ratings]
  )

  // Global ranking data for this hospital's position
  const ranked = useMemo(() => avgByHospital(ratings), [ratings])
  const officialRankCount = ranked.filter((h) => h.isOfficial).length

  const profileSchema = useMemo(() => {
    if (!hospital || !data) return null
    return hospitalProfileSchema(hospital, data)
  }, [hospital, data])

  const breadcrumbSchema = useMemo(() => {
    if (!hospital) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Startseite',
          item: 'https://assistenz-ranking.de/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Berichte',
          item: 'https://assistenz-ranking.de/berichte',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: hospital.name,
          item: `https://assistenz-ranking.de/klinik/${slug}`,
        },
      ],
    }
  }, [hospital, slug])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink">/// KLINIK-PROFIL</div>
        <div className="p-12 text-center">
          <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 animate-pulse mb-4">
            /// LADE KLINIK-DATEN...
          </div>
          <div className="h-1 bg-ink/10 w-48 mx-auto overflow-hidden">
            <div className="h-full bg-hazard animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="max-w-3xl mx-auto my-6 border border-ink">
        <div className="register-strip border-b border-ink flex justify-between items-center">
          <Link to="/berichte" className="hover:text-hazard transition-colors">
            &lt;&lt;&lt; BERICHTE
          </Link>
        </div>
        <div className="p-12 text-center">
          <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 mb-4">
            /// KLINIK NICHT GEFUNDEN
          </div>
          <p className="text-sm text-ink/70 mb-6">
            Die gesuchte Klinik wurde nicht gefunden.
          </p>
          <Link to="/berichte" className="btn-hazard">
            ZU DEN BERICHTEN
          </Link>
        </div>
      </div>
    )
  }

  const hasRatings = data.count > 0
  const score = data.avgScore
  const label = scoreLabel(score)
  const countryName = COUNTRY_NAMES[hospital.country] ?? hospital.country

  const metaTitle = `${appendCityIfMissing(hospital.name, hospital.city)} — Assistenzarzt Bewertungen | assistenz-ranking.de`
  const metaDesc = hasRatings
    ? `${hospital.name}${hospital.city ? `, ${hospital.city}` : ''}: Ø-Score ${score}/10 bei ${data.scoreCount} vergleichbaren Bewertungen. Anonyme Assistenzarzt-Erfahrungen auf assistenz-ranking.de.`
    : `${hospital.name}${hospital.city ? `, ${hospital.city}` : ''} — Noch keine Bewertungen. Sei der*die Erste und teile deine Assistenzarzt-Erfahrung.`

  const canonical = `https://assistenz-ranking.de/klinik/${slug}`

  return (
    <div className="max-w-3xl mx-auto my-6 border border-ink overflow-hidden">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        {profileSchema && (
          <script type="application/ld+json">
            {JSON.stringify(profileSchema)}
          </script>
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
      </Head>

      {/* Register Strip + CTA Bar */}
      <div className="register-strip border-b border-ink flex justify-between items-center">
        <Link to="/berichte" className="hover:text-hazard transition-colors">
          &lt;&lt;&lt; BERICHTE
        </Link>
        <span className="text-canvas/60">KLINIK-PROFIL</span>
      </div>

      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Link
          to={`/bewerten?hospital=${encodeURIComponent(hospital.name)}${hospital.city ? `&city=${encodeURIComponent(hospital.city)}` : ''}${hospital.region ? `&region=${encodeURIComponent(hospital.region)}` : ''}${hospital.country ? `&country=${encodeURIComponent(hospital.country)}` : ''}`}
          className="btn-hazard text-center py-3 text-[9px] sm:text-[10px]"
        >
          + BEWERTUNG
        </Link>
        <Link
          to={`/vergleich?q=${encodeURIComponent(hospital.name)}`}
          className="btn-ghost-ink text-center py-3 text-[9px] sm:text-[10px]"
        >
          VERGLEICH
        </Link>
        <Link
          to={`/berichte?q=${encodeURIComponent(hospital.name)}&type=klinik`}
          className="btn-ghost-ink text-center py-3 text-[9px] sm:text-[10px]"
        >
          BERICHTE
        </Link>
      </div>

      {/* Hero */}
      <div className="border-b border-ink p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl text-ink uppercase tracking-tight leading-none mb-2 break-words">
              {hospital.name}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {hospital.city && <span className="mono-label">{hospital.city}</span>}
              {hospital.region && <span className="mono-label">{hospital.region}</span>}
              {hospital.country && (
                <span className="mono-label">
                  {hospital.country} · {countryName}
                </span>
              )}
              {hospital.carrier && (
                <span className="mono-label text-ink/50">{hospital.carrier}</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {hasRatings ? (
              <>
                <div className="font-mono text-5xl font-bold" style={{ color: scoreColor(score) }}>
                  {score}
                </div>
                <div className="mono-label mt-0.5">{label.toUpperCase()}</div>
                <div className="mono-label text-ink/50 mt-0.5">{data.scoreCount} SCORE-BEW.</div>
              </>
            ) : (
              <div className="font-mono text-sm font-bold text-ink/40 uppercase tracking-widest">
                NOCH KEINE<br />BEWERTUNGEN
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {hasRatings && (
        <div className="ink-grid grid-cols-2 sm:grid-cols-4 border-b border-ink">
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">BEWERTUNGEN</div>
            <div className="font-mono text-2xl font-bold text-ink">{data.count}</div>
          </div>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">Ø-SCORE</div>
            <div className="font-mono text-2xl font-bold" style={{ color: scoreColor(score) }}>
              {score}
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">RANG</div>
            <div className="font-mono text-2xl font-bold text-ink">
              {data.rank ?? '—'}
              {data.rank != null && <span className="text-sm text-ink/40">/{officialRankCount}</span>}
            </div>
            {!data.isOfficialRank && (
              <div className="mono-label text-ink/40 mt-1">AB 3 BEW.</div>
            )}
          </div>
          <div className="p-3 text-center">
            <div className="mono-label text-ink/50 mb-1">JA-EMPFEHLUNG</div>
            <div className="font-mono text-lg font-bold text-ink">
              {data.recommendation.yesPercent != null
                ? `${data.recommendation.yesPercent}%`
                : '—'}
            </div>
            {data.recommendation.count > 0 && (
              <div className="mono-label text-ink/40 mt-1">{data.recommendation.count} V3-ANTW.</div>
            )}
          </div>
        </div>
      )}

      {/* Specialties */}
      {hasRatings && data.specialties.length > 0 && (
        <div className="border-b border-ink px-5 py-3">
          <div className="mono-label mb-2">/// FACHRICHTUNGEN</div>
          <div className="flex flex-wrap gap-2">
            {data.specialties.map((s) => (
              <span key={s} className="font-mono text-[11.5px] uppercase tracking-wider text-ink/80 border border-ink/20 px-2 py-1">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Year Range */}
      {hasRatings && data.yearRange[0] != null && (
        <div className="border-b border-ink px-5 py-2">
          <span className="mono-label text-ink/50">
            BEWERTUNGSZEITRAUM: {data.yearRange[0]}
            {data.yearRange[1] !== data.yearRange[0] && ` – ${data.yearRange[1]}`}
          </span>
        </div>
      )}

      {/* Criteria Breakdown */}
      {hasRatings && data.scoreVersion === 3 ? (
        <CriteriaSection
          title="/// KERNBEWERTUNG V3"
          criteria={CRITERIA_CORE_V3}
          averages={data.criteriaAverages}
        />
      ) : hasRatings ? (
        <>
          <CriteriaSection
            title="/// PFLICHT-KRITERIEN · LEGACY V2"
            criteria={CRITERIA_ESSENTIAL}
            averages={data.criteriaAverages}
          />
          <CriteriaSection
            title="/// WEITERBILDUNG & AUSBILDUNGSQUALITÄT"
            criteria={CRITERIA_MEDICAL}
            averages={data.criteriaAverages}
          />
          <CriteriaSection
            title="/// NICE-TO-HAVE"
            criteria={CRITERIA_NICE}
            averages={data.criteriaAverages}
          />
        </>
      ) : null}

      {/* Mini Radar */}
      {hasRatings && (
        <div className="border-b border-ink">
          <div className="register-strip border-b border-ink">
            <span>/// KRITERIENPROFIL</span>
            <span className="text-canvas/60">SPIDER-CHART</span>
          </div>
          <MiniRadar hospitalName={hospital.name} />
        </div>
      )}

      {/* Individual Reviews */}
      <div className="border-b border-ink">
        <div className="register-strip border-b border-ink">
          <span>/// BEWERTUNGEN</span>
          <span className="text-canvas/60">{hasRatings ? `${data.count} BERICHTE` : 'NOCH KEINE'}</span>
        </div>
        {hasRatings ? (
          <div>
            {data.allRatings.map((r) => (
              <ReviewRow key={r.id} rating={r} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 mb-4">
              [ NOCH KEINE BEWERTUNGEN ]
            </div>
            <p className="text-sm text-ink/70 mb-4 max-w-md mx-auto">
              Diese Klinik wurde noch nicht bewertet. Sei der*die Erste und hilf anderen Assistenzärzt*innen.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
