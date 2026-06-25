import { useState, useMemo } from 'react'
import { Head } from 'vite-react-ssg'
import { useSearchParams } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { overallScore } from '../utils/calculations.js'
import FilterBar from '../components/Berichte/FilterBar.jsx'
import BerichteTabelle from '../components/Berichte/BerichteTabelle.jsx'

const EMPTY_FILTERS = { country: '', region: '', specialty: '', hospital: '', city: '', scoreMin: '0' }

export default function BerichtePage() {
  const ratings        = useRatingsStore((s) => s.ratings)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    country:  searchParams.get('country') ?? '',
    hospital: searchParams.get('q')       ?? '',
    city:     searchParams.get('city')    ?? '',
  }))

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value, ...(key === 'country' ? { region: '' } : {}) }))
  }

  const filtered = useMemo(() => {
    const minScore = parseFloat(filters.scoreMin ?? '0') || 0
    return ratings.filter(r => {
      if (filters.country   && r.country   !== filters.country)   return false
      if (filters.region    && r.region    !== filters.region)    return false
      if (filters.specialty && r.specialty !== filters.specialty) return false
      if (filters.hospital  && !r.hospital.toLowerCase().includes(filters.hospital.toLowerCase())) return false
      if (filters.city      && !r.city?.toLowerCase().includes(filters.city.toLowerCase())) return false
      if (minScore > 0 && overallScore(r.criteria) < minScore)   return false
      return true
    })
  }, [ratings, filters])

  return (
    <div>
      <Head>
        <title>Erfahrungsberichte Assistenzärzte | Kliniken DACH | assistenz-ranking.de</title>
        <meta name="description" content="Alle anonymen Erfahrungsberichte von Assistenzärztinnen und Assistenzärzten aus Deutschland, Österreich und der Schweiz — filtern nach Klinik, Stadt und Fachrichtung." />
        <link rel="canonical" href="https://assistenz-ranking.de/berichte" />
        <meta property="og:url" content="https://assistenz-ranking.de/berichte" />
        <meta property="og:title" content="Erfahrungsberichte Assistenzärzte | DACH" />
        <meta property="og:description" content="Anonyme Bewertungen von Assistenzarztstellen — nach Klinik, Stadt und Fachrichtung filtern." />
      </Head>
      <div className="register-strip border-b border-ink">
        <span>/// BERICHTE LESEN</span>
        <span className="text-canvas/60">ALLE BEWERTUNGEN</span>
      </div>
      <FilterBar filters={filters} onChange={updateFilter} />
      <BerichteTabelle ratings={filtered} />
    </div>
  )
}
