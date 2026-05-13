import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'
import { scoreColor } from '../../utils/calculations.js'

function BrutalistTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ink text-canvas px-3 py-2 border border-canvas/20">
      <div className="font-mono text-[11.5px] tracking-widest uppercase text-canvas/70 mb-1">{d.city} · {d.country}</div>
      <div className="font-display text-sm uppercase">{d.hospital}</div>
      <div className="font-mono text-lg font-bold mt-1" style={{ color: scoreColor(d.score) }}>{d.score}</div>
      <div className="font-mono text-[11.5px] text-canvas/60">{d.count} BEWERTUNGEN</div>
    </div>
  )
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

export default function BarRanking() {
  const { ranked } = useRatings()
  const top = ranked.slice(0, 15)
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 640

  // On mobile the left margin + YAxis width must fit the screen
  // Mobile: 0 outer margin, short axis (110px), truncate labels
  const leftMargin  = isMobile ? 0   : 200
  const rightMargin = isMobile ? 10  : 60
  const axisWidth   = isMobile ? 110 : 195

  const truncate = (str, len) => str.length > len ? str.slice(0, len) + '…' : str

  if (top.length === 0) {
    return <div className="p-8 font-mono text-[11.5px] uppercase tracking-widest text-ink/60">[ KEINE DATEN ]</div>
  }

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// TOP-KLINIKEN NACH SCORE</div>
      <ResponsiveContainer width="100%" height={top.length * 36 + 40}>
        <BarChart data={top} layout="vertical" margin={{ left: leftMargin, right: rightMargin, top: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 10]}
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#050505', textTransform: 'uppercase' }}
            tickLine={false} axisLine={{ stroke: '#050505' }} />
          <YAxis type="category" dataKey="hospital" width={axisWidth}
            tick={{ fontFamily: 'Inter', fontSize: isMobile ? 9 : 10, fontWeight: 700, fill: '#050505' }}
            tickFormatter={v => isMobile ? truncate(v, 15) : v}
            tickLine={false} axisLine={false} />
          <Tooltip content={<BrutalistTooltip />} cursor={{ fill: 'rgba(5,5,5,0.05)' }} />
          <Bar dataKey="score" radius={0} barSize={16}>
            {top.map((entry) => (
              <Cell key={entry.hospital} fill={scoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
