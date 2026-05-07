import { DE_HOSPITALS } from '../data/hospitals.js'
import { AT_HOSPITALS } from '../data/hospitalsAT.js'
import { CH_HOSPITALS } from '../data/hospitalsCH.js'
import { plzToBundesland } from './plzToBundesland.js'

/** Alle Kliniken aus allen drei Ländern, angereichert mit country + region (für DE via PLZ) */
const ALL_HOSPITALS = [
  ...DE_HOSPITALS.map(h => ({
    name:    h.name,
    city:    h.city,
    plz:     h.plz,
    street:  h.street,
    carrier: h.carrier,
    country: 'DE',
    region:  plzToBundesland(h.plz),
  })),
  ...AT_HOSPITALS.map(h => ({
    name:    h.name,
    city:    h.city,
    plz:     h.plz,
    street:  h.street,
    carrier: h.carrier,
    country: 'AT',
    region:  h.region,
  })),
  ...CH_HOSPITALS.map(h => ({
    name:    h.name,
    city:    h.city,
    plz:     h.plz,
    street:  h.street,
    carrier: h.carrier,
    country: 'CH',
    region:  h.region,
  })),
]

/**
 * Normalisiert einen String für den Vergleich:
 * Kleinschreibung, Umlaute vereinheitlichen, Sonderzeichen entfernen.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[.\-–,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Berechnet einen Score für wie gut ein Hospital zur Suchanfrage passt.
 * @param {object} hospital
 * @param {string[]} tokens  normalisierte Token aus der Suche
 * @returns {number}  Score 0–200; 0 = kein Match
 */
function scoreHospital(hospital, tokens) {
  if (tokens.length === 0) return 0

  const nName    = normalize(hospital.name)
  const nCity    = normalize(hospital.city)
  const nRegion  = normalize(hospital.region)
  const nCarrier = normalize(hospital.carrier)
  const nPlz     = hospital.plz || ''

  let matchedInName    = 0
  let matchedInCity    = 0
  let matchedInRegion  = 0
  let matchedElsewhere = 0

  for (const token of tokens) {
    const inName    = nName.includes(token)
    const inCity    = nCity.includes(token)
    const inRegion  = nRegion.includes(token)
    const inPlz     = nPlz.startsWith(token)
    const inCarrier = nCarrier.includes(token)

    if (!inName && !inCity && !inRegion && !inPlz && !inCarrier) return 0

    if (inName)    matchedInName++
    else if (inCity)   matchedInCity++
    else if (inRegion) matchedInRegion++
    else               matchedElsewhere++
  }

  const totalTokens = tokens.length
  let score = 0

  // Alle Tokens matchen nur im Namen → beste Trefferqualität
  if (matchedInName === totalTokens) {
    score = 200
    // Bonus für exakten Wortbeginn
    if (nName.startsWith(tokens[0])) score += 50
  } else if (matchedInName + matchedInCity === totalTokens) {
    // Klassischer Multi-Feld-Match: "Sankt Joseph Berlin"
    score = 150
  } else if (matchedInName + matchedInRegion === totalTokens) {
    score = 120
  } else if (matchedInCity === totalTokens) {
    score = 80
  } else {
    score = 60
  }

  // Bonus: alle Tokens decken sich vollständig ab
  const totalMatched = matchedInName + matchedInCity + matchedInRegion + matchedElsewhere
  if (totalMatched === totalTokens) score += 20

  return score
}

/**
 * Sucht Krankenhäuser aus der gesamten DACH-Datenbank (+ bewertete Kliniken).
 *
 * @param {string} query          - Freitext-Eingabe des Nutzers
 * @param {Set<string>} ratedSet  - Set der bereits bewerteten Krankenhausnamen
 * @param {{ country?: string, region?: string, city?: string }} filters - optionale Vorfilter (Genaue Suche)
 * @param {number} [limit=8]      - max. Anzahl Ergebnisse
 * @returns {{ name:string, city:string, region:string, country:string, plz:string, carrier:string, hasRatings:boolean, score:number }[]}
 */
export function searchHospitals(query, ratedSet = new Set(), filters = {}, limit = 8) {
  const raw = query.trim()
  if (raw.length < 1) return []

  const tokens = normalize(raw).split(' ').filter(t => t.length >= 1)
  if (tokens.length === 0) return []

  let pool = ALL_HOSPITALS

  // Vorfilter anwenden (Genaue Suche: Land / Bundesland / Stadt)
  if (filters.country) {
    pool = pool.filter(h => h.country === filters.country)
  }
  if (filters.region) {
    const nRegion = normalize(filters.region)
    pool = pool.filter(h => normalize(h.region) === nRegion)
  }
  if (filters.city) {
    const nCity = normalize(filters.city)
    pool = pool.filter(h => normalize(h.city).includes(nCity))
  }

  const scored = pool
    .map(h => ({ ...h, hasRatings: ratedSet.has(h.name), score: scoreHospital(h, tokens) }))
    .filter(h => h.score > 0)

  // Sortierung: bewertete Kliniken zuerst (Bonus), dann nach Score
  scored.sort((a, b) => {
    const aFinal = a.score + (a.hasRatings ? 30 : 0)
    const bFinal = b.score + (b.hasRatings ? 30 : 0)
    return bFinal - aFinal
  })

  return scored.slice(0, limit)
}

/**
 * Gibt alle eindeutigen Städte für ein bestimmtes Land / Bundesland zurück.
 * Wird für die Genaue Suche Kaskadierung verwendet.
 * @param {{ country?: string, region?: string }} filters
 * @returns {string[]}
 */
export function getCitiesForFilters(filters = {}) {
  let pool = ALL_HOSPITALS
  if (filters.country) pool = pool.filter(h => h.country === filters.country)
  if (filters.region) {
    const nRegion = normalize(filters.region)
    pool = pool.filter(h => normalize(h.region) === nRegion)
  }
  return [...new Set(pool.map(h => h.city))].sort()
}
