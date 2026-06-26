import { useState } from 'react'
import TurnstileWidget from '../TurnstileWidget.jsx'

export default function MeldeModal({ rating, onClose }) {
  const [begruendung, setBegruendung] = useState('')
  const [kontakt, setKontakt]         = useState('')
  const [typ, setTyp]                 = useState('falsch')
  const [status, setStatus]           = useState('idle') // idle | sending | success | error
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileStatus, setTurnstileStatus] = useState('idle')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  const typLabels = {
    falsch:     'Unwahre Tatsachenbehauptung',
    gegendarst: 'Gegendarstellung (als betroffene Klinik)',
    sonstig:    'Sonstiger Verstoß gegen Nutzungsbedingungen',
  }

  async function handleAbsenden() {
    if (begruendung.trim().length < 20) return
    setStatus('sending')

    try {
      const res = await fetch('/api/melde', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ratingId: rating.id,
          typ,
          begruendung,
          kontakt,
          turnstileToken,
          antiBot: {
            website: '',
            formRuntimeMs: Date.now() - startedAt,
            turnstileBypassReason: turnstileToken
              ? null
              : turnstileStatus === 'missing-config'
                ? 'missing-config'
                : turnstileStatus === 'error'
                  ? 'widget_load_error'
                  : null,
          },
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setTurnstileToken('')
        setTurnstileStatus('idle')
        setTurnstileResetKey(key => key + 1)
      }
    } catch {
      setStatus('error')
      setTurnstileToken('')
      setTurnstileStatus('idle')
      setTurnstileResetKey(key => key + 1)
    }
  }

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
        <div className="border border-ink bg-canvas max-w-md w-full mx-4">
          <div className="register-strip border-b border-ink flex justify-between items-center">
            <span>/// MELDUNG GESENDET</span>
            <button onClick={onClose} className="mono-label hover:text-hazard px-2">✕</button>
          </div>
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">✓</div>
            <p className="font-mono text-sm text-ink">Ihre Meldung wurde erfolgreich übermittelt.</p>
            <p className="font-mono text-[11.5px] text-ink/60 mt-2">Wir prüfen Ihren Hinweis innerhalb von 14 Tagen.</p>
          </div>
          <div className="flex border-t border-ink">
            <button onClick={onClose} className="btn-hazard w-full">SCHLIESSEN</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
      <div className="border border-ink bg-canvas max-w-md w-full mx-4">
        {/* Header */}
        <div className="register-strip border-b border-ink flex justify-between items-center">
          <span>/// INHALT MELDEN</span>
          <button onClick={onClose} className="mono-label hover:text-hazard px-2">✕</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Klinik-Info */}
          <div className="px-3 py-2 bg-canvas-alt border border-ink/20 font-mono text-[11.5px] uppercase tracking-widest text-ink/80">
            {rating.hospital}{rating.city ? ` · ${rating.city}` : ''}
          </div>

          {/* Meldetyp */}
          <div>
            <div className="mono-label mb-2">MELDETYP</div>
            <div className="flex flex-col gap-1">
              {Object.entries(typLabels).map(([val, label]) => (
                <button key={val} onClick={() => setTyp(val)}
                  className={`text-left px-3 py-2 ${typ === val ? 'tab-active' : 'tab-inactive'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Begründung */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="mono-label">BEGRÜNDUNG *</div>
              <div className={`font-mono text-[10px] tabular-nums ${begruendung.trim().length >= 20 ? 'text-score-high' : 'text-ink/40'}`}>
                {begruendung.trim().length} / 20 min.
              </div>
            </div>
            <textarea
              rows={4}
              className="input-brutalist resize-y text-xs w-full"
              placeholder="Bitte beschreiben Sie konkret, welche Aussage unzutreffend oder problematisch ist…"
              value={begruendung}
              maxLength={2000}
              onChange={e => setBegruendung(e.target.value)}
            />
            {begruendung.trim().length > 0 && begruendung.trim().length < 20 && (
              <div className="font-mono text-[10px] text-ink/50 mt-1">
                Noch {20 - begruendung.trim().length} Zeichen bis die Meldung abgesendet werden kann.
              </div>
            )}
          </div>

          {/* Kontakt */}
          <div>
            <div className="mono-label mb-1">IHR KONTAKT (OPTIONAL)</div>
            <input
              className="input-brutalist text-xs w-full"
              type="email"
              placeholder="E-Mail für Rückfragen…"
              value={kontakt}
              maxLength={254}
              onChange={e => setKontakt(e.target.value)}
            />
          </div>

          <div>
            <div className="mono-label mb-2">BOT-SCHUTZ</div>
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onTokenChange={setTurnstileToken}
              onStatusChange={setTurnstileStatus}
              resetKey={turnstileResetKey}
            />
            <p className="font-mono text-[10px] text-ink/50 mt-2">
              Wenn der Check nicht lädt, kannst du trotzdem absenden. Dann greifen unsere stillen Server-Prüfungen.
            </p>
          </div>

          {status === 'error' && (
            <p className="font-mono text-[11.5px] text-hazard">
              Fehler beim Senden. Bitte versuchen Sie es erneut.
            </p>
          )}

          <p className="font-mono text-[11.5px] text-ink/60 leading-relaxed">
            Wir prüfen Ihren Hinweis innerhalb von 14 Tagen. Gegendarstellungen betroffener Kliniken werden öffentlich als Antwort zur Bewertung angezeigt.
          </p>
        </div>

        {/* Footer */}
        <div className="flex border-t border-ink">
          <button onClick={onClose} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ABBRECHEN</button>
          <button
            onClick={handleAbsenden}
            disabled={begruendung.trim().length < 20 || status === 'sending'}
            title={begruendung.trim().length < 20 ? `Noch ${20 - begruendung.trim().length} Zeichen erforderlich` : ''}
            className="btn-hazard disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? '[ ... ]' : 'MELDEN >>>'}
          </button>
        </div>
      </div>
    </div>
  )
}
