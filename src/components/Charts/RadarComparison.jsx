import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'

const COLORS = ['#E61919', '#050505', '#F59E0B']

export default function RadarComparison({ selected = [] }) {
  const { radarChartData } = useRatings()
  const data = radarChartData(selected)

  if (selected.length === 0) {
    return (
      <div className="p-8 font-mono text-[10px] uppercase tracking-widest text-ink/40">
        [ KLINIK AUSWÄHLEN UM VERGLEICH ZU STARTEN ]
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// KRITERIENPROFIL</div>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="#050505" strokeOpacity={0.15} />
          <PolarAngleAxis dataKey="subject"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#050505', fontWeight: 700 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          {selected.map((name, i) => (
            <Radar key={name} name={name} dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.12}
              strokeWidth={2} />
          ))}
          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
