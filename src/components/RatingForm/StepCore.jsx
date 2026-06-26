import { CRITERIA_CORE_V3 } from '../../data/criteria.js'
import { answeredCoreCount, MIN_ANSWERED_CORE_CRITERIA } from '../../utils/calculations.js'
import { ChoiceGroup, FormSummary, ScaleQuestion } from './FormControls.jsx'

const FREQUENCY_OPTIONS = [
  { value: 1, shortLabel: 'Nie' },
  { value: 2, shortLabel: 'Selten' },
  { value: 3, shortLabel: 'Teils' },
  { value: 4, shortLabel: 'Meistens' },
  { value: 5, shortLabel: 'Immer' },
]

const AGREEMENT_OPTIONS = [
  { value: 1, shortLabel: 'Gar nicht' },
  { value: 2, shortLabel: 'Eher nicht' },
  { value: 3, shortLabel: 'Teils' },
  { value: 4, shortLabel: 'Eher ja' },
  { value: 5, shortLabel: 'Vollständig' },
]

export default function StepCore({ data, context, onChange, onBack, onNext }) {
  const set = (key, value) => onChange({ ...data, [key]: value })
  const answered = answeredCoreCount(data)
  const canProceed = answered >= MIN_ANSWERED_CORE_CRITERIA

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>SCHRITT 3 VON 4 /// QUALITÄT &amp; ZUSAMMENARBEIT</span>
        <span className={canProceed ? 'text-score-high' : 'text-canvas/60'}>
          {answered}/6 KERNFRAGEN
        </span>
      </div>
      <FormSummary {...context} />

      <div className="px-4 pt-4">
        <div className="form-section-title">KERNBEWERTUNG</div>
        <p className="form-help mt-1 mb-3">
          Fünf der sechs Kernfragen sind erforderlich. Diese sechs Antworten bilden den Hauptscore.
        </p>
      </div>
      <div className="form-step-grid pt-0">
        {CRITERIA_CORE_V3.map(criterion => (
          <ScaleQuestion
            key={criterion.key}
            title={criterion.label}
            question={criterion.question}
            value={data[criterion.key]}
            onChange={value => set(criterion.key, value)}
            optional
          />
        ))}
      </div>

      <div className="px-4 pt-2">
        <div className="form-section-title">WEITERBILDUNG &amp; LEHRE</div>
        <p className="form-help mt-1 mb-3">Zusatzinformationen; sie verändern den Hauptscore nicht.</p>
      </div>
      <div className="form-step-grid pt-0">
        <ScaleQuestion
          title="Hintergrund nachts erreichbar"
          question="War fachärztliche oder oberärztliche Hilfe nachts zuverlässig erreichbar?"
          value={data.hintergrundErreichbarkeit}
          onChange={value => set('hintergrundErreichbarkeit', value)}
          options={FREQUENCY_OPTIONS}
        />
        <ChoiceGroup label="Fortbildungsfreistellung" value={data.fortbildungFreistellung} options={[{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }]} onChange={value => set('fortbildungFreistellung', value)} />
        <ChoiceGroup label="Fortbildungskosten übernommen" value={data.fortbildungBezahlt} options={[{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }]} onChange={value => set('fortbildungBezahlt', value)} />
        <ChoiceGroup label="Lehrtätigkeit vorhanden" value={data.lehreTaetig} options={[{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }]} onChange={value => set('lehreTaetig', value)} />
        {data.lehreTaetig === true && (
          <ChoiceGroup label="Freistellung für Lehrtätigkeit" value={data.lehreFreistellung} options={[{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }]} onChange={value => set('lehreFreistellung', value)} />
        )}
      </div>

      <div className="px-4 pt-2">
        <div className="form-section-title">ALLTAG &amp; ZUSAMMENARBEIT</div>
      </div>
      <div className="form-step-grid pt-3">
        <ScaleQuestion title="Urlaubsgenehmigung" question="Wie unkompliziert wurde Urlaub genehmigt?" value={data.urlaub} onChange={value => set('urlaub', value)} />
        <ScaleQuestion title="Dokumentationsaufwand" question="Wie gut war der Dokumentationsaufwand im Alltag beherrschbar?" value={data.dokumentation} onChange={value => set('dokumentation', value)} />
        <ScaleQuestion title="Fehlerkultur" question="Konnten Fehler offen und ohne Angst angesprochen werden?" value={data.fehlerkultur} onChange={value => set('fehlerkultur', value)} options={AGREEMENT_OPTIONS} />
        <ScaleQuestion title="Respektvolle Führung" question="Kommunizierten die Vorgesetzten respektvoll und fair?" value={data.fuehrungRespekt} onChange={value => set('fuehrungRespekt', value)} options={AGREEMENT_OPTIONS} />
        <ScaleQuestion title="Zusammenarbeit mit der Pflege" question="Wie gut funktionierte die Zusammenarbeit mit der Pflege?" value={data.pflegeZusammenarbeit} onChange={value => set('pflegeZusammenarbeit', value)} />
        <ScaleQuestion title="Strukturierte Einarbeitung" question="Wie gut war die Einarbeitung in den ersten Wochen organisiert?" value={data.einarbeitung} onChange={value => set('einarbeitung', value)} />
      </div>

      <div className="form-nav">
        <button type="button" onClick={onBack} className="btn-ghost-ink">&lt;&lt;&lt; ZURÜCK</button>
        <div className="grid grid-cols-1">
          {!canProceed && (
            <div className="flex items-center justify-center border-b border-ink/20 px-3 py-1 text-center font-mono text-[9px] uppercase tracking-wider text-hazard">
              Bitte mindestens 5 von 6 Kernfragen bewerten
            </div>
          )}
          <button type="button" onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
            WEITER &gt;&gt;&gt;
          </button>
        </div>
      </div>
    </div>
  )
}
