import { describe, it, expect } from 'vitest'
import { overallScore, scoreColor, scoreLabel, avgByHospital, computeStats } from '../utils/calculations.js'

const mockRating = (overrides = {}) => ({
  id: 'r1', hospital: 'Test Klinik', city: 'Berlin', country: 'DE',
  criteria: {
    workLifeBalance: 8, teamAtmosphaere: 7,
    ueberstundenAufschreiben: true, fortbildungFreistellung: true,
    fortbildungBezahlt: true, diensteProMonat: 4,
    ...overrides,
  },
})

describe('overallScore', () => {
  it('returns number between 1 and 10', () => {
    const score = overallScore(mockRating().criteria)
    expect(score).toBeGreaterThanOrEqual(1)
    expect(score).toBeLessThanOrEqual(10)
  })

  it('high wlb + team = high score', () => {
    const score = overallScore({ workLifeBalance: 10, teamAtmosphaere: 10,
      ueberstundenAufschreiben: true, fortbildungFreistellung: true,
      fortbildungBezahlt: true, diensteProMonat: 0 })
    expect(score).toBeGreaterThan(8)
  })

  it('low wlb + many dienste = low score', () => {
    const score = overallScore({ workLifeBalance: 1, teamAtmosphaere: 1,
      ueberstundenAufschreiben: false, fortbildungFreistellung: false,
      fortbildungBezahlt: false, diensteProMonat: 15 })
    expect(score).toBeLessThan(4)
  })
})

describe('scoreColor', () => {
  it('returns green for high score', () => expect(scoreColor(8)).toBe('#22C55E'))
  it('returns amber for mid score', () => expect(scoreColor(6)).toBe('#F59E0B'))
  it('returns red for low score',  () => expect(scoreColor(3)).toBe('#EF4444'))
})

describe('computeStats', () => {
  it('returns zeros for empty array', () => {
    const s = computeStats([])
    expect(s.total).toBe(0)
    expect(s.avgScore).toBe(0)
  })

  it('counts by country', () => {
    const ratings = [
      { ...mockRating(), country: 'DE' },
      { ...mockRating(), country: 'AT' },
      { ...mockRating(), country: 'CH' },
    ]
    const s = computeStats(ratings)
    expect(s.countDE).toBe(1)
    expect(s.countAT).toBe(1)
    expect(s.countCH).toBe(1)
  })
})
