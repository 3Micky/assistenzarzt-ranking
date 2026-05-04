# Architektur – Assistenzarzt-Ranking

## Überblick

Single-Page-Application ohne Backend. Alle Daten leben im Browser (LocalStorage).
Kein Login, keine Verifizierung — vollständig anonym.

## Datenfluss

```
User-Eingabe (RatingForm)
        │
        ▼
  Zustand Store (ratingsStore)
        │
  ┌─────┴──────┐
  │            │
  ▼            ▼
LocalStorage  Berechnungen (calculations.js)
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
 GeoMap   BarRanking  RadarComparison
```

## Routing-Struktur (React Router v6)

```
/              → Dashboard (default view: GeoMap-Tab)
/bewerten      → RatingForm
```

Tabs im Dashboard wechseln Views ohne URL-Änderung (lokaler State).

## State Management (Zustand)

```js
// ratingsStore.js
{
  ratings: Rating[],          // alle Bewertungen
  addRating(rating): void,    // neue Bewertung hinzufügen
  deleteRating(id): void,     // einzelne Bewertung löschen
  clearAll(): void,           // alle löschen (Dev-Tool)
  hydrate(): void,            // aus LocalStorage laden
}
```

Persistenz via Zustand `persist` middleware (auto sync mit LocalStorage).

## Datenmodell

```js
/**
 * @typedef {Object} Rating
 * @property {string}  id           - UUID v4
 * @property {string}  timestamp    - ISO 8601
 * @property {string}  hospital     - Name der Klinik/Abteilung
 * @property {string}  city         - Stadt
 * @property {'DE'|'AT'|'CH'} country
 * @property {string}  region       - Bundesland/Kanton
 * @property {string}  specialty    - Fachrichtung (aus enum-Liste)
 * @property {number}  year         - Jahr der Stelle (2018-2026)
 * @property {Criteria} criteria
 * @property {string}  [comment]    - Optionaler Freitext
 */

/**
 * @typedef {Object} Criteria
 * @property {number} gehalt        - Gehalt (1–10)
 * @property {number} wlb           - Work-Life-Balance (1–10)
 * @property {number} weiterbildung - Weiterbildungsqualität (1–10)
 * @property {number} mentoring     - Mentoring/Supervision (1–10)
 * @property {number} atmosphaere   - Arbeitsatmosphäre (1–10)
 * @property {number} infrastruktur - Infrastruktur/Equipment (1–10)
 * @property {number} dienste       - Dienstbelastung* (1–10)
 * @property {number} karriere      - Karrierechancen (1–10)
 */
// * Dienste: 10 = wenig Dienste (positiv), 1 = sehr viele Dienste (negativ)
```

## Berechnungen (calculations.js)

```js
// Gewichte der Kriterien für den Gesamt-Score
const WEIGHTS = {
  gehalt: 0.15,
  wlb: 0.20,
  weiterbildung: 0.18,
  mentoring: 0.12,
  atmosphaere: 0.15,
  infrastruktur: 0.08,
  dienste: 0.07,
  karriere: 0.05,
}

overallScore(criteria)  → number (1–10, eine Dezimalstelle)
avgByHospital(ratings)  → { hospital, city, country, score, count }[]
avgByCity(ratings)      → { city, lat, lng, score, count }[]
avgByCriteria(ratings)  → { criterion, avg }[]
topHospitals(n, ratings) → sorted avgByHospital[]
radarData(hospitalName, ratings) → Recharts-kompatibles Array
```

## Komponenten-Übersicht

### GeoMap (`/src/components/GeoMap/GeoMap.jsx`)
- Verwendet `react-simple-maps`: `ComposableMap`, `Geographies`, `Geography`, `Marker`
- Topojson: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json`
- Zeigt Weltkarte, zoomt auf DACH (Projektion: `geoMercator`, center [12, 47], scale 1800)
- DACH-Länder (ISO 3166-1 numerisch: DE=276, AT=40, CH=756) werden hervorgehoben
- `Marker`-Komponenten für jede Stadt mit ≥1 Bewertung
  - `cx` = Longitude, `cy` = Latitude (aus `cities.js`)
  - Farbe: d3-scale `scaleLinear` [1→10] → [`#EF4444` → `#F59E0B` → `#22C55E`]
  - Radius: `Math.sqrt(count) * 6` (min 8, max 40)
  - Tooltip on hover (MapTooltip.jsx)

### BarRanking (`/src/components/Charts/BarRanking.jsx`)
- Recharts `BarChart` (horizontal)
- Top-20 Kliniken nach Gesamt-Score
- Jeder Balken: Gradient-Fill (Blau → Cyan)
- X-Achse: Score 0–10
- Tooltip mit Score + Anzahl Bewertungen + Stadt

### RadarComparison (`/src/components/Charts/RadarComparison.jsx`)
- Recharts `RadarChart`
- Vergleich von 1–3 Kliniken gleichzeitig
- `HospitalSelector.jsx`: Multi-Select Dropdown für Kliniken
- Jede Klinik in anderer Farbe (Palette: sky-500, rose-500, amber-500)
- Achsen: die 8 Kriterien (Labels auf Deutsch)

### RatingForm (`/src/components/RatingForm/RatingForm.jsx`)
- 3-Schritte-Wizard
  1. `StepHospital`: Name, Stadt (Autocomplete aus cities.js), Land, Fachrichtung, Jahr
  2. `StepCriteria`: 8 Slider (1–10) mit Label + Emoji + Beschreibung
  3. `StepDone`: Erfolgsanimation, Link zurück zu Dashboard
- Fortschrittsbalken oben (1/3, 2/3, 3/3)
- Validierung: Alle Pflichtfelder in Schritt 1+2 müssen ausgefüllt sein

## Performance-Hinweise
- Alle Berechnungen in `useMemo` wrappen
- GeoMap: Geographies-Topojson wird gecacht (stable URL)
- Seed-Daten werden nur einmalig geladen (LocalStorage-Check)
