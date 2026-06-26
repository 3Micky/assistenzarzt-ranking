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
      schemaVersion: 3,
      weiterbildungsjahr: 3,
      weiterbildungsziele: 5,
      supervision: 4,
      selbststaendigkeit: 4,
      arbeitsbelastung: 3,
      teamFuehrung: 5,
      ausbildungsstruktur: 4,
      weiterempfehlung: 'Ja',
      arbeitszeitenVon: '07:30',
      arbeitszeitenBis: '17:00',
      diensteProMonat: 5,
      ueberstundenErfassung: 'Teilweise',
      ueberstundenAusgleich: 'Freizeitausgleich',
      nachtdiensteProMonat: 3,
      abteilungsgroesse: 24,
      hintergrundErreichbarkeit: 4,
      urlaub: 4,
      dokumentation: 2,
      fehlerkultur: 4,
      fuehrungRespekt: 3,
      pflegeZusammenarbeit: 5,
      einarbeitung: 4,
      diskriminierung: 'Nein',
      diskriminierungAnsprechperson: 'Ja',
      diskriminierungKlaerung: 'Teilweise',
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

  it('rejects invalid selected v3 detail values', () => {
    const result = validateRatingPayload(validPayload({
      criteria: {
        ...validPayload().criteria,
        nachtdiensteProMonat: 40,
        fehlerkultur: 9,
        diskriminierung: 'Vielleicht',
        diskriminierungAnsprechperson: 'Vielleicht',
        diskriminierungKlaerung: 'Unklar',
      },
    }))
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('nachtdiensteProMonat')
    expect(result.errors.join(' ')).toContain('fehlerkultur')
    expect(result.errors.join(' ')).toContain('diskriminierung')
    expect(result.errors.join(' ')).toContain('diskriminierungAnsprechperson')
    expect(result.errors.join(' ')).toContain('diskriminierungKlaerung')
  })

  it('rejects unknown criteria keys', () => {
    const result = validateRatingPayload(validPayload({
      criteria: { workLifeBalance: 7, adminOverride: true },
    }))
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('adminOverride')
  })

  it('requires v3 metadata, recommendation, and five core answers', () => {
    const result = validateRatingPayload(validPayload({
      criteria: {
        schemaVersion: 3,
        weiterbildungsjahr: 2,
        weiterbildungsziele: 5,
        supervision: 4,
        selbststaendigkeit: 4,
        arbeitsbelastung: 3,
      },
    }))
    expect(result.valid).toBe(false)
    expect(result.errors.join(' ')).toContain('weiterempfehlung')
    expect(result.errors.join(' ')).toContain('5 der 6')
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
