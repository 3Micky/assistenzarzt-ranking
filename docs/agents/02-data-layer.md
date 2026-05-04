# Agent 02 – Data Layer

## Ziel
Alle Datendateien, den Zustand-Store und die Berechnungs-Utilities erstellen.
Diese Schicht ist das Fundament für alle anderen Komponenten.

---

## src/data/criteria.js

```js
/** Kriterien-Definitionen für das Bewertungsformular */
export const CRITERIA = [
  {
    key: 'gehalt',
    label: 'Gehalt',
    emoji: '💰',
    description: 'Tarifkonformität, Zulagen, Gehaltsentwicklung',
    weight: 0.15,
    lowLabel: 'Unterbezahlt',
    highLabel: 'Faire Bezahlung',
  },
  {
    key: 'wlb',
    label: 'Work-Life-Balance',
    emoji: '⚖️',
    description: 'Überstunden, Urlaub, Planbarkeit der Freizeit',
    weight: 0.20,
    lowLabel: 'Kaum Freizeit',
    highLabel: 'Sehr ausgewogen',
  },
  {
    key: 'weiterbildung',
    label: 'Weiterbildung',
    emoji: '🎓',
    description: 'Qualität der Facharztausbildung, Lernkurve',
    weight: 0.18,
    lowLabel: 'Kaum Strukturiert',
    highLabel: 'Exzellent',
  },
  {
    key: 'mentoring',
    label: 'Mentoring',
    emoji: '🧑‍⚕️',
    description: 'Supervision durch Oberärzte, Feedback-Kultur',
    weight: 0.12,
    lowLabel: 'Auf sich gestellt',
    highLabel: 'Starke Unterstützung',
  },
  {
    key: 'atmosphaere',
    label: 'Arbeitsatmosphäre',
    emoji: '🤝',
    description: 'Teamklima, Umgang untereinander, Wertschätzung',
    weight: 0.15,
    lowLabel: 'Toxisch',
    highLabel: 'Sehr angenehm',
  },
  {
    key: 'infrastruktur',
    label: 'Infrastruktur',
    emoji: '🏥',
    description: 'Ausstattung, IT-Systeme, Räumlichkeiten',
    weight: 0.08,
    lowLabel: 'Veraltet',
    highLabel: 'Modern',
  },
  {
    key: 'dienste',
    label: 'Dienstbelastung',
    emoji: '🌙',
    description: 'Anzahl und Belastung der Nacht-/Wochenenddienste',
    weight: 0.07,
    lowLabel: 'Sehr viele Dienste',
    highLabel: 'Wenige Dienste',
  },
  {
    key: 'karriere',
    label: 'Karrierechancen',
    emoji: '📈',
    description: 'Perspektiven innerhalb des Hauses, Forschungsmöglichkeiten',
    weight: 0.05,
    lowLabel: 'Keine Perspektive',
    highLabel: 'Sehr gut',
  },
]

export const CRITERIA_KEYS = CRITERIA.map((c) => c.key)

export const SPECIALTIES = [
  'Allgemeinmedizin',
  'Anästhesiologie',
  'Augenheilkunde',
  'Chirurgie (Allgemein)',
  'Chirurgie (Unfall)',
  'Chirurgie (Viszeral)',
  'Dermatologie',
  'Frauenheilkunde',
  'Gastroenterologie',
  'Geriatrie',
  'HNO',
  'Hämatologie/Onkologie',
  'Innere Medizin',
  'Kardiologie',
  'Kinderheilkunde',
  'Neurologie',
  'Neurochirurgie',
  'Notfallmedizin',
  'Orthopädie',
  'Psychiatrie',
  'Radiologie',
  'Rheumatologie',
  'Urologie',
  'Sonstige',
]

export const REGIONS = {
  DE: [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
    'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
    'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
    'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
  ],
  AT: [
    'Burgenland', 'Kärnten', 'Niederösterreich', 'Oberösterreich',
    'Salzburg', 'Steiermark', 'Tirol', 'Vorarlberg', 'Wien',
  ],
  CH: [
    'Aargau', 'Basel', 'Bern', 'Freiburg', 'Genf', 'Glarus',
    'Graubünden', 'Luzern', 'Schaffhausen', 'Solothurn', 'St. Gallen',
    'Thurgau', 'Ticino', 'Uri', 'Waadt', 'Wallis', 'Zug', 'Zürich',
  ],
}
```

