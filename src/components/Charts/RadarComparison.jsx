import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'
import { averageScoreForRatings, scoreColor } from '../../utils/calculations.js'
import { matchHospitalName } from '../../utils/hospitalSearch.js'

const COLORS = ['#0EA5E9', '#E61919', '#22C55E']

/**
 * @param {{ slots: {hospital:string, specialty:string}[] }} props
 * specialty '' = aggregate all ratings for that hospital
 */
export default function RadarComparison({ slots = [] }) {
  const { radarChartDataUnified, ratings } = useRatings()

  const activeSlots = slots.filter(s => s.hospital)
  const labels = activeSlots.map(s => s.specialty ? `${s.hospital} · ${s.specialty}` : s.hospital)
  const data = radarChartDataUnified(activeSlots)

  if (activeSlots.length === 0 || data.length === 0) {
    return (
      <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60">
        [ MINDESTENS EINE KLINIK AUSWÄHLEN UM VERGLEICH ZU STARTEN ]
      </div>
    )
  }

  const overallAvgs = activeSlots.map((slot, i) => {
    const relevant = ratings.filter(r =>
      matchHospitalName(r.hospital, slot.hospital) &&
      (slot.specialty ? r.specialty === slot.specialty : true)
    )
    const avg = averageScoreForRatings(relevant) ?? 0
    return { label: labels[i], avg, color: COLORS[i % COLORS.length] }
  })

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// KRITERIENPROFIL – SPIDER-VERGLEICH</div>

      <div className="flex flex-wrap gap-3 mb-5">
        {overallAvgs.map((item, i) => (
          <div key={i} className="border px-3 py-2 flex items-center gap-2" style={{ borderColor: item.color }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="font-mono text-[11.5px] uppercase tracking-widest text-ink truncate max-w-[200px]">
              {item.label}
            </span>
            <span className="font-mono text-sm font-bold" style={{ color: scoreColor(item.avg) }}>
              {item.avg.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
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
          {labels.map((label, i) => (
            <Radar
              key={label}
              name={label}
              dataKey={label}
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
