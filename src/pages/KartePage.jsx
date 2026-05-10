import { Helmet } from 'react-helmet-async'
import GeoMap from '../components/GeoMap/GeoMap.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function KartePage() {
  return (
    <div>
      <Helmet>
        <title>Klinik-Heatmap DACH | Assistenzarzt-Bewertungen nach Region | assistenz-ranking.de</title>
        <meta name="description" content="Interaktive Heatmap: Wie gut sind Assistenzarztstellen in deiner Region? Bewertungen aus Deutschland, Österreich und der Schweiz auf einen Blick." />
        <link rel="canonical" href="https://assistenz-ranking.de/karte" />
        <meta property="og:url" content="https://assistenz-ranking.de/karte" />
        <meta property="og:title" content="Klinik-Heatmap DACH | Assistenzarzt-Bewertungen" />
        <meta property="og:description" content="Interaktive Heatmap der Assistenzarzt-Bewertungen in Deutschland, Österreich und der Schweiz." />
      </Helmet>
      <div className="register-strip border-b border-ink">
        <span>/// DACH-HEATMAP</span>
        <span className="text-canvas/60">BEWERTUNGEN NACH REGION</span>
      </div>
      <StatsBar />
      <GeoMap />
    </div>
  )
}
