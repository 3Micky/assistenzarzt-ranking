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

export { supabaseConfigured }
