import { avgByHospital, hospitalNamesMatch, normalizeCriteria, overallScore, ratingValidity } from './calculations.js'
import { searchHospitals } from './hospitalSearch.js'
import { slugify } from './slugify.js'
import { ALL_CRITERIA_KEYS, CRITERIA_ESSENTIAL, CRITERIA_MEDICAL, CRITERIA_NICE } from '../data/criteria.js'

const CRITERIA_BY_KEY = new Map(
  [...CRITERIA_ESSENTIAL, ...CRITERIA_MEDICAL, ...CRITERIA_NICE].map(criteria => [criteria.key, criteria])
)

/**
 * Findet ein Krankenhaus in der DACH-Datenbank anhand seines Slugs.
 * Fallback: Suche im Ratings-Pool wenn nicht in DB gefunden.
 *
 * @param {string} slug
 * @param {object[]} ratings
 * @returns {{ name: string, city?: string, region?: string, country?: string, plz?: string, street?: string, carrier?: string } | null}
 */
export function getHospitalBySlug(slug, ratings) {
  // 1. Suche in den Bewertungen (exakter Slug-Match)
  const fromRatings = ratings.find((r) => slugify(r.hospital) === slug)
  if (fromRatings) {
    return {
      name: fromRatings.hospital,
      city: fromRatings.city,
      region: fromRatings.region,
      country: fromRatings.country,
    }
  }

  // 2. Suche in der vollständigen Klinik-DB
  const allRated = new Set(ratings.map((r) => r.hospital))
  const hits = searchHospitals(slug.replace(/-/g, ' '), allRated, {}, 200)
  const exact = hits.find((h) => slugify(h.name) === slug)

  if (exact) {
    return {
      name: exact.name,
      city: exact.city,
      region: exact.region,
      country: exact.country,
      plz: exact.plz,
      street: exact.street,
      carrier: exact.carrier,
    }
  }

  return null
}

/**
 * Aggregiert alle Bewertungen für eine bestimmte Klinik.
 *
 * @param {string} hospitalName
 * @param {object[]} ratings
 * @returns {{
 *   avgScore: number,
 *   count: number,
 *   criteriaAverages: Record<string, { type: string, value: number|string|null, rawValues: any[] }>,
 *   specialties: string[],
 *   yearRange: [number|null, number|null],
 *   allRatings: object[],
 *   rank: number,
 * }}
 */
export function aggregateHospitalData(hospitalName, ratings) {
  const allRatings = ratings.filter((r) => hospitalNamesMatch(r.hospital, hospitalName))
  const count = allRatings.length

  if (count === 0) {
    return {
      avgScore: 0,
      count: 0,
      criteriaAverages: {},
      specialties: [],
      yearRange: [null, null],
      allRatings: [],
      rank: null,
      isOfficialRank: false,
      rankingScore: 0,
    }
  }

  const scores = allRatings
    .filter((r) => ratingValidity(r.criteria).isValid)
    .map((r) => overallScore(r.criteria))
  const avgScore = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0

  // Ranking berechnen
  const ranked = avgByHospital(ratings)
  const rankingEntry = ranked.find((h) => hospitalNamesMatch(h.hospital, hospitalName))
  const rank = rankingEntry?.rank ?? null

  // Kriterien aggregieren
  const criteriaAverages = {}
  ALL_CRITERIA_KEYS.forEach((key) => {
    const definition = CRITERIA_BY_KEY.get(key)
    const rawValues = allRatings
      .map((r) => normalizeCriteria(r.criteria)[key])
      .filter((v) => v !== null && v !== undefined && v !== '')
    if (rawValues.length === 0) return

    const type = definition?.type === 'boolean'
      ? 'boolean'
      : ['number', 'slider'].includes(definition?.type)
        ? 'number'
        : 'other'

    if (type === 'boolean') {
      const yesCount = rawValues.filter((v) => v === true).length
      criteriaAverages[key] = {
        type: 'boolean',
        value: Math.round((yesCount / rawValues.length) * 100),
        rawValues,
      }
    } else if (type === 'number') {
      const sum = rawValues.reduce((a, b) => a + b, 0)
      criteriaAverages[key] = {
        type: 'number',
        value: Math.round((sum / rawValues.length) * 10) / 10,
        rawValues,
      }
    } else {
      // Für Text/Enum/Time: zeige den häufigsten Wert
      const freq = {}
      rawValues.forEach((v) => { freq[v] = (freq[v] || 0) + 1 })
      const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
      criteriaAverages[key] = {
        type: 'other',
        value: mostCommon,
        rawValues,
      }
    }
  })

  // Fachrichtungen
  const specialtyFreq = {}
  allRatings.forEach((r) => {
    if (r.specialty) specialtyFreq[r.specialty] = (specialtyFreq[r.specialty] || 0) + 1
  })
  const specialties = Object.entries(specialtyFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s)

  // Jahresbereich
  const years = allRatings.map((r) => r.year).filter(Boolean)
  const yearRange = years.length > 0 ? [Math.min(...years), Math.max(...years)] : [null, null]

  return {
    avgScore,
    count,
    criteriaAverages,
    specialties,
    yearRange,
    allRatings,
    rank,
    isOfficialRank: rankingEntry?.isOfficial ?? false,
    rankingScore: rankingEntry?.score ?? 0,
  }
}

/**
 * Erzeugt JSON-LD Structured Data für eine Klinik.
 *
 * @param {{ name: string, city?: string, region?: string, country?: string, street?: string, plz?: string }} hospital
 * @param {{ avgScore: number, count: number }} data
 * @returns {object}
 */
export function hospitalProfileSchema(hospital, data) {
  const countryMap = { DE: 'DE', AT: 'AT', CH: 'CH' }
  const countryCode = countryMap[hospital.country] ?? 'DE'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: hospital.name,
    ...(hospital.city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: hospital.city,
        ...(hospital.region && { addressRegion: hospital.region }),
        ...(hospital.plz && { postalCode: hospital.plz }),
        ...(hospital.street && { streetAddress: hospital.street }),
        addressCountry: countryCode,
      },
    }),
    ...(data.count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.avgScore,
        bestRating: 10,
        worstRating: 0,
        reviewCount: data.count,
      },
    }),
  }

  return schema
}
