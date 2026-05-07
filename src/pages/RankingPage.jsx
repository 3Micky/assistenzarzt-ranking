import BarRanking from '../components/Charts/BarRanking.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function RankingPage() {
  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// RANKING</span>
        <span className="text-canvas/60">TOP-KLINIKEN NACH SCORE</span>
      </div>
      <StatsBar />
      <div className="border-b border-ink">
        <BarRanking />
      </div>
    </div>
  )
}
