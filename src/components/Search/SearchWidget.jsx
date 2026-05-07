import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchDropdown from './SearchDropdown.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { COUNTRY_LABELS, REGIONS, SPECIALTIES } from '../../data/criteria.js'
import { searchHospitals } from '../../utils/hospitalSearch.js'

const COUNTRY_ALIASES = {
  deutschland: 'DE', de: 'DE',
  österreich: 'AT', oesterreich: 'AT', at: 'AT', austria: 'AT',
  schweiz: 'CH', ch: 'CH', swiss: 'CH', switzerland: 'CH',
}

/**
 * @param {{ defaultMode?: 'lesen'|'bewerten' }} props
 */
export default function SearchWidget({ defaultMode = 'lesen' }) {
  const [mode, setMode]             = useState(defaultMode)
  const [showAdvanced, setShowAdv]  = useState(false)
  const [query, setQuery]           = useState('')
  const [results, setResults]       = useState([])
  const [open, setOpen]             = useState(false)

  // Kaskadierte Filter
  const [filterCountry, setCountry]   = useState('')
  const [filterRegion, setRegion]     = useState('')
  const [filterCity, setCity]         = useState('')
  const [filterSpec, setSpec]         = useState('')

  const ratings    = useRatingsStore((s) => s.ratings)
  const navigate   = useNavigate()
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Kaskadierte Optionen
  const availableRegions = useMemo(() => {
    if (!filterCountry) return []
    return REGIONS[filterCountry] ?? []
  }, [filterCountry])

  const availableCities = useMemo(() => {
    let filtered = ratings
    if (filterCountry) filtered = filtered.filter(r => r.country === filterCountry)
    if (filterRegion)  filtered = filtered.filter(r => r.region  === filterRegion)
    return [...new Set(filtered.map(r => r.city).filter(Boolean))].sort()
  }, [ratings, filterCountry, filterRegion])

  function handleCountryChange(c) {
    setCountry(c); setRegion(''); setCity('')
  }
  function handleRegionChange(r) {
    setRegion(r); setCity('')
  }

  function buildResults(q) {
    if (!q.trim() || q.trim().length < 2) return []
    const lower = q.toLowerCase().trim()

    const countryCode = COUNTRY_ALIASES[lower]
    if (countryCode) {
      const label = COUNTRY_LABELS[countryCode]
      const count = [...new Set(ratings.filter(r => r.country === countryCode).map(r => r.hospital))].length
      return [{ type: 'bundesland', label, country: countryCode, count }]
    }

    // Ratings nach aktiven Filtern einschränken
    let base = ratings
    if (filterCountry) base = base.filter(r => r.country === filterCountry)
    if (filterRegion)  base = base.filter(r => r.region  === filterRegion)
    if (filterCity)    base = base.filter(r => r.city    === filterCity)
    if (filterSpec)    base = base.filter(r => r.specialty === filterSpec)

    const ratedSet = new Set(base.map(r => r.hospital))
    const cities   = [...new Set(base.map(r => r.city))]
    const regions  = [...new Set(base.map(r => r.region).filter(Boolean))]
    const out = []

    const hospitalHits = searchHospitals(q, ratedSet, {}, 6)
    hospitalHits.forEach(h => {
      if (filterCountry && h.country !== filterCountry) return
      if (filterCity    && h.city    !== filterCity)    return
      out.push({ type: 'klinik', label: h.name, city: h.city, region: h.region, country: h.country, hasRatings: h.hasRatings })
    })

    cities.filter(c => c.toLowerCase().includes(lower)).slice(0, 3).forEach(c => {
      const r   = base.find(r => r.city === c)
      const cnt = [...new Set(base.filter(r => r.city === c).map(r => r.hospital))].length
      out.push({ type: 'stadt', label: c, country: r?.country, count: cnt })
    })

    regions.filter(rg => rg.toLowerCase().includes(lower)).slice(0, 2).forEach(rg => {
      const r   = base.find(r => r.region === rg)
      const cnt = [...new Set(base.filter(r => r.region === rg).map(r => r.hospital))].length
      out.push({ type: 'bundesland', label: rg, country: r?.country, count: cnt })
    })

    return out.slice(0, 10)
  }

  function handleChange(e) {
    const q = e.target.value
    setQuery(q)
    setResults(buildResults(q))
    setOpen(true)
  }

  function handleSelect(r) {
    setQuery(r.label)
    setOpen(false)
    const params = buildParams(r.label, r.type, r.country)
    navigate(`/berichte?${params}`)
  }

  function buildParams(q, type, country) {
    const p = new URLSearchParams({ q: q ?? '' })
    if (type)          p.set('type', type)
    if (country)       p.set('country', country)
    if (filterCountry) p.set('country', filterCountry)
    if (filterRegion)  p.set('region', filterRegion)
    if (filterCity)    p.set('city', filterCity)
    if (filterSpec)    p.set('spec', filterSpec)
    return p.toString()
  }

  function handleSubmit(e) {
    e.preventDefault()
    setOpen(false)
    const params = buildParams(query)
    if (mode === 'bewerten') {
      navigate(`/bewerten?${params}`)
    } else {
      navigate(`/berichte?${params}`)
    }
  }

  const submitLabel = 'SUCHEN >>>'

  return (
    <div className="border border-ink bg-canvas">
      {/* Schnellzugriff: 3 Tabs */}
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <button
          onClick={() => { setMode('lesen'); setShowAdv(false) }}
          className={mode === 'lesen' && !showAdvanced ? 'tab-active' : 'tab-inactive'}
        >
          &gt;&gt;&gt; BERICHTE LESEN
        </button>
        <button
          onClick={() => { setMode('bewerten'); setShowAdv(false) }}
          className={mode === 'bewerten' && !showAdvanced ? 'tab-active' : 'tab-inactive'}
        >
          [ BEWERTEN ]
        </button>
        <button
          onClick={() => setShowAdv(v => !v)}
          className={showAdvanced ? 'tab-active' : 'tab-inactive'}
        >
          {showAdvanced ? '▲ GENAUE SUCHE' : '▼ GENAUE SUCHE'}
        </button>
      </div>

      {/* Erweiterte kaskadierte Filter */}
      {showAdvanced && (
        <div className="border-t border-ink bg-canvas">
          {/* Land */}
          <div className="border-b border-ink px-4 py-3">
            <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// LAND</div>
            <div className="ink-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {[['', 'ALLE'], ['DE', '🇩🇪 DE'], ['AT', '🇦🇹 AT'], ['CH', '🇨🇭 CH']].map(([c, label]) => (
                <button key={c}
                  onClick={() => handleCountryChange(c)}
                  className={filterCountry === c ? 'tab-active' : 'tab-inactive'}
                  style={{ fontSize: '11px', padding: '5px 2px' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bundesland — nur wenn Land gewählt */}
          {filterCountry && availableRegions.length > 0 && (
            <div className="border-b border-ink px-4 py-3">
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>
                /// {filterCountry === 'CH' ? 'KANTON' : 'BUNDESLAND'}
              </div>
              <select
                value={filterRegion}
                onChange={e => handleRegionChange(e.target.value)}
                className="input-brutalist text-xs w-full"
              >
                <option value="">— Alle {filterCountry === 'CH' ? 'Kantone' : 'Bundesländer'} —</option>
                {availableRegions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          {/* Stadt — nur wenn Bundesland gewählt oder Land mit bewerteten Städten */}
          {availableCities.length > 0 && (
            <div className="border-b border-ink px-4 py-3">
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// STADT</div>
              <select
                value={filterCity}
                onChange={e => setCity(e.target.value)}
                className="input-brutalist text-xs w-full"
              >
                <option value="">— Alle Städte —</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Fachrichtung + Aktion */}
          <div className="px-4 py-3 flex flex-col gap-3">
            <div>
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// FACHRICHTUNG</div>
              <select
                value={filterSpec}
                onChange={e => setSpec(e.target.value)}
                className="input-brutalist text-xs w-full"
              >
                <option value="">— Alle Fachrichtungen —</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// AKTION</div>
              <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button onClick={() => setMode('lesen')}
                  className={mode === 'lesen' ? 'tab-active' : 'tab-inactive'}
                  style={{ fontSize: '11px', padding: '5px 2px' }}>
                  BERICHTE LESEN
                </button>
                <button onClick={() => setMode('bewerten')}
                  className={mode === 'bewerten' ? 'tab-active' : 'tab-inactive'}
                  style={{ fontSize: '11px', padding: '5px 2px' }}>
                  BEWERTEN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suchzeile */}
      <form onSubmit={handleSubmit} className="relative border-t border-ink" ref={wrapperRef}>
        <div className="ink-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <input
            className="bg-white border-none outline-none px-4 py-3 text-sm font-sans text-ink placeholder-ink/30 w-full"
            placeholder={filterCity ? `Klinik in ${filterCity} suchen…` : 'Klinik, Stadt, Bundesland… z.B. "Charité Berlin"'}
            value={query}
            onChange={handleChange}
            onFocus={() => query && setOpen(true)}
            autoComplete="off"
          />
          <button type="submit" className="btn-hazard px-6 border-l border-ink whitespace-nowrap">
            {submitLabel}
          </button>
        </div>

        {open && results.length > 0 && (
          <SearchDropdown results={results} onSelect={handleSelect} />
        )}
      </form>
    </div>
  )
}
