import { describe, expect, it } from 'vitest'
import { MAX_BODY_BYTES, validateRatingPayload } from '../../api/_lib/validateRating.js'

function validPayload(overrides = {}) {
  return {
    hospital: 'Testklinikum',
    city: 'Berlin',
    country: 'DE',
    region: 'Berlin',
    specialty: 'Innere Medizin',
    yearFrom: 2024,
    yearTo: 'fortlaufend',
    criteria: {
      arbeitszeitenVon: '07:00',
      diensteProMonat: 4,
      ueberstundenAufschreiben: true,
      workLifeBalance: 7,
      benefits: 'Jobticket',
    },
    comment: 'Sachlicher Erfahrungsbericht.',
    ...overrides,
  }
}

describe('validateRatingPayload', () => {
  it('accepts a valid payload', () => {
    const result = validateRatingPayload(validPayload(), { currentYear: 2026 })
    expect(result.valid).toBe(true)
    expect(result.data.yearTo).toBe('fortlaufend')
  })

  it('rejects unknown criteria keys', () => {
    const result = validateRatingPayload(validPayload({
      criteria: { workLifeBalance: 7, adminOverride: true },
    }))
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('adminOverride')
  })

  it('rejects over-length text', () => {
    const result = validateRatingPayload(validPayload({
      hospital: 'x'.repeat(201),
      comment: 'x'.repeat(2001),
    }))
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('200')
    expect(result.errors.join(' ')).toContain('2000')
  })

  it('rejects invalid country, specialty, and years', () => {
    const result = validateRatingPayload(validPayload({
      country: 'FR',
      specialty: 'Weltraummedizin',
      yearFrom: 1999,
      yearTo: 1998,
    }), { currentYear: 2026 })
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('country')
    expect(result.errors.join(' ')).toContain('specialty')
    expect(result.errors.join(' ')).toContain('yearFrom')
  })

  it('rejects oversized bodies', () => {
    const result = validateRatingPayload(validPayload(), { rawBodySize: MAX_BODY_BYTES + 1 })
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('20 KB')
  })
})
