import ScoreBadge from '../UI/ScoreBadge.jsx'
import CountryFlag from '../UI/CountryFlag.jsx'

/**
 * Schwebendes Tooltip über einer Stadt
 * @param {{ city, country, score, count, x, y }} props
 */
export default function MapTooltip({ city, country, score, count, x, y }) {
  if (!city) return null

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: x + 12, top: y - 40 }}
    >
      <div className="card-sm shadow-xl border-slate-700 min-w-[160px]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-semibold text-slate-100 text-sm">{city}</span>
          <CountryFlag country={country} />
        </div>
        <div className="flex items-center justify-between">
          <ScoreBadge score={score} size="sm" />
          <span className="text-xs text-slate-500">{count} Bewertung{count !== 1 ? 'en' : ''}</span>
        </div>
      </div>
    </div>
  )
}
