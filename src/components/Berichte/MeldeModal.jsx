import { useState } from 'react'

export default function MeldeModal({ rating, onClose }) {
  const [begruendung, setBegruendung] = useState('')
  const [kontakt, setKontakt]         = useState('')
  const [typ, setTyp]                 = useState('falsch')
  const [status, setStatus]           = useState('idle') // idle | sending | success | error

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
        body:    JSON.stringify({ rating, typ, begruendung, kontakt }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
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
            <div className="mono-label mb-1">BEGRÜNDUNG *</div>
            <textarea
              rows={4}
              className="input-brutalist resize-y text-xs w-full"
              placeholder="Bitte beschreiben Sie konkret, welche Aussage unzutreffend oder problematisch ist…"
              value={begruendung}
              onChange={e => setBegruendung(e.target.value)}
            />
          </div>

          {/* Kontakt */}
          <div>
            <div className="mono-label mb-1">IHR KONTAKT (OPTIONAL)</div>
            <input
              className="input-brutalist text-xs w-full"
              placeholder="E-Mail oder Telefon für Rückfragen…"
              value={kontakt}
              onChange={e => setKontakt(e.target.value)}
            />
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
            className="btn-hazard disabled:opacity-30"
          >
            {status === 'sending' ? '...' : 'MELDEN >>>'}
          </button>
        </div>
      </div>
    </div>
  )
}
