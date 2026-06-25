import { isProceduralSpecialty, procedureType } from '../../utils/calculations.js'
import { ChoiceGroup, FormCard, FormSummary, NumberField } from './FormControls.jsx'

export default function StepFacts({ data, context, onChange, onBack, onNext }) {
  const set = (key, value) => onChange({ ...data, [key]: value })
  const procedural = isProceduralSpecialty(context.specialty)
  const procedureLabel = procedureType(context.specialty) === 'interventionell'
    ? 'Interventionen'
    : 'Eingriffe'

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>SCHRITT 2 VON 4 /// ZAHLEN &amp; FAKTEN</span>
        <span className="text-canvas/60">OPTIONALE DETAILS</span>
      </div>
      <FormSummary {...context} />

      <div className="form-step-grid">
        <FormCard
          title="Tatsächliche Arbeitszeit"
          hint="Typischer normaler Arbeitstag, einschließlich Dokumentation."
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="time"
              value={data.arbeitszeitenVon ?? ''}
              onChange={event => set('arbeitszeitenVon', event.target.value || null)}
              className="input-brutalist font-mono"
              aria-label="Arbeitsbeginn"
            />
            <span className="mono-label">BIS</span>
            <input
              type="time"
              value={data.arbeitszeitenBis ?? ''}
              onChange={event => set('arbeitszeitenBis', event.target.value || null)}
              className="input-brutalist font-mono"
              aria-label="Arbeitsende"
            />
          </div>
        </FormCard>

        <NumberField label="Dienste pro Monat" value={data.diensteProMonat} min={0} max={15} unit="DIENSTE" onChange={value => set('diensteProMonat', value)} />
        <NumberField label="Nachtdienste pro Monat" value={data.nachtdiensteProMonat} min={0} max={31} unit="NÄCHTE" onChange={value => set('nachtdiensteProMonat', value)} />
        <NumberField label="Abteilungsgröße" hint="Ungefähre Zahl der Ärzt*innen." value={data.abteilungsgroesse} min={1} max={500} unit="ÄRZT*INNEN" onChange={value => set('abteilungsgroesse', value)} />

        <ChoiceGroup
          label="Überstunden werden erfasst"
          value={data.ueberstundenErfassung}
          options={['Vollständig', 'Teilweise', 'Nein']}
          onChange={value => set('ueberstundenErfassung', value)}
        />
        <ChoiceGroup
          label="Überstundenausgleich"
          value={data.ueberstundenAusgleich}
          options={['Bezahlt', 'Freizeitausgleich', 'Kein Ausgleich']}
          onChange={value => set('ueberstundenAusgleich', value)}
        />

        {procedural && (
          <>
            <NumberField
              label={`${procedureLabel} pro Monat`}
              hint="Eigene und assistierte zusammen."
              value={data.opsProMonat}
              min={0}
              max={50}
              unit={procedureLabel.toUpperCase()}
              onChange={value => set('opsProMonat', value)}
            />
            <ChoiceGroup
              label="Anteil selbst durchgeführt"
              value={data.hauptoperateurKategorie}
              options={['Unter 10 %', '10–25 %', '26–50 %', 'Über 50 %']}
              onChange={value => set('hauptoperateurKategorie', value)}
              className="sm:col-span-2"
            />
          </>
        )}
      </div>

      <div className="form-nav">
        <button type="button" onClick={onBack} className="btn-ghost-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button type="button" onClick={onNext} className="btn-hazard">WEITER &gt;&gt;&gt;</button>
      </div>
    </div>
  )
}
