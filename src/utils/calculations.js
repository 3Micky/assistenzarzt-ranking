import { matchHospitalName } from './hospitalSearch.js'
import { HOSPITAL_COORDS } from '../data/hospitalCoords.js'
import { CRITERIA_CORE_V3, SPECIALTY_PROCEDURE_TYPE } from '../data/criteria.js'

export const CRITERIA_SCHEMA_VERSION = 3
export const LEGACY_CRITERIA_SCHEMA_VERSION = 2
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

const LEGACY_CORE_SCORE_KEYS = [
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

const LEGACY_SCORE_FIELDS = {
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

const LEGACY_DIMENSION_DEFINITIONS = [
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

const LEGACY_SCORE_DIMENSIONS = LEGACY_DIMENSION_DEFINITIONS.map((dimension) => ({
  ...dimension,
  extract: criteria => legacyDimensionMean(criteria, dimension.fields),
}))

export const V3_CORE_KEYS = CRITERIA_CORE_V3.map(criterion => criterion.key)

const V3_DIMENSION_LABELS = {
  weiterbildungsziele: 'Weiterbildungsziele',
  supervision: 'Supervision',
  selbststaendigkeit: 'Selbstständigkeit',
  arbeitsbelastung: 'Arbeitsbelastung',
  teamFuehrung: 'Team & Führung',
  ausbildungsstruktur: 'Struktur',
}

/**
 * Gemeinsame Radar-Achsen. Für v3 werden die sechs Kernfragen direkt verwendet;
 * für v2 werden fachlich möglichst nahe Legacy-Werte angezeigt.
 */
export const SCORE_DIMENSIONS = V3_CORE_KEYS.map((key) => ({
  key,
  label: V3_DIMENSION_LABELS[key],
  weight: 1 / V3_CORE_KEYS.length,
  extract: criteria => comparableDimensionScore(criteria, key),
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

function normalizeScale5(value) {
  const number = toNumber(value)
  return number == null ? null : clamp(number, 1, 5)
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

export function criteriaSchemaVersion(criteria = {}) {
  const explicitVersion = toNumber(criteria?.schemaVersion)
  if (explicitVersion === CRITERIA_SCHEMA_VERSION) return CRITERIA_SCHEMA_VERSION
  if (V3_CORE_KEYS.some(key => !isMissing(criteria?.[key]))) return CRITERIA_SCHEMA_VERSION
  return LEGACY_CRITERIA_SCHEMA_VERSION
}

/**
 * Canonical criteria shape used by all reads.
 * Legacy rows are adapted in-memory; stored Supabase rows are not mutated.
 *
 * @param {object|null|undefined} criteria
 * @returns {object}
 */
export function normalizeCriteria(criteria = {}) {
  const c = criteria ?? {}
  const schemaVersion = criteriaSchemaVersion(c)
  const schichtsystem = normalizeDienstsystem(c.schichtsystem ?? c.dienstsystem)

  return {
    schemaVersion,
    weiterbildungsjahr: normalizeNumber(c.weiterbildungsjahr, 1, 12),
    weiterbildungsziele: normalizeScale5(c.weiterbildungsziele),
    supervision: normalizeScale5(c.supervision),
    selbststaendigkeit: normalizeScale5(c.selbststaendigkeit),
    arbeitsbelastung: normalizeScale5(c.arbeitsbelastung),
    teamFuehrung: normalizeScale5(c.teamFuehrung),
    ausbildungsstruktur: normalizeScale5(c.ausbildungsstruktur),
    weiterempfehlung: validEnum(c.weiterempfehlung, ['Ja', 'Mit Einschränkungen', 'Nein']),
    ueberstundenErfassung: validEnum(c.ueberstundenErfassung, ['Vollständig', 'Teilweise', 'Nein']),
    nachtdiensteProMonat: normalizeNumber(c.nachtdiensteProMonat, 0, 31),
    hintergrundErreichbarkeit: normalizeScale5(c.hintergrundErreichbarkeit),
    hauptoperateurKategorie: validEnum(c.hauptoperateurKategorie, ['Unter 10 %', '10–25 %', '26–50 %', 'Über 50 %']),
    urlaub: normalizeScale5(c.urlaub),
    dokumentation: normalizeScale5(c.dokumentation),
    fehlerkultur: normalizeScale5(c.fehlerkultur),
    fuehrungRespekt: normalizeScale5(c.fuehrungRespekt),
    pflegeZusammenarbeit: normalizeScale5(c.pflegeZusammenarbeit),
    einarbeitung: normalizeScale5(c.einarbeitung),
    diskriminierung: validEnum(c.diskriminierung, ['Nein', 'Unsicher', 'Ja']),
    arbeitszeitenVon: nullableTextValue(c.arbeitszeitenVon),
    arbeitszeitenBis: nullableTextValue(c.arbeitszeitenBis),
    diensteProMonat: normalizeNumber(c.diensteProMonat, 0, 31),
    schichtsystem,
    ueberstundenAufschreiben: boolOrNull(c.ueberstundenAufschreiben),
    ueberstundenAusgleich: validEnum(c.ueberstundenAusgleich, ['Bezahlt', 'Freizeitausgleich', 'Kein Ausgleich']),
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
    hauptoperateurAnteil: normalizeSlider(c.hauptoperateurAnteil),
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

function legacyScoredField(criteria, key) {
  const c = normalizeCriteria(criteria)
  return LEGACY_SCORE_FIELDS[key]?.(c) ?? null
}

function legacyDimensionMean(criteria, fields) {
  const c = normalizeCriteria(criteria)
  const values = fields
    .map(field => LEGACY_SCORE_FIELDS[field]?.(c) ?? null)
    .filter(value => value != null)

  if (values.length === 0) return null
  return round1(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function legacyDimensionScore(criteria, key) {
  return LEGACY_SCORE_DIMENSIONS.find(dimension => dimension.key === key)?.extract(criteria) ?? null
}

function scale5To10(value) {
  const normalized = normalizeScale5(value)
  return normalized == null ? null : normalized * 2
}

function comparableDimensionScore(criteria, key) {
  const c = normalizeCriteria(criteria)
  if (c.schemaVersion === CRITERIA_SCHEMA_VERSION) {
    return scale5To10(c[key])
  }

  if (key === 'weiterbildungsziele') {
    return legacyDimensionScore(c, 'weiterbildung')
  }
  if (key === 'supervision') return sliderScore(c.supervisionQualitaet)
  if (key === 'selbststaendigkeit') return sliderScore(c.autonomie)
  if (key === 'arbeitsbelastung') return legacyDimensionScore(c, 'workLife')
  if (key === 'teamFuehrung') return sliderScore(c.teamAtmosphaere)
  if (key === 'ausbildungsstruktur') return legacyDimensionScore(c, 'struktur')
  return null
}

export function dimensionScores(criteria) {
  return Object.fromEntries(
    SCORE_DIMENSIONS.map(dimension => [dimension.key, dimension.extract(criteria)])
  )
}

export function answeredCoreCount(criteria) {
  const c = normalizeCriteria(criteria)
  if (c.schemaVersion === CRITERIA_SCHEMA_VERSION) {
    return V3_CORE_KEYS.filter(key => c[key] != null).length
  }
  return LEGACY_CORE_SCORE_KEYS.filter(key => legacyScoredField(c, key) != null).length
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
 * Schema v3: gleich gewichteter Mittelwert der sechs Kernfragen, auf 0-10 skaliert.
 * Schema v2: historischer 5-Dimensionen-Composite bleibt unverändert lesbar.
 */
export function overallScore(criteria) {
  const validity = ratingValidity(criteria)
  if (!validity.isValid) return 0

  const c = normalizeCriteria(criteria)
  if (c.schemaVersion === CRITERIA_SCHEMA_VERSION) {
    const values = V3_CORE_KEYS
      .map(key => c[key])
      .filter(value => value != null)
    return round1((values.reduce((sum, value) => sum + value, 0) / values.length) * 2)
  }

  const dimensions = LEGACY_SCORE_DIMENSIONS
    .map(dimension => ({ ...dimension, score: dimension.extract(c) }))
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

export const MIN_ANSWERED_OP_CRITERIA = 3

/** Gewichtetes Mittel, das nur beantwortete (non-null) Komponenten berücksichtigt. */
function weightedMeanNullAware(entries) {
  const present = entries.filter(([value]) => value != null)
  const weightSum = present.reduce((sum, [, weight]) => sum + weight, 0)
  if (weightSum <= 0) return null
  return present.reduce((sum, [value, weight]) => sum + value * weight, 0) / weightSum
}

/**
 * @param {string} specialty
 * @returns {'operativ'|'interventionell'|'mixed'|null}
 */
export function procedureType(specialty) {
  return SPECIALTY_PROCEDURE_TYPE[specialty] ?? null
}

export function isProceduralSpecialty(specialty) {
  return procedureType(specialty) != null
}

/**
 * OP-/Interventions-Ausbildungs-Score (0-10) — nur für prozedurale Fächer.
 * Wiederverwendung bestehender Felder (logbuchErfuellbarkeit, autonomie,
 * supervisionQualitaet) + einziges neues Feld hauptoperateurAnteil als
 * multiplikatives Gate gegen die "Service-Job-Falle".
 *
 * @param {object} criteria
 * @param {string} specialty
 * @returns {number|null} null = N/A (nicht-prozedurales Fach oder zu wenig Daten)
 */
export function operativeTrainingScore(criteria, specialty) {
  if (!isProceduralSpecialty(specialty)) return null

  const c = normalizeCriteria(criteria)
  const logbuch = sliderScore(c.logbuchErfuellbarkeit)
  const autonomie = sliderScore(c.autonomie)
  const supervision = sliderScore(c.supervisionQualitaet)
  const categoryScore = {
    'Unter 10 %': 1.5,
    '10–25 %': 3,
    '26–50 %': 6,
    'Über 50 %': 9,
  }[c.hauptoperateurKategorie] ?? null
  const hauptOp = sliderScore(c.hauptoperateurAnteil ?? categoryScore)

  // Mindestens 3 beantwortete OP-relevante Felder, sonst N/A
  const answered = [logbuch, autonomie, supervision, hauptOp].filter(v => v != null).length
  if (answered < MIN_ANSWERED_OP_CRITERIA) return null

  // Volumen/WBO × Eigenständigkeits-Gate: ohne Hauptoperateur-Angabe kein Gate
  const gate = hauptOp == null ? 1 : 0.4 + 0.6 * (hauptOp / 10)
  const volumeQuality = logbuch == null ? null : logbuch * gate

  const score = weightedMeanNullAware([
    [volumeQuality, 0.45],
    [autonomie,     0.30],
    [supervision,   0.25],
  ])
  if (score == null) return null

  // Sicherheitsnetz: kaum Eigenleistung + niedrige Autonomie → gedeckelt
  const capped = (hauptOp != null && hauptOp <= 2 && autonomie != null && autonomie <= 4)
    ? Math.min(score, 5)
    : score

  return round1(capped)
}

/** Aggregierter OP-Score je (Klinik, Fachrichtung) über alle passenden Bewertungen. */
export function operativeTrainingScoreForRatings(ratings, specialty) {
  if (!isProceduralSpecialty(specialty)) return null
  const scores = ratings
    .map(rating => operativeTrainingScore(rating.criteria, specialty))
    .filter(score => score != null)
  return average(scores)
}

function average(values) {
  const scores = values.filter(value => value != null)
  if (scores.length === 0) return null
  return round1(scores.reduce((sum, value) => sum + value, 0) / scores.length)
}

export function averageScoreForRatings(ratings) {
  const currentScores = ratings
    .filter(rating => isCurrentCriteria(rating.criteria))
    .map(rating => validOverallScore(rating.criteria))
    .filter(score => score != null)
  if (currentScores.length > 0) return average(currentScores)

  return average(
    ratings
      .filter(rating => !isCurrentCriteria(rating.criteria))
      .map(rating => validOverallScore(rating.criteria))
      .filter(score => score != null)
  )
}

export function scoreColor(score) {
  const value = clampScore(score) ?? 0
  return SCORE_BANDS.find(band => value >= band.min)?.color ?? SCORE_BANDS.at(-1).color
}

export function scoreLabel(score) {
  const value = clampScore(score) ?? 0
  return SCORE_BANDS.find(band => value >= band.min)?.label ?? SCORE_BANDS.at(-1).label
}

export function isCurrentCriteria(criteria) {
  return criteriaSchemaVersion(criteria) === CRITERIA_SCHEMA_VERSION
}

export function recommendationStats(ratings) {
  const values = ratings
    .filter(rating => isCurrentCriteria(rating.criteria))
    .map(rating => normalizeCriteria(rating.criteria).weiterempfehlung)
    .filter(Boolean)

  if (values.length === 0) return { count: 0, yes: 0, limited: 0, no: 0, yesPercent: null }

  const yes = values.filter(value => value === 'Ja').length
  const limited = values.filter(value => value === 'Mit Einschränkungen').length
  const no = values.filter(value => value === 'Nein').length
  return {
    count: values.length,
    yes,
    limited,
    no,
    yesPercent: Math.round((yes / values.length) * 100),
  }
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
  return average(
    ratings
      .filter(rating => isCurrentCriteria(rating.criteria))
      .map(rating => validOverallScore(rating.criteria))
  ) ?? 5
}

export function avgByHospital(ratings) {
  const globalMean = globalScoreMean(ratings)
  const groups = groupRatingsByHospital(ratings)
  const rows = groups.map((group) => {
    const currentScores = group.ratings
      .filter(rating => isCurrentCriteria(rating.criteria))
      .map(rating => validOverallScore(rating.criteria))
      .filter(score => score != null)
    const legacyScores = group.ratings
      .filter(rating => !isCurrentCriteria(rating.criteria))
      .map(rating => validOverallScore(rating.criteria))
      .filter(score => score != null)
    const displayedScores = currentScores.length > 0 ? currentScores : legacyScores
    const rawScore = average(displayedScores) ?? 0
    const bayesianScore = currentScores.length === 0
      ? rawScore
      : round1((rawScore * currentScores.length + globalMean * BAYESIAN_PRIOR_RATINGS) / (currentScores.length + BAYESIAN_PRIOR_RATINGS))

    return {
      hospital: group.hospital,
      city: group.city,
      country: group.country,
      score: bayesianScore,
      rawScore,
      count: group.ratings.length,
      scoreCount: currentScores.length,
      legacyScoreCount: legacyScores.length,
      scoreVersion: currentScores.length > 0 ? CRITERIA_SCHEMA_VERSION : LEGACY_CRITERIA_SCHEMA_VERSION,
      isOfficial: currentScores.length >= MIN_OFFICIAL_RATINGS,
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
    if (!map[rating.city]) map[rating.city] = { city: rating.city, country: rating.country, ratings: [], count: 0 }
    map[rating.city].count += 1
    map[rating.city].ratings.push(rating)
  })
  return Object.values(map)
    .map((city) => {
      const cityInfo = citiesData.find((d) => d.name === city.city)
      return {
        city: city.city,
        country: city.country,
        coordinates: cityInfo?.coordinates ?? null,
        score: averageScoreForRatings(city.ratings) ?? 0,
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
  const currentRatings = ratings.filter(rating => isCurrentCriteria(rating.criteria))
  const selectedRatings = currentRatings.length > 0
    ? currentRatings
    : ratings.filter(rating => !isCurrentCriteria(rating.criteria))
  return average(selectedRatings.map(rating => extract(rating.criteria))) ?? 0
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
  const avgScore = averageScoreForRatings(ratings) ?? 0
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
