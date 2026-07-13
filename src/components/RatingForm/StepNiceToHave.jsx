import { ChoiceGroup, FormCard, FormSummary } from './FormControls.jsx'

const RECOMMENDATIONS = ['Ja', 'Mit Einschränkungen', 'Nein']

export default function StepNiceToHave({
  data,
  context,
  comment,
  onChange,
  onCommentChange,
  onBack,
  onSubmit,
  submitError = '',
  isSubmitting = false,
}) {
  const set = (key, value) => onChange({ ...data, [key]: value })
  const canSubmit = Boolean(data.weiterempfehlung && !isSubmitting)
  const showDiskriminierungFollowUp = data.diskriminierung === 'Ja' || data.diskriminierung === 'Unsicher'

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>SCHRITT 4 VON 4 /// ABSCHLUSS</span>
        <span className="text-canvas/60">ANONYM</span>
      </div>
      <FormSummary {...context} />

      <div className="px-4 pt-4">
        <div className="form-section-title">FAMILIE &amp; UMGANG</div>
      </div>
      <div className="form-step-grid pt-0">
        <ChoiceGroup
          label="Umgang mit Schwangerschaft"
          value={data.schwangerschaft}
          options={['Sofortiges Arbeitsverbot', 'Individuelle Lösung', 'Normal weiterarbeiten']}
          onChange={value => set('schwangerschaft', value)}
        />
        <ChoiceGroup
          label="Familienfreundlichkeit / Elternzeit"
          value={data.schwangerschaftFamilienfreundlich}
          options={[{ value: true, label: 'Familienfreundlich' }, { value: false, label: 'Problematisch' }]}
          onChange={value => set('schwangerschaftFamilienfreundlich', value)}
        />
      </div>

      <div className="px-4 pt-2">
        <div className="form-section-title">RESPEKT &amp; SICHERHEIT</div>
      </div>
      <div className="form-step-grid pt-3">
        <ChoiceGroup
          label="Diskriminierung erlebt"
          hint="Ohne Details, nur dein Eindruck."
          value={data.diskriminierung}
          options={['Nein', 'Unsicher', 'Ja']}
          onChange={(value) => onChange({
            ...data,
            diskriminierung: value,
            diskriminierungAnsprechperson: value === 'Nein' ? null : data.diskriminierungAnsprechperson,
            diskriminierungKlaerung: value === 'Nein' ? null : data.diskriminierungKlaerung,
          })}
        />
        {showDiskriminierungFollowUp && (
          <ChoiceGroup
            label="Gab es eine sichere, erreichbare Ansprechperson oder Meldestelle?"
            hint="Nur wenn du das einschätzen kannst."
            value={data.diskriminierungAnsprechperson}
            options={['Ja', 'Unsicher', 'Nein']}
            onChange={value => set('diskriminierungAnsprechperson', value)}
          />
        )}
        {showDiskriminierungFollowUp && (
          <ChoiceGroup
            label="Wurden Vorfälle ernst genommen und Schritte zur Klärung eingeleitet?"
            hint="Es geht um den Eindruck, ob etwas passiert ist, nicht um Details."
            value={data.diskriminierungKlaerung}
            options={['Ja', 'Teilweise', 'Nein']}
            onChange={value => set('diskriminierungKlaerung', value)}
          />
        )}
      </div>

      <div className="px-4 pt-2">
        <div className="form-section-title">PRAKTISCHES</div>
      </div>
      <div className="form-step-grid pt-3">
        <ChoiceGroup
          label="Parkplatz vorhanden"
          value={data.parkplatz}
          options={[{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }]}
          onChange={value => set('parkplatz', value)}
        />
        <FormCard title="Benefits" hint="Zum Beispiel Jobticket, Kantine oder Kinderbetreuung." className="sm:col-span-2">
          <input
            className="input-brutalist"
            value={data.benefits ?? ''}
            maxLength={500}
            placeholder="Benefits kurz beschreiben …"
            onChange={event => set('benefits', event.target.value)}
          />
        </FormCard>
      </div>

      <div className="px-4 pt-2">
        <div className="form-section-title">EMPFEHLUNG &amp; KOMMENTAR</div>
      </div>
      <div className="form-step-grid pt-3">
        <ChoiceGroup
          label="Würdest du diese Abteilung für die Weiterbildung empfehlen?"
          value={data.weiterempfehlung}
          options={RECOMMENDATIONS}
          onChange={value => set('weiterempfehlung', value)}
          optional={false}
          className="sm:col-span-2"
        />

        <FormCard title="Kommentar" hint="Keine Namen, Patientendaten oder identifizierbaren Einzelfälle nennen." className="sm:col-span-2">
          <textarea
            rows={4}
            className="input-brutalist resize-y"
            placeholder="Was sollten andere Assistenzärzt*innen wissen?"
            value={comment}
            maxLength={2000}
            onChange={event => onCommentChange(event.target.value)}
          />
        </FormCard>

      </div>

      {submitError && (
        <div className="border-t border-ink bg-hazard text-white px-4 py-3 font-mono text-[11.5px] uppercase tracking-wider">
          {submitError}
        </div>
      )}

      <div className="form-nav">
        <button type="button" onClick={onBack} disabled={isSubmitting} className="btn-ghost-ink disabled:opacity-50">
          &lt;&lt;&lt; ZURÜCK
        </button>
        <button type="button" onClick={onSubmit} disabled={!canSubmit} className="btn-hazard disabled:opacity-30">
          {isSubmitting ? 'WIRD GESPEICHERT ...' : 'ANONYM VERÖFFENTLICHEN >>>'}
        </button>
      </div>
    </div>
  )
}
