import { matchHospitalName } from './hospitalSearch.js'
import { HOSPITAL_COORDS } from '../data/hospitalCoords.js'

export const CRITERIA_SCHEMA_VERSION = 2
export const MIN_ANSWERED_CORE_CRITERIA = 5
export const MIN_OFFICIAL_RATINGS = 3
export const BAYESIAN_PRIOR_RATINGS = 4

const REQUIRED_WBE_YEARS_DEFAULT = 6

const DIMENSION_WEIGHTS = {
  weiterbildung: 0.30,
  workLife: 0.25,
  struktur: 0.20,
  teamkultur: 0.15,
  infrastruktur: 0.10,
}

export const SCORE_BANDS = [
  { min: 8, label: 'Ausgezeichnet', color: '#22C55E' },
  { min: 7, label: 'Gut', color: '#22C55E' },
  { min: 5, label: 'Durchschnittlich', color: '#F59E0B' },
  { min: 0, label: 'Mangelhaft', color: '#EF4444' },
]

const CORE_SCORE_KEYS = [
  'wbeJahre',
  'logbuchErfuellbarkeit',
  'supervisionQualitaet',
  'autonomie',
  'diensteProMonat',
  'ueberstundenAufschreiben',
  'schichtsystem',
  'workLifeBalance',
  'urlaubsgenehmigung',
  'rotationsplaene',
  'fortbildungFreistellung',
  'fortbildungBezahlt',
  'mitarbeitergespraeche',
  'teamAtmosphaere',
  'nachtdienstBegleitung',
  'dokumentationsaufwand',
]

const SCORE_FIELDS = {
  wbeJahre: c => scoreWbe(c.wbeJahre),
  logbuchErfuellbarkeit: c => sliderScore(c.logbuchErfuellbarkeit),
  supervisionQualitaet: c => sliderScore(c.supervisionQualitaet),
  autonomie: c => sliderScore(c.autonomie),
  diensteProMonat: c => scoreDienste(c.diensteProMonat),
  ueberstundenAufschreiben: c => boolScore(c.ueberstundenAufschreiben, 10, 1),
  schichtsystem: c => scoreSchichtsystem(c.schichtsystem),
  workLifeBalance: c => sliderScore(c.workLifeBalance),
  urlaubsgenehmigung: c => sliderScore(c.urlaubsgenehmigung),
  rotationsplaene: c => boolScore(c.rotationsplaene, 10, 3),
  fortbildungFreistellung: c => boolScore(c.fortbildungFreistellung, 10, 4),
  fortbildungBezahlt: c => boolScore(c.fortbildungBezahlt, 10, 4),
  mitarbeitergespraeche: c => scoreMitarbeitergespraeche(c.mitarbeitergespraeche),
  teamAtmosphaere: c => sliderScore(c.teamAtmosphaere),
  schwangerschaftFamilienfreundlich: c => boolScore(c.schwangerschaftFamilienfreundlich, 10, 2),
  nachtdienstBegleitung: c => sliderScore(c.nachtdienstBegleitung),
  parkplatz: c => boolScore(c.parkplatz, 10, 5),
  dokumentationsaufwand: c => sliderScore(c.dokumentationsaufwand),
}

const DIMENSION_DEFINITIONS = [
  {
    key: 'weiterbildung',
    label: 'Weiterbildung',
    weight: DIMENSION_WEIGHTS.weiterbildung,
    fields: ['wbeJahre', 'logbuchErfuellbarkeit', 'supervisionQualitaet', 'autonomie'],
  },
  {
    key: 'workLife',
    label: 'Work-Life',
    weight: DIMENSION_WEIGHTS.workLife,
    fields: ['diensteProMonat', 'ueberstundenAufschreiben', 'schichtsystem', 'workLifeBalance', 'urlaubsgenehmigung'],
  },
  {
    key: 'struktur',
    label: 'Struktur',
    weight: DIMENSION_WEIGHTS.struktur,
    fields: ['rotationsplaene', 'fortbildungFreistellung', 'fortbildungBezahlt', 'mitarbeitergespraeche'],
  },
  {
    key: 'teamkultur',
    label: 'Teamkultur',
    weight: DIMENSION_WEIGHTS.teamkultur,
    fields: ['teamAtmosphaere', 'schwangerschaftFamilienfreundlich', 'nachtdienstBegleitung'],
  },
  {
    key: 'infrastruktur',
    label: 'Infrastruktur',
    weight: DIMENSION_WEIGHTS.infrastruktur,
    fields: ['parkplatz', 'dokumentationsaufwand'],
  },
]

export const SCORE_DIMENSIONS = DIMENSION_DEFINITIONS.map((dimension) => ({
  ...dimension,
  extract: criteria => dimensionMean(criteria, dimension.fields),
}))

