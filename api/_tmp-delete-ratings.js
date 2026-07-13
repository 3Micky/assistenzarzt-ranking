import { createClient } from '@supabase/supabase-js'

const IDS = [
  '226dc8ff-8fce-4656-a52a-67432b7b373b',
  '6e0d888b-de23-40d3-b69f-fc9a599123a9',
  'f1d6dc70-365f-41a2-90e4-a16e245f1641',
  'c782dcba-1bfa-4803-b78d-bee010bba626',
]

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Nur DELETE erlaubt' })
  if (req.headers['x-admin-token'] !== process.env.DELETE_RATINGS_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Serverkonfiguration für Supabase fehlt' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data, error } = await supabase
    .from('ratings')
    .delete()
    .in('id', IDS)
    .select('id, hospital, created_at')

  if (error) {
    console.error('Temporäre Rating-Löschung fehlgeschlagen:', error)
    return res.status(500).json({ error: 'Löschung fehlgeschlagen' })
  }

  return res.status(200).json({ deleted: data })
}
