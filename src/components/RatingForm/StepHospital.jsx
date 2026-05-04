import { useState } from 'react'
import { REGIONS, SPECIALTIES, COUNTRY_LABELS, COUNTRY_FLAGS } from '../../data/criteria.js'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { DE_HOSPITALS } from '../../data/hospitals.js'

const COUNTRY_ALIASES = {
  deutschland: 'DE', de: 'DE', österreich: 'AT', oesterreich: 'AT',
  at: 'AT', schweiz: 'CH', ch: 'CH',
}

export default function StepHospital({ data, onChange, onNext }) {
  const [searchMode, setSearchMode] = useState('schnell')
  const [query, setQuery]           = useState(data.hospital || '')
  const [dropdownOpen, setOpen]     = useState(false)
  const ratings = useRatingsStore((s) => s.ratings)

  function buildResults(q) {
    if (!q.trim() || q.trim().length < 2) return []
    const lower = q.toLowerCase()
    const alias = COUNTRY_ALIASES[lower]

    const ratedHospitals = new Set(ratings.map(r => r.hospital))
    const cities         = [...new Set(ratings.map(r => r.city))]
    const regions        = [...new Set(ratings.map(r => r.region).filter(Boolean))]
    const out = []

    if (alias) {
      out.push({ type: 'bundesland', label: COUNTRY_LABELS[alias], country: alias })
    }

    // Rated hospitals first
    ;[...ratedHospitals].filter(h => h.toLowerCase().includes(lower)).slice(0, 4).forEach(h => {
      const r = ratings.find(r => r.hospital === h)
      out.push({ type: 'klinik', label: h, country: r.country, city: r.city, region: r.region, hasRatings: true })
    })

    // Master list (unrated)
    const ratedKlinikCount = out.filter(o => o.type === 'klinik').length
    if (ratedKlinikCount < 5) {
      DE_HOSPITALS
        .filter(h => h.name.toLowerCase().includes(lower) && !ratedHospitals.has(h.name))
        .slice(0, 5 - ratedKlinikCount)
        .forEach(h => {
          out.push({ type: 'klinik', label: h.name, city: h.city, country: 'DE', hasRatings: false })
        })
    }

    cities.filter(c => c.toLowerCase().includes(lower)).slice(0, 3).forEach(c => {
      const r = ratings.find(r => r.city === c)
      out.push({ type: 'stadt', label: c, country: r.country })
    })
    regions.filter(rg => rg.toLowerCase().includes(lower)).slice(0, 2).forEach(rg => {
      const r = ratings.find(r => r.region === rg)
      out.push({ type: 'bundesland', label: rg, country: r.country })
    })
    return out.slice(0, 10)
  }

  const results = buildResults(query)

  function selectResult(r) {
    setQuery(r.label)
    setOpen(false)
    if (r.type === 'klinik') {
      onChange({ ...data, hospital: r.label, city: r.city || data.city, country: r.country || 'DE', region: r.region || data.region })
    } else {
      onChange({ ...data, hospital: r.label, country: r.country })
    }
  }

  const canProceed = data.hospital && data.specialty && data.country

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 1 VON 4 /// KLINIK WÄHLEN
      </div>

      {/* Mode toggle */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => setSearchMode('schnell')} className={searchMode === 'schnell' ? 'tab-active' : 'tab-inactive'}>SCHNELLSUCHE</button>
        <button onClick={() => setSearchMode('genau')}   className={searchMode === 'genau'   ? 'tab-active' : 'tab-inactive'}>GENAUE SUCHE</button>
      </div>

      <div className="p-5">
        {searchMode === 'schnell' ? (
          <div className="relative mb-4">
            <input
              className="input-brutalist"
              placeholder="Klinik, Stadt, Bundesland, Deutschland…"
              value={query}
              onChange={e => { setQuery(e.target.value); onChange({ ...data, hospital: e.target.value }); setOpen(true) }}
              onFocus={() => query && setOpen(true)}
              autoComplete="off"
            />
            {dropdownOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white">
                {results.map((r, i) => (
                  <button key={i} onClick={() => selectResult(r)}
                    className="w-full flex items-center gap-3 px-3 py-2 border-b border-ink/10 last:border-b-0 hover:bg-canvas-alt text-left">
                    <span className={`font-mono text-[8px] tracking-widest uppercase min-w-[56px] ${r.type === 'klinik' ? 'text-hazard' : 'text-ink/40'}`}>
                      {r.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-ink flex-1">{r.label}</span>
                    {r.type === 'klinik' && r.city && (
                      <span className="font-mono text-[8px] text-ink/40">{r.city}</span>
                    )}
                    <span className="font-mono text-[8px] text-ink/40">{COUNTRY_FLAGS[r.country]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Land */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">01 /// LAND</div>
              <select className="select-brutalist" value={data.country}
                onChange={e => onChange({ ...data, country: e.target.value, region: '', city: '' })}>
                <option value="">— Wählen —</option>
                <option value="DE">🇩🇪 Deutschland</option>
                <option value="AT">🇦🇹 Österreich</option>
                <option value="CH">🇨🇭 Schweiz</option>
              </select>
            </div>
            {/* Bundesland */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">02 /// BUNDESLAND / KANTON</div>
              <select className="select-brutalist" value={data.region}
                onChange={e => onChange({ ...data, region: e.target.value })}>
                <option value="">— Wählen —</option>
                {(REGIONS[data.country] || []).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {/* Stadt */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">03 /// STADT</div>
              <input className="input-brutalist" value={data.city}
                onChange={e => onChange({ ...data, city: e.target.value })}
                placeholder="z.B. Berlin" />
            </div>
            {/* Klinik */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">04 /// KLINIK</div>
              <input className="input-brutalist" value={data.hospital}
                onChange={e => onChange({ ...data, hospital: e.target.value })}
                placeholder="Klinikname eingeben…" />
            </div>
          </div>
        )}

        {/* Specialty only (Jahr removed, Stadt removed from Schnellsuche) */}
        <div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr' }}>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">FACHRICHTUNG</div>
            <select className="select-brutalist" value={data.specialty}
              onChange={e => onChange({ ...data, specialty: e.target.value })}>
              <option value="">— Wählen —</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
            WEITER &gt;&gt;&gt;
          </button>
        </div>
      </div>
    </div>
  )
}
