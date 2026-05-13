import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import { searchHospitals, matchHospitalName } from '../utils/hospitalSearch.js'
import RadarComparison from '../components/Charts/RadarComparison.jsx'

const COLORS = ['#0EA5E9', '#E61919', '#22C55E']
const SLOTS  = [0, 1, 2]

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

/* ─── Klinik-Suchbox (wie bisher, leicht angepasst) ─── */
function KlinikSearchBox({ index, value, onSelect, onClear }) {
  const [query, setQuery]   = useState(value ?? '')
  const [open, setOpen]     = useState(false)
  const ref                 = useRef(null)
  const ratings             = useRatingsStore((s) => s.ratings)
  const ratedSet            = new Set(ratings.map(r => r.hospital))
  useClickOutside(ref, () => setOpen(false))

  const results = query.trim().length >= 2
    ? searchHospitals(query, ratedSet, {}, 6)
    : []

  const color = COLORS[index]
  const selected = !!value

  function handleSelect(h) {
    setQuery(h.name)
    setOpen(false)
    onSelect(h.name)
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
          KLINIK {index + 1}
          {selected && (
            <button onClick={handleClear}
              className="ml-auto font-mono text-[11.5px] text-ink/50 hover:text-hazard tracking-widest">
              ✕ ENTFERNEN
            </button>
          )}
        </div>
        <div className="relative">
          <input
            className="input-brutalist text-xs"
            placeholder={selected ? value : 'Klinikname eingeben…'}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onClear() }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            autoComplete="off"
          />
          {open && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white max-h-48 overflow-y-auto">
              {results.map((h, i) => (
                <button key={i} onMouseDown={e => { e.preventDefault(); handleSelect(h) }}
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
      </div>

      {selected && (
        <div className="px-3 pb-3">
          <div className="mt-1.5 px-2 py-1 border font-mono text-[11.5px] uppercase tracking-widest text-ink/80"
               style={{ borderColor: color, color }}>
            ✓ {value}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Abteilungs-Suchbox (neu) ─── */
function AbteilungSearchBox({ index, value, onSelect, onClear }) {
  const [query, setQuery] = useState(value?.hospital ?? '')
  const [open, setOpen]   = useState(false)
  const ref               = useRef(null)
  const ratings           = useRatingsStore((s) => s.ratings)
  const ratedSet          = new Set(ratings.map(r => r.hospital))
  useClickOutside(ref, () => setOpen(false))

  const results = query.trim().length >= 2
    ? searchHospitals(query, ratedSet, {}, 6)
    : []

  const color = COLORS[index]
  const selectedHospital  = value?.hospital || ''
  const selectedSpecialty = value?.specialty || ''

  const availableSpecialties = selectedHospital
    ? [...new Set(ratings.filter(r => matchHospitalName(r.hospital, selectedHospital)).map(r => r.specialty))].filter(Boolean).sort()
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
          ABTEILUNG {index + 1}
          {(selectedHospital || selectedSpecialty) && (
            <button onClick={handleClear}
              className="ml-auto font-mono text-[11.5px] text-ink/50 hover:text-hazard tracking-widest">
              ✕ ENTFERNEN
            </button>
          )}
        </div>
        <div className="relative">
          <input
            className="input-brutalist text-xs"
            placeholder={selectedHospital || 'Klinikname eingeben…'}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onClear() }}
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
      </div>

      {selectedHospital && (
        <div className="px-3 pb-1">
          <div className="mt-1.5 px-2 py-1 border font-mono text-[11.5px] uppercase tracking-widest text-ink/80"
               style={{ borderColor: color, color }}>
            ✓ {selectedHospital}
          </div>
        </div>
      )}

      {selectedHospital && availableSpecialties.length > 0 && (
        <div className="px-3 pb-3">
          <div className="mono-label mb-1 mt-1">FACHRICHTUNG</div>
          <select
            className="input-brutalist text-xs w-full"
            value={selectedSpecialty}
            onChange={e => onSelect({ ...value, specialty: e.target.value })}
          >
            <option value="">Fachrichtung wählen…</option>
            {availableSpecialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {selectedHospital && availableSpecialties.length === 0 && (
        <div className="px-3 pb-3">
          <div className="mono-label-red text-xs mt-1">[ KEINE BEWERTETEN FACHRICHTUNGEN ]</div>
        </div>
      )}
    </div>
  )
}

/* ─── Hauptseite ─── */
export default function VergleichPage() {
  const [searchParams] = useSearchParams()
  const initialQ        = searchParams.get('q') ?? ''
  const initialMode     = searchParams.get('mode') ?? 'klinik'
  const initialHospital = searchParams.get('hospital') ?? ''
  const initialSpecialty = searchParams.get('specialty') ?? ''

  const [mode, setMode] = useState(initialMode === 'abteilung' ? 'abteilung' : 'klinik')

  const [klinikSlots, setKlinikSlots] = useState([initialQ, '', ''])
  const [abteilungSlots, setAbteilungSlots] = useState([
    initialHospital ? { hospital: initialHospital, specialty: initialSpecialty } : { hospital: '', specialty: '' },
    { hospital: '', specialty: '' },
    { hospital: '', specialty: '' },
  ])

  function handleKlinikSelect(index, name) {
    setKlinikSlots(prev => { const next = [...prev]; next[index] = name; return next })
  }
  function handleKlinikClear(index) {
    setKlinikSlots(prev => { const next = [...prev]; next[index] = ''; return next })
  }

  function handleAbteilungSelect(index, pair) {
    setAbteilungSlots(prev => { const next = [...prev]; next[index] = pair; return next })
  }
  function handleAbteilungClear(index) {
    setAbteilungSlots(prev => { const next = [...prev]; next[index] = { hospital: '', specialty: '' }; return next })
  }

  const activeKlinikSelected = klinikSlots.filter(Boolean)
  const activeAbteilungSelected = abteilungSlots.filter(p => p.hospital && p.specialty)

  const isKlinik = mode === 'klinik'

  return (
    <div>
      <Helmet>
        <title>{isKlinik ? 'Klinik-Vergleich' : 'Abteilungs-Vergleich'} | Bis zu 3 vergleichen | assistenz-ranking.de</title>
        <meta name="description" content={isKlinik
          ? 'Vergleiche bis zu 3 Kliniken direkt nebeneinander — Weiterbildungsqualität, Arbeitsklima, Gehalt, Überstunden und mehr. Basierend auf anonymen Assistenzarzt-Bewertungen.'
          : 'Vergleiche bis zu 3 Abteilungen (Klinik + Fachrichtung) direkt nebeneinander — Weiterbildungsqualität, Arbeitsklima, Gehalt, Überstunden und mehr. Basierend auf anonymen Assistenzarzt-Bewertungen.'
        } />
        <link rel="canonical" href="https://assistenz-ranking.de/vergleich" />
        <meta property="og:url" content="https://assistenz-ranking.de/vergleich" />
        <meta property="og:title" content={isKlinik ? 'Klinik-Vergleich für Assistenzärzte | DACH' : 'Abteilungs-Vergleich für Assistenzärzte | DACH'} />
        <meta property="og:description" content={isKlinik
          ? 'Bis zu 3 Kliniken direkt vergleichen — Weiterbildung, Klima, Gehalt aus anonymen Bewertungen.'
          : 'Bis zu 3 Abteilungen direkt vergleichen — Weiterbildung, Klima, Gehalt aus anonymen Bewertungen.'
        } />
      </Helmet>

      {/* Modus-Toggle — Apple-inspirierter Sliding-Block Toggle */}
      <div className="border-b border-ink px-6 py-4">
        <div className="mx-auto max-w-md relative border border-ink h-10 flex items-center">
          {/* Gleitender Active-Indikator */}
          <div
            className="absolute top-[2px] bottom-[2px] bg-ink transition-all duration-300 ease-out"
            style={{
              width: 'calc(50% - 2px)',
              left: isKlinik ? '2px' : 'calc(50% + 1px)',
            }}
          />
          <button
            onClick={() => setMode('klinik')}
            className={`relative z-10 flex-1 h-full font-mono text-[11px] uppercase tracking-widest transition-colors duration-200 ${
              isKlinik ? 'text-canvas' : 'text-ink/40 hover:text-ink/70'
            }`}
          >
            Klinik
          </button>
          <button
            onClick={() => setMode('abteilung')}
            className={`relative z-10 flex-1 h-full font-mono text-[11px] uppercase tracking-widest transition-colors duration-200 ${
              !isKlinik ? 'text-canvas' : 'text-ink/40 hover:text-ink/70'
            }`}
          >
            Abteilung
          </button>
        </div>
      </div>

      <div className="register-strip border-b border-ink">
        <span>/// {isKlinik ? 'KLINIK-VERGLEICH' : 'ABTEILUNGS-VERGLEICH'}</span>
        <span className="text-canvas/60">BIS ZU 3 {isKlinik ? 'KLINIKEN' : 'ABTEILUNGEN'} VERGLEICHEN</span>
      </div>

      {/* Suchboxen */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {isKlinik
          ? SLOTS.map(i => (
              <KlinikSearchBox
                key={i}
                index={i}
                value={klinikSlots[i] || null}
                onSelect={name => handleKlinikSelect(i, name)}
                onClear={() => handleKlinikClear(i)}
              />
            ))
          : SLOTS.map(i => (
              <AbteilungSearchBox
                key={i}
                index={i}
                value={abteilungSlots[i]}
                onSelect={pair => handleAbteilungSelect(i, pair)}
                onClear={() => handleAbteilungClear(i)}
              />
            ))
        }
      </div>

      {/* Radar-Chart */}
      <div className="border-t border-ink">
        <RadarComparison
          mode={mode}
          selected={activeKlinikSelected}
          selectedPairs={activeAbteilungSelected}
        />
      </div>
    </div>
  )
}