---

## src/data/cities.js

Städte mit Koordinaten für die Geo-Map-Marker:

```js
/**
 * Hauptstädte/Medizin-Standorte DACH mit lat/lng
 * lng, lat Reihenfolge (GeoJSON Standard, auch react-simple-maps)
 */
export const CITIES = [
  // Deutschland
  { name: 'Berlin',        country: 'DE', region: 'Berlin',                 coordinates: [13.405, 52.520] },
  { name: 'Hamburg',       country: 'DE', region: 'Hamburg',                coordinates: [9.993, 53.551] },
  { name: 'München',       country: 'DE', region: 'Bayern',                 coordinates: [11.576, 48.137] },
  { name: 'Köln',          country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [6.960, 50.938] },
  { name: 'Frankfurt',     country: 'DE', region: 'Hessen',                 coordinates: [8.682, 50.110] },
  { name: 'Stuttgart',     country: 'DE', region: 'Baden-Württemberg',      coordinates: [9.182, 48.775] },
  { name: 'Düsseldorf',    country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [6.773, 51.227] },
  { name: 'Leipzig',       country: 'DE', region: 'Sachsen',                coordinates: [12.374, 51.340] },
  { name: 'Nürnberg',      country: 'DE', region: 'Bayern',                 coordinates: [11.078, 49.452] },
  { name: 'Hannover',      country: 'DE', region: 'Niedersachsen',          coordinates: [9.732, 52.374] },
  { name: 'Bremen',        country: 'DE', region: 'Bremen',                 coordinates: [8.807, 53.073] },
  { name: 'Dresden',       country: 'DE', region: 'Sachsen',                coordinates: [13.737, 51.050] },
  { name: 'Freiburg',      country: 'DE', region: 'Baden-Württemberg',      coordinates: [7.852, 47.997] },
  { name: 'Heidelberg',    country: 'DE', region: 'Baden-Württemberg',      coordinates: [8.692, 49.398] },
  { name: 'Essen',         country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [7.011, 51.457] },
  // Österreich
  { name: 'Wien',          country: 'AT', region: 'Wien',                   coordinates: [16.373, 48.209] },
  { name: 'Graz',          country: 'AT', region: 'Steiermark',             coordinates: [15.440, 47.070] },
  { name: 'Linz',          country: 'AT', region: 'Oberösterreich',         coordinates: [14.292, 48.306] },
  { name: 'Salzburg',      country: 'AT', region: 'Salzburg',               coordinates: [13.044, 47.799] },
  { name: 'Innsbruck',     country: 'AT', region: 'Tirol',                  coordinates: [11.392, 47.269] },
  // Schweiz
  { name: 'Zürich',        country: 'CH', region: 'Zürich',                 coordinates: [8.541, 47.376] },
  { name: 'Bern',          country: 'CH', region: 'Bern',                   coordinates: [7.447, 46.948] },
  { name: 'Basel',         country: 'CH', region: 'Basel',                  coordinates: [7.589, 47.558] },
  { name: 'Genf',          country: 'CH', region: 'Genf',                   coordinates: [6.143, 46.204] },
  { name: 'Lausanne',      country: 'CH', region: 'Waadt',                  coordinates: [6.633, 46.520] },
  { name: 'Luzern',        country: 'CH', region: 'Luzern',                 coordinates: [8.301, 47.050] },
]

/** Hilfsfunktion: Stadt aus name finden */
export const getCityCoords = (cityName) =>
  CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase())?.coordinates ?? null
```

---

## src/data/sampleData.js

20 realistische (aber fiktive) Beispiel-Bewertungen als Seed-Daten:

