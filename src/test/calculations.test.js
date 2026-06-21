import { describe, it, expect } from 'vitest'
import {
  MIN_OFFICIAL_RATINGS,
  SCORE_BANDS,
  SCORE_DIMENSIONS,
  avgByHospital,
  computeStats,
  dimensionScores,
  isProceduralSpecialty,
  normalizeCriteria,
  operativeTrainingScore,
  overallScore,
  ratingValidity,
  scoreColor,
  scoreLabel,
} from '../utils/calculations.js'

const goodCriteria = (overrides = {}) => ({
  wbeJahre: 6,
  logbuchErfuellbarkeit: 9,
  supervisionQualitaet: 9,
  autonomie: 8,
  diensteProMonat: 2,
  schichtsystem: '2-Schicht',
  ueberstundenAufschreiben: true,
  workLifeBalance: 9,
  urlaubsgenehmigung: 9,
  rotationsplaene: true,
  fortbildungFreistellung: true,
  fortbildungBezahlt: true,
  mitarbeitergespraeche: 2,
  teamAtmosphaere: 9,
  schwangerschaftFamilienfreundlich: true,
  nachtdienstBegleitung: 9,
  parkplatz: true,
  dokumentationsaufwand: 9,
  ...overrides,
})

const poorCriteria = (overrides = {}) => goodCriteria({
  wbeJahre: 0,
  logbuchErfuellbarkeit: 1,
  supervisionQualitaet: 1,
  autonomie: 1,
  diensteProMonat: 15,
  schichtsystem: '24h-Dienste',
  ueberstundenAufschreiben: false,
  workLifeBalance: 1,
  urlaubsgenehmigung: 1,
  rotationsplaene: false,
  fortbildungFreistellung: false,
  fortbildungBezahlt: false,
  mitarbeitergespraeche: 0,
  teamAtmosphaere: 1,
  schwangerschaftFamilienfreundlich: false,
  nachtdienstBegleitung: 1,
  parkplatz: false,
  dokumentationsaufwand: 1,
  ...overrides,
})

const mockRating = (overrides = {}) => ({
  id: 'r1',
  hospital: 'Test Klinik',
  city: 'Berlin',
  country: 'DE',
  criteria: goodCriteria(),
  ...overrides,
})

describe('normalization', () => {
  it('maps legacy and v2 service fields to identical canonical criteria', () => {
    expect(normalizeCriteria({ dienstsystem: '24h', nachtdienstBegleitung: true }))
      .toEqual(normalizeCriteria({ schichtsystem: '24h-Dienste', nachtdienstBegleitung: 10 }))

    expect(normalizeCriteria({ dienstsystem: '12h', nachtdienstBegleitung: false }))
      .toEqual(normalizeCriteria({ schichtsystem: '2-Schicht', nachtdienstBegleitung: 1 }))
  })

  it('uses canonical v2 fields and removes legacy dienstsystem from the normalized shape', () => {
    const normalized = normalizeCriteria({ dienstsystem: '12h', nachtdienstBegleitung: true })
    expect(normalized.schemaVersion).toBe(2)
    expect(normalized.schichtsystem).toBe('2-Schicht')
    expect(normalized.nachtdienstBegleitung).toBe(10)
    expect(normalized).not.toHaveProperty('dienstsystem')
  })
})

describe('overallScore', () => {
  it('returns a clamped number between 0 and 10', () => {
    const cases = [
      {},
      goodCriteria(),
      poorCriteria(),
      goodCriteria({ wbeJahre: 999, diensteProMonat: -20, nachtdienstBegleitung: 99 }),
      poorCriteria({ wbeJahre: -999, diensteProMonat: 999, dokumentationsaufwand: -10 }),
    ]

    cases.forEach((criteria) => {
      const score = overallScore(criteria)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(10)
    })
  })

  it('does not turn missing answers into an artificial mid-value', () => {
    expect(ratingValidity({}).isValid).toBe(false)
    expect(overallScore({})).toBe(0)
    expect(dimensionScores({})).toEqual({
      weiterbildung: null,
      workLife: null,
      struktur: null,
      teamkultur: null,
      infrastruktur: null,
    })
  })

  it('recalibrates one employee review per year to a usable score', () => {
    const onePerYear = overallScore(goodCriteria({ mitarbeitergespraeche: 1 }))
    const none = overallScore(goodCriteria({ mitarbeitergespraeche: 0 }))
    expect(onePerYear).toBeGreaterThan(none)
    expect(onePerYear).toBeGreaterThanOrEqual(8)
  })

  it('recalibrates WBE years against a normal required Weiterbildung duration', () => {
    const fiveYears = overallScore(goodCriteria({ wbeJahre: 5 }))
    const oneYear = overallScore(goodCriteria({ wbeJahre: 1 }))
    expect(fiveYears).toBeGreaterThan(oneYear)
    expect(fiveYears).toBeGreaterThan(8)
  })

  it('lets schichtsystem and numeric nachtdienstBegleitung affect the score', () => {
    expect(overallScore(goodCriteria({ schichtsystem: '2-Schicht' })))
      .toBeGreaterThan(overallScore(goodCriteria({ schichtsystem: '24h-Dienste' })))
    expect(overallScore(goodCriteria({ nachtdienstBegleitung: 10 })))
      .toBeGreaterThan(overallScore(goodCriteria({ nachtdienstBegleitung: 1 })))
  })
})

