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
