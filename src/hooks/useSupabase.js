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
 * Falls back to sample data only in local dev (no .env.local configured).
 * @returns {Promise<Array>}
 */
export async function fetchAllRatings() {
  if (!supabaseConfigured) {
    // Local dev without .env.local — show sample data so UI isn't empty
    return SAMPLE_RATINGS
  }
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[useSupabase] fetchAllRatings Fehler:', error.message, error.code, error.details, error.hint)
    return []
  }
  // Production: only real user ratings, no seed data
  return data || []
}

/**
 * Insert a new rating into Supabase.
 * Returns null if Supabase is not configured.
 * @param {Object} rating
 * @returns {Promise<Object|null>}
 */
export async function insertRating(rating) {
  if (!supabaseConfigured) {
    console.warn('[useSupabase] Kein .env.local — Bewertung wurde NICHT gespeichert.')
    return null
  }
  // Nur bekannte DB-Spalten senden (kein id/timestamp — Supabase generiert diese)
  const payload = {
    hospital:   rating.hospital,
    city:       rating.city       || '',
    country:    rating.country    || 'DE',
    region:     rating.region     || '',
    specialty:  rating.specialty  || '',
    year:       rating.yearFrom   ?? rating.year ?? null,
    yearFrom:   rating.yearFrom   ?? null,
    yearTo:     rating.yearTo != null ? String(rating.yearTo) : null,
    criteria:   rating.criteria,
    comment:    rating.comment    || '',
  }

  const { data, error } = await supabase
    .from('ratings')
    .insert([payload])
    .select()

  if (error) {
    console.error('[useSupabase] insertRating Fehler:', error.message, '|', error.details, '|', error.hint)
    return null
  }
  return data?.[0] || null
}

export { supabaseConfigured }
