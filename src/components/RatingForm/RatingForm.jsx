import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import StepHospital    from './StepHospital.jsx'
import StepCriteria    from './StepCriteria.jsx'
import StepMedical     from './StepMedical.jsx'
import StepNiceToHave  from './StepNiceToHave.jsx'
import StepDone        from './StepDone.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { DEFAULT_CRITERIA } from '../../data/criteria.js'

const DEFAULT_HOSPITAL = { hospital: '', city: '', country: 'DE', region: '', specialty: '', year: new Date().getFullYear(), yearFrom: new Date().getFullYear(), yearTo: 'fortlaufend' }
const TOTAL_STEPS = 5

export default function RatingForm({ prefill = null, initialSearchMode = 'schnell' }) {
  const [step, setStep]           = useState(1)
  const [hospitalData, setHosp]   = useState(() =>
    prefill ? { ...DEFAULT_HOSPITAL, ...prefill } : DEFAULT_HOSPITAL
  )
  const [criteriaData, setCrit]   = useState({ ...DEFAULT_CRITERIA })
  const [comment, setComment]     = useState('')
  const addRating = useRatingsStore((s) => s.addRating)

  function handleSubmit() {
    addRating({ id: uuidv4(), timestamp: new Date().toISOString(), ...hospitalData, criteria: criteriaData, comment })
    setStep(TOTAL_STEPS)
  }

  function reset() {
    setStep(1); setHosp(DEFAULT_HOSPITAL); setCrit({ ...DEFAULT_CRITERIA }); setComment('')
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

      {step === 1 && <StepHospital   data={hospitalData} onChange={setHosp} onNext={() => setStep(2)} initialSearchMode={initialSearchMode} />}
      {step === 2 && <StepCriteria   data={criteriaData} onChange={setCrit} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <StepMedical    data={criteriaData} onChange={setCrit} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
      {step === 4 && <StepNiceToHave data={criteriaData} comment={comment} onChange={setCrit} onCommentChange={setComment} onBack={() => setStep(3)} onSubmit={handleSubmit} />}
      {step === TOTAL_STEPS && <StepDone hospital={hospitalData.hospital} onNew={reset} />}
    </div>
  )
}