function isMissing(value) {
  return value === null || value === undefined || value === '' || Number.isNaN(value)
}

function toNumber(value) {
  if (isMissing(value)) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function clampScore(value) {
  const number = toNumber(value)
  return number == null ? null : clamp(number, 0, 10)
}

function round1(value) {
  const score = clampScore(value)
  return score == null ? 0 : Math.round(score * 10) / 10
}

function boolOrNull(value) {
  return typeof value === 'boolean' ? value : null
}

function boolScore(value, yes, no) {
  if (value === true) return yes
  if (value === false) return no
  return null
}

function sliderScore(value) {
  return clampScore(value)
}

function scoreDienste(value) {
  const number = toNumber(value)
  return number == null ? null : clamp(10 - number * 0.6, 0, 10)
}

function scoreSchichtsystem(value) {
  if (value === '2-Schicht') return 8
  if (value === '3-Schicht') return 6
  if (value === '24h-Dienste') return 3
  return null
}

function scoreMitarbeitergespraeche(value) {
  const count = toNumber(value)
  if (count == null) return null
  if (count <= 0) return 0
  if (count <= 1) return 6.5 * count
  if (count <= 2) return 6.5 + (count - 1) * 1.5
  if (count <= 4) return 8 + (count - 2) * 1
  return 10
}

function scoreWbe(value) {
  const years = toNumber(value)
  if (years == null) return null
  return clamp((years / REQUIRED_WBE_YEARS_DEFAULT) * 10, 0, 10)
}

function normalizeDienstsystem(value) {
  if (value === '2-Schicht' || value === '3-Schicht' || value === '24h-Dienste') return value
  if (value === '12h') return '2-Schicht'
  if (value === '24h') return '24h-Dienste'
  return null
}

function normalizeSlider(value) {
  const number = toNumber(value)
  return number == null ? null : clamp(number, 1, 10)
}

function normalizeNumber(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  const number = toNumber(value)
  return number == null ? null : clamp(number, min, max)
}

function normalizeNachtdienstBegleitung(value) {
  if (value === true) return 10
  if (value === false) return 1
  return normalizeSlider(value)
}

function validEnum(value, allowed) {
  return allowed.includes(value) ? value : null
}

function textValue(value) {
  return typeof value === 'string' ? value : ''
}

function nullableTextValue(value) {
  return typeof value === 'string' && value !== '' ? value : null
}

/**
 * Canonical v2 criteria shape used by all scoring reads.
 * Legacy rows are adapted in-memory; stored Supabase rows are not mutated.
 *
 * @param {object|null|undefined} criteria
 * @returns {object}
 */
export function normalizeCriteria(criteria = {}) {
  const c = criteria ?? {}
  const schichtsystem = normalizeDienstsystem(c.schichtsystem ?? c.dienstsystem)

  return {
    schemaVersion: CRITERIA_SCHEMA_VERSION,
    arbeitszeitenVon: nullableTextValue(c.arbeitszeitenVon),
    arbeitszeitenBis: nullableTextValue(c.arbeitszeitenBis),
    diensteProMonat: normalizeNumber(c.diensteProMonat, 0, 31),
    schichtsystem,
    ueberstundenAufschreiben: boolOrNull(c.ueberstundenAufschreiben),
    ueberstundenAusgleich: validEnum(c.ueberstundenAusgleich, ['Bezahlt', 'Freizeitausgleich']),
    abteilungsgroesse: normalizeNumber(c.abteilungsgroesse, 1, 500),
    personalschluessel: normalizeNumber(c.personalschluessel, 1, 100),
    wbeJahre: normalizeNumber(c.wbeJahre, 0, 12),
    opsProMonat: normalizeNumber(c.opsProMonat, 0, 100),
    rotationsplaene: boolOrNull(c.rotationsplaene),
    rotationsplaeneText: textValue(c.rotationsplaeneText),
    nachtdienstBegleitung: normalizeNachtdienstBegleitung(c.nachtdienstBegleitung),
    fortbildungFreistellung: boolOrNull(c.fortbildungFreistellung),
    fortbildungBezahlt: boolOrNull(c.fortbildungBezahlt),
    lehreTaetig: boolOrNull(c.lehreTaetig),
    lehreFreistellung: boolOrNull(c.lehreFreistellung),
    logbuchErfuellbarkeit: normalizeSlider(c.logbuchErfuellbarkeit),
    supervisionQualitaet: normalizeSlider(c.supervisionQualitaet),
    autonomie: normalizeSlider(c.autonomie),
    mitarbeitergespraeche: normalizeNumber(c.mitarbeitergespraeche, 0, 12),
    dokumentationsaufwand: normalizeSlider(c.dokumentationsaufwand),
    urlaubsgenehmigung: normalizeSlider(c.urlaubsgenehmigung),
    workLifeBalance: normalizeSlider(c.workLifeBalance),
    teamAtmosphaere: normalizeSlider(c.teamAtmosphaere),
    schwangerschaft: validEnum(c.schwangerschaft, ['Sofortiges Arbeitsverbot', 'Individuelle Lösung', 'Normal weiterarbeiten']),
    schwangerschaftFamilienfreundlich: boolOrNull(c.schwangerschaftFamilienfreundlich),
    parkplatz: boolOrNull(c.parkplatz),
    benefits: textValue(c.benefits),
  }
}

/**
 * @param {object} rating
 * @returns {object}
 */
export function normalizeRating(rating) {
  return {
    ...rating,
    criteria: normalizeCriteria(rating?.criteria),
  }
}

function scoredField(criteria, key) {
  const c = normalizeCriteria(criteria)
  return SCORE_FIELDS[key]?.(c) ?? null
}

function dimensionMean(criteria, fields) {
  const c = normalizeCriteria(criteria)
  const values = fields
    .map(field => SCORE_FIELDS[field]?.(c) ?? null)
    .filter(value => value != null)

  if (values.length === 0) return null
  return round1(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function dimensionScores(criteria) {
  return Object.fromEntries(
    SCORE_DIMENSIONS.map(dimension => [dimension.key, dimension.extract(criteria)])
  )
}

export function answeredCoreCount(criteria) {
  return CORE_SCORE_KEYS.filter(key => scoredField(criteria, key) != null).length
}

export function ratingValidity(criteria) {
  const answeredCore = answeredCoreCount(criteria)
  return {
    isValid: answeredCore >= MIN_ANSWERED_CORE_CRITERIA,
    answeredCore,
    requiredCore: MIN_ANSWERED_CORE_CRITERIA,
  }
}

/**
 * 5-Dimensionen-Composite-Score (0-10).
 * Gewichtung: Weiterbildung 30% · WLB 25% · Ausbildungsstruktur 20% · Teamkultur 15% · Infrastruktur 10%
 */
export function overallScore(criteria) {
  const validity = ratingValidity(criteria)
  if (!validity.isValid) return 0

  const dimensions = SCORE_DIMENSIONS
    .map(dimension => ({ ...dimension, score: dimension.extract(criteria) }))
    .filter(dimension => dimension.score != null)

  const weightSum = dimensions.reduce((sum, dimension) => sum + dimension.weight, 0)
  if (weightSum <= 0) return 0

  const score = dimensions.reduce((sum, dimension) => {
    return sum + dimension.score * dimension.weight
  }, 0) / weightSum

  return round1(score)
}

function validOverallScore(criteria) {
  return ratingValidity(criteria).isValid ? overallScore(criteria) : null
}

function average(values) {
  const scores = values.filter(value => value != null)
  if (scores.length === 0) return null
  return round1(scores.reduce((sum, value) => sum + value, 0) / scores.length)
}

export function scoreColor(score) {
  const value = clampScore(score) ?? 0
  return SCORE_BANDS.find(band => value >= band.min)?.color ?? SCORE_BANDS.at(-1).color
}

export function scoreLabel(score) {
  const value = clampScore(score) ?? 0
  return SCORE_BANDS.find(band => value >= band.min)?.label ?? SCORE_BANDS.at(-1).label
}

export function hospitalNamesMatch(left, right) {
  return left === right || matchHospitalName(left, right)
}

export function groupRatingsByHospital(ratings) {
  const groups = []

  ratings.forEach((rating) => {
    const existing = groups.find(group => hospitalNamesMatch(group.hospital, rating.hospital))
    if (existing) {
      existing.ratings.push(rating)
      if (!existing.city && rating.city) existing.city = rating.city
      if (!existing.country && rating.country) existing.country = rating.country
      return
    }

    groups.push({
      hospital: rating.hospital,
      city: rating.city,
      country: rating.country,
      ratings: [rating],
    })
  })

  return groups
}

function globalScoreMean(ratings) {
  return average(ratings.map(rating => validOverallScore(rating.criteria))) ?? 5
}

export function avgByHospital(ratings) {
  const globalMean = globalScoreMean(ratings)
  const groups = groupRatingsByHospital(ratings)
  const rows = groups.map((group) => {
    const scores = group.ratings
      .map(rating => validOverallScore(rating.criteria))
      .filter(score => score != null)
    const rawScore = average(scores) ?? 0
    const bayesianScore = scores.length === 0
      ? 0
      : round1((rawScore * scores.length + globalMean * BAYESIAN_PRIOR_RATINGS) / (scores.length + BAYESIAN_PRIOR_RATINGS))

    return {
      hospital: group.hospital,
      city: group.city,
      country: group.country,
      score: bayesianScore,
      rawScore,
      count: group.ratings.length,
      scoreCount: scores.length,
      isOfficial: scores.length >= MIN_OFFICIAL_RATINGS,
      rank: null,
    }
  })

  const hasOfficial = rows.some(row => row.isOfficial)
  const sorted = rows.sort((a, b) => {
    if (hasOfficial && a.isOfficial !== b.isOfficial) return a.isOfficial ? -1 : 1
    return b.score - a.score || b.count - a.count || a.hospital.localeCompare(b.hospital, 'de')
  })

  let rank = 1
  sorted.forEach((row) => {
    if (row.isOfficial) {
      row.rank = rank
      rank += 1
    }
  })

  return sorted
}

export function avgByCity(ratings, citiesData) {
  const map = {}
  ratings.forEach((rating) => {
    if (!map[rating.city]) map[rating.city] = { city: rating.city, country: rating.country, scores: [], count: 0 }
    const score = validOverallScore(rating.criteria)
    map[rating.city].count += 1
    if (score != null) map[rating.city].scores.push(score)
  })
  return Object.values(map)
    .map((city) => {
      const cityInfo = citiesData.find((d) => d.name === city.city)
      return {
        city: city.city,
        country: city.country,
        coordinates: cityInfo?.coordinates ?? null,
        score: average(city.scores) ?? 0,
        count: city.count,
      }
    })
    .filter((city) => city.coordinates !== null)
}

/** Erweitert avgByHospital um echte Koordinaten aus der Hospital-Datenbank */
export function avgByHospitalWithCoords(ratings) {
  const hospitals = avgByHospital(ratings)
  return hospitals.map((hospital) => {
    let coords = HOSPITAL_COORDS[hospital.hospital] ?? null
    if (!coords) {
      const match = Object.keys(HOSPITAL_COORDS).find((name) => hospitalNamesMatch(name, hospital.hospital))
      if (match) coords = HOSPITAL_COORDS[match]
    }
    return {
      ...hospital,
      coordinates: coords,
    }
  })
}

function averageDimension(ratings, extract) {
  return average(ratings.map(rating => extract(rating.criteria))) ?? 0
}

/** Radar data auf Basis derselben 5 Dimensionen wie der Gesamtscore */
export function radarData(hospitalNames, ratings) {
  return SCORE_DIMENSIONS.map(({ key, label, extract }) => {
    const entry = { subject: label, key }
    hospitalNames.forEach((name) => {
      const relevant = ratings.filter(rating => hospitalNamesMatch(rating.hospital, name))
      entry[name] = averageDimension(relevant, extract)
    })
    return entry
  })
}

/** Unified radar data: slots = [{hospital, specialty}], specialty '' → aggregate all */
export function radarDataUnified(slots, ratings) {
  return SCORE_DIMENSIONS.map(({ key, label, extract }) => {
    const entry = { subject: label, key }
    slots.forEach((slot) => {
      const dataKey = slot.specialty ? `${slot.hospital} · ${slot.specialty}` : slot.hospital
      const relevant = ratings.filter(rating =>
        hospitalNamesMatch(rating.hospital, slot.hospital) &&
        (slot.specialty ? rating.specialty === slot.specialty : true)
      )
      entry[dataKey] = averageDimension(relevant, extract)
    })
    return entry
  })
}

export function radarDataBySpecialty(pairs, ratings) {
  return SCORE_DIMENSIONS.map(({ key, label, extract }) => {
    const entry = { subject: label, key }
    pairs.forEach((pair) => {
      const labelKey = `${pair.hospital} · ${pair.specialty}`
      const relevant = ratings.filter(rating =>
        hospitalNamesMatch(rating.hospital, pair.hospital) &&
        rating.specialty === pair.specialty
      )
      entry[labelKey] = averageDimension(relevant, extract)
    })
    return entry
  })
}

export function computeStats(ratings) {
  if (ratings.length === 0) return { total: 0, avgScore: 0, topHospital: '—', countDE: 0, countAT: 0, countCH: 0 }
  const avgScore = average(ratings.map(rating => validOverallScore(rating.criteria))) ?? 0
  const top = avgByHospital(ratings).find(hospital => hospital.isOfficial) ?? avgByHospital(ratings)[0]
  return {
    total: ratings.length,
    avgScore,
    topHospital: top?.hospital ?? '—',
    countDE: ratings.filter((rating) => rating.country === 'DE').length,
    countAT: ratings.filter((rating) => rating.country === 'AT').length,
    countCH: ratings.filter((rating) => rating.country === 'CH').length,
  }
}
