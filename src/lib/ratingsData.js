import { createClient } from '@supabase/supabase-js'
import { SAMPLE_RATINGS } from '../data/sampleData.js'
import { normalizeRating } from '../utils/calculations.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function fetchAllRatings() {
  if (!supabaseConfigured) {
    return SAMPLE_RATINGS.map(normalizeRating)
  }

  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[ratingsData] fetchAllRatings Fehler:', error.message, error.code, error.details, error.hint)
    return []
  }

  return (data || []).map(normalizeRating)
}
