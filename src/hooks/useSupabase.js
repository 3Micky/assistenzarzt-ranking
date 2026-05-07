import { createClient } from '@supabase/supabase-js'
import { SAMPLE_RATINGS } from '../data/sampleData.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null

/**
 * Fetch all ratings from Supabase.
 * Returns empty array if Supabase is not configured.
 * @returns {Promise<Array>}
 */
export async function fetchAllRatings() {
  if (!supabaseConfigured) {
    return SAMPLE_RATINGS
  }
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[useSupabase] fetchAllRatings Fehler:', error.message, error.code, error.details, error.hint)
    return SAMPLE_RATINGS
  }
  // Supabase-Daten mit Sample-Daten mergen (seed-IDs nie mit echten UUIDs doppelt)
  const realData = data || []
  return [...realData, ...SAMPLE_RATINGS]
}

/**
 * Insert a new rating into Supabase.
 * Returns null if Supabase is not configured.
 * @param {Object} rating
 * @returns {Promise<Object|null>}
 */
export async function insertRating(rating) {
  if (!supabaseConfigured) {
    console.warn('[useSupabase] Kein .env.local — Bewertung wurde NICHT gespeichert. Siehe SUPABASE_SETUP.md.')
    return null
  }
  // Strip client-generated fields — Supabase auto-generates id (uuid) and created_at (timestamptz)
  const { id, timestamp, ...payload } = rating
  const { data, error } = await supabase
    .from('ratings')
    .insert([payload])
    .select()

  if (error) {
    console.error('[useSupabase] insertRating Fehler:', error)
    return null
  }
  return data?.[0] || null
}

export { supabaseConfigured }
