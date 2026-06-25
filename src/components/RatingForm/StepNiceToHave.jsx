import TurnstileWidget from '../TurnstileWidget.jsx'

const RECOMMENDATIONS = ['Ja', 'Mit Einschränkungen', 'Nein']

export default function StepNiceToHave({
  data,
  comment,
  onChange,
  onCommentChange,
  onBack,
  onSubmit,
  submitError = '',
  isSubmitting = false,
  turnstileToken = '',
  onTurnstileTokenChange,
  turnstileResetKey = 0,
}) {
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const canSubmit = Boolean(data.weiterempfehlung && turnstileToken && !isSubmitting)

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 3 VON 3 /// VERÖFFENTLICHEN
      </div>

      <div className="p-4 space-y-4">
        <fieldset className="bg-canvas-alt rounded p-4">
          <legend className="mono-label-red mb-2">
            WÜRDEST DU DIESE ABTEILUNG FÜR DIE WEITERBILDUNG EMPFEHLEN?
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            {RECOMMENDATIONS.map(option => (
              <button
                type="button"
                key={option}
                onClick={() => onChange({ ...data, weiterempfehlung: option })}
                className={data.weiterempfehlung === option ? 'tab-active min-h-11' : 'tab-inactive min-h-11'}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="bg-canvas-alt rounded p-4">
          <label className="mono-label block mb-2">KOMMENTAR · OPTIONAL</label>
          <textarea
            rows={4}
            className="input-brutalist resize-y w-full"
            placeholder="Was sollten andere Assistenzärzt*innen wissen?"
            value={comment}
            maxLength={2000}
            onChange={event => onCommentChange(event.target.value)}
          />
          <div className="mt-2 text-xs text-ink/60">
            Bitte keine Namen, Patientendaten oder identifizierbaren Einzelfälle nennen.
          </div>
        </div>

        <div className="bg-canvas-alt rounded p-4">
          <div className="mono-label mb-2">BOT-SCHUTZ</div>
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            onTokenChange={onTurnstileTokenChange}
            resetKey={turnstileResetKey}
          />
        </div>

        <div className="text-xs text-ink/65">
          Deine Bewertung wird anonym veröffentlicht. Eine Anmeldung oder E-Mail-Adresse ist nicht erforderlich.
        </div>
      </div>

      {submitError && (
        <div className="border-t border-ink bg-hazard text-white px-4 py-3 font-mono text-[11.5px] uppercase tracking-wider">
          {submitError}
        </div>
      )}

      <div className="flex border-t border-ink">
        <button type="button" onClick={onBack} disabled={isSubmitting} className="btn-ghost-ink border-r border-ink disabled:opacity-50">
          &lt;&lt;&lt; ZURÜCK
        </button>
        <button type="button" onClick={onSubmit} disabled={!canSubmit} className="btn-hazard disabled:opacity-30">
          {isSubmitting ? 'WIRD GESPEICHERT ...' : 'ANONYM VERÖFFENTLICHEN >>>'}
        </button>
      </div>
    </div>
  )
}
