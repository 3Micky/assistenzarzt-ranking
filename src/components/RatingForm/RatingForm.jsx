import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import StepHospital    from './StepHospital.jsx'
import StepCriteria    from './StepCriteria.jsx'
import StepNiceToHave  from './StepNiceToHave.jsx'
import StepDone        from './StepDone.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { DEFAULT_CRITERIA } from '../../data/criteria.js'

const DEFAULT_HOSPITAL = { hospital: '', city: '', country: 'DE', region: '', specialty: '', year: new Date().getFullYear() }

export default function RatingForm() {
  const [step, setStep]           = useState(1)
  const [hospitalData, setHosp]   = useState(DEFAULT_HOSPITAL)
  const [criteriaData, setCrit]   = useState({ ...DEFAULT_CRITERIA })
  const [comment, setComment]     = useState('')
  const addRating = useRatingsStore((s) => s.addRating)

  function handleSubmit() {
    addRating({ id: uuidv4(), timestamp: new Date().toISOString(), ...hospitalData, criteria: criteriaData, comment })
    setStep(4)
  }

  function reset() {
    setStep(1); setHosp(DEFAULT_HOSPITAL); setCrit({ ...DEFAULT_CRITERIA }); setComment('')
  }

  const pct = step === 4 ? 100 : Math.round((step - 1) / 3 * 100)

  return (
    <div className="border border-ink max-w-3xl mx-auto my-6">
      {/* Progress */}
      {step < 4 && (
        <div className="h-0.5 bg-ink/10">
          <div className="h-full bg-hazard transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      )}

      {step === 1 && <StepHospital   data={hospitalData} onChange={setHosp} onNext={() => setStep(2)} />}
      {step === 2 && <StepCriteria   data={criteriaData} onChange={setCrit} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <StepNiceToHave data={criteriaData} comment={comment} onChange={setCrit} onCommentChange={setComment} onBack={() => setStep(2)} onSubmit={handleSubmit} />}
      {step === 4 && <StepDone hospital={hospitalData.hospital} onNew={reset} />}
    </div>
  )
}
