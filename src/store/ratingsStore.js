import { create } from 'zustand'
import { fetchAllRatings } from '../lib/ratingsData.js'
import { normalizeRating } from '../utils/calculations.js'

export function primeRatingsStore(ratings = []) {
  useRatingsStore.setState({ ratings, isLoading: false })
}

const baseRatingsStore = create((set, get) => ({
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

  /** Add a new rating through the protected server route */
  async addRating(rating) {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rating),
      })
      const result = await response.json()

      if (response.ok && result.rating) {
        const normalized = normalizeRating(result.rating)
        set((state) => ({ ratings: [normalized, ...state.ratings] }))
        return normalized
      }

      console.error('Bewertung speichern fehlgeschlagen:', result.error, result.details)
      return null
    } catch (error) {
      console.error('Bewertung speichern fehlgeschlagen:', error)
      return null
    }
  },

  /** Clear local state (not used in normal flow) */
  clearAll() {
    set({ ratings: [] })
  },
}))

export function useRatingsStore(selector) {
  return baseRatingsStore(selector)
}

useRatingsStore.getState = baseRatingsStore.getState
useRatingsStore.setState = baseRatingsStore.setState
useRatingsStore.subscribe = baseRatingsStore.subscribe
