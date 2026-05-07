import { useSearchParams } from 'react-router-dom'
import RatingForm from '../components/RatingForm/RatingForm.jsx'

export default function BewertungPage() {
  const [searchParams] = useSearchParams()

  // Vorausfüllen aus Startseiten-Suche (mode=bewerten)
  const hasPrefill = searchParams.get('hospital') || searchParams.get('country') || searchParams.get('city')
  const prefill = hasPrefill ? {
    hospital: searchParams.get('hospital') || '',
    city:     searchParams.get('city')     || '',
    region:   searchParams.get('region')   || '',
    country:  searchParams.get('country')  || 'DE',
  } : null

  return (
    <div className="px-4 py-6">
      <div className="register-strip border border-ink mb-6 max-w-3xl mx-auto">
        <span>/// BEWERTUNG SCHREIBEN</span>
      </div>
      <RatingForm prefill={prefill} />
    </div>
  )
}
