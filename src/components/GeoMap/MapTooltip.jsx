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
      style={{ left: x + 10, top: y - 36 }}
    >
      <div className="bg-canvas border border-ink px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="font-mono text-[11.5px] font-semibold uppercase tracking-wider text-ink">{city}</span>
          <CountryFlag country={country} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <ScoreBadge score={score} size="sm" />
          <span className="font-mono text-[11.5px] text-ink/60">{count} Bewertung{count !== 1 ? 'en' : ''}</span>
        </div>
      </div>
    </div>
  )
}
