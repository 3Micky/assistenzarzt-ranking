import { Head } from 'vite-react-ssg'
import BarRanking from '../components/Charts/BarRanking.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function RankingPage() {
  return (
    <div>
      <Head>
        <title>Klinik-Ranking | Top-Kliniken für Assistenzärzte | assistenz-ranking.de</title>
        <meta name="description" content="Das Ranking der besten Kliniken für Assistenzärzte in DACH — nach echten, anonymen Bewertungen sortiert. Weiterbildungsqualität, Arbeitsklima und mehr." />
        <link rel="canonical" href="https://assistenz-ranking.de/ranking" />
        <meta property="og:url" content="https://assistenz-ranking.de/ranking" />
        <meta property="og:title" content="Klinik-Ranking für Assistenzärzte | DACH" />
        <meta property="og:description" content="Top-Kliniken nach anonymen Assistenzarzt-Bewertungen — Weiterbildung, Arbeitsklima, Gehalt." />
      </Head>
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
