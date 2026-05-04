import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Fetch all ratings from Supabase
 * @returns {Promise<Array>} Array of rating objects
 */
export async function fetchAllRatings() {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch ratings:', error)
    return []
  }
  return data || []
}

/**
 * Insert a new rating into Supabase
 * @param {Object} rating - Rating object (all fields required)
 * @returns {Promise<Object|null>} Inserted rating or null on error
 */
export async function insertRating(rating) {
  const { data, error } = await supabase
    .from('ratings')
    .insert([rating])
    .select()

  if (error) {
    console.error('Failed to insert rating:', error)
    return null
  }
  return data?.[0] || null
}
