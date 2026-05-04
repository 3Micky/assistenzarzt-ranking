import { useRatings } from '../../hooks/useRatings.js'
import { scoreColor } from '../../utils/calculations.js'

export default function HospitalSelector({ selected, onChange, max = 3 }) {
  const { ranked } = useRatings()

  function toggle(name) {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name))
    } else if (selected.length < max) {
      onChange([...selected, name])
    }
  }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        /// KLINIK AUSWÄHLEN (MAX {max})
      </div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {ranked.map((h) => {
          const active = selected.includes(h.hospital)
          return (
            <button key={h.hospital} onClick={() => toggle(h.hospital)}
              className={`bg-canvas p-3 text-left border-2 transition-colors ${active ? 'border-hazard bg-canvas-alt' : 'border-transparent hover:bg-canvas-alt'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-xs text-ink uppercase leading-tight">{h.hospital}</div>
                <div className="font-mono text-sm font-bold flex-shrink-0" style={{ color: scoreColor(h.score) }}>
                  {h.score}
                </div>
              </div>
              <div className="mono-label mt-1">{h.city} · {h.count} BEW.</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
