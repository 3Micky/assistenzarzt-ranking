import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useRatingsStore } from '../store/ratingsStore.js'
import { searchHospitals } from '../utils/hospitalSearch.js'
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
                  className="w-full flex items-center gap-2 px-3 py-2 border-b border-ink/10 last:border-b-0 hover:bg-canvas-alt text-left">
                  <span className="text-xs font-bold text-ink flex-1">{h.name}</span>
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

export default function VergleichPage() {
  const [selected, setSelected] = useState(['', '', ''])

  function handleSelect(index, name) {
    setSelected(prev => { const next = [...prev]; next[index] = name; return next })
  }

  function handleClear(index) {
    setSelected(prev => { const next = [...prev]; next[index] = ''; return next })
  }

  const activeSelected = selected.filter(Boolean)

  return (
    <div>
      <Helmet>
        <title>Klinik-Vergleich | Bis zu 3 Kliniken vergleichen | assistenz-ranking.de</title>
        <meta name="description" content="Vergleiche bis zu 3 Kliniken direkt nebeneinander — Weiterbildungsqualität, Arbeitsklima, Gehalt, Überstunden und mehr. Basierend auf anonymen Assistenzarzt-Bewertungen." />
        <link rel="canonical" href="https://assistenz-ranking.de/vergleich" />
        <meta property="og:url" content="https://assistenz-ranking.de/vergleich" />
        <meta property="og:title" content="Klinik-Vergleich für Assistenzärzte | DACH" />
        <meta property="og:description" content="Bis zu 3 Kliniken direkt vergleichen — Weiterbildung, Klima, Gehalt aus anonymen Bewertungen." />
      </Helmet>
      <div className="register-strip border-b border-ink">
        <span>/// KLINIK-VERGLEICH</span>
        <span className="text-canvas/60">BIS ZU 3 KLINIKEN VERGLEICHEN</span>
      </div>

      {/* 3 Suchboxen */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {SLOTS.map(i => (
          <KlinikSearchBox
            key={i}
            index={i}
            value={selected[i] || null}
            onSelect={name => handleSelect(i, name)}
            onClear={() => handleClear(i)}
          />
        ))}
      </div>

      {/* Radar Chart */}
      <div className="border-t border-ink">
        <RadarComparison selected={activeSelected} />
      </div>
    </div>
  )
}
