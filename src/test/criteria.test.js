import { describe, it, expect } from 'vitest'
import {
  ALL_CRITERIA_KEYS,
  ALLOWED_CRITERIA_KEYS,
  CRITERIA_CONTEXT_V3,
  CRITERIA_CORE_V3,
  CRITERIA_DETAILS_V3,
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
      ...CRITERIA_CORE_V3.map(c => c.key),
      ...CRITERIA_CONTEXT_V3.map(c => c.key),
      ...CRITERIA_DETAILS_V3.map(c => c.key),
    ]
    expect(ALL_CRITERIA_KEYS).toEqual(expected)
    expect(ALL_CRITERIA_KEYS).toHaveLength(49)
    expect(new Set(ALL_CRITERIA_KEYS).size).toBe(49)
    expect(ALLOWED_CRITERIA_KEYS).toContain('schemaVersion')
  })

  it('defines the selected quantitative and qualitative v3 details', () => {
    const keys = CRITERIA_DETAILS_V3.map(criterion => criterion.key)
    expect(keys).toContain('nachtdiensteProMonat')
    expect(keys).toContain('hintergrundErreichbarkeit')
    expect(keys).toContain('fehlerkultur')
    expect(keys).toContain('diskriminierung')
  })

  it('defines exactly six v3 core questions on a five-point scale', () => {
    expect(CRITERIA_CORE_V3).toHaveLength(6)
    CRITERIA_CORE_V3.forEach(criterion => {
      expect(criterion.type).toBe('scale5')
      expect(criterion.min).toBe(1)
      expect(criterion.max).toBe(5)
    })
  })

  it('specialties and regions are populated', () => {
    expect(SPECIALTIES.length).toBeGreaterThan(0)
    expect(REGIONS.DE.length).toBeGreaterThan(0)
    expect(REGIONS.AT.length).toBeGreaterThan(0)
    expect(REGIONS.CH.length).toBeGreaterThan(0)
  })
})
