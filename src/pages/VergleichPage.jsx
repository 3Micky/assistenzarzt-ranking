import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { searchHospitals, matchHospitalName } from '../utils/hospitalSearch.js'
import RadarComparison from '../components/Charts/RadarComparison.jsx'

const COLORS = ['#0EA5E9', '#E61919', '#22C55E']
const EMPTY  = { hospital: '', specialty: '' }

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

/* ─── Unified Slot Box ─── */
function SlotBox({ index, slot, onSelect, onClear }) {
  const [query, setQuery] = useState(slot.hospital)
  const [open, setOpen]   = useState(false)
  const ref               = useRef(null)
  const ratings           = useRatingsStore((s) => s.ratings)
  const ratedSet          = new Set(ratings.map(r => r.hospital))
  useClickOutside(ref, () => setOpen(false))

  const color = COLORS[index]
  const hasHospital = !!slot.hospital

  const results = query.trim().length >= 2 && !hasHospital
    ? searchHospitals(query, ratedSet, {}, 6)
    : []

  const availableSpecialties = hasHospital
    ? [...new Set(ratings.filter(r => matchHospitalName(r.hospital, slot.hospital)).map(r => r.specialty))].filter(Boolean).sort()
    : []

  function handleSelectHospital(h) {
    setQuery(h.name)
    setOpen(false)
    onSelect({ hospital: h.name, specialty: '' })
  }

  function handleClear() {
    setQuery('')
    setOpen(false)
    onClear()
  }

  return (
    <div className="bg-canvas" ref={ref}>
      <div className="px-3 pt-3 pb-1">
        <div className="mono-label mb-1.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
          SLOT {index + 1}
          {hasHospital && (
            <button onClick={handleClear}
              className="ml-auto font-mono text-[11.5px] text-ink/50 hover:text-hazard tracking-widest">
              ✕ ENTFERNEN
            </button>
          )}
        </div>

        {/* Hospital search — only shown when no hospital selected yet */}
        {!hasHospital && (
          <div className="relative">
            <input
              className="input-brutalist text-xs"
              placeholder="Klinik, Stadt, Bundesland…"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => query.length >= 2 && setOpen(true)}
              autoComplete="off"
            />
            {open && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white max-h-48 overflow-y-auto">
                {results.map((h, i) => (
                  <button key={i} onMouseDown={e => { e.preventDefault(); handleSelectHospital(h) }}
                    className="w-full flex items-center gap-2 px-3 py-2 border-b border-ink/10 last:border-b-0 hover:bg-canvas-alt text-left"
                  >
                    <span className="text-xs font-bold text-ink flex-1 truncate">{h.name}</span>
                    {h.hasRatings && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-hazard flex-shrink-0 border border-hazard/30 px-1">
                        Bewertet
                      </span>
                    )}
                    <span className="font-mono text-[11.5px] text-ink/60 flex-shrink-0">{h.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected hospital badge */}
        {hasHospital && (
          <div className="mt-1 px-2 py-1 border font-mono text-[11.5px] uppercase tracking-widest truncate"
               style={{ borderColor: color, color }}>
            ✓ {slot.hospital}
          </div>
        )}
      </div>

      {/* Specialty dropdown — appears after hospital is selected */}
      {hasHospital && (
        <div className="px-3 pb-3 mt-1">
          <div className="mono-label mb-1">FACHRICHTUNG</div>
          {availableSpecialties.length > 0 ? (
            <select
              className="input-brutalist text-xs w-full"
              value={slot.specialty}
              onChange={e => onSelect({ ...slot, specialty: e.target.value })}
            >
              <option value="">Alle Fachrichtungen (Gesamt)</option>
              {availableSpecialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <div className="font-mono text-[11px] text-ink/40 uppercase tracking-widest">
              Noch keine Bewertungen
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Hauptseite ─── */
export default function VergleichPage() {
  const [searchParams] = useSearchParams()
  const initialHospital  = searchParams.get('hospital') ?? searchParams.get('q') ?? ''
  const initialSpecialty = searchParams.get('specialty') ?? ''

  const [slots, setSlots] = useState([
    initialHospital ? { hospital: initialHospital, specialty: initialSpecialty } : EMPTY,
    EMPTY,
    EMPTY,
  ])

  function handleSelect(index, slot) {
    setSlots(prev => { const next = [...prev]; next[index] = slot; return next })
  }
  function handleClear(index) {
    setSlots(prev => { const next = [...prev]; next[index] = EMPTY; return next })
  }

  const activeCount = slots.filter(s => s.hospital).length

  return (
    <div>
      <Helmet>
        <title>Klinik-Vergleich | Bis zu 3 Kliniken vergleichen | assistenz-ranking.de</title>
        <meta name="description" content="Vergleiche bis zu 3 Kliniken direkt nebeneinander — optional nach Fachrichtung gefiltert. Weiterbildungsqualität, Arbeitsklima, Überstunden und mehr aus anonymen Assistenzarzt-Bewertungen." />
        <link rel="canonical" href="https://assistenz-ranking.de/vergleich" />
        <meta property="og:url" content="https://assistenz-ranking.de/vergleich" />
        <meta property="og:title" content="Klinik-Vergleich für Assistenzärzte | DACH" />
        <meta property="og:description" content="Bis zu 3 Kliniken direkt vergleichen — optional nach Fachrichtung. Weiterbildung, Klima, Gehalt aus anonymen Bewertungen." />
      </Helmet>

      <div className="register-strip border-b border-ink">
        <span>/// KLINIK-VERGLEICH</span>
        <span className="text-canvas/60">BIS ZU 3 KLINIKEN VERGLEICHEN</span>
      </div>

      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {[0, 1, 2].map(i => (
          <SlotBox
            key={i}
            index={i}
            slot={slots[i]}
            onSelect={slot => handleSelect(i, slot)}
            onClear={() => handleClear(i)}
          />
        ))}
      </div>

      {activeCount === 0 && (
        <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60">
          [ KLINIK EINGEBEN UM VERGLEICH ZU STARTEN ]
        </div>
      )}

      {activeCount > 0 && (
        <div className="border-t border-ink">
          <RadarComparison slots={slots} />
        </div>
      )}
    </div>
  )
}
