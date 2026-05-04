import { COUNTRY_FLAGS } from '../../data/criteria.js'

/**
 * @param {{ results: {type:'klinik'|'stadt'|'bundesland', label:string, country:string, count?:number}[], onSelect: (r)=>void }} props
 */
export default function SearchDropdown({ results, onSelect }) {
  if (results.length === 0) return null

  const typeLabel = { klinik: 'KLINIK', stadt: 'STADT', bundesland: 'BUNDESLAND' }

  return (
    <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white">
      {results.map((r, i) => (
        <button
          key={i}
          onClick={() => onSelect(r)}
          className="w-full flex items-center gap-3 px-4 py-2 border-b border-ink/10 last:border-b-0
                     hover:bg-canvas-alt transition-colors text-left"
        >
          <span className={`font-mono text-[8px] tracking-widest uppercase min-w-[64px] ${r.type === 'klinik' ? 'text-hazard' : 'text-ink/40'}`}>
            {typeLabel[r.type]}
          </span>
          <span className="text-xs font-bold text-ink flex-1">{r.label}</span>
          <span className="font-mono text-[8px] text-ink/40 flex-shrink-0 flex items-center gap-1">
            {r.type === 'klinik' && r.hasRatings === false && (
              <span className="text-ink/30">NOCH KEINE BEW.</span>
            )}
            {COUNTRY_FLAGS[r.country]} {r.count != null ? `${r.count} KLINIKEN` : r.country}
          </span>
        </button>
      ))}
    </div>
  )
}
