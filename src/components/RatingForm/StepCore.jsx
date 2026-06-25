import { CRITERIA_CORE_V3, SCALE_5_OPTIONS } from '../../data/criteria.js'
import { answeredCoreCount, MIN_ANSWERED_CORE_CRITERIA } from '../../utils/calculations.js'

function ScaleQuestion({ criterion, value, onChange }) {
  return (
    <fieldset className="bg-canvas-alt rounded p-4">
      <legend className="sr-only">{criterion.label}</legend>
      <div className="mono-label-red mb-1">{criterion.label}</div>
      <p className="text-sm text-ink/85 leading-relaxed mb-3">{criterion.question}</p>
      <div className="grid grid-cols-5 gap-1">
        {SCALE_5_OPTIONS.map(option => (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={
              value === option.value
                ? 'bg-hazard text-white border border-hazard min-h-12 px-1 py-2 font-mono text-[9px] sm:text-[11px] uppercase leading-tight'
                : 'bg-canvas text-ink/75 border border-ink/20 hover:border-ink min-h-12 px-1 py-2 font-mono text-[9px] sm:text-[11px] uppercase leading-tight'
            }
          >
            {option.shortLabel}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${
          value == null ? 'text-hazard' : 'text-ink/45 hover:text-ink'
        }`}
      >
        {value == null ? '○ Nicht beurteilt' : 'Antwort löschen / nicht beurteilbar'}
      </button>
    </fieldset>
  )
}

export default function StepCore({ data, onChange, onBack, onNext }) {
  const answered = answeredCoreCount(data)
  const canProceed = answered >= MIN_ANSWERED_CORE_CRITERIA

  return (
    <div>
      <div className="register-strip border-b border-ink flex justify-between">
        <span>SCHRITT 2 VON 3 /// DEINE ERFAHRUNG</span>
        <span className={canProceed ? 'text-score-high' : 'text-canvas/60'}>
          {answered}/6 BEANTWORTET
        </span>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-ink/70">
          Fünf Antworten reichen. Wähle „nicht beurteilbar“, wenn du etwas nicht sicher einschätzen kannst.
        </p>
        {CRITERIA_CORE_V3.map(criterion => (
          <ScaleQuestion
            key={criterion.key}
            criterion={criterion}
            value={data[criterion.key]}
            onChange={value => onChange({ ...data, [criterion.key]: value })}
          />
        ))}
      </div>

      <div className="flex border-t border-ink">
        <button type="button" onClick={onBack} className="btn-ghost-ink border-r border-ink">
          &lt;&lt;&lt; ZURÜCK
        </button>
        <button type="button" onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
          WEITER &gt;&gt;&gt;
        </button>
      </div>
    </div>
  )
}