```js
export const SAMPLE_RATINGS = [
  {
    id: 'seed-01', timestamp: '2024-03-15T10:23:00Z',
    hospital: 'Charité – Campus Mitte', city: 'Berlin', country: 'DE',
    region: 'Berlin', specialty: 'Neurologie', year: 2024,
    criteria: { gehalt: 6, wlb: 5, weiterbildung: 9, mentoring: 8, atmosphaere: 7, infrastruktur: 9, dienste: 4, karriere: 9 },
    comment: 'Sehr gutes Forschungsumfeld, Dienste sind aber belastend.',
  },
  {
    id: 'seed-02', timestamp: '2024-04-20T14:11:00Z',
    hospital: 'Universitätsklinikum München (LMU)', city: 'München', country: 'DE',
    region: 'Bayern', specialty: 'Innere Medizin', year: 2023,
    criteria: { gehalt: 7, wlb: 6, weiterbildung: 8, mentoring: 7, atmosphaere: 8, infrastruktur: 8, dienste: 5, karriere: 7 },
    comment: '',
  },
  {
    id: 'seed-03', timestamp: '2024-01-08T09:00:00Z',
    hospital: 'AKH Wien', city: 'Wien', country: 'AT',
    region: 'Wien', specialty: 'Chirurgie (Allgemein)', year: 2024,
    criteria: { gehalt: 8, wlb: 4, weiterbildung: 9, mentoring: 7, atmosphaere: 6, infrastruktur: 9, dienste: 3, karriere: 8 },
    comment: 'Top Ausbildung, aber lange Arbeitszeiten.',
  },
  {
    id: 'seed-04', timestamp: '2024-05-02T16:30:00Z',
    hospital: 'Universitätsspital Zürich', city: 'Zürich', country: 'CH',
    region: 'Zürich', specialty: 'Kardiologie', year: 2024,
    criteria: { gehalt: 10, wlb: 7, weiterbildung: 9, mentoring: 8, atmosphaere: 8, infrastruktur: 10, dienste: 6, karriere: 9 },
    comment: 'Gehalt in der Schweiz deutlich besser. Sehr modernes Haus.',
  },
  {
    id: 'seed-05', timestamp: '2023-11-14T11:45:00Z',
    hospital: 'Inselspital Bern', city: 'Bern', country: 'CH',
    region: 'Bern', specialty: 'Anästhesiologie', year: 2023,
    criteria: { gehalt: 9, wlb: 6, weiterbildung: 8, mentoring: 7, atmosphaere: 7, infrastruktur: 9, dienste: 5, karriere: 7 },
    comment: '',
  },
  {
    id: 'seed-06', timestamp: '2024-02-28T08:15:00Z',
    hospital: 'Uniklinik Frankfurt', city: 'Frankfurt', country: 'DE',
    region: 'Hessen', specialty: 'Hämatologie/Onkologie', year: 2022,
    criteria: { gehalt: 6, wlb: 5, weiterbildung: 8, mentoring: 6, atmosphaere: 6, infrastruktur: 7, dienste: 4, karriere: 7 },
    comment: 'Gute Weiterbildung, aber viele Überstunden ungefühlt.',
  },
  {
    id: 'seed-07', timestamp: '2024-06-10T13:00:00Z',
    hospital: 'Universitätsklinikum Hamburg-Eppendorf', city: 'Hamburg', country: 'DE',
    region: 'Hamburg', specialty: 'Psychiatrie', year: 2024,
    criteria: { gehalt: 7, wlb: 8, weiterbildung: 7, mentoring: 8, atmosphaere: 9, infrastruktur: 7, dienste: 7, karriere: 6 },
    comment: 'Tolle Atmosphäre, sehr kooperatives Team.',
  },
  {
    id: 'seed-08', timestamp: '2023-09-05T10:00:00Z',
    hospital: 'LKH Graz', city: 'Graz', country: 'AT',
    region: 'Steiermark', specialty: 'Orthopädie', year: 2023,
    criteria: { gehalt: 7, wlb: 7, weiterbildung: 7, mentoring: 6, atmosphaere: 7, infrastruktur: 7, dienste: 6, karriere: 6 },
    comment: '',
  },
  {
    id: 'seed-09', timestamp: '2024-03-22T15:00:00Z',
    hospital: 'Universitätsspital Basel', city: 'Basel', country: 'CH',
    region: 'Basel', specialty: 'Neurologie', year: 2024,
    criteria: { gehalt: 9, wlb: 7, weiterbildung: 8, mentoring: 8, atmosphaere: 8, infrastruktur: 9, dienste: 6, karriere: 8 },
    comment: '',
  },
  {
    id: 'seed-10', timestamp: '2024-01-30T09:30:00Z',
    hospital: 'Klinikum Stuttgart', city: 'Stuttgart', country: 'DE',
    region: 'Baden-Württemberg', specialty: 'Frauenheilkunde', year: 2024,
    criteria: { gehalt: 6, wlb: 6, weiterbildung: 7, mentoring: 7, atmosphaere: 7, infrastruktur: 8, dienste: 5, karriere: 6 },
    comment: '',
  },
  {
    id: 'seed-11', timestamp: '2023-12-01T12:00:00Z',
    hospital: 'Charité – Campus Virchow', city: 'Berlin', country: 'DE',
    region: 'Berlin', specialty: 'Chirurgie (Unfall)', year: 2023,
    criteria: { gehalt: 6, wlb: 4, weiterbildung: 8, mentoring: 7, atmosphaere: 6, infrastruktur: 8, dienste: 3, karriere: 8 },
    comment: 'Sehr gute Ausbildung, aber Work-Life-Balance leidet.',
  },
  {
    id: 'seed-12', timestamp: '2024-04-05T16:00:00Z',
    hospital: 'Uniklinik Köln', city: 'Köln', country: 'DE',
    region: 'Nordrhein-Westfalen', specialty: 'Innere Medizin', year: 2024,
    criteria: { gehalt: 7, wlb: 6, weiterbildung: 7, mentoring: 6, atmosphaere: 7, infrastruktur: 7, dienste: 5, karriere: 6 },
    comment: '',
  },
  {
    id: 'seed-13', timestamp: '2024-05-18T11:00:00Z',
    hospital: 'CHUV Lausanne', city: 'Lausanne', country: 'CH',
    region: 'Waadt', specialty: 'Innere Medizin', year: 2024,
    criteria: { gehalt: 9, wlb: 6, weiterbildung: 8, mentoring: 7, atmosphaere: 7, infrastruktur: 9, dienste: 5, karriere: 8 },
    comment: 'Französischsprachiges Umfeld, hohe Standards.',
  },
  {
    id: 'seed-14', timestamp: '2023-10-10T08:00:00Z',
    hospital: 'Klinikum Nürnberg', city: 'Nürnberg', country: 'DE',
    region: 'Bayern', specialty: 'Geriatrie', year: 2023,
    criteria: { gehalt: 6, wlb: 7, weiterbildung: 6, mentoring: 6, atmosphaere: 7, infrastruktur: 6, dienste: 7, karriere: 5 },
    comment: 'Gute Work-Life-Balance, weniger Forschungsfokus.',
  },
  {
    id: 'seed-15', timestamp: '2024-02-14T14:00:00Z',
    hospital: 'Medizinische Universität Innsbruck', city: 'Innsbruck', country: 'AT',
    region: 'Tirol', specialty: 'Radiologie', year: 2024,
    criteria: { gehalt: 7, wlb: 8, weiterbildung: 8, mentoring: 8, atmosphaere: 9, infrastruktur: 8, dienste: 7, karriere: 7 },
    comment: 'Schöner Standort, tolle Atmosphäre.',
  },
  {
    id: 'seed-16', timestamp: '2024-03-30T10:00:00Z',
    hospital: 'Uniklinik Düsseldorf', city: 'Düsseldorf', country: 'DE',
    region: 'Nordrhein-Westfalen', specialty: 'Neurologie', year: 2024,
    criteria: { gehalt: 6, wlb: 5, weiterbildung: 7, mentoring: 6, atmosphaere: 6, infrastruktur: 7, dienste: 4, karriere: 6 },
    comment: '',
  },
  {
    id: 'seed-17', timestamp: '2024-01-22T09:00:00Z',
    hospital: 'Universitätsspital Genf (HUG)', city: 'Genf', country: 'CH',
    region: 'Genf', specialty: 'Kardiologie', year: 2024,
    criteria: { gehalt: 9, wlb: 5, weiterbildung: 9, mentoring: 8, atmosphaere: 7, infrastruktur: 10, dienste: 4, karriere: 9 },
    comment: 'Sehr internationales Umfeld.',
  },
  {
    id: 'seed-18', timestamp: '2023-08-15T13:00:00Z',
    hospital: 'Klinikum Freiburg', city: 'Freiburg', country: 'DE',
    region: 'Baden-Württemberg', specialty: 'Chirurgie (Viszeral)', year: 2023,
    criteria: { gehalt: 6, wlb: 5, weiterbildung: 8, mentoring: 7, atmosphaere: 7, infrastruktur: 7, dienste: 4, karriere: 7 },
    comment: '',
  },
  {
    id: 'seed-19', timestamp: '2024-06-01T10:00:00Z',
    hospital: 'Uniklinik Leipzig', city: 'Leipzig', country: 'DE',
    region: 'Sachsen', specialty: 'Hämatologie/Onkologie', year: 2024,
    criteria: { gehalt: 6, wlb: 6, weiterbildung: 8, mentoring: 7, atmosphaere: 7, infrastruktur: 7, dienste: 5, karriere: 7 },
    comment: '',
  },
  {
    id: 'seed-20', timestamp: '2024-05-25T15:00:00Z',
    hospital: 'LKH Salzburg', city: 'Salzburg', country: 'AT',
    region: 'Salzburg', specialty: 'Anästhesiologie', year: 2024,
    criteria: { gehalt: 8, wlb: 6, weiterbildung: 7, mentoring: 7, atmosphaere: 8, infrastruktur: 8, dienste: 5, karriere: 7 },
    comment: '',
  },
]
```

