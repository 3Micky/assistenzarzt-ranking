import { DE_HOSPITALS } from '../data/hospitals.js'
import { AT_HOSPITALS } from '../data/hospitalsAT.js'
import { CH_HOSPITALS } from '../data/hospitalsCH.js'
import { plzToBundesland } from './plzToBundesland.js'

/**
 * Normalisiert einen String für den Vergleich:
 * Kleinschreibung, Umlaute vereinheitlichen, Sonderzeichen entfernen.
 * Synonyme (klinik/krankenhaus/klinikum/spital) werden vereinheitlicht.
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
    .replace(/\bklinikum\b/g, 'klinik').replace(/\bkliniken\b/g, 'klinik')
    .replace(/\bkrankenhaus\b/g, 'klinik').replace(/\bkrankenhaeuser\b/g, 'klinik')
    .replace(/\bhospital\b/g, 'klinik').replace(/\bspital\b/g, 'klinik')
}

/** Generische Registernamen → echter Name aus Träger ableiten */
const GENERIC_NAMES = new Set(['hauptstandort', 'haupthaus', 'hauptgebaeude', 'standort'])
function resolveDisplayName(hospital) {
  if (!hospital.carrier) return hospital.name
  const key = normalize(hospital.name).replace(/\s/g, '')
  if (!GENERIC_NAMES.has(key)) return hospital.name
  return hospital.carrier.replace(/\s+(GmbH|gGmbH|AG|e\.V\.|KG|OHG|GbR)\.?$/i, '').trim()
}

/** Alle Kliniken aus allen drei Ländern, angereichert mit country + region (für DE via PLZ) */
const ALL_HOSPITALS = [
  ...DE_HOSPITALS.map(h => ({
    name:    resolveDisplayName(h),
    city:    h.city,
    plz:     h.plz,
    street:  h.street,
    carrier: h.carrier,
    country: 'DE',
    region:  plzToBundesland(h.plz),
  })),
  ...AT_HOSPITALS.map(h => ({
    name:    resolveDisplayName(h),
    city:    h.city,
    plz:     h.plz,
    street:  h.street,
    carrier: h.carrier,
    country: 'AT',
    region:  h.region,
  })),
  ...CH_HOSPITALS.map(h => ({
    name:    resolveDisplayName(h),
    city:    h.city,
    plz:     h.plz,
    street:  h.street,
    carrier: h.carrier,
    country: 'CH',
    region:  h.region,
  })),
]

/** Levenshtein-Distanz zwischen zwei kurzen Strings */
function levenshtein(a, b) {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let cur = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const next = Math.min(prev[j] + 1, cur + 1, prev[j - 1] + cost)
      prev[j - 1] = cur
      cur = next
    }
    prev[b.length] = cur
  }
  return prev[b.length]
}

/** Max erlaubte Edit-Distanz abhängig von Token-Länge */
function maxDist(len) {
  if (len <= 3) return 0  // kurze Tokens: nur exakt
  if (len <= 5) return 1
  if (len <= 8) return 2
  return 3
}

/**
 * Prüft ob ein Token fuzzy in einem normalisierten Feld-String vorkommt.
 * Splittet das Feld in Wörter und prüft Levenshtein gegen jedes Wort.
 */
function fuzzyInField(token, field) {
  const max = maxDist(token.length)
  if (max === 0) return false
  return field.split(' ').some(word => {
    if (Math.abs(word.length - token.length) > max) return false
    return levenshtein(token, word) <= max
  })
}

/**
 * Berechnet einen Score für wie gut ein Hospital zur Suchanfrage passt.
 * Erst exaktes Matching (hoher Score), dann Levenshtein-Fallback (reduzierter Score).
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
  let fuzzyMatches     = 0

  for (const token of tokens) {
    const inName    = nName.includes(token)
    const inCity    = nCity.includes(token)
    const inRegion  = nRegion.includes(token)
    const inPlz     = nPlz.startsWith(token)
    const inCarrier = nCarrier.includes(token)

    if (inName || inCity || inRegion || inPlz || inCarrier) {
      if (inName)         matchedInName++
      else if (inCity)    matchedInCity++
      else if (inRegion)  matchedInRegion++
      else                matchedElsewhere++
    } else {
      // Kein exakter Match — Levenshtein-Fallback
      if (fuzzyInField(token, nName) || fuzzyInField(token, nCity)) {
        fuzzyMatches++
      } else {
        return 0  // Token passt nirgends → komplett raus
      }
    }
  }

  const totalTokens  = tokens.length
  const exactMatched = matchedInName + matchedInCity + matchedInRegion + matchedElsewhere
  let score = 0

  if (matchedInName === totalTokens) {
    score = 200
    if (nName.startsWith(tokens[0])) score += 50
  } else if (matchedInName + matchedInCity === totalTokens) {
    score = 150
  } else if (matchedInName + matchedInRegion === totalTokens) {
    score = 120
  } else if (matchedInCity === totalTokens) {
    score = 80
  } else if (exactMatched + fuzzyMatches === totalTokens) {
    // Gemischter Match: exakt + fuzzy
    score = fuzzyMatches === totalTokens ? 50 : 90
  } else {
    score = 60
  }

  if (exactMatched + fuzzyMatches === totalTokens) score += 20
  if (fuzzyMatches > 0) score -= fuzzyMatches * 15  // Penalty pro Tippfehler

  return Math.max(score, 1)
}

/**
 * Berechnet Token-Überlappung zwischen zwei Krankenhausnamen (0–1).
 * Wird verwendet, wenn exakte Namen in Bewertungen und DB divergieren.
 */
