import { useSearchParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
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
    specialty:  searchParams.get('specialty')  || '',
  } : null
  return (
    <div className="px-4 py-6">
      <Head>
        <title>Klinik bewerten | Erfahrung teilen | assistenz-ranking.de</title>
        <meta name="description" content="Teile deine Erfahrung als Assistenzärztin oder Assistenzarzt — anonym, ohne Anmeldung und mit vergleichbaren Qualitäts- und Arbeitsdaten." />
        <link rel="canonical" href="https://assistenz-ranking.de/bewerten" />
        <meta property="og:url" content="https://assistenz-ranking.de/bewerten" />
        <meta property="og:title" content="Klinik bewerten | Assistenzarzt-Erfahrung teilen" />
        <meta property="og:description" content="Anonym und ohne Anmeldung — teile Qualitäts- und Arbeitsdaten zu deiner Weiterbildungsstelle." />
      </Head>
      <div className="register-strip border border-ink mb-6 max-w-3xl mx-auto">
        <span>/// BEWERTUNG SCHREIBEN</span>
      </div>
      <RatingForm prefill={prefill} />
    </div>
  )
}
