import { useState, useRef, useEffect } from 'react'
import { REGIONS, SPECIALTIES, COUNTRY_FLAGS } from '../../data/criteria.js'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { searchHospitals, getCitiesForFilters } from '../../utils/hospitalSearch.js'

/** Schließt ein Dropdown wenn außerhalb geklickt wird */
function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

/** Kleines wiederverwendbares Dropdown-Panel */
function DropdownList({ items, onSelect, renderItem }) {
  if (!items || items.length === 0) return null
  return (
    <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white max-h-60 overflow-y-auto">
      {items.map((item, i) => (
        <button
          key={i}
          onMouseDown={e => { e.preventDefault(); onSelect(item) }}
          className="w-full flex items-center gap-3 px-3 py-3 sm:py-2 border-b border-ink/10 last:border-b-0 hover:bg-canvas-alt text-left"
        >
          {renderItem(item)}
        </button>
      ))}
    </div>
  )
}

export default function StepHospital({ data, onChange, onNext, initialSearchMode = 'schnell' }) {
  const [searchMode, setSearchMode] = useState(initialSearchMode)

  // ── Schnellsuche ──────────────────────────────────────────────────────────
  const [schnellQuery, setSchnellQuery] = useState(data.hospital || '')
  const [schnellOpen, setSchnellOpen]   = useState(false)
  const schnellRef                       = useRef(null)
  useClickOutside(schnellRef, () => setSchnellOpen(false))

  // ── Genaue Suche ─────────────────────────────────────────────────────────
  const [cityQuery, setCityQuery]         = useState(data.city || '')
  const [cityOpen, setCityOpen]           = useState(false)
  const [klinikQuery, setKlinikQuery]     = useState(data.hospital || '')
  const [klinikOpen, setKlinikOpen]       = useState(false)
  const cityRef                            = useRef(null)
  const klinikRef                          = useRef(null)
  useClickOutside(cityRef,    () => setCityOpen(false))
  useClickOutside(klinikRef,  () => setKlinikOpen(false))

  const ratings  = useRatingsStore((s) => s.ratings)
  const ratedSet = new Set(ratings.map(r => r.hospital))

  // ── Schnellsuche Results ──────────────────────────────────────────────────
  const schnellResults = schnellQuery.trim().length >= 2
    ? searchHospitals(schnellQuery, ratedSet, {}, 8)
    : []

  function selectSchnell(h) {
    setSchnellQuery(h.name)
    setSchnellOpen(false)
    onChange({
      ...data,
      hospital: h.name,
      city:     h.city    || data.city,
      region:   h.region  || data.region,
      country:  h.country || data.country || 'DE',
    })
  }

  // ── Genaue Suche: verfügbare Städte (gefiltert nach Land + Region) ────────
  const availableCities = getCitiesForFilters({
    country: data.country || undefined,
    region:  data.region  || undefined,
  })
  const cityResults = cityQuery.trim().length >= 1
    ? availableCities.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).slice(0, 8)
    : availableCities.slice(0, 8)

  function selectCity(city) {
    setCityQuery(city)
    setCityOpen(false)
    onChange({ ...data, city })
  }

  // ── Genaue Suche: Klinik-Suche (gefiltert nach Land + Region + Stadt) ─────
  const klinikResults = klinikQuery.trim().length >= 1
    ? searchHospitals(klinikQuery, ratedSet, {
        country: data.country || undefined,
        region:  data.region  || undefined,
        city:    cityQuery.trim() || undefined,
      }, 8)
    : []

  function selectKlinik(h) {
    setKlinikQuery(h.name)
    setKlinikOpen(false)
    // Auto-fill Stadt, Region, Land aus dem gewählten Krankenhaus
    onChange({
      ...data,
      hospital: h.name,
      city:     h.city    || data.city,
      region:   h.region  || data.region,
      country:  h.country || data.country || 'DE',
    })
    setCityQuery(h.city || data.city || '')
  }

  // Wenn Land wechselt → Region + Stadt + Klinik zurücksetzen
  function handleCountryChange(country) {
    onChange({ ...data, country, region: '', city: '', hospital: '' })
    setCityQuery('')
    setKlinikQuery('')
  }

  // Wenn Bundesland wechselt → Stadt + Klinik zurücksetzen
  function handleRegionChange(region) {
    onChange({ ...data, region, city: '', hospital: '' })
    setCityQuery('')
    setKlinikQuery('')
  }

  // Klinikname, Land + Fachrichtung sind Pflicht — Jahr bleibt freiwillig
  const canProceed = data.hospital?.trim() && data.country && data.specialty

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i)

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 1 VON 5 /// KLINIK WÄHLEN
      </div>

      {/* Mode toggle */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => setSearchMode('schnell')} className={searchMode === 'schnell' ? 'tab-active' : 'tab-inactive'}>SCHNELLSUCHE</button>
        <button onClick={() => setSearchMode('genau')}   className={searchMode === 'genau'   ? 'tab-active' : 'tab-inactive'}>GENAUE SUCHE</button>
      </div>

      <div className="p-5">

        {/* ── SCHNELLSUCHE ─────────────────────────────────────────────────── */}
        {searchMode === 'schnell' && (
          <div className="relative mb-4" ref={schnellRef}>
            <input
              className="input-brutalist"
              placeholder='z.B. „St. Joseph Berlin" oder „Charité"'
              value={schnellQuery}
              onChange={e => {
                setSchnellQuery(e.target.value)
                onChange({ ...data, hospital: e.target.value })
                setSchnellOpen(true)
              }}
              onFocus={() => setSchnellOpen(true)}
              autoComplete="off"
            />
            {schnellOpen && (
              <DropdownList
                items={schnellResults}
                onSelect={selectSchnell}
                renderItem={h => (
                  <>
                    <span className="font-mono text-[11.5px] tracking-widest text-hazard min-w-[56px] uppercase">
                      KLINIK
                    </span>
                    <span className="text-sm sm:text-xs font-bold text-ink flex-1">{h.name}</span>
                    <span className="font-mono text-[11.5px] text-ink/60 flex-shrink-0 flex items-center gap-1">
                      {h.city && <span>{h.city}</span>}
                      {h.hasRatings === false && <span className="text-ink/50">NEU</span>}
                      <span>{COUNTRY_FLAGS[h.country]}</span>
                    </span>
                  </>
                )}
              />
            )}
          </div>
        )}

        {/* ── GENAUE SUCHE ─────────────────────────────────────────────────── */}
        {searchMode === 'genau' && (
          <div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>

            {/* 01 Land */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">01 /// LAND</div>
              <select className="select-brutalist" value={data.country || ''}
                onChange={e => handleCountryChange(e.target.value)}>
                <option value="">— Wählen —</option>
                <option value="DE">DE · Deutschland</option>
                <option value="AT">AT · Österreich</option>
                <option value="CH">CH · Schweiz</option>
              </select>
            </div>

            {/* 02 Bundesland / Kanton */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">02 /// BUNDESLAND / KANTON</div>
              <select className="select-brutalist" value={data.region || ''}
                onChange={e => handleRegionChange(e.target.value)}
                disabled={!data.country}>
                <option value="">— Wählen —</option>
                {(REGIONS[data.country] || []).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* 03 Stadt — Dropdown aus DB */}
            <div className="bg-canvas p-3 relative" ref={cityRef}>
              <div className="mono-label mb-1">03 /// STADT</div>
              <input
                className="input-brutalist"
                value={cityQuery}
                onChange={e => {
                  setCityQuery(e.target.value)
                  onChange({ ...data, city: e.target.value })
                  setCityOpen(true)
                }}
                onFocus={() => setCityOpen(true)}
                placeholder={data.country ? 'Stadt eingeben…' : 'Erst Land wählen'}
                disabled={!data.country}
                autoComplete="off"
              />
              {cityOpen && cityResults.length > 0 && (
                <DropdownList
                  items={cityResults}
                  onSelect={selectCity}
                  renderItem={city => (
                    <span className="text-xs font-bold text-ink">{city}</span>
                  )}
                />
              )}
            </div>

            {/* 04 Klinik — Dropdown aus DB */}
            <div className="bg-canvas p-3 relative" ref={klinikRef}>
              <div className="mono-label mb-1">04 /// KLINIK</div>
              <input
                className="input-brutalist"
                value={klinikQuery}
                onChange={e => {
                  setKlinikQuery(e.target.value)
                  onChange({ ...data, hospital: e.target.value })
                  setKlinikOpen(true)
                }}
                onFocus={() => klinikQuery.length >= 1 && setKlinikOpen(true)}
                placeholder={data.country ? 'Klinikname eingeben…' : 'Erst Land wählen'}
                disabled={!data.country}
                autoComplete="off"
              />
              {klinikOpen && klinikResults.length > 0 && (
                <DropdownList
                  items={klinikResults}
                  onSelect={selectKlinik}
                  renderItem={h => (
                    <>
                      <span className="text-sm sm:text-xs font-bold text-ink flex-1">{h.name}</span>
                      <span className="font-mono text-[11.5px] text-ink/60 flex-shrink-0 flex items-center gap-1">
                        {h.city}
                        {h.hasRatings === false && <span className="text-ink/50 ml-1">NEU</span>}
                      </span>
                    </>
                  )}
                />
              )}
            </div>

          </div>
        )}

        {/* Arbeitszeitraum */}
        <div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">VON JAHR</div>
            <select className="select-brutalist" value={data.yearFrom ?? currentYear}
              onChange={e => onChange({ ...data, yearFrom: +e.target.value })}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">BIS JAHR</div>
            <select className="select-brutalist" value={data.yearTo ?? 'fortlaufend'}
              onChange={e => onChange({ ...data, yearTo: e.target.value === 'fortlaufend' ? 'fortlaufend' : +e.target.value })}>
              <option value="fortlaufend">FORTLAUFEND</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Fachrichtung */}
        <div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr' }}>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">FACHRICHTUNG · PFLICHT</div>
            <select className="select-brutalist" value={data.specialty || ''}
              onChange={e => onChange({ ...data, specialty: e.target.value })}>
              <option value="">— Wählen —</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {!data.specialty && (
              <div className="mt-1 font-mono text-[11.5px] tracking-widest uppercase text-hazard">
                Fachrichtung wählen, um fortzufahren
              </div>
            )}
          </div>
        </div>

        {/* Ausgewählte Klinik als Zusammenfassung */}
        {data.hospital && (
          <div className="mb-4 px-3 py-2 bg-canvas border border-ink/20 font-mono text-[11.5px] uppercase tracking-widest text-ink/80">
            ✓ {data.hospital}
            {data.city   && ` · ${data.city}`}
            {data.region && ` · ${data.region}`}
            {data.country && ` · ${data.country}`}
            {data.yearFrom && ` · ${data.yearFrom} – ${data.yearTo === 'fortlaufend' ? 'FORTLAUFEND' : data.yearTo}`}
          </div>
        )}

        <div className="flex border-t border-ink mt-4 -mx-5 -mb-5">
          <div className="flex-1 bg-canvas" />
          <button onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
            WEITER &gt;&gt;&gt;
          </button>
        </div>
      </div>
    </div>
  )
}
