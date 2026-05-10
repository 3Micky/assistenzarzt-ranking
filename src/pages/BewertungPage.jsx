import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import RatingForm from '../components/RatingForm/RatingForm.jsx'

export default function BewertungPage() {
  const [searchParams] = useSearchParams()

  // Vorausfüllen aus Startseiten-Suche (mode=bewerten)
  const hasPrefill = searchParams.get('hospital') || searchParams.get('country') || searchParams.get('city')
  const prefill = hasPrefill ? {
    hospital:   searchParams.get('hospital')   || '',
    city:       searchParams.get('city')       || '',
    region:     searchParams.get('region')     || '',
    country:    searchParams.get('country')    || 'DE',
  } : null
  const initialSearchMode = searchParams.get('searchMode') || 'schnell'

  return (
    <div className="px-4 py-6">
      <Helmet>
        <title>Klinik bewerten | Erfahrung teilen | assistenz-ranking.de</title>
        <meta name="description" content="Teile deine Erfahrung als Assistenzärztin oder Assistenzarzt — anonym, in wenigen Minuten. Hilf anderen bei der Wahl der richtigen Klinik." />
        <link rel="canonical" href="https://assistenz-ranking.de/bewerten" />
        <meta property="og:url" content="https://assistenz-ranking.de/bewerten" />
        <meta property="og:title" content="Klinik bewerten | Assistenzarzt-Erfahrung teilen" />
        <meta property="og:description" content="Anonym und in wenigen Minuten — teile deine Erfahrung als Assistenzärztin oder Assistenzarzt." />
      </Helmet>
      <div className="register-strip border border-ink mb-6 max-w-3xl mx-auto">
        <span>/// BEWERTUNG SCHREIBEN</span>
      </div>
      <RatingForm prefill={prefill} initialSearchMode={initialSearchMode} />
    </div>
  )
}
