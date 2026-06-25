import { SCALE_5_OPTIONS } from '../../data/criteria.js'

export function FormCard({ title, hint, optional = true, children, className = '' }) {
  return (
    <section className={`form-card ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="form-card-title">{title}</div>
          {hint && <div className="form-help mt-1">{hint}</div>}
        </div>
        <span className={optional ? 'form-badge' : 'form-badge form-badge-required'}>
          {optional ? 'OPTIONAL' : 'PFLICHT'}
        </span>
      </div>
      {children}
    </section>
  )
}

export function ChoiceGroup({ label, value, options, onChange, optional = true, hint, className = '' }) {
  return (
    <FormCard title={label} hint={hint} optional={optional} className={className}>
      <div className={`grid gap-1 ${options.length <= 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`} role="radiogroup" aria-label={label}>
        {options.map(option => {
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label
          return (
            <button
              type="button"
              key={String(optionValue)}
              onClick={() => onChange(optionValue)}
              aria-pressed={value === optionValue}
              className={value === optionValue ? 'form-choice form-choice-active' : 'form-choice'}
            >
              {optionLabel}
            </button>
          )
        })}
      </div>
      {optional && value != null && (
        <button type="button" onClick={() => onChange(null)} className="form-clear">
          Antwort löschen
        </button>
      )}
    </FormCard>
  )
}

export function ScaleQuestion({ title, question, value, onChange, optional = true, options = SCALE_5_OPTIONS }) {
  return (
    <FormCard title={title} hint={question} optional={optional}>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-1" role="radiogroup" aria-label={title}>
        {options.map(option => (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={value === option.value ? 'form-choice form-choice-active' : 'form-choice'}
          >
            <span className="block text-sm font-bold mb-0.5">{option.value}</span>
            <span className="block text-[10px]">{option.shortLabel}</span>
          </button>
        ))}
      </div>
      {optional && (
        <button type="button" onClick={() => onChange(null)} className="form-clear">
          {value == null ? 'Nicht beurteilt' : 'Antwort löschen / nicht beurteilbar'}
        </button>
      )}
    </FormCard>
  )
}

export function NumberField({ label, value, min, max, unit, onChange, hint }) {
  return (
    <FormCard title={label} hint={hint}>
      <div className="flex items-stretch max-w-xs">
        <input
          type="number"
          min={min}
          max={max}
          value={value ?? ''}
          onChange={event => onChange(event.target.value === '' ? null : Number(event.target.value))}
          className="input-brutalist font-mono text-lg font-bold tabular-nums"
        />
        {unit && <span className="form-unit">{unit}</span>}
      </div>
    </FormCard>
  )
}

export function FormSummary({ hospital, specialty, yearFrom, yearTo }) {
  return (
    <div className="form-summary">
      <span className="font-bold text-ink">{hospital}</span>
      <span>{specialty}</span>
      <span>{yearFrom}–{yearTo === 'fortlaufend' ? 'heute' : yearTo}</span>
    </div>
  )
}
