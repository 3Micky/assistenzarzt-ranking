# Agent 03 – Bewertungsformular (RatingForm)

## Ziel
Dreistufiger Wizard: Klinik-Info → Kriterien-Bewertung → Bestätigung.
Validierung, Fortschrittsbalken, schöne Slider.

---

## src/components/RatingForm/RatingForm.jsx

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import StepHospital from './StepHospital.jsx'
import StepCriteria from './StepCriteria.jsx'
import StepDone from './StepDone.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { CRITERIA_KEYS } from '../../data/criteria.js'

const DEFAULT_CRITERIA = Object.fromEntries(CRITERIA_KEYS.map((k) => [k, 5]))

export default function RatingForm({ embedded = false }) {
  const [step, setStep] = useState(1)
  const [hospitalData, setHospitalData] = useState({
    hospital: '', city: '', country: 'DE', region: '', specialty: '', year: new Date().getFullYear(),
  })
  const [criteriaData, setCriteriaData] = useState(DEFAULT_CRITERIA)
  const [comment, setComment] = useState('')
  const addRating = useRatingsStore((s) => s.addRating)
  const navigate = useNavigate()

  const handleSubmit = () => {
    addRating({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...hospitalData,
      criteria: criteriaData,
      comment,
    })
    setStep(3)
  }

  const wrapperClass = embedded
    ? 'card max-w-2xl mx-auto'
    : 'max-w-2xl mx-auto px-4 py-8'

  return (
    <div className={wrapperClass}>
      {/* Progress bar */}
      {step < 3 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">
              Schritt {step} von 2
            </span>
            <span className="text-sm text-slate-500">
              {step === 1 ? 'Klinik-Details' : 'Kriterien bewerten'}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${step * 50}%` }} />
          </div>
        </div>
      )}

      {step === 1 && (
        <StepHospital
          data={hospitalData}
          onChange={setHospitalData}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepCriteria
          data={criteriaData}
          comment={comment}
          onChange={setCriteriaData}
          onCommentChange={setComment}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
      {step === 3 && (
        <StepDone
          hospital={hospitalData.hospital}
          onNew={() => { setStep(1); setHospitalData({ hospital: '', city: '', country: 'DE', region: '', specialty: '', year: new Date().getFullYear() }); setCriteriaData(DEFAULT_CRITERIA); setComment('') }}
          onDashboard={() => embedded ? null : navigate('/')}
          embedded={embedded}
        />
      )}
    </div>
  )
}
```

---

## src/components/RatingForm/StepHospital.jsx

```jsx
import { SPECIALTIES, REGIONS } from '../../data/criteria.js'
import { CITIES } from '../../data/cities.js'

export default function StepHospital({ data, onChange, onNext }) {
  const update = (key, val) => onChange({ ...data, [key]: val })

  const citiesForCountry = CITIES.filter((c) => c.country === data.country)
  const isValid = data.hospital.trim() && data.city.trim() && data.region && data.specialty

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">Klinik-Details</h2>
        <p className="text-slate-400 text-sm">Keine persönlichen Angaben erforderlich — vollständig anonym.</p>
      </div>

      {/* Klinikname */}
      <div>
        <label className="label">Klinik / Abteilung *</label>
        <input
          className="input-field"
          placeholder="z.B. Charité – Campus Mitte"
          value={data.hospital}
          onChange={(e) => update('hospital', e.target.value)}
        />
      </div>

      {/* Land */}
      <div>
        <label className="label">Land *</label>
        <div className="flex gap-2">
          {['DE', 'AT', 'CH'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { update('country', c); update('region', ''); update('city', '') }}
              className={`flex-1 py-2.5 rounded-lg border font-medium text-sm transition-all ${
                data.country === c
                  ? 'border-sky-500 bg-sky-500/15 text-sky-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {{ DE: '🇩🇪 DE', AT: '🇦🇹 AT', CH: '🇨🇭 CH' }[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Stadt */}
      <div>
        <label className="label">Stadt *</label>
        <input
          className="input-field"
          list="city-suggestions"
          placeholder="Stadt eingeben…"
          value={data.city}
          onChange={(e) => update('city', e.target.value)}
        />
        <datalist id="city-suggestions">
          {citiesForCountry.map((c) => <option key={c.name} value={c.name} />)}
        </datalist>
      </div>

      {/* Region / Bundesland */}
      <div>
        <label className="label">Bundesland / Kanton *</label>
        <select className="select-field" value={data.region} onChange={(e) => update('region', e.target.value)}>
          <option value="">— bitte wählen —</option>
          {(REGIONS[data.country] ?? []).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Fachrichtung */}
      <div>
        <label className="label">Fachrichtung *</label>
        <select className="select-field" value={data.specialty} onChange={(e) => update('specialty', e.target.value)}>
          <option value="">— bitte wählen —</option>
          {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Jahr */}
      <div>
        <label className="label">Jahr der Stelle</label>
        <select className="select-field" value={data.year} onChange={(e) => update('year', Number(e.target.value))}>
          {Array.from({ length: 9 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button className="btn-primary w-full" onClick={onNext} disabled={!isValid}>
        Weiter → Kriterien bewerten
      </button>
    </div>
  )
}
```

---

## src/components/RatingForm/StepCriteria.jsx

```jsx
import { CRITERIA } from '../../data/criteria.js'

function CriterionSlider({ criterion, value, onChange }) {
  const pct = ((value - 1) / 9) * 100

  // Dynamische Slider-Farbe per Inline-Style auf dem Track
  const trackStyle = {
    background: `linear-gradient(to right, ${
      value >= 7.5 ? '#22c55e' : value >= 5 ? '#f59e0b' : '#ef4444'
    } 0% ${pct}%, #334155 ${pct}% 100%)`
  }

  return (
    <div className="card-sm space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 font-medium text-slate-200">
            <span>{criterion.emoji}</span>
            <span>{criterion.label}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{criterion.description}</div>
        </div>
        <div
          className="text-2xl font-bold tabular-nums min-w-[2.5rem] text-right"
          style={{ color: value >= 7.5 ? '#22c55e' : value >= 5 ? '#f59e0b' : '#ef4444' }}
        >
          {value}
        </div>
      </div>

      <input
        type="range"
        min={1} max={10} step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
        style={trackStyle}
      />

      <div className="flex justify-between text-xs text-slate-600">
        <span>{criterion.lowLabel}</span>
        <span>{criterion.highLabel}</span>
      </div>
    </div>
  )
}

export default function StepCriteria({ data, comment, onChange, onCommentChange, onBack, onSubmit }) {
  const update = (key, val) => onChange({ ...data, [key]: val })

  return (
    <div className="space-y-4 animate-slide-up">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">Kriterien bewerten</h2>
        <p className="text-slate-400 text-sm">Bewerte jedes Kriterium von 1 (schlecht) bis 10 (ausgezeichnet).</p>
      </div>

      {CRITERIA.map((c) => (
        <CriterionSlider
          key={c.key}
          criterion={c}
          value={data[c.key]}
          onChange={(val) => update(c.key, val)}
        />
      ))}

      {/* Kommentar */}
      <div>
        <label className="label">Kommentar (optional)</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Was hat dir besonders gut oder schlecht gefallen?"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button className="btn-secondary flex-1" onClick={onBack}>← Zurück</button>
        <button className="btn-primary flex-1" onClick={onSubmit}>✓ Bewertung abschicken</button>
      </div>
    </div>
  )
}
```

---

## src/components/RatingForm/StepDone.jsx

```jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function StepDone({ hospital, onNew, onDashboard, embedded }) {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 50) }, [])

  return (
    <div
      className={`flex flex-col items-center text-center py-10 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-6xl mb-4 animate-bounce">🎉</div>
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Danke für deine Bewertung!</h2>
      <p className="text-slate-400 text-sm mb-8 max-w-sm">
        Deine Bewertung für <span className="text-slate-200 font-medium">{hospital}</span> wurde
        gespeichert und erscheint sofort in den Rankings.
      </p>
      <div className="flex gap-3">
        <button className="btn-secondary" onClick={onNew}>+ Weitere Bewertung</button>
        {embedded ? (
          <button className="btn-primary" onClick={onDashboard}>Zum Dashboard</button>
        ) : (
          <Link to="/" className="btn-primary">Zum Dashboard</Link>
        )}
      </div>
    </div>
  )
}
```

## Verifizierung
- Formular öffnet sich, Schritt 1 → Pflichtfeld-Validation funktioniert
- Schritt 2 → Slider färben sich dynamisch (rot/gelb/grün)
- Nach Submit → Schritt 3 mit Bounce-Animation
- Neue Bewertung erscheint in StatsBar (Anzahl erhöht sich)
- Auf Mobile nutzbar (touch-friendly Slider)
