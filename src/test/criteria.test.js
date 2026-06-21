import { describe, it, expect } from 'vitest'
import {
  ALL_CRITERIA_KEYS,
  CRITERIA_ESSENTIAL,
  CRITERIA_MEDICAL,
  CRITERIA_NICE,
  REGIONS,
  SPECIALTIES,
} from '../data/criteria.js'

describe('criteria', () => {
  it('essential criteria has current v2 keys', () => {
    const keys = CRITERIA_ESSENTIAL.map(c => c.key)
    expect(keys).toContain('arbeitszeitenVon')
    expect(keys).toContain('diensteProMonat')
    expect(keys).toContain('schichtsystem')
    expect(keys).not.toContain('dienstsystem')
  })

  it('medical criteria includes the scoring-critical fields', () => {
    const keys = CRITERIA_MEDICAL.map(c => c.key)
    expect(keys).toContain('wbeJahre')
    expect(keys).toContain('logbuchErfuellbarkeit')
    expect(keys).toContain('supervisionQualitaet')
    expect(keys).toContain('nachtdienstBegleitung')
    expect(keys).toContain('dokumentationsaufwand')
  })

  it('nice criteria has correct keys', () => {
    const keys = CRITERIA_NICE.map(c => c.key)
    expect(keys).toContain('workLifeBalance')
    expect(keys).toContain('teamAtmosphaere')
    expect(keys).toContain('parkplatz')
  })

  it('ALL_CRITERIA_KEYS contains every criterion exactly once', () => {
    const expected = [
      ...CRITERIA_ESSENTIAL.map(c => c.key),
      ...CRITERIA_MEDICAL.map(c => c.key),
      ...CRITERIA_NICE.map(c => c.key),
    ]
    expect(ALL_CRITERIA_KEYS).toEqual(expected)
    expect(ALL_CRITERIA_KEYS).toHaveLength(30)
    expect(new Set(ALL_CRITERIA_KEYS).size).toBe(30)
  })

  it('specialties and regions are populated', () => {
    expect(SPECIALTIES.length).toBeGreaterThan(0)
    expect(REGIONS.DE.length).toBeGreaterThan(0)
    expect(REGIONS.AT.length).toBeGreaterThan(0)
    expect(REGIONS.CH.length).toBeGreaterThan(0)
  })
})