---

## src/utils/calculations.js

```js
import { CRITERIA } from '../data/criteria.js'

/** Gewichteter Gesamt-Score aus einem Criteria-Objekt */
export function overallScore(criteria) {
  const total = CRITERIA.reduce((sum, c) => sum + (criteria[c.key] ?? 0) * c.weight, 0)
  return Math.round(total * 10) / 10
}

/** Farbwert für einen Score 1–10 */
export function scoreColor(score) {
  if (score >= 7.5) return '#22C55E'
  if (score >= 5.0) return '#F59E0B'
  return '#EF4444'
}

/** Score-Label */
export function scoreLabel(score) {
  if (score >= 8) return 'Ausgezeichnet'
  if (score >= 6.5) return 'Gut'
  if (score >= 5) return 'Durchschnittlich'
  return 'Mangelhaft'
}

/**
 * Aggregiert Ratings nach Klinikname
 * @returns {{ hospital, city, country, score, count }[]} sortiert nach score desc
 */
export function avgByHospital(ratings) {
  const map = {}
  ratings.forEach((r) => {
    const key = r.hospital
    if (!map[key]) map[key] = { hospital: r.hospital, city: r.city, country: r.country, scores: [] }
    map[key].scores.push(overallScore(r.criteria))
  })
  return Object.values(map)
    .map((h) => ({
      hospital: h.hospital,
      city: h.city,
      country: h.country,
      score: Math.round((h.scores.reduce((a, b) => a + b, 0) / h.scores.length) * 10) / 10,
      count: h.scores.length,
    }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Aggregiert Ratings nach Stadt (für Geo-Map-Marker)
 * @returns {{ city, country, coordinates, score, count }[]}
 */
export function avgByCity(ratings, citiesData) {
  const map = {}
  ratings.forEach((r) => {
    if (!map[r.city]) map[r.city] = { city: r.city, country: r.country, scores: [] }
    map[r.city].scores.push(overallScore(r.criteria))
  })
  return Object.values(map)
    .map((c) => {
      const cityInfo = citiesData.find((d) => d.name === c.city)
      return {
        city: c.city,
        country: c.country,
        coordinates: cityInfo?.coordinates ?? null,
        score: Math.round((c.scores.reduce((a, b) => a + b, 0) / c.scores.length) * 10) / 10,
        count: c.scores.length,
      }
    })
    .filter((c) => c.coordinates !== null)
}

/**
 * Radar-Chart-Daten für eine oder mehrere Kliniken
 * @param {string[]} hospitalNames
 * @param {Rating[]} ratings
 * @returns Recharts-kompatibles Array mit subject + ein Schlüssel pro Klinik
 */
export function radarData(hospitalNames, ratings) {
  return CRITERIA.map((c) => {
    const entry = { subject: c.label, emoji: c.emoji }
    hospitalNames.forEach((name) => {
      const relevant = ratings.filter((r) => r.hospital === name)
      if (relevant.length === 0) {
        entry[name] = 0
      } else {
        const avg = relevant.reduce((sum, r) => sum + (r.criteria[c.key] ?? 0), 0) / relevant.length
        entry[name] = Math.round(avg * 10) / 10
      }
    })
    return entry
  })
}

/**
 * Statistiken für StatsBar
 */
export function computeStats(ratings) {
  if (ratings.length === 0) return { total: 0, avgScore: 0, topHospital: '—', countDE: 0, countAT: 0, countCH: 0 }
  const scores = ratings.map((r) => overallScore(r.criteria))
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
  const top = avgByHospital(ratings)[0]
  return {
    total: ratings.length,
    avgScore,
    topHospital: top?.hospital ?? '—',
    countDE: ratings.filter((r) => r.country === 'DE').length,
    countAT: ratings.filter((r) => r.country === 'AT').length,
    countCH: ratings.filter((r) => r.country === 'CH').length,
  }
}
```

