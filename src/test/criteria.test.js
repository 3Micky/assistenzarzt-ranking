import { describe, it, expect } from 'vitest'
import { CRITERIA_ESSENTIAL, CRITERIA_NICE, ALL_CRITERIA_KEYS, SPECIALTIES, REGIONS } from '../data/criteria.js'

describe('criteria', () => {
  it('essential criteria has correct keys', () => {
    const keys = CRITERIA_ESSENTIAL.map(c => c.key)
    expect(keys).toContain('arbeitszeitenVon')
    expect(keys).toContain('diensteProMonat')
    expect(keys).toContain('dienstsystem')
    expect(keys).toContain('fortbildungFreistellung')
  })

  it('nice criteria has correct keys', () => {
    const keys = CRITERIA_NICE.map(c => c.key)
    expect(keys).toContain('workLifeBalance')
    expect(keys).toContain('teamAtmosphaere')
    expect(keys).toContain('parkplatz')
  })

  it('ALL_CRITERIA_KEYS contains all keys', () => {
    expect(ALL_CRITERIA_KEYS.length).toBe(CRITERIA_ESSENTIAL.length + CRITERIA_NICE.length)
  })

  it('REGIONS has DE AT CH', () => {
    expect(REGIONS.DE.length).toBeGreaterThan(0)
    expect(REGIONS.AT.length).toBeGreaterThan(0)
    expect(REGIONS.CH.length).toBeGreaterThan(0)
  })
})
