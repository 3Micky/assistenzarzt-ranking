import { useMemo } from 'react'
import { useRatingsStore } from '../store/ratingsStore.js'
import { avgByHospital, avgByCity, computeStats, radarData } from '../utils/calculations.js'
import { CITIES } from '../data/cities.js'

export function useRatings() {
  const ratings = useRatingsStore((s) => s.ratings)
  const addRating = useRatingsStore((s) => s.addRating)

  const ranked   = useMemo(() => avgByHospital(ratings), [ratings])
  const cityData = useMemo(() => avgByCity(ratings, CITIES), [ratings])
  const stats    = useMemo(() => computeStats(ratings), [ratings])

  const radarChartData = (hospitalNames) => radarData(hospitalNames, ratings)

  const hospitalNames = useMemo(
    () => [...new Set(ratings.map((r) => r.hospital))].sort(),
    [ratings]
  )

  return { ratings, addRating, ranked, cityData, stats, radarChartData, hospitalNames }
}
