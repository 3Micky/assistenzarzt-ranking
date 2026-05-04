import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SAMPLE_RATINGS } from '../data/sampleData.js'

const STORAGE_KEY = 'assistenzarzt-ratings-v1'

export const useRatingsStore = create(
  persist(
    (set, get) => ({
      ratings: [],

      /** Beim App-Start aufrufen; lädt Seed-Daten falls Storage leer */
      hydrate() {
        const stored = get().ratings
        if (stored.length === 0) {
          set({ ratings: SAMPLE_RATINGS })
        }
      },

      addRating(rating) {
        set((state) => ({ ratings: [rating, ...state.ratings] }))
      },

      deleteRating(id) {
        set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) }))
      },

      clearAll() {
        set({ ratings: [] })
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
)
