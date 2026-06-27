import { SCALE_5_OPTIONS } from '../../data/criteria.js'

export function FormCard({ title, hint, optional = true, showBadge = !optional, children, className = '' }) {
  return (
    <section className={`form-card ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="form-card-title">{title}</div>
          {hint && <div className="form-help mt-1">{hint}</div>}
        </div>
        {showBadge && (
          <span className={optional ? 'form-badge' : 'form-badge form-badge-required'}>
            {optional ? 'OPTIONAL' : 'PFLICHT'}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

export function ChoiceGroup({ label, value, options, onChange, optional = true, hint, className = '' }) {
  const hasLongLabel = String(label).length > 28
  const hasLongOptions = options.some(option => {
    const optionLabel = typeof option === 'string' ? option : option.label
    return String(optionLabel).length > 16 || String(optionLabel).trim().split(/\s+/).length > 2
  })
  const gridClass = options.length <= 2
    ? hasLongOptions
      ? 'grid-cols-1'
      : 'grid-cols-2'
    : hasLongOptions
      ? 'grid-cols-1'
      : 'grid-cols-1 sm:grid-cols-3'
  const wideClass = hasLongLabel || hasLongOptions ? 'sm:col-span-2' : ''

  return (
    <FormCard title={label} hint={hint} optional={optional} className={`${wideClass} ${className}`.trim()}>
      <div className={`grid gap-1 ${gridClass}`} role="radiogroup" aria-label={label}>
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
  const selectedOption = options.find(option => option.value === value)

  return (
    <FormCard title={title} hint={question} optional={optional}>
      <div className="scale-slider" role="radiogroup" aria-label={title}>
        {options.map(option => (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            aria-checked={value === option.value}
            aria-label={`${option.value}: ${option.shortLabel}`}
            className={value === option.value ? 'scale-option scale-option-active' : 'scale-option'}
          >
            <span className="scale-dot">{option.value}</span>
            <span className="scale-label">{option.shortLabel}</span>
          </button>
        ))}
      </div>
      <div className={value == null ? 'scale-status' : 'scale-status scale-status-active'}>
        {value == null
          ? 'Noch nicht bewertet'
          : `Ausgewählt: ${value} · ${selectedOption?.shortLabel ?? ''}`}
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
