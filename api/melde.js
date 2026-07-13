import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { applyCors, getRequestBodySize } from './_lib/security.js'
import { MAX_BODY_BYTES, validateReportPayload } from './_lib/validateRating.js'

const EMPFAENGER = process.env.MELDE_EMPFAENGER || 'hbartels22@gmail.com'
const TYP_LABELS = {
  falsch: 'Unwahre Tatsachenbehauptung',
  gegendarst: 'Gegendarstellung (als betroffene Klinik)',
  sonstig: 'Sonstiger Verstoß gegen Nutzungsbedingungen',
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function subjectText(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim()
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) {
    return res.status(403).json({ error: 'Origin nicht erlaubt' })
  }
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' })

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Serverkonfiguration für Supabase fehlt' })
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Serverkonfiguration für E-Mail-Versand fehlt' })
  }

  if (getRequestBodySize(req) > MAX_BODY_BYTES) {
    return res.status(400).json({ error: 'Anfrage ist größer als 20 KB' })
  }

  const { turnstileToken: _t, antiBot: _a, ...reportPayload } = req.body ?? {}
  const validation = validateReportPayload(reportPayload)
  if (!validation.valid) {
    return res.status(400).json({ error: 'Ungültige Eingabe', details: validation.errors })
  }

  const { ratingId, typ, begruendung, kontakt } = validation.data
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data: rating, error: ratingError } = await supabase
    .from('ratings')
    .select('id, hospital, city, country, created_at')
    .eq('id', ratingId)
    .single()

  if (ratingError || !rating) {
    return res.status(400).json({ error: 'Bewertung wurde nicht gefunden' })
  }

  const typLabel = TYP_LABELS[typ]
  const datum = rating.created_at
    ? new Date(rating.created_at).toLocaleDateString('de-DE')
    : '—'

  const htmlBody = `
    <div style="font-family: monospace; font-size: 13px; color: #050505; max-width: 600px;">
      <h2 style="font-size: 16px; border-bottom: 2px solid #E61919; padding-bottom: 8px;">
        MELDUNG: ${escapeHtml(typLabel)}
      </h2>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding:4px 8px; background:#f4f4f0; font-weight:bold; width:180px;">Klinik</td>
            <td style="padding:4px 8px;">${escapeHtml(rating.hospital)}</td></tr>
        <tr><td style="padding:4px 8px; font-weight:bold;">Stadt / Land</td>
            <td style="padding:4px 8px;">${escapeHtml(rating.city || '—')} · ${escapeHtml(rating.country || '—')}</td></tr>
        <tr><td style="padding:4px 8px; background:#f4f4f0; font-weight:bold;">Bewertungs-ID</td>
            <td style="padding:4px 8px;">${escapeHtml(rating.id)}</td></tr>
        <tr><td style="padding:4px 8px; font-weight:bold;">Datum</td>
            <td style="padding:4px 8px;">${escapeHtml(datum)}</td></tr>
        <tr><td style="padding:4px 8px; background:#f4f4f0; font-weight:bold;">Meldetyp</td>
            <td style="padding:4px 8px; color:#E61919; font-weight:bold;">${escapeHtml(typLabel)}</td></tr>
      </table>
      <h3 style="margin-top: 20px; font-size: 13px;">Begründung</h3>
      <div style="background:#f4f4f0; padding: 12px; white-space: pre-wrap;">${escapeHtml(begruendung)}</div>
      <p style="margin-top: 16px; color: #666;">
        <strong>Kontakt (optional):</strong> ${escapeHtml(kontakt || '—')}
      </p>
      <hr style="margin-top: 24px; border: none; border-top: 1px solid #ccc;" />
      <p style="color: #999; font-size: 11px;">AssistenzDoc Ranking · Automatische Meldungsbenachrichtigung</p>
    </div>
  `

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'AssistenzDoc Meldung <meldung@assistenz-ranking.de>',
      to: EMPFAENGER,
      subject: `[MELDUNG] ${typLabel}: ${subjectText(rating.hospital)}`,
      html: htmlBody,
      replyTo: kontakt || undefined,
    })

    if (error) {
      console.error('Resend-Fehler:', error)
      return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' })
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Unerwarteter Melde-Fehler:', error)
    return res.status(500).json({ error: 'Serverfehler' })
  }
}
