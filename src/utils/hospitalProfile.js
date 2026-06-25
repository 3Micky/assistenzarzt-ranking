import {
  CRITERIA_SCHEMA_VERSION,
  avgByHospital,
  hospitalNamesMatch,
  isCurrentCriteria,
  normalizeCriteria,
  overallScore,
  ratingValidity,
  recommendationStats,
} from './calculations.js'
import { searchHospitals } from './hospitalSearch.js'
import { slugify } from './slugify.js'
import {
  ALL_CRITERIA_KEYS,
  CRITERIA_CONTEXT_V3,
  CRITERIA_CORE_V3,
  CRITERIA_ESSENTIAL,
  CRITERIA_MEDICAL,
  CRITERIA_NICE,
} from '../data/criteria.js'

const CRITERIA_BY_KEY = new Map(
  [
    ...CRITERIA_ESSENTIAL,
    ...CRITERIA_MEDICAL,
    ...CRITERIA_NICE,
    ...CRITERIA_CORE_V3,
    ...CRITERIA_CONTEXT_V3,
  ].map(criteria => [criteria.key, criteria])
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
      scoreVersion: null,
      scoreCount: 0,
      recommendation: { count: 0, yes: 0, limited: 0, no: 0, yesPercent: null },
      rank: null,
      isOfficialRank: false,
      rankingScore: 0,
    }
  }

  const currentScores = allRatings
    .filter((r) => isCurrentCriteria(r.criteria))
    .filter((r) => ratingValidity(r.criteria).isValid)
    .map((r) => overallScore(r.criteria))
  const legacyScores = allRatings
    .filter((r) => !isCurrentCriteria(r.criteria))
    .filter((r) => ratingValidity(r.criteria).isValid)
    .map((r) => overallScore(r.criteria))
  const scores = currentScores.length > 0 ? currentScores : legacyScores
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
      : definition?.type === 'scale5'
        ? 'scale5'
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
    } else if (type === 'number' || type === 'scale5') {
      const sum = rawValues.reduce((a, b) => a + b, 0)
      criteriaAverages[key] = {
        type,
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
    scoreVersion: currentScores.length > 0 ? CRITERIA_SCHEMA_VERSION : 2,
    scoreCount: scores.length,
    recommendation: recommendationStats(allRatings),
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
  const slug = slugify(hospital.name)
  const canonicalUrl = `https://assistenz-ranking.de/klinik/${slug}`
  const hasCurrentRatings = (data.allRatings ?? []).some(rating => isCurrentCriteria(rating.criteria))
  const reviewItems = (data.allRatings ?? [])
    .filter(rating => hasCurrentRatings ? isCurrentCriteria(rating.criteria) : !isCurrentCriteria(rating.criteria))
    .filter((rating) => ratingValidity(rating.criteria).isValid)
    .slice(0, 3)
    .map((rating) => {
      const review = {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Anonym',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: overallScore(rating.criteria),
          bestRating: 10,
          worstRating: 0,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Assistenz-Ranking',
        },
      }

      if (rating.created_at) review.datePublished = new Date(rating.created_at).toISOString()
      if (rating.comment) review.reviewBody = rating.comment
      if (rating.specialty) review.name = `Erfahrungsbericht ${rating.specialty}`

      return review
    })

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    '@id': `${canonicalUrl}#hospital`,
    name: hospital.name,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    description: `${hospital.name}${hospital.city ? ` in ${hospital.city}` : ''} mit anonymen Assistenzarzt-Bewertungen zu Weiterbildung, Team, Diensten und Work-Life-Balance auf Assistenz-Ranking.`,
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
    ...(data.scoreCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.avgScore,
        bestRating: 10,
        worstRating: 0,
        reviewCount: data.scoreCount,
      },
    }),
    ...(reviewItems.length > 0 && { review: reviewItems }),
  }

  return schema
}
