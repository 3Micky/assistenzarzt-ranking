import { REGIONS, SPECIALTIES } from '../../data/criteria.js'

/**
 * @param {{ filters: object, onChange: (k:string, v:string)=>void }} props
 */
export default function FilterBar({ filters, onChange }) {
  const regionOptions = filters.country && REGIONS[filters.country]
    ? REGIONS[filters.country]
    : [...REGIONS.DE, ...REGIONS.AT, ...REGIONS.CH]

  return (
    <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(6, auto) 1fr' }}>
      {/* Land */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">LAND</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.country}
          onChange={e => onChange('country', e.target.value)}
        >
          <option value="">ALLE</option>
          <option value="DE">🇩🇪 DE</option>
          <option value="AT">🇦🇹 AT</option>
          <option value="CH">🇨🇭 CH</option>
        </select>
      </div>

      {/* Bundesland */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">BUNDESLAND / KANTON</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.region}
          onChange={e => onChange('region', e.target.value)}
        >
          <option value="">ALLE</option>
          {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Fachrichtung */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">FACHRICHTUNG</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.specialty}
          onChange={e => onChange('specialty', e.target.value)}
        >
          <option value="">ALLE</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Dienstsystem */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">DIENSTSYSTEM</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.dienstsystem}
          onChange={e => onChange('dienstsystem', e.target.value)}
        >
          <option value="">ALLE</option>
          <option value="12h">12H</option>
          <option value="24h">24H</option>
        </select>
      </div>

      {/* Klinik */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">KLINIK</div>
        <input
          className="input-brutalist text-[11px] py-1"
          placeholder="Name…"
          value={filters.hospital}
          onChange={e => onChange('hospital', e.target.value)}
        />
      </div>

      {/* Stadt */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">STADT</div>
        <input
          className="input-brutalist text-[11px] py-1"
          placeholder="Name…"
          value={filters.city}
          onChange={e => onChange('city', e.target.value)}
        />
      </div>

      {/* Filler */}
      <div className="bg-canvas" />
    </div>
  )
}
