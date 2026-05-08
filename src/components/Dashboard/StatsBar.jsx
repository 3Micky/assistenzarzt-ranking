import { useRatings } from '../../hooks/useRatings.js'

function StatCell({ label, value, valueClass = '' }) {
  return (
    <div className="bg-canvas px-3 py-3">
      <div className={`font-mono text-xl font-bold leading-none tabular-nums ${valueClass}`}>
        {value}
      </div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  )
}

export default function StatsBar() {
  const { stats } = useRatings()
  const top = stats.topHospital.length > 20 ? stats.topHospital.slice(0, 18) + '…' : stats.topHospital

  return (
    <div className="ink-grid border-b border-ink grid-cols-3 sm:grid-cols-6">
      <StatCell label="BEWERTUNGEN" value={stats.total}            valueClass="text-hazard" />
      <StatCell label="⌀ SCORE"     value={stats.avgScore.toFixed(1)} />
      <StatCell label="TOP-KLINIK"  value={top} valueClass="text-xs leading-tight pt-1" />
      <StatCell label="🇩🇪 DEUTSCHLAND" value={stats.countDE} />
      <StatCell label="🇦🇹 ÖSTERREICH"  value={stats.countAT} />
      <StatCell label="🇨🇭 SCHWEIZ"      value={stats.countCH} />
    </div>
  )
}
