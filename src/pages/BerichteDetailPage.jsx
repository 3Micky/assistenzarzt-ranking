import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { useParams, Link } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { isCurrentCriteria, overallScore, scoreColor, scoreLabel } from '../utils/calculations.js'
import { slugify } from '../utils/slugify.js'
import {
  CRITERIA_CONTEXT_V3,
  CRITERIA_CORE_V3,
  CRITERIA_DISPLAY_V3,
  CRITERIA_ESSENTIAL,
  CRITERIA_MEDICAL,
  CRITERIA_NICE,
  SCALE_5_OPTIONS,
} from '../data/criteria.js'
import MeldeModal from '../components/Berichte/MeldeModal.jsx'

const COUNTRY_NAMES = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }

function appendCityIfMissing(name, city) {
  if (!city) return name
  return name.toLowerCase().includes(city.toLowerCase()) ? name : `${name} ${city}`
}

function renderValue(type, value, key) {
  if (value === null || value === undefined || value === '') return <span className="text-ink/50">—</span>
  if (type === 'boolean') {
    return (
      <span className={`font-bold ${value === true ? 'text-score-high' : 'text-score-low'}`}>
        {value === true ? 'JA' : 'NEIN'}
      </span>
    )
  }
  if (type === 'slider') {
    return (
      <span className="font-bold" style={{ color: scoreColor(value) }}>{value} / 10</span>
    )
  }
  if (type === 'scale5') {
    const label = SCALE_5_OPTIONS.find(option => option.value === value)?.shortLabel ?? value
    return <span className="font-bold" style={{ color: scoreColor(value * 2) }}>{label} · {value}/5</span>
  }
  if (type === 'time') return <span>{value}</span>
  if (type === 'number') return <span className="font-bold">{value}</span>
  return <span>{value}</span>
}

function CriteriaSection({ title, criteria, values }) {
  const items = criteria.filter(c => values[c.key] !== null && values[c.key] !== undefined && values[c.key] !== '')
  if (items.length === 0) return null
  return (
    <div className="border-b border-ink">
      <div className="register-strip border-b border-ink">{title}</div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {items.map(c => (
          <div key={c.key} className="bg-canvas p-3">
            <div className="mono-label mb-1">{c.label}</div>
            <div className="text-sm">{renderValue(c.type, values[c.key], c.key)}</div>
          </div>
        ))}
        {items.length % 2 !== 0 && <div className="bg-canvas" />}
      </div>
    </div>
  )
}

