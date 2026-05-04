import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import FilterBar from '../components/Berichte/FilterBar.jsx'
import BerichteTabelle from '../components/Berichte/BerichteTabelle.jsx'

const EMPTY_FILTERS = { country: '', region: '', specialty: '', dienstsystem: '', hospital: '' }

export default function BerichtePage() {
  const ratings        = useRatingsStore((s) => s.ratings)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => {
    const q = searchParams.get('q') ?? ''
    return { ...EMPTY_FILTERS, hospital: q }
  })

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value, ...(key === 'country' ? { region: '' } : {}) }))
  }

  const filtered = useMemo(() => {
    return ratings.filter(r => {
      if (filters.country      && r.country   !== filters.country)     return false
      if (filters.region       && r.region    !== filters.region)      return false
      if (filters.specialty    && r.specialty !== filters.specialty)   return false
      if (filters.dienstsystem && r.criteria.dienstsystem !== filters.dienstsystem) return false
      if (filters.hospital     && !r.hospital.toLowerCase().includes(filters.hospital.toLowerCase())) return false
      return true
    })
  }, [ratings, filters])

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// BERICHTE LESEN</span>
        <span className="text-canvas/40">ALLE BEWERTUNGEN</span>
      </div>
      <FilterBar filters={filters} onChange={updateFilter} />
      <BerichteTabelle ratings={filtered} />
    </div>
  )
}
