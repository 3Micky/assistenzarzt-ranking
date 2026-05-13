import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchDropdown from './SearchDropdown.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { COUNTRY_LABELS, REGIONS, SPECIALTIES } from '../../data/criteria.js'
import { searchHospitals, getCitiesForFilters, getHospitalsForFilters } from '../../utils/hospitalSearch.js'
import { slugify } from '../../utils/slugify.js'

const COUNTRY_ALIASES = {
  deutschland: 'DE', de: 'DE',
  österreich: 'AT', oesterreich: 'AT', at: 'AT', austria: 'AT',
  schweiz: 'CH', ch: 'CH', swiss: 'CH', switzerland: 'CH',
}

/**
 * @param {{ defaultMode?: 'lesen'|'bewerten' }} props
 */
export default function SearchWidget({ defaultMode = 'lesen' }) {
  const [mode, setMode]            = useState(defaultMode)
  const [showAdvanced, setShowAdv] = useState(false)

  // ── Schnellsuche State ────────────────────────────────────────────────────
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen]     = useState(false)

  // ── Genaue Suche State (kaskadiert) ───────────────────────────────────────
  const [advCountry,  setAdvCountry]  = useState('')
  const [advRegion,   setAdvRegion]   = useState('')
  const [advCity,     setAdvCity]     = useState('')
  const [advHospital, setAdvHospital] = useState('')
  const [advMode,     setAdvMode]     = useState('lesen')

  const ratings    = useRatingsStore((s) => s.ratings)
  const ratedSet   = useMemo(() => new Set(ratings.map(r => r.hospital)), [ratings])
  const navigate   = useNavigate()
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Genaue Suche: kaskadierte Listen aus Klinik-DB ────────────────────────
  const advRegions = useMemo(() =>
    advCountry ? (REGIONS[advCountry] ?? []) : []
  , [advCountry])

  const advCities = useMemo(() =>
    getCitiesForFilters({ country: advCountry || undefined, region: advRegion || undefined })
  , [advCountry, advRegion])

  const advHospitals = useMemo(() =>
    (advCountry && advCity)
      ? getHospitalsForFilters({ country: advCountry, region: advRegion || undefined, city: advCity }, ratedSet)
      : []
  , [advCountry, advRegion, advCity, ratedSet])

  function handleAdvCountry(c) {
    setAdvCountry(c); setAdvRegion(''); setAdvCity(''); setAdvHospital('')
  }
  function handleAdvRegion(r) {
    setAdvRegion(r); setAdvCity(''); setAdvHospital('')
  }
  function handleAdvCity(c) {
    setAdvCity(c); setAdvHospital('')
  }

  // ── Schnellsuche Logic ────────────────────────────────────────────────────
  function buildResults(q) {
    if (!q.trim() || q.trim().length < 2) return []
    const lower = q.toLowerCase().trim()

    const countryCode = COUNTRY_ALIASES[lower]
    if (countryCode) {
      const label = COUNTRY_LABELS[countryCode]
      const count = [...new Set(ratings.filter(r => r.country === countryCode).map(r => r.hospital))].length
      return [{ type: 'bundesland', label, country: countryCode, count }]
    }

    const out = []
    const hospitalHits = searchHospitals(q, ratedSet, {}, 6)
    hospitalHits.forEach(h => {
      out.push({ type: 'klinik', label: h.name, city: h.city, region: h.region, country: h.country, hasRatings: h.hasRatings })
    })

    const cities = [...new Set(ratings.map(r => r.city))]
    cities.filter(c => c.toLowerCase().includes(lower)).slice(0, 3).forEach(c => {
      const r   = ratings.find(r => r.city === c)
      const cnt = [...new Set(ratings.filter(r => r.city === c).map(r => r.hospital))].length
      out.push({ type: 'stadt', label: c, country: r?.country, count: cnt })
    })

    const regions = [...new Set(ratings.map(r => r.region).filter(Boolean))]
    regions.filter(rg => rg.toLowerCase().includes(lower)).slice(0, 2).forEach(rg => {
      const r   = ratings.find(r => r.region === rg)
      const cnt = [...new Set(ratings.filter(r => r.region === rg).map(r => r.hospital))].length
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
    if (mode === 'bewerten' && r.type === 'klinik') {
      const p = new URLSearchParams()
      p.set('hospital', r.label)
      if (r.city)    p.set('city',    r.city)
      if (r.region)  p.set('region',  r.region)
      if (r.country) p.set('country', r.country)
      navigate(`/bewerten?${p}`)
    } else {
      if (r.type === 'klinik') {
        navigate(`/klinik/${slugify(r.label)}`)
      } else {
        navigate(`/berichte?${new URLSearchParams({ q: r.label, type: r.type ?? '', country: r.country ?? '' })}`)
      }
    }
  }

  function handleQuickSubmit(e) {
    e.preventDefault()
    setOpen(false)
    if (mode === 'bewerten') {
      const p = new URLSearchParams()
      if (query) p.set('hospital', query)
      navigate(`/bewerten?${p}`)
    } else {
      const exactMatch = ratings.find(r => r.hospital.toLowerCase() === query.trim().toLowerCase())
      if (exactMatch) {
        navigate(`/klinik/${slugify(exactMatch.hospital)}`)
      } else {
        navigate(`/berichte?${new URLSearchParams({ q: query })}`)
      }
    }
  }

  // ── Genaue Suche: Submit ──────────────────────────────────────────────────
  function handleAdvSubmit() {
    if (advMode === 'bewerten' && advHospital) {
      const selected = advHospitals.find(h => h.name === advHospital)
      const p = new URLSearchParams()
      p.set('hospital', advHospital)
      if (selected?.city)    p.set('city',    selected.city)
      if (selected?.region)  p.set('region',  selected.region)
      if (advCountry)        p.set('country', advCountry)
      navigate(`/bewerten?${p}`)
    } else {
      const p = new URLSearchParams()
      if (advHospital) { p.set('q', advHospital); p.set('type', 'klinik') }
      else if (advCity) { p.set('q', advCity); p.set('type', 'stadt') }
      else if (advRegion) { p.set('q', advRegion); p.set('type', 'bundesland') }
      if (advCountry) p.set('country', advCountry)
      if (advRegion)  p.set('region',  advRegion)
      if (advCity)    p.set('city',    advCity)
      navigate(`/berichte?${p}`)
    }
  }

  const advCanSubmit = !!(advCountry || advRegion || advCity || advHospital)

  return (
    <div className="border border-ink bg-canvas">
      {/* Tabs */}
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <button
          onClick={() => { setMode('lesen'); setShowAdv(false) }}
          className={`${mode === 'lesen' && !showAdvanced ? 'tab-active' : 'tab-inactive'} whitespace-nowrap overflow-hidden text-ellipsis`}
          style={{ fontSize: '10px', padding: '8px 4px' }}
        >
          <span className="hidden sm:inline">&gt;&gt;&gt; </span>BERICHTE
        </button>
        <button
          onClick={() => { setMode('bewerten'); setShowAdv(false) }}
          className={`${mode === 'bewerten' && !showAdvanced ? 'tab-active' : 'tab-inactive'} whitespace-nowrap`}
          style={{ fontSize: '10px', padding: '8px 4px' }}
        >
          [BEWERTEN]
        </button>
        <button
          onClick={() => setShowAdv(v => !v)}
          className={`${showAdvanced ? 'tab-active' : 'tab-inactive'} whitespace-nowrap overflow-hidden text-ellipsis`}
          style={{ fontSize: '10px', padding: '8px 4px' }}
        >
          {showAdvanced ? '▲ ' : '▼ '}SUCHE
        </button>
      </div>

      {/* ── GENAUE SUCHE: reine Dropdowns ───────────────────────────────────── */}
      {showAdvanced && (
        <div className="border-t border-ink bg-canvas">

          {/* 1. Land */}
          <div className="border-b border-ink px-4 py-3">
            <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// 01 LAND</div>
            <div className="ink-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[['DE', '🇩🇪 DEUTSCHLAND'], ['AT', '🇦🇹 ÖSTERREICH'], ['CH', '🇨🇭 SCHWEIZ']].map(([c, label]) => (
                <button key={c}
                  onClick={() => handleAdvCountry(c)}
                  className={advCountry === c ? 'tab-active' : 'tab-inactive'}
                  style={{ fontSize: '10px', padding: '5px 2px' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Bundesland / Kanton — nur wenn Land gewählt */}
          {advCountry && advRegions.length > 0 && (
            <div className="border-b border-ink px-4 py-3">
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>
                /// 02 {advCountry === 'CH' ? 'KANTON' : 'BUNDESLAND'}
              </div>
              <select
                value={advRegion}
                onChange={e => handleAdvRegion(e.target.value)}
                className="input-brutalist text-xs w-full"
              >
                <option value="">— Alle {advCountry === 'CH' ? 'Kantone' : 'Bundesländer'} —</option>
                {advRegions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          {/* 3. Stadt — aus Klinik-DB, gefiltert nach Land + Bundesland */}
          {advCountry && (
            <div className="border-b border-ink px-4 py-3">
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// 03 STADT</div>
              <select
                value={advCity}
                onChange={e => handleAdvCity(e.target.value)}
                className="input-brutalist text-xs w-full"
                disabled={!advCountry}
              >
                <option value="">— Stadt wählen —</option>
                {advCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* 4. Klinik — aus Klinik-DB, gefiltert nach Stadt */}
          {advCity && advHospitals.length > 0 && (
            <div className="border-b border-ink px-4 py-3">
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// 04 KLINIK</div>
              <select
                value={advHospital}
                onChange={e => setAdvHospital(e.target.value)}
                className="input-brutalist text-xs w-full"
              >
                <option value="">— Klinik wählen (optional) —</option>
                {advHospitals.map(h => (
                  <option key={h.name} value={h.name}>
                    {h.hasRatings ? '★ ' : ''}{h.name}
                  </option>
                ))}
              </select>
              {/* Hint: Klinik nicht gelistet → Freitext im Formular */}
              <p className="mt-2 font-mono text-[10px] text-ink/50">
                Klinik nicht in der Liste?{' '}
                <button
                  type="button"
                  onClick={() => {
                    const p = new URLSearchParams()
                    if (advCountry) p.set('country', advCountry)
                    if (advRegion)  p.set('region',  advRegion)
                    if (advCity)    p.set('city',    advCity)
                    p.set('searchMode', 'genau')
                    navigate(`/bewerten?${p}`)
                  }}
                  className="underline text-hazard hover:text-ink transition-colors"
                >
                  Namen im Formular frei eingeben →
                </button>
              </p>
            </div>
          )}

          {/* Aktion + SUCHEN */}
          <div className="px-4 py-3 flex flex-col gap-3">
            <div>
              <div className="mono-label mb-2" style={{ fontSize: '10px' }}>/// AKTION</div>
              <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button onClick={() => setAdvMode('lesen')}
                  className={advMode === 'lesen' ? 'tab-active' : 'tab-inactive'}
                  style={{ fontSize: '11px', padding: '5px 2px' }}>
                  BERICHTE LESEN
                </button>
                <button onClick={() => setAdvMode('bewerten')}
                  className={advMode === 'bewerten' ? 'tab-active' : 'tab-inactive'}
                  style={{ fontSize: '11px', padding: '5px 2px' }}>
                  BEWERTEN
                </button>
              </div>
            </div>
            <button
              onClick={handleAdvSubmit}
              disabled={!advCanSubmit}
              className="btn-hazard disabled:opacity-30 disabled:cursor-not-allowed"
            >
              SUCHEN &gt;&gt;&gt;
            </button>
          </div>
        </div>
      )}

      {/* ── SCHNELLSUCHE: Freitext + Dropdown ───────────────────────────────── */}
      {!showAdvanced && (
        <form onSubmit={handleQuickSubmit} className="relative border-t border-ink" ref={wrapperRef}>
          <div className="ink-grid" style={{ gridTemplateColumns: '1fr auto' }}>
            <input
              className="bg-white border-none outline-none px-4 py-3 text-sm font-sans text-ink placeholder-ink/30 w-full"
              placeholder='Klinik, Stadt, Bundesland… z.B. "Charité Berlin"'
              value={query}
              onChange={handleChange}
              onFocus={() => query && setOpen(true)}
              autoComplete="off"
            />
            <button type="submit" className="btn-hazard px-6 border-l border-ink whitespace-nowrap">
              SUCHEN &gt;&gt;&gt;
            </button>
          </div>

          {open && results.length > 0 && (
            <SearchDropdown results={results} onSelect={handleSelect} />
          )}

          {/* Hint: Klinik nicht gefunden → Freitext im Formular (nur im Bewerten-Tab) */}
          {mode === 'bewerten' && query.trim().length >= 2 && results.length === 0 && (
            <p className="px-4 py-2 border-t border-ink/10 font-mono text-[10px] text-ink/50">
              Nicht gefunden? Einfach{' '}
              <strong className="text-ink/70">SUCHEN</strong> drücken — du kannst den Namen im Formular frei eingeben.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
