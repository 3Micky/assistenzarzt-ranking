import { useEffect, useRef, useState } from 'react'
import { COUNTRY_FLAGS, REGIONS, SPECIALTIES } from '../../data/criteria.js'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { getCitiesForFilters, searchHospitals } from '../../utils/hospitalSearch.js'

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

function DropdownList({ items, onSelect, renderItem }) {
  if (!items?.length) return null
  return (
    <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white max-h-60 overflow-y-auto">
      {items.map((item, index) => (
        <button
          type="button"
          key={index}
          onMouseDown={(event) => {
            event.preventDefault()
            onSelect(item)
          }}
          className="w-full flex items-center gap-3 px-3 py-3 border-b border-ink/10 last:border-b-0 hover:bg-canvas-alt text-left"
        >
          {renderItem(item)}
        </button>
      ))}
    </div>
  )
}

export default function StepHospital({
  data,
  criteria,
  onChange,
  onCriteriaChange,
  onNext,
}) {
  const currentYear = new Date().getFullYear()
  const [query, setQuery] = useState(data.hospital || '')
  const [open, setOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const searchRef = useRef(null)
  useClickOutside(searchRef, () => setOpen(false))

  const ratings = useRatingsStore(state => state.ratings)
  const ratedSet = new Set(ratings.map(rating => rating.hospital))
  const results = query.trim().length >= 2
    ? searchHospitals(query, ratedSet, {}, 8)
    : []

  const period = data.yearTo === 'fortlaufend'
    ? 'aktuell'
    : data.yearFrom === currentYear - 1 && Number(data.yearTo) === currentYear - 1
      ? 'letztes-jahr'
      : 'frueher'
  const earlierYears = Array.from({ length: currentYear - 1999 }, (_, index) => currentYear - index)

  const availableCities = getCitiesForFilters({
    country: data.country || undefined,
    region: data.region || undefined,
  })

  function selectHospital(hospital) {
    setQuery(hospital.name)
    setOpen(false)
    onChange({
      ...data,
      hospital: hospital.name,
      city: hospital.city || '',
      region: hospital.region || '',
      country: hospital.country || 'DE',
    })
  }

  function setPeriod(value) {
    if (value === 'aktuell') {
      onChange({ ...data, yearFrom: currentYear, yearTo: 'fortlaufend' })
      return
    }
    if (value === 'letztes-jahr') {
      onChange({ ...data, yearFrom: currentYear - 1, yearTo: currentYear - 1 })
      return
    }
    const year = data.yearTo === 'fortlaufend' ? currentYear - 2 : Number(data.yearFrom || currentYear - 2)
    onChange({ ...data, yearFrom: year, yearTo: year })
  }

  const canProceed = Boolean(
    data.hospital?.trim()
    && data.city?.trim()
    && data.country
    && data.region
    && data.specialty
    && criteria.weiterbildungsjahr
  )

  return (
    <div>
      <div className="register-strip border-b border-ink flex justify-between">
        <span>SCHRITT 1 VON 3 /// ARBEITSPLATZ</span>
        <span className="text-canvas/60">CA. 2 MINUTEN GESAMT</span>
      </div>

      <div className="p-5 space-y-4">
        <div ref={searchRef} className="relative">
          <label className="mono-label block mb-2">KLINIK · PFLICHT</label>
          <input
            className="input-brutalist"
            placeholder='z. B. „Charité" oder „Klinik Nauen"'
            value={query}
            onChange={(event) => {
              const hospital = event.target.value
              setQuery(hospital)
              setOpen(true)
              onChange({ ...data, hospital, city: '', region: '' })
            }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
          />
          {open && (
            <DropdownList
              items={results}
              onSelect={selectHospital}
              renderItem={hospital => (
                <>
                  <span className="text-sm font-bold text-ink flex-1">{hospital.name}</span>
                  <span className="font-mono text-[11.5px] text-ink/60 flex-shrink-0">
                    {hospital.city} {COUNTRY_FLAGS[hospital.country]}
                  </span>
                </>
              )}
            />
          )}
          {data.city && (
            <div className="mt-2 font-mono text-[11.5px] uppercase tracking-wider text-ink/60">
              ✓ {data.city} · {data.region} · {data.country}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setManualOpen(value => !value)}
          className="font-mono text-[11.5px] uppercase tracking-widest text-ink/60 hover:text-hazard"
        >
          {manualOpen ? '− ORTSEINGABE SCHLIESSEN' : '+ KLINIK NICHT GEFUNDEN? ORT MANUELL ANGEBEN'}
        </button>

        {manualOpen && (
          <div className="ink-grid grid-cols-1 sm:grid-cols-3">
            <div className="bg-canvas p-3">
              <label className="mono-label block mb-1">LAND</label>
              <select
                className="select-brutalist"
                value={data.country || ''}
                onChange={(event) => onChange({
                  ...data,
                  country: event.target.value,
                  region: '',
                  city: '',
                })}
              >
                <option value="">— Wählen —</option>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
              </select>
            </div>
            <div className="bg-canvas p-3">
              <label className="mono-label block mb-1">REGION</label>
              <select
                className="select-brutalist"
                value={data.region || ''}
                disabled={!data.country}
                onChange={(event) => onChange({ ...data, region: event.target.value, city: '' })}
              >
                <option value="">— Wählen —</option>
                {(REGIONS[data.country] || []).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="bg-canvas p-3">
              <label className="mono-label block mb-1">STADT</label>
              <input
                className="input-brutalist"
                list="rating-city-options"
                value={data.city || ''}
                disabled={!data.country}
                onChange={(event) => onChange({ ...data, city: event.target.value })}
              />
              <datalist id="rating-city-options">
                {availableCities.slice(0, 300).map(city => <option key={city} value={city} />)}
              </datalist>
            </div>
          </div>
        )}

        <div className="ink-grid grid-cols-1 sm:grid-cols-2">
          <div className="bg-canvas p-3">
            <label className="mono-label block mb-1">FACHRICHTUNG · PFLICHT</label>
            <select
              className="select-brutalist"
              value={data.specialty || ''}
              onChange={(event) => onChange({ ...data, specialty: event.target.value })}
            >
              <option value="">— Wählen —</option>
              {SPECIALTIES.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          <div className="bg-canvas p-3">
            <label className="mono-label block mb-1">WEITERBILDUNGSJAHR · PFLICHT</label>
            <select
              className="select-brutalist"
              value={criteria.weiterbildungsjahr ?? ''}
              onChange={(event) => onCriteriaChange({
                ...criteria,
                weiterbildungsjahr: event.target.value ? Number(event.target.value) : null,
              })}
            >
              <option value="">— Wählen —</option>
              {Array.from({ length: 10 }, (_, index) => index + 1).map(year => (
                <option key={year} value={year}>{year}. Weiterbildungsjahr</option>
              ))}
              <option value="11">Fachärzt*in / danach</option>
            </select>
          </div>
        </div>

        <div>
          <div className="mono-label mb-2">ZEITRAUM · PFLICHT</div>
          <div className="grid grid-cols-3 gap-1">
            {[
              ['aktuell', 'Aktuell'],
              ['letztes-jahr', String(currentYear - 1)],
              ['frueher', 'Früher'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => setPeriod(value)}
                className={period === value ? 'tab-active' : 'tab-inactive'}
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>
          {period === 'frueher' && (
            <select
              className="select-brutalist mt-2"
              value={data.yearFrom}
              onChange={(event) => {
                const year = Number(event.target.value)
                onChange({ ...data, yearFrom: year, yearTo: year })
              }}
            >
              {earlierYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          )}
        </div>

        <div className="text-xs text-ink/65">
          Anonym, ohne Anmeldung. Wir veröffentlichen keine personenbezogenen Angaben.
        </div>
      </div>

      <div className="flex border-t border-ink">
        <div className="flex-1 bg-canvas" />
        <button type="button" onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
          WEITER &gt;&gt;&gt;
        </button>
      </div>
    </div>
  )
}
