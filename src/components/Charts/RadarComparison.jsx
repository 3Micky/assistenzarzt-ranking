import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'

const COLORS = ['#0EA5E9', '#E61919', '#22C55E']

export default function RadarComparison({ selected = [] }) {
  const { radarChartData } = useRatings()
  const data = radarChartData(selected)

  if (selected.length === 0) {
    return (
      <div className="p-12 text-center font-mono text-[10px] uppercase tracking-widest text-ink/40">
        [ MINDESTENS EINE KLINIK AUSWÄHLEN UM VERGLEICH ZU STARTEN ]
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// KRITERIENPROFIL – SPIDER-VERGLEICH</div>
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={data} margin={{ top: 30, right: 60, bottom: 30, left: 60 }}>
          <PolarGrid stroke="#050505" strokeOpacity={0.12} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#050505', fontWeight: 700 }}
          />
          <PolarRadiusAxis
            domain={[0, 10]}
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 8, fill: '#050505' }}
            tickCount={6}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              background: '#F4F4F0',
              border: '1px solid #050505',
              borderRadius: 0,
            }}
            formatter={(value, name) => [value.toFixed(1) + ' / 10', name]}
          />
          {selected.map((name, i) => (
            <Radar
              key={name}
              name={name}
              dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.20}
              strokeWidth={2.5}
              dot={{ r: 3, fill: COLORS[i % COLORS.length] }}
            />
          ))}
          <Legend
            wrapperStyle={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              textTransform: 'uppercase',
              paddingTop: 16,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
