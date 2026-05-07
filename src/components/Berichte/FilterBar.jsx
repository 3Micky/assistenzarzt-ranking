import { REGIONS, SPECIALTIES } from '../../data/criteria.js'

/**
 * @param {{ filters: object, onChange: (k:string, v:string)=>void }} props
 */
export default function FilterBar({ filters, onChange }) {
  const regionOptions = filters.country && REGIONS[filters.country]
    ? REGIONS[filters.country]
    : [...REGIONS.DE, ...REGIONS.AT, ...REGIONS.CH]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-ink/10 border-b border-ink">

      {/* Land */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">LAND</div>
        <select className="select-brutalist text-[11px] py-1" value={filters.country}
          onChange={e => onChange('country', e.target.value)}>
          <option value="">ALLE</option>
          <option value="DE">Deutschland</option>
          <option value="AT">Österreich</option>
          <option value="CH">Schweiz</option>
        </select>
      </div>

      {/* Bundesland */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">BUNDESLAND / KANTON</div>
        <select className="select-brutalist text-[11px] py-1" value={filters.region}
          onChange={e => onChange('region', e.target.value)}>
          <option value="">ALLE</option>
          {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Stadt */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">STADT</div>
        <input className="input-brutalist text-[11px] py-1" placeholder="Name…"
          value={filters.city} onChange={e => onChange('city', e.target.value)} />
      </div>

      {/* Klinik */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">KLINIK</div>
        <input className="input-brutalist text-[11px] py-1" placeholder="Name…"
          value={filters.hospital} onChange={e => onChange('hospital', e.target.value)} />
      </div>

      {/* Fachrichtung */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">FACHRICHTUNG</div>
        <select className="select-brutalist text-[11px] py-1" value={filters.specialty}
          onChange={e => onChange('specialty', e.target.value)}>
          <option value="">ALLE</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Min. Score */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">MIN. SCORE</div>
        <select className="select-brutalist text-[11px] py-1" value={filters.scoreMin ?? '0'}
          onChange={e => onChange('scoreMin', e.target.value)}>
          <option value="0">ALLE</option>
          <option value="5">≥ 5.0</option>
          <option value="6">≥ 6.0</option>
          <option value="6.5">≥ 6.5</option>
          <option value="7">≥ 7.0</option>
          <option value="7.5">≥ 7.5</option>
          <option value="8">≥ 8.0</option>
          <option value="8.5">≥ 8.5</option>
          <option value="9">≥ 9.0</option>
        </select>
      </div>

    </div>
  )
}
