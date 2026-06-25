import {
  ALLOWED_CRITERIA_KEYS,
  CRITERIA_CONTEXT_V3,
  CRITERIA_CORE_V3,
  CRITERIA_ESSENTIAL,
  CRITERIA_MEDICAL,
  CRITERIA_NICE,
  REGIONS,
  SPECIALTIES,
} from '../../src/data/criteria.js'

export const MAX_BODY_BYTES = 20 * 1024

export const TEXT_LIMITS = {
  hospital: 200,
  city: 100,
  region: 100,
  specialty: 100,
  comment: 2000,
  benefits: 500,
  rotationsplaeneText: 500,
  begruendung: 2000,
  kontakt: 254,
}

const COUNTRIES = new Set(['DE', 'AT', 'CH'])
const SPECIALTY_SET = new Set(SPECIALTIES)
const CRITERIA_KEY_SET = new Set(ALLOWED_CRITERIA_KEYS)
const CRITERIA_DEFINITIONS = new Map(
  [
    ...CRITERIA_ESSENTIAL,
    ...CRITERIA_MEDICAL,
    ...CRITERIA_NICE,
    ...CRITERIA_CORE_V3,
    ...CRITERIA_CONTEXT_V3,
  ]
    .map(criterion => [criterion.key, criterion])
)
const RATING_FIELDS = new Set([
  'hospital',
  'city',
  'country',
  'region',
  'specialty',
  'yearFrom',
  'yearTo',
  'criteria',
  'comment',
])
const REPORT_FIELDS = new Set(['ratingId', 'typ', 'begruendung', 'kontakt'])
const REPORT_TYPES = new Set(['falsch', 'gegendarst', 'sonstig'])
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength
}

function serializedSize(value) {
  try {
    return byteLength(JSON.stringify(value))
  } catch {
    return Number.POSITIVE_INFINITY
  }
}

function isPlainObject(value) {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function validateString(errors, field, value, { required = true, min = 1, max }) {
  if (typeof value !== 'string') {
    errors.push(`${field} muss Text sein.`)
    return ''
  }

  const trimmed = value.trim()
  if (required && trimmed.length < min) errors.push(`${field} ist erforderlich.`)
  if (trimmed.length > max) errors.push(`${field} darf höchstens ${max} Zeichen enthalten.`)
  return trimmed
}

function validateCriterion(errors, key, value) {
  if (value == null) return
  if (key === 'schemaVersion') {
    if (value !== 3) errors.push('criteria.schemaVersion muss 3 sein.')
    return
  }

  const definition = CRITERIA_DEFINITIONS.get(key)
  if (!definition) return

  if (definition.type === 'number' || definition.type === 'slider' || definition.type === 'scale5') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(`criteria.${key} muss eine Zahl sein.`)
      return
    }
    if (value < definition.min || value > definition.max) {
      errors.push(`criteria.${key} muss zwischen ${definition.min} und ${definition.max} liegen.`)
    }
    return
  }

  if (definition.type === 'boolean') {
    if (typeof value !== 'boolean') errors.push(`criteria.${key} muss true oder false sein.`)
    return
  }

  if (definition.type === 'enum') {
    if (typeof value !== 'string' || !definition.options.includes(value)) {
      errors.push(`criteria.${key} enthält einen ungültigen Wert.`)
    }
    return
  }

  if (definition.type === 'time') {
    if (typeof value !== 'string' || !TIME_PATTERN.test(value)) {
      errors.push(`criteria.${key} muss eine Uhrzeit im Format HH:MM sein.`)
    }
    return
  }

  if (definition.type === 'text') {
    const max = TEXT_LIMITS[key] ?? 500
    if (typeof value !== 'string' || value.length > max) {
      errors.push(`criteria.${key} darf höchstens ${max} Zeichen enthalten.`)
    }
  }
}

/**
 * Validates and normalizes a rating submission.
 *
 * @param {unknown} payload
 * @param {{ rawBodySize?: number, currentYear?: number }} options
 * @returns {{ valid: boolean, errors: string[], data: object|null }}
 */
