import { useRatings } from '../../hooks/useRatings.js'

function StatCell({ label, value, valueClass = '' }) {
  return (
    <div className="bg-canvas px-3 py-3 min-h-0">
      <div className={`font-mono font-bold tabular-nums ${valueClass}`}>
        {value}
      </div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  )
}

export default function StatsBar() {
  const { stats } = useRatings()

  return (
    <div className="ink-grid border-b border-ink grid-cols-3 sm:grid-cols-6 auto-rows-min mx-[-0.75rem] sm:mx-[-1rem] md:mx-[-1.5rem] lg:mx-[-2rem]">
      <StatCell label="BEWERTUNGEN" value={stats.total}            valueClass="text-hazard" />
      <StatCell label="⌀ SCORE"     value={stats.avgScore.toFixed(1)} />
      <StatCell label="TOP-KLINIK"  value={stats.topHospital} valueClass="text-[11px] leading-snug break-words pt-0.5" />
      <StatCell label="DEUTSCHLAND" value={stats.countDE} />
      <StatCell label="ÖSTERREICH"  value={stats.countAT} />
      <StatCell label="SCHWEIZ"      value={stats.countCH} />
    </div>
  )
}