describe('score properties', () => {
  it('keeps every dimension extractor in the 0-10 range', () => {
    SCORE_DIMENSIONS.forEach(({ extract }) => {
      const score = extract(goodCriteria({ wbeJahre: 99, dokumentationsaufwand: 99 }))
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(10)
    })
  })

  it('better inputs never lower the score', () => {
    const cases = [
      ['wbeJahre', 1, 6],
      ['logbuchErfuellbarkeit', 2, 9],
      ['supervisionQualitaet', 2, 9],
      ['autonomie', 2, 9],
      ['diensteProMonat', 12, 1],
      ['schichtsystem', '24h-Dienste', '2-Schicht'],
      ['ueberstundenAufschreiben', false, true],
      ['workLifeBalance', 2, 9],
      ['urlaubsgenehmigung', 2, 9],
      ['rotationsplaene', false, true],
      ['fortbildungFreistellung', false, true],
      ['fortbildungBezahlt', false, true],
      ['mitarbeitergespraeche', 0, 4],
      ['teamAtmosphaere', 2, 9],
      ['schwangerschaftFamilienfreundlich', false, true],
      ['nachtdienstBegleitung', 1, 10],
      ['parkplatz', false, true],
      ['dokumentationsaufwand', 2, 9],
    ]

    cases.forEach(([key, worse, better]) => {
      const worseScore = overallScore(goodCriteria({ [key]: worse }))
      const betterScore = overallScore(goodCriteria({ [key]: better }))
      expect(betterScore, key).toBeGreaterThanOrEqual(worseScore)
    })
  })
})

describe('score bands', () => {
  it('uses the same thresholds for color and label', () => {
    SCORE_BANDS.forEach((band) => {
      expect(scoreColor(band.min)).toBe(band.color)
      expect(scoreLabel(band.min)).toBe(band.label)
    })
  })

  it('matches the documented 7.0 green/Gut boundary', () => {
    expect(scoreColor(7)).toBe('#22C55E')
    expect(scoreLabel(7)).toBe('Gut')
  })
})

describe('avgByHospital', () => {
  it('requires enough ratings for official placement and always exposes counts', () => {
    const ratings = [
      mockRating({ id: 'a1', hospital: 'Alpha Klinik', criteria: goodCriteria() }),
      mockRating({ id: 'b1', hospital: 'Beta Klinik', criteria: goodCriteria({ workLifeBalance: 7 }) }),
      mockRating({ id: 'b2', hospital: 'Beta Klinikum', criteria: goodCriteria({ workLifeBalance: 7 }) }),
      mockRating({ id: 'b3', hospital: 'Beta Klinik', criteria: goodCriteria({ workLifeBalance: 7 }) }),
    ]
    const ranked = avgByHospital(ratings)
    const alpha = ranked.find(r => r.hospital === 'Alpha Klinik')
    const beta = ranked.find(r => r.hospital === 'Beta Klinik')

    expect(alpha.count).toBe(1)
    expect(alpha.isOfficial).toBe(false)
    expect(alpha.rank).toBeNull()
    expect(beta.count).toBeGreaterThanOrEqual(MIN_OFFICIAL_RATINGS)
    expect(beta.isOfficial).toBe(true)
    expect(beta.rank).toBe(1)
  })
})

describe('computeStats', () => {
  it('returns zeros for empty array', () => {
    const stats = computeStats([])
    expect(stats.total).toBe(0)
    expect(stats.avgScore).toBe(0)
  })

  it('counts by country', () => {
    const ratings = [
      mockRating({ country: 'DE' }),
      mockRating({ country: 'AT' }),
      mockRating({ country: 'CH' }),
    ]
    const stats = computeStats(ratings)
    expect(stats.countDE).toBe(1)
    expect(stats.countAT).toBe(1)
    expect(stats.countCH).toBe(1)
  })
})

describe('operativeTrainingScore', () => {
  const opCriteria = (overrides = {}) => ({
    logbuchErfuellbarkeit: 8,
    autonomie: 8,
    supervisionQualitaet: 8,
    hauptoperateurAnteil: 8,
    ...overrides,
  })

  it('returns null (N/A) for non-procedural specialties', () => {
    expect(operativeTrainingScore(opCriteria(), 'Psychiatrie')).toBeNull()
    expect(operativeTrainingScore(opCriteria(), 'Allgemeinmedizin')).toBeNull()
    expect(isProceduralSpecialty('Chirurgie (Viszeral)')).toBe(true)
    expect(isProceduralSpecialty('Psychiatrie')).toBe(false)
  })

  it('returns a score in [0,10] for procedural specialties', () => {
    const score = operativeTrainingScore(opCriteria(), 'Chirurgie (Viszeral)')
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(10)
  })

  it('returns null when too few op-relevant fields are answered', () => {
    expect(operativeTrainingScore({ autonomie: 8 }, 'Orthopädie')).toBeNull()
  })

  it('penalizes the service-job trap (high volume, low own operating)', () => {
    const serviceJob = operativeTrainingScore(
      opCriteria({ hauptoperateurAnteil: 1, autonomie: 3 }),
      'Chirurgie (Viszeral)'
    )
    const realTraining = operativeTrainingScore(
      opCriteria({ hauptoperateurAnteil: 9, autonomie: 9 }),
      'Chirurgie (Viszeral)'
    )
    expect(serviceJob).toBeLessThan(realTraining)
    expect(serviceJob).toBeLessThanOrEqual(5)
  })
})