export function validateRatingPayload(payload, options = {}) {
  const errors = []
  const bodySize = options.rawBodySize ?? serializedSize(payload)
  if (bodySize > MAX_BODY_BYTES) {
    return { valid: false, errors: ['Anfrage ist größer als 20 KB.'], data: null }
  }
  if (!isPlainObject(payload)) {
    return { valid: false, errors: ['Ungültiger Anfragekörper.'], data: null }
  }

  for (const key of Object.keys(payload)) {
    if (!RATING_FIELDS.has(key)) errors.push(`Unbekanntes Feld: ${key}.`)
  }

  const hospital = validateString(errors, 'hospital', payload.hospital, { max: TEXT_LIMITS.hospital })
  const city = validateString(errors, 'city', payload.city, { max: TEXT_LIMITS.city })
  const region = validateString(errors, 'region', payload.region, { max: TEXT_LIMITS.region })
  const specialty = validateString(errors, 'specialty', payload.specialty, { max: TEXT_LIMITS.specialty })
  const comment = validateString(errors, 'comment', payload.comment ?? '', {
    required: false,
    min: 0,
    max: TEXT_LIMITS.comment,
  })

  if (!COUNTRIES.has(payload.country)) errors.push('country muss DE, AT oder CH sein.')
  if (!SPECIALTY_SET.has(specialty)) errors.push('specialty ist ungültig.')
  if (COUNTRIES.has(payload.country) && !REGIONS[payload.country].includes(region)) {
    errors.push('region passt nicht zum ausgewählten Land.')
  }

  const currentYear = options.currentYear ?? new Date().getFullYear()
  const maxYear = currentYear + 1
  if (!Number.isInteger(payload.yearFrom) || payload.yearFrom < 2000 || payload.yearFrom > maxYear) {
    errors.push(`yearFrom muss zwischen 2000 und ${maxYear} liegen.`)
  }

  const yearToIsOngoing = payload.yearTo === 'fortlaufend'
  const yearToIsValidNumber = Number.isInteger(payload.yearTo)
    && payload.yearTo >= 2000
    && payload.yearTo <= maxYear
  if (!yearToIsOngoing && !yearToIsValidNumber) {
    errors.push(`yearTo muss "fortlaufend" oder ein Jahr zwischen 2000 und ${maxYear} sein.`)
  } else if (yearToIsValidNumber && Number.isInteger(payload.yearFrom) && payload.yearTo < payload.yearFrom) {
    errors.push('yearTo darf nicht vor yearFrom liegen.')
  }

  if (!isPlainObject(payload.criteria)) {
    errors.push('criteria muss ein Objekt sein.')
  } else {
    for (const [key, value] of Object.entries(payload.criteria)) {
      if (!CRITERIA_KEY_SET.has(key)) {
        errors.push(`Unbekanntes Kriterium: ${key}.`)
        continue
      }
      validateCriterion(errors, key, value)
    }

    if (payload.criteria.schemaVersion !== 3) {
      errors.push('criteria.schemaVersion ist erforderlich.')
    }
    if (!Number.isInteger(payload.criteria.weiterbildungsjahr)) {
      errors.push('criteria.weiterbildungsjahr ist erforderlich.')
    }
    if (!['Ja', 'Mit Einschränkungen', 'Nein'].includes(payload.criteria.weiterempfehlung)) {
      errors.push('criteria.weiterempfehlung ist erforderlich.')
    }
    const answeredCore = CRITERIA_CORE_V3
      .filter(criterion => payload.criteria[criterion.key] != null)
      .length
    if (answeredCore < 5) {
      errors.push('Mindestens 5 der 6 Kernfragen müssen beantwortet sein.')
    }
  }

  if (errors.length > 0) return { valid: false, errors, data: null }

  return {
    valid: true,
    errors: [],
    data: {
      hospital,
      city,
      country: payload.country,
      region,
      specialty,
      yearFrom: payload.yearFrom,
      yearTo: yearToIsOngoing ? 'fortlaufend' : String(payload.yearTo),
      criteria: payload.criteria,
      comment,
    },
  }
}

/**
 * @param {unknown} payload
 * @returns {{ valid: boolean, errors: string[], data: object|null }}
 */
export function validateReportPayload(payload) {
  const errors = []
  if (!isPlainObject(payload)) {
    return { valid: false, errors: ['Ungültiger Anfragekörper.'], data: null }
  }

  for (const key of Object.keys(payload)) {
    if (!REPORT_FIELDS.has(key)) errors.push(`Unbekanntes Feld: ${key}.`)
  }

  const ratingId = typeof payload.ratingId === 'string' ? payload.ratingId.trim() : ''
  if (!UUID_PATTERN.test(ratingId)) errors.push('ratingId ist ungültig.')
  if (!REPORT_TYPES.has(payload.typ)) errors.push('typ ist ungültig.')

  const begruendung = validateString(errors, 'begruendung', payload.begruendung, {
    min: 20,
    max: TEXT_LIMITS.begruendung,
  })
  if (begruendung.length > 0 && begruendung.length < 20) {
    errors.push('begruendung muss mindestens 20 Zeichen enthalten.')
  }

  const kontakt = validateString(errors, 'kontakt', payload.kontakt ?? '', {
    required: false,
    min: 0,
    max: TEXT_LIMITS.kontakt,
  })
  if (kontakt && !EMAIL_PATTERN.test(kontakt)) errors.push('kontakt muss eine gültige E-Mail-Adresse sein.')

  return errors.length > 0
    ? { valid: false, errors, data: null }
    : { valid: true, errors: [], data: { ratingId, typ: payload.typ, begruendung, kontakt } }
}