---

## src/store/ratingsStore.js

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SAMPLE_RATINGS } from '../data/sampleData.js'

const STORAGE_KEY = 'assistenzarzt-ratings-v1'

export const useRatingsStore = create(
  persist(
    (set, get) => ({
      ratings: [],

      /** Beim App-Start aufrufen; lädt Seed-Daten falls Storage leer */
      hydrate() {
        const stored = get().ratings
        if (stored.length === 0) {
          set({ ratings: SAMPLE_RATINGS })
        }
      },

      addRating(rating) {
        set((state) => ({ ratings: [rating, ...state.ratings] }))
      },

      deleteRating(id) {
        set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) }))
      },

      clearAll() {
        set({ ratings: [] })
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
)
```

---

## src/hooks/useRatings.js

```js
import { useMemo } from 'react'
import { useRatingsStore } from '../store/ratingsStore.js'
import { avgByHospital, avgByCity, computeStats, radarData } from '../utils/calculations.js'
import { CITIES } from '../data/cities.js'

export function useRatings() {
  const ratings = useRatingsStore((s) => s.ratings)
  const addRating = useRatingsStore((s) => s.addRating)

  const hospitalRankings = useMemo(() => avgByHospital(ratings), [ratings])
  const cityData        = useMemo(() => avgByCity(ratings, CITIES), [ratings])
  const stats           = useMemo(() => computeStats(ratings), [ratings])

  const getRadarData = (hospitalNames) => radarData(hospitalNames, ratings)

  const hospitalNames = useMemo(
    () => [...new Set(ratings.map((r) => r.hospital))].sort(),
    [ratings]
  )

  return { ratings, addRating, hospitalRankings, cityData, stats, getRadarData, hospitalNames }
}
```

## Verifizierung
- `import { useRatings } from './hooks/useRatings.js'` in einer Komponente sollte funktionieren
- Nach `hydrate()` sind 20 Seed-Ratings im Store
- `overallScore({ gehalt:8, wlb:8, weiterbildung:8, mentoring:8, atmosphaere:8, infrastruktur:8, dienste:8, karriere:8 })` → `8.0`
