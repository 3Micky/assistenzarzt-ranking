import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMPFAENGER = process.env.MELDE_EMPFAENGER || 'hbartels22@gmail.com'

const TYP_LABELS = {
  falsch:     'Unwahre Tatsachenbehauptung',
  gegendarst: 'Gegendarstellung (als betroffene Klinik)',
  sonstig:    'Sonstiger Verstoß gegen Nutzungsbedingungen',
}

export default async function handler(req, res) {
  // CORS für lokale Entwicklung
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' })
  }

  const { rating, typ, begruendung, kontakt } = req.body ?? {}

  // Validierung
  if (!rating?.hospital || !typ || !begruendung || begruendung.trim().length < 20) {
    return res.status(400).json({ error: 'Ungültige Eingabe' })
  }

  const typLabel = TYP_LABELS[typ] ?? typ
  const datum    = rating.timestamp
    ? new Date(rating.timestamp).toLocaleDateString('de-DE')
    : '—'

  const htmlBody = `
    <div style="font-family: monospace; font-size: 13px; color: #050505; max-width: 600px;">
      <h2 style="font-size: 16px; border-bottom: 2px solid #E61919; padding-bottom: 8px;">
        MELDUNG: ${typLabel}
      </h2>

      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding:4px 8px; background:#f4f4f0; font-weight:bold; width:180px;">Klinik</td>
            <td style="padding:4px 8px;">${rating.hospital}</td></tr>
        <tr><td style="padding:4px 8px; font-weight:bold;">Stadt / Land</td>
            <td style="padding:4px 8px;">${rating.city ?? '—'} · ${rating.country ?? '—'}</td></tr>
        <tr><td style="padding:4px 8px; background:#f4f4f0; font-weight:bold;">Bewertungs-ID</td>
            <td style="padding:4px 8px;">${rating.id ?? '—'}</td></tr>
        <tr><td style="padding:4px 8px; font-weight:bold;">Datum</td>
            <td style="padding:4px 8px;">${datum}</td></tr>
        <tr><td style="padding:4px 8px; background:#f4f4f0; font-weight:bold;">Meldetyp</td>
            <td style="padding:4px 8px; color:#E61919; font-weight:bold;">${typLabel}</td></tr>
      </table>

      <h3 style="margin-top: 20px; font-size: 13px;">Begründung</h3>
      <div style="background:#f4f4f0; padding: 12px; white-space: pre-wrap;">${begruendung}</div>

      <p style="margin-top: 16px; color: #666;">
        <strong>Kontakt (optional):</strong> ${kontakt || '—'}
      </p>

      <hr style="margin-top: 24px; border: none; border-top: 1px solid #ccc;" />
      <p style="color: #999; font-size: 11px;">AssistenzDoc Ranking · Automatische Meldungsbenachrichtigung</p>
    </div>
  `

  try {
    const { error } = await resend.emails.send({
      from:    'AssistenzDoc Meldung <onboarding@resend.dev>',
      to:      EMPFAENGER,
      subject: `[MELDUNG] ${typLabel}: ${rating.hospital}`,
      html:    htmlBody,
      replyTo: kontakt || undefined,
    })

    if (error) {
      console.error('Resend-Fehler:', error)
      return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unerwarteter Fehler:', err)
    return res.status(500).json({ error: 'Serverfehler' })
  }
}
