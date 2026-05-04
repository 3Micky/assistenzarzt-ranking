import { scoreColor, scoreLabel } from '../../utils/calculations.js'

/**
 * Zeigt einen farbigen Score-Badge
 * @param {{ score: number, size?: 'sm'|'md'|'lg', showLabel?: boolean }} props
 */
export default function ScoreBadge({ score, size = 'md', showLabel = false }) {
  const color = scoreColor(score)
  const cls = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tabular-nums ${cls}`}
      style={{ color, backgroundColor: color + '20', border: `1px solid ${color}40` }}
    >
      {score.toFixed(1)}
      {showLabel && <span className="font-normal opacity-80">{scoreLabel(score)}</span>}
    </span>
  )
}
