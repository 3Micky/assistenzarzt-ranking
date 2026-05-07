import GeoMap from '../components/GeoMap/GeoMap.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function KartePage() {
  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// DACH-HEATMAP</span>
        <span className="text-canvas/60">BEWERTUNGEN NACH REGION</span>
      </div>
      <StatsBar />
      <GeoMap />
    </div>
  )
}
