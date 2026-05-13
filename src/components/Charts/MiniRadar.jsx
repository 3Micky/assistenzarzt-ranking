import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'

const COLOR = '#0EA5E9'

export default function MiniRadar({ hospitalName }) {
  const { radarChartData } = useRatings()
  const data = radarChartData([hospitalName])

  if (!hospitalName || data.length === 0) {
    return (
      <div className="p-8 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60">
        [ KEINE DATEN ]
      </div>
    )
  }

  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="#050505" strokeOpacity={0.12} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#050505', fontWeight: 700 }}
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
            formatter={(value) => [value.toFixed(1) + ' / 10', hospitalName]}
          />
          <Radar
            name={hospitalName}
            dataKey={hospitalName}
            stroke={COLOR}
            fill={COLOR}
            fillOpacity={0.20}
            strokeWidth={2}
            dot={{ r: 2, fill: COLOR }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
