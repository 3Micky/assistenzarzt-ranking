import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { overallScore, scoreColor } from '../../utils/calculations.js'
import { slugify } from '../../utils/slugify.js'

const COUNTRY_NAMES = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }
const PAGE_SIZE = 50

const COLUMNS = [
  { key: 'hospital',  label: 'KLINIK',      center: false, sortFn: (a, b) => a.hospital.localeCompare(b.hospital, 'de') },
  { key: 'specialty', label: 'FACHRICHTUNG', center: false, sortFn: (a, b) => (a.specialty ?? '').localeCompare(b.specialty ?? '', 'de') },
  { key: 'city',      label: 'STADT',        center: false, sortFn: (a, b) => (a.city ?? '').localeCompare(b.city ?? '', 'de') },
  { key: 'region',    label: 'BUNDESLAND',   center: false, sortFn: (a, b) => (a.region ?? '').localeCompare(b.region ?? '', 'de') },
  { key: 'country',   label: 'LAND',         center: false, sortFn: (a, b) => (a.country ?? '').localeCompare(b.country ?? '', 'de') },
  { key: 'score',     label: 'SCORE',        center: true,  sortFn: (a, b) => overallScore(a.criteria) - overallScore(b.criteria) },
]

function SortArrows({ col, sortCol, sortDir }) {
  const active = sortCol === col
  return (
    <span className="inline-flex flex-col ml-1 gap-0 leading-none" style={{ verticalAlign: 'middle' }}>
      <span className={`block leading-none text-[7px] ${active && sortDir === 'asc'  ? 'text-hazard' : 'text-canvas/50'}`}>▲</span>
      <span className={`block leading-none text-[7px] ${active && sortDir === 'desc' ? 'text-hazard' : 'text-canvas/50'}`}>▼</span>
    </span>
  )
}

/**
 * @param {{ ratings: object[] }} props
 */
export default function BerichteTabelle({ ratings }) {
  const navigate = useNavigate()
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sorted = sortCol
    ? [...ratings].sort((a, b) => {
        const col = COLUMNS.find(c => c.key === sortCol)
        const result = col.sortFn(a, b)
        return sortDir === 'asc' ? result : -result
      })
    : ratings

  if (ratings.length === 0) {
    return (
      <div className="px-6 py-12 text-center font-mono text-[11.5px] tracking-widest uppercase text-ink/60">
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
              {COLUMNS.map(({ key, label, center }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`font-mono text-[11.5px] tracking-widest uppercase text-canvas/90 px-4 py-2 font-normal border-r border-canvas/10 whitespace-nowrap cursor-pointer select-none hover:bg-white/5 transition-colors ${center ? 'text-center' : 'text-left'}`}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {label}
                    <SortArrows col={key} sortCol={sortCol} sortDir={sortDir} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, PAGE_SIZE).map((r, i) => {
              const rowBg = i % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
              const score = overallScore(r.criteria)
              return (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/berichte/${r.id}`)}
                  className={`${rowBg} border-b border-ink/10 cursor-pointer transition-colors hover:bg-[#F47474]`}
                >
                  <td className="px-4 py-2.5 text-xs font-bold text-ink border-r border-ink/10">
                    <Link
                      to={`/klinik/${slugify(r.hospital)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-hazard hover:underline transition-colors"
                    >
                      {r.hospital}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11.5px] uppercase text-ink/80 border-r border-ink/10">{r.specialty}</td>
                  <td className="px-3 py-2.5 font-mono text-[11.5px] text-ink/90 border-r border-ink/10">{r.city ?? '—'}</td>
                  <td className="px-3 py-2.5 font-mono text-[11.5px] text-ink/90 border-r border-ink/10">{r.region ?? '—'}</td>
                  <td className="px-3 py-2.5 font-mono text-[11.5px] uppercase tracking-wide text-ink/90 border-r border-ink/10">{COUNTRY_NAMES[r.country] ?? r.country}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-sm font-bold" style={{ color: scoreColor(score) }}>
                    {score}
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
