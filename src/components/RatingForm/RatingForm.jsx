import { useState, useEffect } from 'react'
import StepHospital    from './StepHospital.jsx'
import StepCore        from './StepCore.jsx'
import StepNiceToHave  from './StepNiceToHave.jsx'
import StepDone        from './StepDone.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { DEFAULT_CRITERIA } from '../../data/criteria.js'
import { normalizeCriteria, ratingValidity } from '../../utils/calculations.js'

const DEFAULT_HOSPITAL = { hospital: '', city: '', country: 'DE', region: '', specialty: '', year: new Date().getFullYear(), yearFrom: new Date().getFullYear(), yearTo: 'fortlaufend' }
const TOTAL_STEPS = 4

export default function RatingForm({ prefill = null }) {
  const [step, setStep]           = useState(1)
  useEffect(() => { window.scrollTo(0, 0) }, [step])
  const [hospitalData, setHosp]   = useState(() =>
    prefill ? { ...DEFAULT_HOSPITAL, ...prefill } : DEFAULT_HOSPITAL
  )
  const [criteriaData, setCrit]   = useState({ ...DEFAULT_CRITERIA })
  const [comment, setComment]     = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const addRating = useRatingsStore((s) => s.addRating)

  async function handleSubmit() {
    setSubmitError('')
    if (!turnstileToken) {
      setSubmitError('Bitte bestätige zuerst, dass du kein Bot bist.')
      return
    }

    const validity = ratingValidity(criteriaData)
    if (!validity.isValid) {
      setSubmitError(`Bitte beantworte mindestens ${validity.requiredCore} Kernfragen. Aktuell beantwortet: ${validity.answeredCore}.`)
      return
    }

    setSubmitting(true)
    try {
      const criteria = normalizeCriteria(criteriaData)
      const result = await addRating({
        hospital: hospitalData.hospital,
        city: hospitalData.city,
        country: hospitalData.country,
        region: hospitalData.region,
        specialty: hospitalData.specialty,
        yearFrom: hospitalData.yearFrom,
        yearTo: hospitalData.yearTo,
        criteria,
        comment,
      }, turnstileToken)

      if (!result) {
        setSubmitError('Die Bewertung konnte nicht gespeichert werden. Bitte später erneut versuchen.')
        setTurnstileToken('')
        setTurnstileResetKey(key => key + 1)
        return
      }

      setStep(TOTAL_STEPS)
    } catch (error) {
      console.error('Bewertung speichern fehlgeschlagen:', error)
      setSubmitError('Die Bewertung konnte nicht gespeichert werden. Bitte später erneut versuchen.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setStep(1); setHosp(DEFAULT_HOSPITAL); setCrit({ ...DEFAULT_CRITERIA }); setComment('')
    setSubmitError('')
    setTurnstileToken('')
    setTurnstileResetKey(key => key + 1)
    // Nach dem Zurücksetzen URL-Params entfernen damit kein altes Prefill erneut greift
    window.history.replaceState(null, '', window.location.pathname)
  }

  const pct = step === TOTAL_STEPS ? 100 : Math.round((step - 1) / (TOTAL_STEPS - 1) * 100)

  return (
    <div className="border border-ink max-w-3xl mx-auto my-6">
      {step < TOTAL_STEPS && (
        <div className="h-0.5 bg-ink/10">
          <div className="h-full bg-hazard transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      )}

      {step === 1 && (
        <StepHospital
          data={hospitalData}
          criteria={criteriaData}
          onChange={setHosp}
          onCriteriaChange={setCrit}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepCore
          data={criteriaData}
          onChange={setCrit}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <StepNiceToHave
          data={criteriaData}
          comment={comment}
          onChange={setCrit}
          onCommentChange={setComment}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
          submitError={submitError}
          isSubmitting={isSubmitting}
          turnstileToken={turnstileToken}
          onTurnstileTokenChange={setTurnstileToken}
          turnstileResetKey={turnstileResetKey}
        />
      )}
      {step === TOTAL_STEPS && <StepDone hospital={hospitalData.hospital} onNew={reset} />}
    </div>
  )
}