export default function BerichteDetailPage() {
  const { id } = useParams()
  const ratings = useRatingsStore((s) => s.ratings)
  const [meldeOpen, setMeldeOpen] = useState(false)

  const rating = ratings.find(r => r.id === id)

  if (!rating) {
    return (
      <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60">
        BEWERTUNG NICHT GEFUNDEN —{' '}
        <Link to="/berichte" className="text-hazard hover:underline">ZURÜCK ZU BERICHTEN</Link>
      </div>
    )
  }

  const score = overallScore(rating.criteria)
  const isV3 = isCurrentCriteria(rating.criteria)
  const date  = rating.timestamp ? new Date(rating.timestamp).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' }) : null
  const country = COUNTRY_NAMES[rating.country] ?? rating.country
  const metaTitle = `${appendCityIfMissing(rating.hospital, rating.city)} — Erfahrungsbericht Assistenzarzt | assistenz-ranking.de`
  const metaDesc  = `Anonymer Erfahrungsbericht: ${rating.hospital}${rating.city ? `, ${rating.city}` : ''}${rating.specialty ? ` · ${rating.specialty}` : ''}. Gesamtscore: ${score}/10. Bewertung auf assistenz-ranking.de.`

  return (
    <div className="max-w-3xl mx-auto my-6 border border-ink overflow-hidden">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://assistenz-ranking.de/berichte/${rating.id}`} />
        <meta property="og:url" content={`https://assistenz-ranking.de/berichte/${rating.id}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
      </Head>
      {meldeOpen && <MeldeModal rating={rating} onClose={() => setMeldeOpen(false)} />}

      {/* Header */}
      <div className="register-strip border-b border-ink flex justify-between items-center">
        <Link to="/berichte" className="hover:text-hazard transition-colors">&lt;&lt;&lt; BERICHTE</Link>
        {date && <span className="text-canvas/60">{date}</span>}
      </div>

      {/* Klinik-Info */}
      <div className="border-b border-ink p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl text-ink uppercase tracking-tight leading-none mb-2 break-words">
              <Link
                to={`/klinik/${slugify(rating.hospital)}`}
                className="hover:text-hazard hover:underline transition-colors"
              >
                {rating.hospital}
              </Link>
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {rating.city    && <span className="mono-label">{rating.city}</span>}
              {rating.region  && <span className="mono-label">{rating.region}</span>}
              {rating.country && <span className="mono-label">{COUNTRY_NAMES[rating.country] ?? rating.country}</span>}
              {rating.specialty && <span className="mono-label text-hazard">{rating.specialty}</span>}
              {rating.yearFrom && (
                <span className="mono-label">
                  {rating.yearFrom} – {rating.yearTo === 'fortlaufend' ? 'FORTLAUFEND' : rating.yearTo}
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-4xl font-bold" style={{ color: scoreColor(score) }}>{score}</div>
            <div className="mono-label mt-0.5">{scoreLabel(score).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Criteria sections */}
      {isV3 ? (
        <>
          <CriteriaSection
            title="/// KERNBEWERTUNG"
            criteria={CRITERIA_CORE_V3}
            values={rating.criteria}
          />
          <CriteriaSection
            title="/// KONTEXT"
            criteria={CRITERIA_CONTEXT_V3}
            values={rating.criteria}
          />
          <CriteriaSection
            title="/// ZAHLEN & ZUSATZANGABEN"
            criteria={CRITERIA_DISPLAY_V3}
            values={rating.criteria}
          />
        </>
      ) : (
        <>
          <CriteriaSection
            title="/// PFLICHT-KRITERIEN · LEGACY V2"
            criteria={CRITERIA_ESSENTIAL}
            values={rating.criteria}
          />
          <CriteriaSection
            title="/// WEITERBILDUNG & AUSBILDUNGSQUALITÄT"
            criteria={CRITERIA_MEDICAL}
            values={rating.criteria}
          />
          <CriteriaSection
            title="/// NICE-TO-HAVE"
            criteria={CRITERIA_NICE}
            values={rating.criteria}
          />
        </>
      )}

      {/* CTA Bar */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Link
          to={`/bewerten?hospital=${encodeURIComponent(rating.hospital)}${rating.city ? `&city=${encodeURIComponent(rating.city)}` : ''}${rating.region ? `&region=${encodeURIComponent(rating.region)}` : ''}${rating.country ? `&country=${encodeURIComponent(rating.country)}` : ''}${rating.specialty ? `&specialty=${encodeURIComponent(rating.specialty)}` : ''}`}
          className="btn-hazard text-center py-3 text-[9px] sm:text-[10px]"
        >
          + BEWERTUNG
        </Link>
        <Link
          to={`/vergleich?mode=abteilung&hospital=${encodeURIComponent(rating.hospital)}${rating.specialty ? `&specialty=${encodeURIComponent(rating.specialty)}` : ''}`}
          className="btn-ghost-ink text-center py-3 text-[9px] sm:text-[10px]"
        >
          VERGLEICH
        </Link>
        <Link
          to={`/berichte?q=${encodeURIComponent(rating.hospital)}&type=klinik`}
          className="btn-ghost-ink text-center py-3 text-[9px] sm:text-[10px]"
        >
          BERICHTE
        </Link>
      </div>

      {/* Kommentar */}
      {rating.comment && (
        <div className="border-b border-ink p-5">
          <div className="mono-label mb-2">/// KOMMENTAR</div>
          <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{rating.comment}</p>
        </div>
      )}

      {/* Footer: Melden */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setMeldeOpen(true)}
          className="font-mono text-[11.5px] uppercase tracking-widest text-ink/50 hover:text-hazard transition-colors border border-ink/20 hover:border-hazard px-3 py-1.5"
        >
          ⚑ INHALT MELDEN
        </button>
      </div>
    </div>
  )
}
