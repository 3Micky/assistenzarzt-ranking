import { useEffect, useRef, useState } from 'react'
import { COUNTRY_FLAGS, SPECIALTIES } from '../../data/criteria.js'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { searchHospitals } from '../../utils/hospitalSearch.js'

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
  const searchRef = useRef(null)
  useClickOutside(searchRef, () => setOpen(false))

  const ratings = useRatingsStore(state => state.ratings)
  const ratedSet = new Set(ratings.map(rating => rating.hospital))
  const results = query.trim().length >= 2
    ? searchHospitals(query, ratedSet, {}, 8)
    : []

  const years = Array.from({ length: currentYear - 1999 }, (_, index) => currentYear - index)

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
      <div className="register-strip border-b border-ink">
        <span>SCHRITT 1 VON 4 /// KLINIK &amp; ZEITRAUM</span>
        <span className="text-canvas/60">CA. 3–4 MINUTEN</span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
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

        {!data.city && query.trim().length >= 2 && !open && (
          <div className="form-help text-hazard">
            Bitte eine Klinik aus der Ergebnisliste auswählen.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="form-card">
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
          <div className="form-card">
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

        <div className="form-card">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="form-card-title">Beschäftigungszeitraum</div>
              <div className="form-help mt-1">Wann hast du in dieser Abteilung gearbeitet?</div>
            </div>
            <span className="form-badge form-badge-required">PFLICHT</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label>
              <span className="mono-label block mb-1">VON JAHR</span>
              <select
                className="select-brutalist"
                value={data.yearFrom}
                onChange={event => {
                  const yearFrom = Number(event.target.value)
                  const yearTo = data.yearTo !== 'fortlaufend' && Number(data.yearTo) < yearFrom
                    ? yearFrom
                    : data.yearTo
                  onChange({ ...data, yearFrom, yearTo })
                }}
              >
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label>
              <span className="mono-label block mb-1">BIS JAHR</span>
            <select
              className="select-brutalist"
              value={data.yearTo}
              onChange={event => onChange({
                ...data,
                yearTo: event.target.value === 'fortlaufend'
                  ? 'fortlaufend'
                  : Number(event.target.value),
              })}
            >
              <option value="fortlaufend">FORTLAUFEND / AKTUELL</option>
              {years.filter(year => year >= data.yearFrom).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            </label>
          </div>
        </div>

        <div className="text-xs text-ink/65">
          Anonym, ohne Anmeldung. Wir veröffentlichen keine personenbezogenen Angaben.
        </div>
      </div>

      <div className="form-nav">
        <div />
        <button type="button" onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
          WEITER &gt;&gt;&gt;
        </button>
      </div>
    </div>
  )
}
