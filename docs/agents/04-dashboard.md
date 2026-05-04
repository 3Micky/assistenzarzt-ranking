# Agent 04 – Dashboard & Layout Shell

## Ziel
App-Shell mit Header, Tab-Navigation und Dashboard-Layout aufbauen.
Das Dashboard ist die Startseite mit 4 Tabs: Karte, Ranking, Vergleich, Bewerten.

---

## src/components/Layout/Header.jsx

```jsx
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400
                            flex items-center justify-center text-lg shadow-lg
                            group-hover:shadow-sky-500/30 transition-shadow">
              🏥
            </div>
            <div>
              <div className="font-bold text-slate-100 leading-tight">
                Assistenzarzt
                <span className="text-gradient">-Ranking</span>
              </div>
              <div className="text-xs text-slate-500 leading-tight">DE · AT · CH</div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-sky-400 bg-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Dashboard
            </Link>
            <Link to="/bewerten" className="btn-primary text-sm py-2 px-4">
              + Bewertung
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

---

## src/components/Dashboard/StatsBar.jsx

```jsx
import { useRatings } from '../../hooks/useRatings.js'

function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className="card-sm flex flex-col gap-0.5">
      <div className={`text-2xl font-bold tabular-nums ${accent ? 'text-gradient' : 'text-slate-100'}`}>
        {value}
      </div>
      <div className="text-xs font-medium text-slate-400">{label}</div>
      {sub && <div className="text-xs text-slate-600">{sub}</div>}
    </div>
  )
}

export default function StatsBar() {
  const { stats } = useRatings()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <StatCard
        label="Bewertungen gesamt"
        value={stats.total}
        accent
      />
      <StatCard
        label="⌀ Gesamt-Score"
        value={stats.avgScore.toFixed(1)}
        sub="von 10 Punkten"
      />
      <StatCard
        label="🏆 Top-Klinik"
        value={stats.topHospital.length > 22 ? stats.topHospital.slice(0, 20) + '…' : stats.topHospital}
      />
      <StatCard label="🇩🇪 Deutschland" value={stats.countDE} sub="Bewertungen" />
      <StatCard label="🇦🇹 Österreich"  value={stats.countAT} sub="Bewertungen" />
      <StatCard label="🇨🇭 Schweiz"      value={stats.countCH} sub="Bewertungen" />
    </div>
  )
}
```

---

## src/components/Dashboard/Dashboard.jsx

```jsx
import { useState } from 'react'
import StatsBar from './StatsBar.jsx'
import GeoMap from '../GeoMap/GeoMap.jsx'
import BarRanking from '../Charts/BarRanking.jsx'
import RadarComparison from '../Charts/RadarComparison.jsx'
import RatingForm from '../RatingForm/RatingForm.jsx'

const TABS = [
  { id: 'map',     label: 'DACH-Karte',   icon: '🗺️'  },
  { id: 'ranking', label: 'Ranking',       icon: '🏆'  },
  { id: 'radar',   label: 'Vergleich',     icon: '🎯'  },
  { id: 'form',    label: 'Bewerten',      icon: '✏️'  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('map')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Assistenzarzt-Stellen{' '}
          <span className="text-gradient">im Vergleich</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Anonyme Bewertungen von Assistenzärzten aus Deutschland, Österreich und der Schweiz.
          Hilf anderen bei der Entscheidung — trage deine Erfahrung bei.
        </p>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'tab-item-active' : 'tab-item-inactive'}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-slide-up" key={activeTab}>
        {activeTab === 'map'     && <GeoMap />}
        {activeTab === 'ranking' && <BarRanking />}
        {activeTab === 'radar'   && <RadarComparison />}
        {activeTab === 'form'    && <RatingForm embedded />}
      </div>
    </div>
  )
}
```

---

## Hinweis: Platzhalter-Komponenten

Da die Chart-Komponenten (GeoMap, BarRanking, RadarComparison) und RatingForm
in späteren Agents erstellt werden, lege zunächst folgende Stub-Dateien an,
damit die App ohne Fehler startet:

`src/components/GeoMap/GeoMap.jsx`:
```jsx
export default function GeoMap() {
  return <div className="card h-96 flex items-center justify-center text-slate-500">🗺️ Karte wird geladen…</div>
}
```

`src/components/Charts/BarRanking.jsx`:
```jsx
export default function BarRanking() {
  return <div className="card h-96 flex items-center justify-center text-slate-500">📊 Ranking wird geladen…</div>
}
```

`src/components/Charts/RadarComparison.jsx`:
```jsx
export default function RadarComparison() {
  return <div className="card h-96 flex items-center justify-center text-slate-500">🎯 Vergleich wird geladen…</div>
}
```

`src/components/RatingForm/RatingForm.jsx`:
```jsx
export default function RatingForm({ embedded }) {
  return <div className="card h-96 flex items-center justify-center text-slate-500">✏️ Formular wird geladen…</div>
}
```

Diese Stubs werden in Agents 03, 05, 06 durch echte Implementierungen ersetzt.

## Verifizierung
- `npm run dev` → Header + Tabs erscheinen, alle 4 Tabs klickbar
- StatsBar zeigt 6 Karten mit Seed-Daten
- Tab-Wechsel animiert (slide-up)
- Responsive auf Mobile (≤ 640px) → Grid wird 2-spaltig
