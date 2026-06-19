import { create } from 'zustand'
import { fetchAllRatings, insertRating } from '../hooks/useSupabase.js'
import { normalizeRating } from '../utils/calculations.js'

export const useRatingsStore = create((set, get) => ({
  ratings: [],
  isLoading: false,

  /** Fetch all ratings from Supabase on app start */
  async hydrate() {
    set({ isLoading: true })
    try {
      const ratings = await fetchAllRatings()
      set({ ratings: ratings.map(normalizeRating) })
    } catch (error) {
      console.error('Hydration failed:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  /** Add a new rating to Supabase */
  async addRating(rating) {
    const result = await insertRating(normalizeRating(rating))
    if (result) {
      const normalized = normalizeRating(result)
      set((state) => ({ ratings: [normalized, ...state.ratings] }))
      return normalized
    }
    return null
  },

  /** Clear local state (not used in normal flow) */
  clearAll() {
    set({ ratings: [] })
  },
}))
