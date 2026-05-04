import { create } from 'zustand'
import { fetchAllRatings, insertRating } from '../hooks/useSupabase.js'

export const useRatingsStore = create((set, get) => ({
  ratings: [],
  isLoading: false,

  /** Fetch all ratings from Supabase on app start */
  async hydrate() {
    set({ isLoading: true })
    try {
      const ratings = await fetchAllRatings()
      set({ ratings })
    } catch (error) {
      console.error('Hydration failed:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  /** Add a new rating to Supabase */
  async addRating(rating) {
    const result = await insertRating(rating)
    if (result) {
      set((state) => ({ ratings: [result, ...state.ratings] }))
      return result
    }
    return null
  },

  /** Clear local state (not used in normal flow) */
  clearAll() {
    set({ ratings: [] })
  },
}))
