import { overallScore, scoreColor } from '../../utils/calculations.js'
import { COUNTRY_FLAGS } from '../../data/criteria.js'

const PAGE_SIZE = 20

/**
 * @param {{ ratings: object[] }} props
 */
export default function BerichteTabelle({ ratings }) {
  if (ratings.length === 0) {
    return (
      <div className="px-6 py-12 text-center font-mono text-[10px] tracking-widest uppercase text-ink/40">
        /// KEINE ERGEBNISSE GEFUNDEN
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ink">
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-4 py-2 text-left font-normal border-r border-canvas/10">KLINIK</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">LAND</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-left font-normal border-r border-canvas/10 whitespace-nowrap">FACH</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">ZEITEN</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">DIENSTE</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">SYST.</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">ÜB.</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">WLB</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal whitespace-nowrap">TEAM</th>
            </tr>
          </thead>
          <tbody>
            {ratings.slice(0, PAGE_SIZE).map((r, i) => {
              const rowBg = i % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
              const ueb = r.criteria.ueberstundenAufschreiben
              return (
                <tr key={r.id} className={`${rowBg} border-b border-ink/10`}>
                  <td className="px-4 py-2 text-xs font-bold text-ink border-r border-ink/10">{r.hospital}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs border-r border-ink/10">{COUNTRY_FLAGS[r.country]}</td>
                  <td className="px-3 py-2 font-mono text-[9px] uppercase text-ink/60 border-r border-ink/10">{r.specialty}</td>
                  <td className="px-3 py-2 text-center font-mono text-[10px] border-r border-ink/10">{r.criteria.arbeitszeitenVon}–{r.criteria.arbeitszeitenBis}</td>
                  <td className="px-3 py-2 text-center font-mono text-[10px] font-bold border-r border-ink/10">{r.criteria.diensteProMonat}/mo</td>
                  <td className="px-3 py-2 text-center font-mono text-[9px] border-r border-ink/10 uppercase">{r.criteria.dienstsystem ?? '—'}</td>
                  <td className={`px-3 py-2 text-center text-xs font-bold border-r border-ink/10 ${ueb === true ? 'text-score-high' : ueb === false ? 'text-score-low' : 'text-ink/30'}`}>
                    {ueb === true ? '✓' : ueb === false ? '✗' : '—'}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs font-bold border-r border-ink/10"
                      style={{ color: scoreColor(r.criteria.workLifeBalance ?? 5) }}>
                    {r.criteria.workLifeBalance ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs font-bold"
                      style={{ color: scoreColor(r.criteria.teamAtmosphaere ?? 5) }}>
                    {r.criteria.teamAtmosphaere ?? '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-ink px-4 py-2 flex items-center justify-between">
        <span className="mono-label">{ratings.length} BERICHTE GEFUNDEN</span>
        {ratings.length > PAGE_SIZE && (
          <span className="mono-label text-hazard">(ZEIGE ERSTE {PAGE_SIZE})</span>
        )}
      </div>
    </div>
  )
}
