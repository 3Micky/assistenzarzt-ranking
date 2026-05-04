import RatingForm from '../components/RatingForm/RatingForm.jsx'

export default function BewertungPage() {
  return (
    <div className="px-4 py-6">
      <div className="register-strip border border-ink mb-6 max-w-3xl mx-auto">
        <span>/// BEWERTUNG SCHREIBEN</span>
      </div>
      <RatingForm />
    </div>
  )
}
