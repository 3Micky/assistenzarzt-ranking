import { createClient } from '@supabase/supabase-js'
import { applyCors, getRequestBodySize } from './_lib/security.js'
import { MAX_BODY_BYTES, validateRatingPayload } from './_lib/validateRating.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) {
    return res.status(403).json({ error: 'Origin nicht erlaubt' })
  }
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' })

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Serverkonfiguration für Supabase fehlt' })
  }
  const bodySize = getRequestBodySize(req)
  if (bodySize > MAX_BODY_BYTES) {
    return res.status(400).json({ error: 'Anfrage ist größer als 20 KB' })
  }

  const { turnstileToken: _t, antiBot: _a, ...ratingPayload } = req.body ?? {}
  const validation = validateRatingPayload(ratingPayload, {
    rawBodySize: bodySize,
  })
  if (!validation.valid) {
    return res.status(400).json({ error: 'Ungültige Bewertung', details: validation.errors })
  }

  const rating = validation.data
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const payload = {
    id: crypto.randomUUID(),
    hospital: rating.hospital,
    city: rating.city,
    country: rating.country,
    region: rating.region,
    specialty: rating.specialty,
    year: rating.yearFrom,
    yearFrom: rating.yearFrom,
    yearTo: rating.yearTo,
    criteria: rating.criteria,
    comment: rating.comment,
  }

  const { data, error } = await supabase
    .from('ratings')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('Bewertung speichern fehlgeschlagen:', error)
    return res.status(500).json({ error: 'Bewertung konnte nicht gespeichert werden' })
  }

  return res.status(200).json({
    success: true,
    rating: { ...data, timestamp: data.created_at },
  })
}
