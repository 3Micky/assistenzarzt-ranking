# Agent 06 – Charts: Bar-Ranking & Radar-Vergleich

## Ziel
Zwei interaktive Charts mit Recharts:
1. **BarRanking** — Top-Kliniken horizontal sortiert nach Gesamt-Score
2. **RadarComparison** — Spinnendiagramm zum Vergleich von bis zu 3 Kliniken

---

## src/components/Charts/BarRanking.jsx

```jsx
import { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'
import { scoreColor } from '../../utils/calculations.js'
import ScoreBadge from '../UI/ScoreBadge.jsx'
import CountryFlag from '../UI/CountryFlag.jsx'
import EmptyState from '../UI/EmptyState.jsx'
import { Link } from 'react-router-dom'

const COUNTRY_FILTER_OPTIONS = ['Alle', 'DE', 'AT', 'CH']
const PAGE_SIZE = 10

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="card-sm shadow-xl border-slate-700 min-w-[200px]">
      <div className="font-semibold text-slate-100 text-sm mb-1">{d.hospital}</div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <CountryFlag country={d.country} />
          <span>{d.city}</span>
        </div>
        <ScoreBadge score={d.score} size="sm" />
      </div>
      <div className="text-xs text-slate-500 mt-1">{d.count} Bewertung{d.count !== 1 ? 'en' : ''}</div>
    </div>
  )
}

export default function BarRanking() {
  const { hospitalRankings } = useRatings()
  const [countryFilter, setCountryFilter] = useState('Alle')
  const [page, setPage] = useState(0)

  const filtered = useMemo(
    () => countryFilter === 'Alle'
      ? hospitalRankings
      : hospitalRankings.filter((h) => h.country === countryFilter),
    [hospitalRankings, countryFilter]
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Kürzung langer Namen für Y-Achse
  const truncate = (name, len = 28) =>
    name.length > len ? name.slice(0, len) + '…' : name

  if (filtered.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon="🏆"
          title="Keine Kliniken gefunden"
          description="Noch keine Bewertungen für dieses Land vorhanden."
          action={<Link to="/bewerten" className="btn-primary">Jetzt bewerten</Link>}
        />
      </div>
    )
  }

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="section-title">🏆 Klinik-Ranking</div>
          <div className="section-subtitle">
            {filtered.length} Kliniken · sortiert nach Gesamt-Score
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1">
          {COUNTRY_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { setCountryFilter(opt); setPage(0) }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                countryFilter === opt
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {opt === 'Alle' ? 'Alle' : { DE: '🇩🇪 DE', AT: '🇦🇹 AT', CH: '🇨🇭 CH' }[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={Math.max(300, pageData.length * 44)}>
        <BarChart
          data={pageData.map((d) => ({ ...d, hospital: truncate(d.hospital) }))}
          layout="vertical"
          margin={{ top: 0, right: 70, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 10]}
            tickCount={6}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="hospital"
            width={200}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {pageData.map((entry, i) => (
              <Cell key={i} fill={scoreColor(entry.score)} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="score"
              position="right"
              formatter={(v) => v.toFixed(1)}
              style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            className="btn-ghost text-sm px-3 py-1.5"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ← Vorherige
          </button>
          <span className="text-sm text-slate-500">
            Seite {page + 1} / {totalPages}
          </span>
          <button
            className="btn-ghost text-sm px-3 py-1.5"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Nächste →
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## src/components/Charts/HospitalSelector.jsx

```jsx
/**
 * Multi-Select für bis zu 3 Kliniken (für Radar-Chart)
 */