export function hospitalNameSimilarity(a, b) {
  const na = normalize(a).split(' ').filter(Boolean)
  const nb = normalize(b).split(' ').filter(Boolean)
  const intersection = na.filter(t => nb.includes(t))
  const union = [...new Set([...na, ...nb])]
  return union.length === 0 ? 0 : intersection.length / union.length
}

/**
 * Prüft, ob zwei Krankenhausnamen wahrscheinlich dieselbe Klinik meinen.
 * Zuerst exakter Match, dann slugify, dann Token-Overlap ≥ 0.5.
 */
export function matchHospitalName(ratingHospital, selectedHospital) {
  if (!ratingHospital || !selectedHospital) return false
  if (ratingHospital === selectedHospital) return true
  const rSlug = normalize(ratingHospital).replace(/\s+/g, '')
  const sSlug = normalize(selectedHospital).replace(/\s+/g, '')
  if (rSlug === sSlug) return true
  if (rSlug.includes(sSlug) || sSlug.includes(rSlug)) return true
  return hospitalNameSimilarity(ratingHospital, selectedHospital) >= 0.5
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

  // Bewertete Kliniken, die NICHT in ALL_HOSPITALS sind, als Extra-Einträge hinzufügen
  const extraRated = []
  for (const ratedName of ratedSet) {
    const alreadyInPool = pool.some(h => matchHospitalName(h.name, ratedName))
    if (!alreadyInPool) {
      const score = scoreHospital({ name: ratedName, city: '', region: '', carrier: '', plz: '' }, tokens)
      if (score > 0) {
        extraRated.push({
          name: ratedName,
          city: '',
          region: '',
          country: '',
          plz: '',
          carrier: '',
          hasRatings: true,
          score,
        })
      }
    }
  }

  scored.push(...extraRated)

  // "Stadt-Trap" entfernen: Krankenhäuser, deren Name identisch mit einer Stadt ist
  const queryAsCity = tokens.join(' ')
  const cityMatchCount = pool.filter(h => normalize(h.city) === queryAsCity).length
  const isCityTrap = (h) => cityMatchCount >= 3 && normalize(h.name) === queryAsCity
  const filtered = scored.filter(h => !isCityTrap(h))

  // Wenn Query = reiner Stadtnamen und es gibt ≥3 Kliniken dort →
  // zusätzlich ALLE Kliniken in dieser Stadt einblenden (Stadt-Suche)
  const isPureCityQuery = tokens.length === 1 && cityMatchCount >= 3
  if (isPureCityQuery) {
    const inFiltered = new Set(filtered.map(f => f.name))
    const cityHospitals = pool
      .filter(h => normalize(h.city) === queryAsCity && !inFiltered.has(h.name) && !isCityTrap(h))
      .map(h => ({ ...h, hasRatings: ratedSet.has(h.name), score: 70 }))
    filtered.push(...cityHospitals)
  }

  // Sortierung: bewertete Kliniken zuerst (Bonus), dann nach Score
  filtered.sort((a, b) => {
    const aFinal = a.score + (a.hasRatings ? 100 : 0) // Bewertete drängen nach vorne
    const bFinal = b.score + (b.hasRatings ? 100 : 0)
    return bFinal - aFinal
  })

  return filtered.slice(0, limit)
}

/**
 * Löst einen exakt eingegebenen Kliniknamen auf Stammdaten auf.
 * Hilft Formularen, wenn Nutzer*innen den Namen tippen und nicht aktiv
 * aus der Dropdown-Liste auswählen.
 *
 * @param {string} query
 * @returns {{ name:string, city:string, region:string, country:string, plz:string, carrier:string } | null}
 */
export function findHospitalByExactName(query) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return null
  return ALL_HOSPITALS.find(hospital => normalize(hospital.name) === normalizedQuery) || null
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

/**
 * Gibt alle Kliniken für eine Land/Bundesland/Stadt-Kombination zurück.
 * Wird für das Klinik-Dropdown in der Genauen Suche verwendet.
 * @param {{ country?: string, region?: string, city?: string }} filters
 * @param {Set<string>} ratedSet
 * @returns {{ name: string, city: string, region: string, country: string, hasRatings: boolean }[]}
 */
export function getHospitalsForFilters(filters = {}, ratedSet = new Set()) {
  let pool = ALL_HOSPITALS
  if (filters.country) pool = pool.filter(h => h.country === filters.country)
  if (filters.region) {
    const nRegion = normalize(filters.region)
    pool = pool.filter(h => normalize(h.region) === nRegion)
  }
  if (filters.city) {
    const nCity = normalize(filters.city)
    pool = pool.filter(h => normalize(h.city) === nCity)
  }
  return pool
    .map(h => ({ ...h, hasRatings: ratedSet.has(h.name) }))
    .sort((a, b) => {
      // Bewertete zuerst, dann alphabetisch
      if (a.hasRatings !== b.hasRatings) return a.hasRatings ? -1 : 1
      return a.name.localeCompare(b.name, 'de')
    })
}
