import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'
import { overallScore, scoreColor } from '../../utils/calculations.js'
import { matchHospitalName } from '../../utils/hospitalSearch.js'

const COLORS = ['#0EA5E9', '#E61919', '#22C55E']

/**
 * @param {{ selected?: string[], mode?: 'klinik'|'abteilung', selectedPairs?: {hospital:string, specialty:string}[] }} props
 */
export default function RadarComparison({ selected = [], mode = 'klinik', selectedPairs = [] }) {
  const { radarChartData, radarChartDataBySpecialty, ratings } = useRatings()

  const data = mode === 'klinik'
    ? radarChartData(selected)
    : radarChartDataBySpecialty(selectedPairs)

  const labels = mode === 'klinik'
    ? selected
    : selectedPairs.map((p) => `${p.hospital} · ${p.specialty}`)

  const isEmpty = labels.length === 0 || data.length === 0

  if (isEmpty) {
    return (
      <div className="p-12 text-center font-mono text-[11.5px] uppercase tracking-widest text-ink/60">
        [ MINDESTENS EINE {mode === 'klinik' ? 'KLINIK' : 'ABTEILUNG'} AUSWÄHLEN UM VERGLEICH ZU STARTEN ]
      </div>
    )
  }

  // Ø-Gesamt-Score pro Entity berechnen (mit fuzzy Hospital-Match)
  const overallAvgs = labels.map((label, i) => {
    if (mode === 'klinik') {
      const relevant = ratings.filter((r) => matchHospitalName(r.hospital, label))
      const avg = relevant.length === 0
        ? 0
        : Math.round((relevant.reduce((sum, r) => sum + overallScore(r.criteria), 0) / relevant.length) * 10) / 10
      return { label, avg, color: COLORS[i % COLORS.length] }
    } else {
      const pair = selectedPairs[i]
      const relevant = ratings.filter((r) => matchHospitalName(r.hospital, pair.hospital) && r.specialty === pair.specialty)
      const avg = relevant.length === 0
        ? 0
        : Math.round((relevant.reduce((sum, r) => sum + overallScore(r.criteria), 0) / relevant.length) * 10) / 10
      return { label, avg, color: COLORS[i % COLORS.length] }
    }
  })

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// KRITERIENPROFIL – SPIDER-VERGLEICH</div>

      {/* Gesamt-Score Badges */}
      <div className="flex flex-wrap gap-3 mb-5">
        {overallAvgs.map((item, i) => (
          <div
            key={i}
            className="border px-3 py-2 flex items-center gap-2"
            style={{ borderColor: item.color }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="font-mono text-[11.5px] uppercase tracking-widest text-ink truncate max-w-[200px]">
              {item.label}
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: scoreColor(item.avg) }}
            >
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