export default function HospitalSelector({ options, selected, onChange, max = 3 }) {
  const toggle = (name) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name))
    } else if (selected.length < max) {
      onChange([...selected, name])
    }
  }

  // Farben für die 3 Plätze
  const COLORS = ['sky', 'rose', 'amber']
  const colorClass = (idx) => {
    const c = COLORS[idx]
    return `border-${c}-500 bg-${c}-500/15 text-${c}-400`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="label mb-0">Klinik auswählen (max. {max})</span>
        {selected.length > 0 && (
          <button className="btn-ghost text-xs py-1 px-2" onClick={() => onChange([])}>
            Auswahl löschen
          </button>
        )}
      </div>

      {/* Aktuelle Auswahl */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((name, idx) => (
            <span
              key={name}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${colorClass(idx)}`}
            >
              <span className={`w-2 h-2 rounded-full bg-${COLORS[idx]}-400 inline-block`} />
              {name.length > 25 ? name.slice(0, 23) + '…' : name}
              <button onClick={() => toggle(name)} className="ml-1 opacity-60 hover:opacity-100">×</button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown-Liste */}
      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
        {options.map((name) => {
          const selIdx = selected.indexOf(name)
          const isSelected = selIdx >= 0
          const isDisabled = !isSelected && selected.length >= max
          return (
            <button
              key={name}
              onClick={() => toggle(name)}
              disabled={isDisabled}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                isSelected
                  ? colorClass(selIdx) + ' border'
                  : isDisabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

---

## src/components/Charts/RadarComparison.jsx

```jsx
import { useState, useMemo } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'
import HospitalSelector from './HospitalSelector.jsx'
import EmptyState from '../UI/EmptyState.jsx'
import { Link } from 'react-router-dom'

// Feste Farben für bis zu 3 Kliniken (Tailwind kann nicht dynamisch interpoliert werden)
const RADAR_COLORS = [
  { stroke: '#0ea5e9', fill: '#0ea5e9' },  // sky-500
  { stroke: '#f43f5e', fill: '#f43f5e' },  // rose-500
  { stroke: '#f59e0b', fill: '#f59e0b' },  // amber-500
]

function CustomRadarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="card-sm shadow-xl border-slate-700 min-w-[160px]">
      <div className="font-semibold text-slate-200 text-sm mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            <span className="text-slate-400 truncate max-w-[100px]">{p.name}</span>
          </span>
          <span className="font-semibold tabular-nums" style={{ color: p.color }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RadarComparison() {
  const { hospitalNames, getRadarData } = useRatings()
  const [selected, setSelected] = useState(hospitalNames.slice(0, 2))

  const chartData = useMemo(
    () => (selected.length > 0 ? getRadarData(selected) : []),
    [selected, getRadarData]
  )

  if (hospitalNames.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon="🎯"
          title="Noch keine Daten"
          description="Füge Bewertungen hinzu, um Kliniken zu vergleichen."
          action={<Link to="/bewerten" className="btn-primary">Jetzt bewerten</Link>}
        />
      </div>
    )
  }

  return (
    <div className="card space-y-6">
      <div>
        <div className="section-title">🎯 Klinik-Vergleich</div>
        <div className="section-subtitle">Vergleiche bis zu 3 Kliniken in allen Kriterien</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="lg:col-span-1">
          <HospitalSelector
            options={hospitalNames}
            selected={selected}
            onChange={setSelected}
          />
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          {selected.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-slate-500 text-sm">
              Wähle mindestens eine Klinik aus.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  tick={{ fill: '#475569', fontSize: 9 }}
                  tickCount={6}
                  axisLine={false}
                />
                {selected.map((name, i) => (
                  <Radar
                    key={name}
                    name={name.length > 22 ? name.slice(0, 20) + '…' : name}
                    dataKey={name}
                    stroke={RADAR_COLORS[i].stroke}
                    fill={RADAR_COLORS[i].fill}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={{ r: 3, fill: RADAR_COLORS[i].fill }}
                  />
                ))}
                <Tooltip content={<CustomRadarTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '8px' }}
                  formatter={(value) => (
                    <span style={{ color: '#94a3b8' }}>
                      {value.length > 30 ? value.slice(0, 28) + '…' : value}
                    </span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Verifizierung
- BarRanking zeigt horizontale Balken, farbig nach Score (grün/gelb/rot)
- Filter-Buttons DE/AT/CH/Alle funktionieren
- Pagination bei > 10 Kliniken
- Radar-Chart zeigt 2 Kliniken standardmäßig verglichen
- Auswahl im HospitalSelector ändert Radar-Chart sofort
- Tooltip erscheint auf Hover in beiden Charts
- Responsive: Charts schrumpfen auf Mobile korrekt
