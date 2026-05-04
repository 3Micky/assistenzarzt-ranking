# Swiss Brutalist Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete redesign of AssistenzDoc into Swiss Brutalist aesthetic — new Tailwind tokens, revised 13-field criteria model, 4-step rating form with live search, filtered Berichte table, and 6-page routing.

**Architecture:** Foundation-first — tokens → data model → shell → pages. Each page is a thin wrapper that composes focused components. Design system lives in `tailwind.config.js` + `index.css`. No inline `style={{}}` props except SVG attributes and dynamic numeric values (e.g. chart dimensions).

**Tech Stack:** React 18, Vite 5, Tailwind CSS v3, React Router v6, Zustand v4, Recharts v2, react-simple-maps v3, Vitest (added for data layer)

---

## File Map

**Created:**
- `src/pages/HomePage.jsx` — Startseite: hero + search + heatmap + statsbar
- `src/pages/BerichtePage.jsx` — Filtered table of all ratings
- `src/pages/KartePage.jsx` — Full-page DACH heatmap
- `src/pages/RankingPage.jsx` — Bar chart top hospitals
- `src/pages/VergleichPage.jsx` — Radar comparison
- `src/pages/BewertungPage.jsx` — 4-step rating form wrapper
- `src/components/Layout/TabNav.jsx` — Extracted tab nav component
- `src/components/Search/SearchWidget.jsx` — Toggle + input + dropdown
- `src/components/Search/SearchDropdown.jsx` — Live result list
- `src/components/Berichte/FilterBar.jsx` — Filter controls for berichte
- `src/components/Berichte/BerichteTabelle.jsx` — Table with ink-grid rows
- `src/components/RatingForm/StepNiceToHave.jsx` — New step 3
- `src/test/calculations.test.js` — Data layer tests

**Modified:**
- `tailwind.config.js` — canvas/ink/hazard tokens, font families
- `index.html` — Google Fonts (Archivo Black, JetBrains Mono)
- `src/index.css` — brutalist utility classes
- `src/App.jsx` — 6-route setup
- `src/components/Layout/Header.jsx` — register strip + brutalist nav
- `src/components/Dashboard/StatsBar.jsx` — ink-grid layout
- `src/components/GeoMap/GeoMap.jsx` — canvas fill, ink borders, hazard hover
- `src/components/Charts/BarRanking.jsx` — brutalist chart styling
- `src/components/Charts/RadarComparison.jsx` — brutalist chart styling
- `src/components/RatingForm/RatingForm.jsx` — 4-step orchestrator
- `src/components/RatingForm/StepHospital.jsx` — quick + precise search
- `src/components/RatingForm/StepCriteria.jsx` — new 9-field criteria
- `src/components/RatingForm/StepDone.jsx` — brutalist confirmation
- `src/data/criteria.js` — new data model + SPECIALTIES + REGIONS preserved
- `src/data/sampleData.js` — new seed data matching new model
- `src/utils/calculations.js` — score from new model
- `src/store/ratingsStore.js` — minor: default criteria shape

---

## Task 1: Vitest setup

**Files:**
- Create: `vite.config.js` (modify)
- Create: `src/test/setup.js`

- [ ] Install vitest

```bash
cd /Users/hermannbartels/Desktop/assistenzdoc-react-final
npm install --save-dev vitest
```

- [ ] Add test config to `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
})
```

- [ ] Verify vitest runs

```bash
npx vitest run --reporter=verbose 2>&1 | head -20
```
Expected: "No test files found" or similar — no errors.

- [ ] Commit

```bash
git init && git add vite.config.js package.json package-lock.json
git commit -m "chore: add vitest for data layer tests"
```

---

## Task 2: Tailwind config — design tokens

**Files:**
- Modify: `tailwind.config.js`
- Modify: `index.html`

- [ ] Update `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas:     '#F4F4F0',
        'canvas-alt': '#EAE8E3',
        ink:        '#050505',
        hazard:     '#E61919',
        'score-low':  '#EF4444',
        'score-mid':  '#F59E0B',
        'score-high': '#22C55E',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none:    '0px',
        sm:      '0px',
        md:      '0px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        full:    '0px',
      },
      letterSpacing: {
        widest: '0.12em',
        wider:  '0.08em',
      },
    },
  },
  plugins: [],
}
```

- [ ] Add Google Fonts to `index.html` `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] Commit

```bash
git add tailwind.config.js index.html
git commit -m "feat: add brutalist design tokens to tailwind config"
```

---

## Task 3: index.css — brutalist utility classes

**Files:**
- Modify: `src/index.css`

- [ ] Replace `src/index.css` entirely

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-score-low:  #EF4444;
    --color-score-mid:  #F59E0B;
    --color-score-high: #22C55E;
  }

  html { scroll-behavior: smooth; }

  body {
    @apply bg-canvas text-ink font-sans antialiased;
  }

  * { @apply box-border; }

  ::-webkit-scrollbar       { @apply w-1.5 h-1.5; }
  ::-webkit-scrollbar-track { @apply bg-canvas-alt; }
  ::-webkit-scrollbar-thumb { @apply bg-ink/30; }
}

@layer components {
  /* ── Ink Grid (1px dividers via gap on ink background) ── */
  .ink-grid {
    @apply grid gap-px bg-ink;
  }
  .ink-grid > * {
    @apply bg-canvas;
  }
  .ink-grid-alt > *:nth-child(even) {
    @apply bg-canvas-alt;
  }

  /* ── Buttons ── */
  .btn-hazard {
    @apply inline-flex items-center justify-center
           bg-hazard text-white
           font-mono text-[10px] tracking-wider uppercase
           px-5 py-2.5
           transition-opacity duration-100
           hover:opacity-90 active:opacity-80
           focus:outline-none;
  }
  .btn-ink {
    @apply inline-flex items-center justify-center
           bg-ink text-canvas
           font-mono text-[10px] tracking-wider uppercase
           px-5 py-2.5
           transition-opacity duration-100
           hover:opacity-80
           focus:outline-none;
  }
  .btn-ghost-ink {
    @apply inline-flex items-center justify-center
           bg-canvas text-ink/50 border border-ink/20
           font-mono text-[10px] tracking-wider uppercase
           px-5 py-2.5
           transition-colors duration-100
           hover:text-ink hover:border-ink
           focus:outline-none;
  }

  /* ── Tabs ── */
  .tab-active {
    @apply bg-hazard text-white font-mono text-[10px] tracking-wider uppercase px-5 py-2.5 cursor-pointer;
  }
  .tab-inactive {
    @apply bg-canvas text-ink/40 font-mono text-[10px] tracking-wider uppercase px-5 py-2.5 cursor-pointer
           hover:text-ink transition-colors;
  }

  /* ── Form Elements ── */
  .input-brutalist {
    @apply w-full bg-white border border-ink text-ink
           px-3 py-2 font-sans text-sm
           focus:outline-none focus:ring-1 focus:ring-hazard
           placeholder-ink/30;
  }
  .select-brutalist {
    @apply input-brutalist appearance-none cursor-pointer;
  }

  /* ── Mono Label ── */
  .mono-label {
    @apply font-mono text-[8px] tracking-widest uppercase text-ink/50;
  }
  .mono-label-red {
    @apply font-mono text-[8px] tracking-widest uppercase text-hazard;
  }

  /* ── Register Strip ── */
  .register-strip {
    @apply bg-ink text-canvas/80 font-mono text-[8px] tracking-widest uppercase
           flex items-center justify-between px-5 py-1;
  }

  /* ── Section heading ── */
  .section-heading {
    @apply font-display text-ink uppercase tracking-tight leading-none;
  }

  /* ── Score colors ── */
  .score-high { @apply text-score-high font-mono font-bold; }
  .score-mid  { @apply text-score-mid  font-mono font-bold; }
  .score-low  { @apply text-score-low  font-mono font-bold; }

  /* ── Range Slider ── */
  .slider-brutalist {
    @apply w-full h-0.5 appearance-none cursor-pointer bg-ink/20 outline-none;
    accent-color: #E61919;
  }
  .slider-brutalist::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 bg-hazard border-2 border-canvas cursor-pointer;
  }

  /* ── Yes/No Toggle ── */
  .toggle-group {
    @apply ink-grid;
    grid-template-columns: 1fr 1fr;
  }
  .toggle-yes-active   { @apply bg-score-high text-white font-mono text-[9px] tracking-wider uppercase py-1.5 text-center cursor-pointer; }
  .toggle-no-active    { @apply bg-score-low  text-white font-mono text-[9px] tracking-wider uppercase py-1.5 text-center cursor-pointer; }
  .toggle-inactive     { @apply bg-canvas text-ink/40 font-mono text-[9px] tracking-wider uppercase py-1.5 text-center cursor-pointer hover:text-ink; }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-hazard to-red-700 bg-clip-text text-transparent;
  }
}
```

- [ ] Start dev server and verify no CSS errors

```bash
npm run dev
```
Expected: App loads at http://localhost:5173, console shows no CSS errors.

- [ ] Commit

```bash
git add src/index.css
git commit -m "feat: replace design system with swiss brutalist utility classes"
```

---

## Task 4: New criteria.js data model

**Files:**
- Modify: `src/data/criteria.js`
- Create: `src/test/criteria.test.js`

- [ ] Write failing test

```js
// src/test/criteria.test.js
import { describe, it, expect } from 'vitest'
import { CRITERIA_ESSENTIAL, CRITERIA_NICE, ALL_CRITERIA_KEYS, SPECIALTIES, REGIONS } from '../data/criteria.js'

describe('criteria', () => {
  it('essential criteria has correct keys', () => {
    const keys = CRITERIA_ESSENTIAL.map(c => c.key)
    expect(keys).toContain('arbeitszeitenVon')
    expect(keys).toContain('diensteProMonat')
    expect(keys).toContain('dienstsystem')
    expect(keys).toContain('fortbildungFreistellung')
  })

  it('nice criteria has correct keys', () => {
    const keys = CRITERIA_NICE.map(c => c.key)
    expect(keys).toContain('workLifeBalance')
    expect(keys).toContain('teamAtmosphaere')
    expect(keys).toContain('parkplatz')
  })

  it('ALL_CRITERIA_KEYS contains all keys', () => {
    expect(ALL_CRITERIA_KEYS.length).toBe(CRITERIA_ESSENTIAL.length + CRITERIA_NICE.length)
  })

  it('REGIONS has DE AT CH', () => {
    expect(REGIONS.DE.length).toBeGreaterThan(0)
    expect(REGIONS.AT.length).toBeGreaterThan(0)
    expect(REGIONS.CH.length).toBeGreaterThan(0)
  })
})
```

- [ ] Run test — expect FAIL

```bash
npx vitest run src/test/criteria.test.js
```
Expected: FAIL — named exports not found.

- [ ] Replace `src/data/criteria.js`

```js
/** Pflicht-Kriterien */
export const CRITERIA_ESSENTIAL = [
  { key: 'arbeitszeitenVon',         label: 'Arbeitszeiten von',          type: 'time'    },
  { key: 'arbeitszeitenBis',         label: 'Arbeitszeiten bis',          type: 'time'    },
  { key: 'diensteProMonat',          label: 'Dienste / Monat',            type: 'number', min: 0, max: 15 },
  { key: 'opsProMonat',              label: 'OPs / Monat',               type: 'number', min: 0, max: 50 },
  { key: 'rotationsplaene',          label: 'Rotationspläne',            type: 'boolean' },
  { key: 'rotationsplaeneText',      label: 'Rotationspläne (Details)',  type: 'text'    },
  { key: 'ueberstundenAufschreiben', label: 'Überstunden aufschreiben',  type: 'boolean' },
  { key: 'dienstsystem',             label: 'Dienstsystem',              type: 'enum', options: ['12h', '24h'] },
  { key: 'fortbildungFreistellung',  label: 'Fortbildung — Freistellung', type: 'boolean' },
  { key: 'fortbildungBezahlt',       label: 'Fortbildung — Bezahlt',     type: 'boolean' },
  { key: 'abteilungsgroesse',        label: 'Abteilungsgröße (Ärzte)',   type: 'number', min: 1, max: 500 },
  { key: 'mitarbeitergespraeche',    label: 'Mitarbeitergespräche / Jahr', type: 'number', min: 0, max: 12 },
]

/** Nice-to-have-Kriterien */
export const CRITERIA_NICE = [
  { key: 'parkplatz',       label: 'Parkplatz',          type: 'boolean'            },
  { key: 'workLifeBalance', label: 'Work-Life-Balance',  type: 'slider', min: 1, max: 10 },
  { key: 'teamAtmosphaere', label: 'Team-Atmosphäre',    type: 'slider', min: 1, max: 10 },
  { key: 'benefits',        label: 'Benefits',           type: 'text'               },
]

export const ALL_CRITERIA_KEYS = [
  ...CRITERIA_ESSENTIAL.map(c => c.key),
  ...CRITERIA_NICE.map(c => c.key),
]

/** Default-Werte für ein leeres Formular */
export const DEFAULT_CRITERIA = {
  arbeitszeitenVon:         '07:00',
  arbeitszeitenBis:         '16:00',
  diensteProMonat:          4,
  opsProMonat:              0,
  rotationsplaene:          null,
  rotationsplaeneText:      '',
  ueberstundenAufschreiben: null,
  dienstsystem:             null,
  fortbildungFreistellung:  null,
  fortbildungBezahlt:       null,
  abteilungsgroesse:        10,
  mitarbeitergespraeche:    1,
  parkplatz:                null,
  workLifeBalance:          5,
  teamAtmosphaere:          5,
  benefits:                 '',
}

export const SPECIALTIES = [
  'Allgemeinmedizin', 'Anästhesiologie', 'Augenheilkunde',
  'Chirurgie (Allgemein)', 'Chirurgie (Unfall)', 'Chirurgie (Viszeral)',
  'Dermatologie', 'Frauenheilkunde', 'Gastroenterologie', 'Geriatrie',
  'HNO', 'Hämatologie/Onkologie', 'Innere Medizin', 'Kardiologie',
  'Kinderheilkunde', 'Neurologie', 'Neurochirurgie', 'Notfallmedizin',
  'Orthopädie', 'Psychiatrie', 'Radiologie', 'Rheumatologie',
  'Urologie', 'Sonstige',
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

export const COUNTRY_LABELS = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }
export const COUNTRY_FLAGS  = { DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭' }
```

- [ ] Run test — expect PASS

```bash
npx vitest run src/test/criteria.test.js
```
Expected: 4 tests PASS.

- [ ] Commit

```bash
git add src/data/criteria.js src/test/criteria.test.js
git commit -m "feat: replace criteria model with 13-field brutalist data schema"
```

---

## Task 5: New calculations.js

**Files:**
- Modify: `src/utils/calculations.js`
- Create: `src/test/calculations.test.js`

- [ ] Write failing test

```js
// src/test/calculations.test.js
import { describe, it, expect } from 'vitest'
import { overallScore, scoreColor, scoreLabel, avgByHospital, computeStats } from '../utils/calculations.js'

const mockRating = (overrides = {}) => ({
  id: 'r1', hospital: 'Test Klinik', city: 'Berlin', country: 'DE',
  criteria: {
    workLifeBalance: 8, teamAtmosphaere: 7,
    ueberstundenAufschreiben: true, fortbildungFreistellung: true,
    fortbildungBezahlt: true, diensteProMonat: 4,
    ...overrides,
  },
})

describe('overallScore', () => {
  it('returns number between 1 and 10', () => {
    const score = overallScore(mockRating().criteria)
    expect(score).toBeGreaterThanOrEqual(1)
    expect(score).toBeLessThanOrEqual(10)
  })

  it('high wlb + team = high score', () => {
    const score = overallScore({ workLifeBalance: 10, teamAtmosphaere: 10,
      ueberstundenAufschreiben: true, fortbildungFreistellung: true,
      fortbildungBezahlt: true, diensteProMonat: 0 })
    expect(score).toBeGreaterThan(8)
  })

  it('low wlb + many dienste = low score', () => {
    const score = overallScore({ workLifeBalance: 1, teamAtmosphaere: 1,
      ueberstundenAufschreiben: false, fortbildungFreistellung: false,
      fortbildungBezahlt: false, diensteProMonat: 15 })
    expect(score).toBeLessThan(4)
  })
})

describe('scoreColor', () => {
  it('returns green for high score', () => expect(scoreColor(8)).toBe('#22C55E'))
  it('returns amber for mid score', () => expect(scoreColor(6)).toBe('#F59E0B'))
  it('returns red for low score',  () => expect(scoreColor(3)).toBe('#EF4444'))
})

describe('computeStats', () => {
  it('returns zeros for empty array', () => {
    const s = computeStats([])
    expect(s.total).toBe(0)
    expect(s.avgScore).toBe(0)
  })

  it('counts by country', () => {
    const ratings = [
      { ...mockRating(), country: 'DE' },
      { ...mockRating(), country: 'AT' },
      { ...mockRating(), country: 'CH' },
    ]
    const s = computeStats(ratings)
    expect(s.countDE).toBe(1)
    expect(s.countAT).toBe(1)
    expect(s.countCH).toBe(1)
  })
})
```

- [ ] Run test — expect FAIL

```bash
npx vitest run src/test/calculations.test.js
```

- [ ] Replace `src/utils/calculations.js`

```js
/**
 * Gewichteter Score aus dem neuen Kriteriensatz.
 * Nur messbare Felder fließen ein; optionale Felder werden ignoriert wenn null.
 */
export function overallScore(criteria) {
  const wlb    = criteria.workLifeBalance  ?? 5
  const team   = criteria.teamAtmosphaere  ?? 5
  const ueb    = criteria.ueberstundenAufschreiben === true  ? 10
               : criteria.ueberstundenAufschreiben === false ? 1 : 5
  const frei   = criteria.fortbildungFreistellung  === true  ? 10
               : criteria.fortbildungFreistellung  === false ? 4 : 5
  const bezahlt = criteria.fortbildungBezahlt      === true  ? 10
               : criteria.fortbildungBezahlt       === false ? 3 : 5
  const dienste = criteria.diensteProMonat != null
    ? Math.max(1, 10 - (criteria.diensteProMonat * 0.6))
    : 5

  const score = wlb * 0.30 + team * 0.25 + ueb * 0.20 + frei * 0.10 + bezahlt * 0.10 + dienste * 0.05
  return Math.round(score * 10) / 10
}

export function scoreColor(score) {
  if (score >= 7.5) return '#22C55E'
  if (score >= 5.0) return '#F59E0B'
  return '#EF4444'
}

export function scoreLabel(score) {
  if (score >= 8)   return 'Ausgezeichnet'
  if (score >= 6.5) return 'Gut'
  if (score >= 5)   return 'Durchschnittlich'
  return 'Mangelhaft'
}

export function avgByHospital(ratings) {
  const map = {}
  ratings.forEach((r) => {
    if (!map[r.hospital]) map[r.hospital] = { hospital: r.hospital, city: r.city, country: r.country, scores: [] }
    map[r.hospital].scores.push(overallScore(r.criteria))
  })
  return Object.values(map)
    .map((h) => ({
      hospital: h.hospital,
      city:     h.city,
      country:  h.country,
      score:    Math.round((h.scores.reduce((a, b) => a + b, 0) / h.scores.length) * 10) / 10,
      count:    h.scores.length,
    }))
    .sort((a, b) => b.score - a.score)
}

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
        city:        c.city,
        country:     c.country,
        coordinates: cityInfo?.coordinates ?? null,
        score:       Math.round((c.scores.reduce((a, b) => a + b, 0) / c.scores.length) * 10) / 10,
        count:       c.scores.length,
      }
    })
    .filter((c) => c.coordinates !== null)
}

/** Radar data — uses wlb/team sliders + derived scores for boolean fields */
export function radarData(hospitalNames, ratings) {
  const axes = [
    { key: 'workLifeBalance',          label: 'Work-Life',   extract: c => c.workLifeBalance  ?? 5 },
    { key: 'teamAtmosphaere',          label: 'Team',        extract: c => c.teamAtmosphaere  ?? 5 },
    { key: 'ueberstundenAufschreiben', label: 'Überstunden', extract: c => c.ueberstundenAufschreiben === true ? 10 : c.ueberstundenAufschreiben === false ? 1 : 5 },
    { key: 'fortbildungFreistellung',  label: 'Fortbildung', extract: c => c.fortbildungFreistellung  === true ? 10 : c.fortbildungFreistellung  === false ? 4 : 5 },
    { key: 'diensteProMonat',          label: 'Dienste',     extract: c => Math.max(1, 10 - ((c.diensteProMonat ?? 4) * 0.6)) },
  ]
  return axes.map(({ key, label, extract }) => {
    const entry = { subject: label, key }
    hospitalNames.forEach((name) => {
      const relevant = ratings.filter((r) => r.hospital === name)
      entry[name] = relevant.length === 0
        ? 0
        : Math.round((relevant.reduce((sum, r) => sum + extract(r.criteria), 0) / relevant.length) * 10) / 10
    })
    return entry
  })
}

export function computeStats(ratings) {
  if (ratings.length === 0) return { total: 0, avgScore: 0, topHospital: '—', countDE: 0, countAT: 0, countCH: 0 }
  const scores   = ratings.map((r) => overallScore(r.criteria))
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
  const top      = avgByHospital(ratings)[0]
  return {
    total:       ratings.length,
    avgScore,
    topHospital: top?.hospital ?? '—',
    countDE:     ratings.filter((r) => r.country === 'DE').length,
    countAT:     ratings.filter((r) => r.country === 'AT').length,
    countCH:     ratings.filter((r) => r.country === 'CH').length,
  }
}
```

- [ ] Run tests — expect PASS

```bash
npx vitest run src/test/calculations.test.js
```
Expected: all tests PASS.

- [ ] Commit

```bash
git add src/utils/calculations.js src/test/calculations.test.js
git commit -m "feat: update score calculation for new criteria model"
```

---

## Task 6: New sampleData.js

**Files:**
- Modify: `src/data/sampleData.js`

- [ ] Replace `src/data/sampleData.js`

```js
export const SAMPLE_RATINGS = [
  {
    id: 'seed-01', timestamp: '2024-03-15T10:23:00Z',
    hospital: 'Charité – Universitätsmedizin Berlin', city: 'Berlin',
    country: 'DE', region: 'Berlin', specialty: 'Neurologie', year: 2024,
    criteria: {
      arbeitszeitenVon: '07:00', arbeitszeitenBis: '16:30',
      diensteProMonat: 6, opsProMonat: 0,
      rotationsplaene: true, rotationsplaeneText: 'Jährliche Rotation durch 3 Stationen',
      ueberstundenAufschreiben: true, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 42, mitarbeitergespraeche: 2,
      parkplatz: false, workLifeBalance: 6, teamAtmosphaere: 8, benefits: 'BVG-Ticket',
    },
    comment: 'Sehr gutes Forschungsumfeld, Dienste sind aber belastend.',
  },
  {
    id: 'seed-02', timestamp: '2024-04-20T14:11:00Z',
    hospital: 'LMU Klinikum München', city: 'München',
    country: 'DE', region: 'Bayern', specialty: 'Innere Medizin', year: 2023,
    criteria: {
      arbeitszeitenVon: '07:30', arbeitszeitenBis: '17:00',
      diensteProMonat: 4, opsProMonat: 0,
      rotationsplaene: true, rotationsplaeneText: '',
      ueberstundenAufschreiben: true, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 35, mitarbeitergespraeche: 2,
      parkplatz: true, workLifeBalance: 7, teamAtmosphaere: 8, benefits: 'Kantine',
    },
    comment: '',
  },
  {
    id: 'seed-03', timestamp: '2024-01-08T09:00:00Z',
    hospital: 'AKH Wien', city: 'Wien',
    country: 'AT', region: 'Wien', specialty: 'Chirurgie (Allgemein)', year: 2024,
    criteria: {
      arbeitszeitenVon: '07:00', arbeitszeitenBis: '19:00',
      diensteProMonat: 8, opsProMonat: 20,
      rotationsplaene: false, rotationsplaeneText: '',
      ueberstundenAufschreiben: false, dienstsystem: '12h',
      fortbildungFreistellung: true, fortbildungBezahlt: false,
      abteilungsgroesse: 60, mitarbeitergespraeche: 1,
      parkplatz: true, workLifeBalance: 4, teamAtmosphaere: 6, benefits: '',
    },
    comment: 'Top Ausbildung, aber lange Arbeitszeiten.',
  },
  {
    id: 'seed-04', timestamp: '2024-05-02T16:30:00Z',
    hospital: 'Universitätsspital Zürich', city: 'Zürich',
    country: 'CH', region: 'Zürich', specialty: 'Kardiologie', year: 2024,
    criteria: {
      arbeitszeitenVon: '08:00', arbeitszeitenBis: '17:00',
      diensteProMonat: 3, opsProMonat: 0,
      rotationsplaene: true, rotationsplaeneText: 'Rotation alle 6 Monate',
      ueberstundenAufschreiben: true, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 28, mitarbeitergespraeche: 4,
      parkplatz: true, workLifeBalance: 8, teamAtmosphaere: 9, benefits: 'Jobrad, Kantine',
    },
    comment: 'Gehalt in der Schweiz deutlich besser. Sehr modernes Haus.',
  },
  {
    id: 'seed-05', timestamp: '2023-11-14T11:45:00Z',
    hospital: 'Inselspital Bern', city: 'Bern',
    country: 'CH', region: 'Bern', specialty: 'Anästhesiologie', year: 2023,
    criteria: {
      arbeitszeitenVon: '07:00', arbeitszeitenBis: '16:00',
      diensteProMonat: 5, opsProMonat: 30,
      rotationsplaene: true, rotationsplaeneText: '',
      ueberstundenAufschreiben: true, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 22, mitarbeitergespraeche: 2,
      parkplatz: true, workLifeBalance: 7, teamAtmosphaere: 7, benefits: '',
    },
    comment: '',
  },
  {
    id: 'seed-06', timestamp: '2024-02-28T08:15:00Z',
    hospital: 'Universitätsklinikum Frankfurt', city: 'Frankfurt',
    country: 'DE', region: 'Hessen', specialty: 'Hämatologie/Onkologie', year: 2022,
    criteria: {
      arbeitszeitenVon: '07:00', arbeitszeitenBis: '18:00',
      diensteProMonat: 7, opsProMonat: 0,
      rotationsplaene: false, rotationsplaeneText: '',
      ueberstundenAufschreiben: false, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: false,
      abteilungsgroesse: 30, mitarbeitergespraeche: 1,
      parkplatz: false, workLifeBalance: 5, teamAtmosphaere: 6, benefits: '',
    },
    comment: 'Gute Weiterbildung, aber viele Überstunden.',
  },
  {
    id: 'seed-07', timestamp: '2024-06-10T13:00:00Z',
    hospital: 'UKE Hamburg', city: 'Hamburg',
    country: 'DE', region: 'Hamburg', specialty: 'Psychiatrie', year: 2024,
    criteria: {
      arbeitszeitenVon: '08:00', arbeitszeitenBis: '16:00',
      diensteProMonat: 3, opsProMonat: 0,
      rotationsplaene: true, rotationsplaeneText: 'Strukturiertes Rotationsprogramm',
      ueberstundenAufschreiben: true, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 18, mitarbeitergespraeche: 4,
      parkplatz: false, workLifeBalance: 9, teamAtmosphaere: 9, benefits: 'HVV-Ticket',
    },
    comment: 'Tolle Atmosphäre, sehr kooperatives Team.',
  },
  {
    id: 'seed-08', timestamp: '2023-09-05T10:00:00Z',
    hospital: 'LKH Graz', city: 'Graz',
    country: 'AT', region: 'Steiermark', specialty: 'Orthopädie', year: 2023,
    criteria: {
      arbeitszeitenVon: '07:00', arbeitszeitenBis: '15:30',
      diensteProMonat: 4, opsProMonat: 15,
      rotationsplaene: true, rotationsplaeneText: '',
      ueberstundenAufschreiben: true, dienstsystem: '12h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 20, mitarbeitergespraeche: 2,
      parkplatz: true, workLifeBalance: 7, teamAtmosphaere: 7, benefits: '',
    },
    comment: '',
  },
  {
    id: 'seed-09', timestamp: '2024-04-01T09:30:00Z',
    hospital: 'Universitätsklinikum Freiburg', city: 'Freiburg',
    country: 'DE', region: 'Baden-Württemberg', specialty: 'Neurologie', year: 2024,
    criteria: {
      arbeitszeitenVon: '07:30', arbeitszeitenBis: '16:30',
      diensteProMonat: 5, opsProMonat: 0,
      rotationsplaene: true, rotationsplaeneText: '',
      ueberstundenAufschreiben: true, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 25, mitarbeitergespraeche: 2,
      parkplatz: true, workLifeBalance: 7, teamAtmosphaere: 8, benefits: 'Fahrrad-Leasing',
    },
    comment: '',
  },
  {
    id: 'seed-10', timestamp: '2023-12-20T14:00:00Z',
    hospital: 'Medizinische Universität Wien', city: 'Wien',
    country: 'AT', region: 'Wien', specialty: 'Kardiologie', year: 2023,
    criteria: {
      arbeitszeitenVon: '07:00', arbeitszeitenBis: '17:00',
      diensteProMonat: 6, opsProMonat: 0,
      rotationsplaene: true, rotationsplaeneText: '',
      ueberstundenAufschreiben: false, dienstsystem: '24h',
      fortbildungFreistellung: true, fortbildungBezahlt: true,
      abteilungsgroesse: 40, mitarbeitergespraeche: 2,
      parkplatz: false, workLifeBalance: 6, teamAtmosphaere: 7, benefits: '',
    },
    comment: '',
  },
]
```

- [ ] Verify store hydration — start dev server, open browser console

```bash
npm run dev
```
In browser console: `JSON.parse(localStorage.getItem('ratings'))` → should seed with new data on first load.

- [ ] Commit

```bash
git add src/data/sampleData.js
git commit -m "feat: update seed data for new criteria model"
```

---

## Task 7: App.jsx — 6-route setup

**Files:**
- Modify: `src/App.jsx`

- [ ] Replace `src/App.jsx`

```jsx
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Layout/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import BerichtePage from './pages/BerichtePage.jsx'
import KartePage from './pages/KartePage.jsx'
import RankingPage from './pages/RankingPage.jsx'
import VergleichPage from './pages/VergleichPage.jsx'
import BewertungPage from './pages/BewertungPage.jsx'
import { useRatingsStore } from './store/ratingsStore.js'

export default function App() {
  const hydrate = useRatingsStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<HomePage />}     />
          <Route path="/berichte"  element={<BerichtePage />} />
          <Route path="/karte"     element={<KartePage />}    />
          <Route path="/ranking"   element={<RankingPage />}  />
          <Route path="/vergleich" element={<VergleichPage />}/>
          <Route path="/bewerten"  element={<BewertungPage />}/>
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] Create page stubs so app doesn't crash — create all 6 pages

```bash
mkdir -p /Users/hermannbartels/Desktop/assistenzdoc-react-final/src/pages
```

Create `src/pages/HomePage.jsx`:
```jsx
export default function HomePage() {
  return <div className="p-8 font-mono text-[10px] uppercase tracking-widest">[ STARTSEITE — TODO ]</div>
}
```

Create `src/pages/BerichtePage.jsx`:
```jsx
export default function BerichtePage() {
  return <div className="p-8 font-mono text-[10px] uppercase tracking-widest">[ BERICHTE — TODO ]</div>
}
```

Create `src/pages/KartePage.jsx`:
```jsx
export default function KartePage() {
  return <div className="p-8 font-mono text-[10px] uppercase tracking-widest">[ KARTE — TODO ]</div>
}
```

Create `src/pages/RankingPage.jsx`:
```jsx
export default function RankingPage() {
  return <div className="p-8 font-mono text-[10px] uppercase tracking-widest">[ RANKING — TODO ]</div>
}
```

Create `src/pages/VergleichPage.jsx`:
```jsx
export default function VergleichPage() {
  return <div className="p-8 font-mono text-[10px] uppercase tracking-widest">[ VERGLEICH — TODO ]</div>
}
```

Create `src/pages/BewertungPage.jsx`:
```jsx
export default function BewertungPage() {
  return <div className="p-8 font-mono text-[10px] uppercase tracking-widest">[ BEWERTUNG — TODO ]</div>
}
```

- [ ] Verify app loads without errors at http://localhost:5173

- [ ] Commit

```bash
git add src/App.jsx src/pages/
git commit -m "feat: add 6-route app structure with page stubs"
```

---

## Task 8: Header.jsx — brutalist header

**Files:**
- Modify: `src/components/Layout/Header.jsx`

- [ ] Replace `src/components/Layout/Header.jsx`

```jsx
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/berichte',  label: 'BERICHTE'  },
  { to: '/karte',     label: 'KARTE'     },
  { to: '/ranking',   label: 'RANKING'   },
  { to: '/vergleich', label: 'VERGLEICH' },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-ink sticky top-0 z-50 bg-canvas">
      {/* Register Strip */}
      <div className="register-strip">
        <span>ASSISTENZARZT-RANKING /// DE · AT · CH</span>
        <span className="text-canvas/40">ANONYME BEWERTUNGSPLATTFORM</span>
      </div>

      {/* Main Header */}
      <div className="flex items-stretch">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-5 py-3 border-r border-ink hover:bg-canvas-alt transition-colors">
          <div className="w-8 h-8 bg-ink flex items-center justify-center text-base flex-shrink-0">
            🏥
          </div>
          <div>
            <div className="font-display text-sm text-ink uppercase leading-none tracking-tight">
              AssistenzDoc
            </div>
            <div className="mono-label mt-0.5">Ranking-Plattform</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-stretch flex-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 border-r border-ink/10 font-mono text-[9px] tracking-wider uppercase transition-colors
                ${pathname === to
                  ? 'text-ink border-b-2 border-b-hazard bg-canvas-alt'
                  : 'text-ink/40 hover:text-ink hover:bg-canvas-alt'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link to="/bewerten" className="btn-hazard px-6 border-l border-ink flex-shrink-0">
          [ + BEWERTUNG ]
        </Link>
      </div>
    </header>
  )
}
```

- [ ] Verify header renders correctly at http://localhost:5173 — register strip, logo, nav links, red CTA

- [ ] Commit

```bash
git add src/components/Layout/Header.jsx
git commit -m "feat: brutalist header with register strip and hazard CTA"
```

---

## Task 9: TabNav.jsx

**Files:**
- Create: `src/components/Layout/TabNav.jsx`

- [ ] Create `src/components/Layout/TabNav.jsx`

```jsx
/**
 * @param {{ tabs: {id:string, label:string}[], active: string, onChange: (id:string)=>void }} props
 */
export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: `repeat(${tabs.length}, auto) 1fr` }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={active === tab.id ? 'tab-active' : 'tab-inactive'}
        >
          {tab.label}
        </button>
      ))}
      {/* Filler cell */}
      <div className="bg-canvas" />
    </div>
  )
}
```

- [ ] Commit

```bash
git add src/components/Layout/TabNav.jsx
git commit -m "feat: extract TabNav as reusable brutalist component"
```

---

## Task 10: SearchDropdown + SearchWidget

**Files:**
- Create: `src/components/Search/SearchDropdown.jsx`
- Create: `src/components/Search/SearchWidget.jsx`

- [ ] Create `src/components/Search/` directory

```bash
mkdir -p /Users/hermannbartels/Desktop/assistenzdoc-react-final/src/components/Search
```

- [ ] Create `src/components/Search/SearchDropdown.jsx`

```jsx
import { COUNTRY_FLAGS } from '../../data/criteria.js'

/**
 * @param {{ results: {type:'klinik'|'stadt'|'bundesland', label:string, country:string, count?:number}[], onSelect: (r)=>void }} props
 */
export default function SearchDropdown({ results, onSelect }) {
  if (results.length === 0) return null

  const typeLabel = { klinik: 'KLINIK', stadt: 'STADT', bundesland: 'BUNDESLAND' }

  return (
    <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white">
      {results.map((r, i) => (
        <button
          key={i}
          onClick={() => onSelect(r)}
          className="w-full flex items-center gap-3 px-4 py-2 border-b border-ink/10 last:border-b-0
                     hover:bg-canvas-alt transition-colors text-left"
        >
          <span className={`font-mono text-[8px] tracking-widest uppercase min-w-[64px] ${r.type === 'klinik' ? 'text-hazard' : 'text-ink/40'}`}>
            {typeLabel[r.type]}
          </span>
          <span className="text-xs font-bold text-ink flex-1">{r.label}</span>
          <span className="font-mono text-[8px] text-ink/40 flex-shrink-0">
            {COUNTRY_FLAGS[r.country]} {r.count != null ? `${r.count} KLINIKEN` : r.country}
          </span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] Create `src/components/Search/SearchWidget.jsx`

```jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchDropdown from './SearchDropdown.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { COUNTRY_LABELS } from '../../data/criteria.js'

const COUNTRY_ALIASES = {
  deutschland: 'DE', de: 'DE',
  österreich: 'AT', oesterreich: 'AT', at: 'AT', austria: 'AT',
  schweiz: 'CH', ch: 'CH', swiss: 'CH', switzerland: 'CH',
}

/**
 * @param {{ defaultMode?: 'lesen'|'bewerten' }} props
 */
export default function SearchWidget({ defaultMode = 'lesen' }) {
  const [mode, setMode]       = useState(defaultMode)
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
  const ratings               = useRatingsStore((s) => s.ratings)
  const navigate              = useNavigate()
  const wrapperRef            = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function buildResults(q) {
    if (!q.trim()) return []
    const lower = q.toLowerCase().trim()

    // Country alias check
    const countryCode = COUNTRY_ALIASES[lower]

    const hospitals = [...new Set(ratings.map(r => r.hospital))]
    const cities    = [...new Set(ratings.map(r => r.city))]
    const regions   = [...new Set(ratings.map(r => r.region).filter(Boolean))]

    const out = []

    if (countryCode) {
      const label = COUNTRY_LABELS[countryCode]
      const count = [...new Set(ratings.filter(r => r.country === countryCode).map(r => r.hospital))].length
      out.push({ type: 'bundesland', label, country: countryCode, count })
    }

    hospitals.filter(h => h.toLowerCase().includes(lower)).slice(0, 4).forEach(h => {
      const r = ratings.find(r => r.hospital === h)
      out.push({ type: 'klinik', label: h, country: r.country })
    })

    cities.filter(c => c.toLowerCase().includes(lower)).slice(0, 3).forEach(c => {
      const r   = ratings.find(r => r.city === c)
      const cnt = [...new Set(ratings.filter(r => r.city === c).map(r => r.hospital))].length
      out.push({ type: 'stadt', label: c, country: r.country, count: cnt })
    })

    regions.filter(rg => rg.toLowerCase().includes(lower)).slice(0, 2).forEach(rg => {
      const r   = ratings.find(r => r.region === rg)
      const cnt = [...new Set(ratings.filter(r => r.region === rg).map(r => r.hospital))].length
      out.push({ type: 'bundesland', label: rg, country: r.country, count: cnt })
    })

    return out.slice(0, 8)
  }

  function handleChange(e) {
    const q = e.target.value
    setQuery(q)
    setResults(buildResults(q))
    setOpen(true)
  }

  function handleSelect(r) {
    setQuery(r.label)
    setOpen(false)
    navigate(`/berichte?q=${encodeURIComponent(r.label)}&type=${r.type}&country=${r.country}`)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setOpen(false)
    if (mode === 'bewerten') {
      navigate(`/bewerten?q=${encodeURIComponent(query)}`)
    } else {
      navigate(`/berichte?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="border border-ink bg-canvas">
      {/* Mode toggle */}
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button
          onClick={() => setMode('lesen')}
          className={mode === 'lesen' ? 'tab-active' : 'tab-inactive'}
        >
          &gt;&gt;&gt; BERICHTE LESEN
        </button>
        <button
          onClick={() => { setMode('bewerten'); navigate('/bewerten') }}
          className={mode === 'bewerten' ? 'tab-active' : 'tab-inactive'}
        >
          [ BEWERTEN ]
        </button>
      </div>

      {/* Search row */}
      <form onSubmit={handleSubmit} className="relative" ref={wrapperRef}>
        <div className="ink-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <input
            className="bg-white border-none outline-none px-4 py-3 text-sm font-sans text-ink placeholder-ink/30 w-full"
            placeholder="Klinik, Stadt, Bundesland, Deutschland…"
            value={query}
            onChange={handleChange}
            onFocus={() => query && setOpen(true)}
            autoComplete="off"
          />
          <button type="submit" className="btn-hazard px-6 border-l border-ink whitespace-nowrap">
            SUCHEN &gt;&gt;&gt;
          </button>
        </div>

        {open && (
          <SearchDropdown results={results} onSelect={handleSelect} />
        )}
      </form>
    </div>
  )
}
```

- [ ] Commit

```bash
git add src/components/Search/
git commit -m "feat: add SearchWidget with live dropdown and country alias matching"
```

---

## Task 11: StatsBar.jsx — ink-grid layout

**Files:**
- Modify: `src/components/Dashboard/StatsBar.jsx`

- [ ] Replace `src/components/Dashboard/StatsBar.jsx`

```jsx
import { useRatings } from '../../hooks/useRatings.js'

function StatCell({ label, value, valueClass = '' }) {
  return (
    <div className="bg-canvas px-3 py-3">
      <div className={`font-mono text-xl font-bold leading-none tabular-nums ${valueClass}`}>
        {value}
      </div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  )
}

export default function StatsBar() {
  const { stats } = useRatings()
  const top = stats.topHospital.length > 20 ? stats.topHospital.slice(0, 18) + '…' : stats.topHospital

  return (
    <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
      <StatCell label="BEWERTUNGEN" value={stats.total}            valueClass="text-hazard" />
      <StatCell label="⌀ SCORE"     value={stats.avgScore.toFixed(1)} />
      <StatCell label="TOP-KLINIK"  value={top} valueClass="text-xs leading-tight pt-1" />
      <StatCell label="🇩🇪 DEUTSCHLAND" value={stats.countDE} />
      <StatCell label="🇦🇹 ÖSTERREICH"  value={stats.countAT} />
      <StatCell label="🇨🇭 SCHWEIZ"      value={stats.countCH} />
    </div>
  )
}
```

- [ ] Commit

```bash
git add src/components/Dashboard/StatsBar.jsx
git commit -m "feat: StatsBar with ink-grid 1px dividers"
```

---

## Task 12: GeoMap.jsx — brutalist restyling

**Files:**
- Modify: `src/components/GeoMap/GeoMap.jsx`

- [ ] Open `src/components/GeoMap/GeoMap.jsx` and find where country/land fills and borders are set (look for `fill`, `stroke` props on `<Geographies>` or `<Geography>`)

- [ ] Update the Geography style block to use canvas fill + ink border + hazard hover. Replace the existing style object on `<Geography>` with:

```jsx
// Inside the Geography component's style prop:
style={{
  default: {
    fill:        '#F4F4F0',
    stroke:      '#050505',
    strokeWidth: 0.5,
    outline:     'none',
  },
  hover: {
    fill:        '#F4F4F0',
    stroke:      '#E61919',
    strokeWidth: 1.5,
    outline:     'none',
  },
  pressed: {
    fill:        '#EAE8E3',
    stroke:      '#E61919',
    strokeWidth: 1.5,
    outline:     'none',
  },
}}
```

- [ ] Remove any dark background from the map container — replace `bg-slate-900` or similar dark class with `bg-canvas`

- [ ] Verify map renders at http://localhost:5173/karte — countries on newsprint background, black borders, red on hover

- [ ] Commit

```bash
git add src/components/GeoMap/GeoMap.jsx
git commit -m "feat: GeoMap brutalist restyling — canvas fill, ink borders, hazard hover"
```

---

## Task 13: HomePage.jsx

**Files:**
- Modify: `src/pages/HomePage.jsx`

- [ ] Replace `src/pages/HomePage.jsx`

```jsx
import SearchWidget from '../components/Search/SearchWidget.jsx'
import GeoMap from '../components/GeoMap/GeoMap.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="border-b border-ink px-6 pt-8 pb-6">
        <div className="mono-label-red mb-2">[ ÜBERSICHT ]</div>
        <h1 className="font-display text-4xl text-ink uppercase tracking-tight leading-none mb-3">
          Assistenzarztstellen<br />im Vergleich
        </h1>
        <p className="text-sm text-ink/60 max-w-xl leading-relaxed">
          Anonyme Bewertungen von Assistenzärzten aus Deutschland, Österreich und der Schweiz.
        </p>
      </div>

      {/* Search */}
      <div className="border-b border-ink px-6 py-4">
        <div className="max-w-xl">
          <SearchWidget defaultMode="lesen" />
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Map */}
      <div className="border-b border-ink">
        <div className="px-6 py-2 border-b border-ink">
          <span className="mono-label">/// DACH-HEATMAP</span>
        </div>
        <GeoMap />
      </div>
    </div>
  )
}
```

- [ ] Verify at http://localhost:5173 — hero, search widget, stats, map all visible

- [ ] Commit

```bash
git add src/pages/HomePage.jsx
git commit -m "feat: HomePage with hero, search widget, stats, and map"
```

---

## Task 14: KartePage.jsx

**Files:**
- Modify: `src/pages/KartePage.jsx`

- [ ] Replace `src/pages/KartePage.jsx`

```jsx
import GeoMap from '../components/GeoMap/GeoMap.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function KartePage() {
  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// DACH-HEATMAP</span>
        <span className="text-canvas/40">BEWERTUNGEN NACH REGION</span>
      </div>
      <StatsBar />
      <GeoMap />
    </div>
  )
}
```

- [ ] Verify at http://localhost:5173/karte

- [ ] Commit

```bash
git add src/pages/KartePage.jsx
git commit -m "feat: KartePage full-page DACH heatmap"
```

---

## Task 15: FilterBar.jsx + BerichteTabelle.jsx + BerichtePage.jsx

**Files:**
- Create: `src/components/Berichte/FilterBar.jsx`
- Create: `src/components/Berichte/BerichteTabelle.jsx`
- Modify: `src/pages/BerichtePage.jsx`

- [ ] Create `src/components/Berichte/` directory

```bash
mkdir -p /Users/hermannbartels/Desktop/assistenzdoc-react-final/src/components/Berichte
```

- [ ] Create `src/components/Berichte/FilterBar.jsx`

```jsx
import { REGIONS, SPECIALTIES, COUNTRY_FLAGS } from '../../data/criteria.js'

/**
 * @param {{ filters: object, onChange: (k:string, v:string)=>void }} props
 */
export default function FilterBar({ filters, onChange }) {
  const regionOptions = filters.country && REGIONS[filters.country]
    ? REGIONS[filters.country]
    : [...REGIONS.DE, ...REGIONS.AT, ...REGIONS.CH]

  return (
    <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: 'repeat(5, auto) 1fr' }}>
      {/* Land */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">LAND</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.country}
          onChange={e => onChange('country', e.target.value)}
        >
          <option value="">ALLE</option>
          <option value="DE">🇩🇪 DE</option>
          <option value="AT">🇦🇹 AT</option>
          <option value="CH">🇨🇭 CH</option>
        </select>
      </div>

      {/* Bundesland */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">BUNDESLAND / KANTON</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.region}
          onChange={e => onChange('region', e.target.value)}
        >
          <option value="">ALLE</option>
          {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Fachrichtung */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">FACHRICHTUNG</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.specialty}
          onChange={e => onChange('specialty', e.target.value)}
        >
          <option value="">ALLE</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Dienstsystem */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">DIENSTSYSTEM</div>
        <select
          className="select-brutalist text-[11px] py-1"
          value={filters.dienstsystem}
          onChange={e => onChange('dienstsystem', e.target.value)}
        >
          <option value="">ALLE</option>
          <option value="12h">12H</option>
          <option value="24h">24H</option>
        </select>
      </div>

      {/* Klinik */}
      <div className="bg-canvas px-3 py-2">
        <div className="mono-label mb-1">KLINIK</div>
        <input
          className="input-brutalist text-[11px] py-1"
          placeholder="Name…"
          value={filters.hospital}
          onChange={e => onChange('hospital', e.target.value)}
        />
      </div>

      {/* Filler */}
      <div className="bg-canvas" />
    </div>
  )
}
```

- [ ] Create `src/components/Berichte/BerichteTabelle.jsx`

```jsx
import { overallScore, scoreColor } from '../../utils/calculations.js'
import { COUNTRY_FLAGS } from '../../data/criteria.js'

const PAGE_SIZE = 20

/**
 * @param {{ ratings: Rating[] }} props
 */
export default function BerichteTabelle({ ratings }) {
  if (ratings.length === 0) {
    return (
      <div className="px-6 py-12 text-center font-mono text-[10px] tracking-widest uppercase text-ink/40">
        /// KEINE ERGEBNISSE GEFUNDEN
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ink">
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-4 py-2 text-left font-normal border-r border-canvas/10">KLINIK</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">LAND</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-left font-normal border-r border-canvas/10 whitespace-nowrap">FACH</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">ZEITEN</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">DIENSTE</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">SYST.</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">ÜB.</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal border-r border-canvas/10 whitespace-nowrap">WLB</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-canvas/70 px-3 py-2 text-center font-normal whitespace-nowrap">TEAM</th>
            </tr>
          </thead>
          <tbody>
            {ratings.slice(0, PAGE_SIZE).map((r, i) => {
              const rowBg = i % 2 === 0 ? 'bg-canvas' : 'bg-canvas-alt'
              const ueb = r.criteria.ueberstundenAufschreiben
              return (
                <tr key={r.id} className={`${rowBg} border-b border-ink/10`}>
                  <td className="px-4 py-2 text-xs font-bold text-ink border-r border-ink/10">{r.hospital}</td>
                  <td className="px-3 py-2 text-center font-mono text-xs border-r border-ink/10">{COUNTRY_FLAGS[r.country]}</td>
                  <td className="px-3 py-2 font-mono text-[9px] uppercase text-ink/60 border-r border-ink/10">{r.specialty}</td>
                  <td className="px-3 py-2 text-center font-mono text-[10px] border-r border-ink/10">{r.criteria.arbeitszeitenVon}–{r.criteria.arbeitszeitenBis}</td>
                  <td className="px-3 py-2 text-center font-mono text-[10px] font-bold border-r border-ink/10">{r.criteria.diensteProMonat}/mo</td>
                  <td className="px-3 py-2 text-center font-mono text-[9px] border-r border-ink/10 uppercase">{r.criteria.dienstsystem ?? '—'}</td>
                  <td className={`px-3 py-2 text-center text-xs font-bold border-r border-ink/10 ${ueb === true ? 'text-score-high' : ueb === false ? 'text-score-low' : 'text-ink/30'}`}>
                    {ueb === true ? '✓' : ueb === false ? '✗' : '—'}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs font-bold border-r border-ink/10"
                      style={{ color: scoreColor(r.criteria.workLifeBalance ?? 5) }}>
                    {r.criteria.workLifeBalance ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs font-bold"
                      style={{ color: scoreColor(r.criteria.teamAtmosphaere ?? 5) }}>
                    {r.criteria.teamAtmosphaere ?? '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-ink px-4 py-2 flex items-center justify-between">
        <span className="mono-label">{ratings.length} BERICHTE GEFUNDEN</span>
        {ratings.length > PAGE_SIZE && (
          <span className="mono-label text-hazard">(ZEIGE ERSTE {PAGE_SIZE})</span>
        )}
      </div>
    </div>
  )
}
```

- [ ] Replace `src/pages/BerichtePage.jsx`

```jsx
import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRatingsStore } from '../store/ratingsStore.js'
import FilterBar from '../components/Berichte/FilterBar.jsx'
import BerichteTabelle from '../components/Berichte/BerichteTabelle.jsx'

const EMPTY_FILTERS = { country: '', region: '', specialty: '', dienstsystem: '', hospital: '' }

export default function BerichtePage() {
  const ratings       = useRatingsStore((s) => s.ratings)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => {
    const q = searchParams.get('q') ?? ''
    return { ...EMPTY_FILTERS, hospital: q }
  })

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value, ...(key === 'country' ? { region: '' } : {}) }))
  }

  const filtered = useMemo(() => {
    return ratings.filter(r => {
      if (filters.country     && r.country   !== filters.country)     return false
      if (filters.region      && r.region    !== filters.region)      return false
      if (filters.specialty   && r.specialty !== filters.specialty)   return false
      if (filters.dienstsystem && r.criteria.dienstsystem !== filters.dienstsystem) return false
      if (filters.hospital    && !r.hospital.toLowerCase().includes(filters.hospital.toLowerCase())) return false
      return true
    })
  }, [ratings, filters])

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// BERICHTE LESEN</span>
        <span className="text-canvas/40">ALLE BEWERTUNGEN</span>
      </div>
      <FilterBar filters={filters} onChange={updateFilter} />
      <BerichteTabelle ratings={filtered} />
    </div>
  )
}
```

- [ ] Verify at http://localhost:5173/berichte — filter bar + table with ink-grid dividers

- [ ] Commit

```bash
git add src/components/Berichte/ src/pages/BerichtePage.jsx
git commit -m "feat: Berichte page with filter bar and ink-grid table"
```

---

## Task 16: RatingForm — 4-step form

**Files:**
- Modify: `src/components/RatingForm/StepHospital.jsx`
- Modify: `src/components/RatingForm/StepCriteria.jsx`
- Create: `src/components/RatingForm/StepNiceToHave.jsx`
- Modify: `src/components/RatingForm/StepDone.jsx`
- Modify: `src/components/RatingForm/RatingForm.jsx`
- Modify: `src/pages/BewertungPage.jsx`

- [ ] Replace `src/components/RatingForm/StepHospital.jsx`

```jsx
import { useState } from 'react'
import { REGIONS, SPECIALTIES, COUNTRY_LABELS, COUNTRY_FLAGS } from '../../data/criteria.js'
import { useRatingsStore } from '../../store/ratingsStore.js'

const COUNTRY_ALIASES = {
  deutschland: 'DE', de: 'DE', österreich: 'AT', oesterreich: 'AT',
  at: 'AT', schweiz: 'CH', ch: 'CH',
}

export default function StepHospital({ data, onChange, onNext }) {
  const [searchMode, setSearchMode] = useState('schnell')
  const [query, setQuery]           = useState(data.hospital || '')
  const [dropdownOpen, setOpen]     = useState(false)
  const ratings = useRatingsStore((s) => s.ratings)

  function buildResults(q) {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    const alias = COUNTRY_ALIASES[lower]
    const hospitals = [...new Set(ratings.map(r => r.hospital))]
    const cities    = [...new Set(ratings.map(r => r.city))]
    const regions   = [...new Set(ratings.map(r => r.region).filter(Boolean))]
    const out = []
    if (alias) {
      out.push({ type: 'bundesland', label: COUNTRY_LABELS[alias], country: alias })
    }
    hospitals.filter(h => h.toLowerCase().includes(lower)).slice(0, 4).forEach(h => {
      const r = ratings.find(r => r.hospital === h)
      out.push({ type: 'klinik', label: h, country: r.country, city: r.city, region: r.region })
    })
    cities.filter(c => c.toLowerCase().includes(lower)).slice(0, 2).forEach(c => {
      const r = ratings.find(r => r.city === c)
      out.push({ type: 'stadt', label: c, country: r.country })
    })
    regions.filter(rg => rg.toLowerCase().includes(lower)).slice(0, 2).forEach(rg => {
      const r = ratings.find(r => r.region === rg)
      out.push({ type: 'bundesland', label: rg, country: r.country })
    })
    return out.slice(0, 8)
  }

  const results = buildResults(query)

  function selectResult(r) {
    setQuery(r.label)
    setOpen(false)
    if (r.type === 'klinik') {
      onChange({ ...data, hospital: r.label, city: r.city || data.city, country: r.country, region: r.region || data.region })
    } else {
      onChange({ ...data, hospital: r.label, country: r.country })
    }
  }

  const canProceed = data.hospital && data.specialty && data.country

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 1 VON 4 /// KLINIK WÄHLEN
      </div>

      {/* Mode toggle */}
      <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => setSearchMode('schnell')} className={searchMode === 'schnell' ? 'tab-active' : 'tab-inactive'}>SCHNELLSUCHE</button>
        <button onClick={() => setSearchMode('genau')}   className={searchMode === 'genau'   ? 'tab-active' : 'tab-inactive'}>GENAUE SUCHE</button>
      </div>

      <div className="p-5">
        {searchMode === 'schnell' ? (
          <div className="relative mb-4">
            <input
              className="input-brutalist"
              placeholder="Klinik, Stadt, Bundesland, Deutschland…"
              value={query}
              onChange={e => { setQuery(e.target.value); onChange({ ...data, hospital: e.target.value }); setOpen(true) }}
              onFocus={() => query && setOpen(true)}
              autoComplete="off"
            />
            {dropdownOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 border border-ink border-t-0 bg-white">
                {results.map((r, i) => (
                  <button key={i} onClick={() => selectResult(r)}
                    className="w-full flex items-center gap-3 px-3 py-2 border-b border-ink/10 last:border-b-0 hover:bg-canvas-alt text-left">
                    <span className={`font-mono text-[8px] tracking-widest uppercase min-w-[56px] ${r.type === 'klinik' ? 'text-hazard' : 'text-ink/40'}`}>
                      {r.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-ink flex-1">{r.label}</span>
                    <span className="font-mono text-[8px] text-ink/40">{COUNTRY_FLAGS[r.country]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="ink-grid mb-4">
            {/* Country */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">01 /// LAND</div>
              <select className="select-brutalist" value={data.country}
                onChange={e => onChange({ ...data, country: e.target.value, region: '', city: '' })}>
                <option value="">— Wählen —</option>
                <option value="DE">🇩🇪 Deutschland</option>
                <option value="AT">🇦🇹 Österreich</option>
                <option value="CH">🇨🇭 Schweiz</option>
              </select>
            </div>
            {/* Region */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">02 /// BUNDESLAND / KANTON</div>
              <select className="select-brutalist" value={data.region}
                onChange={e => onChange({ ...data, region: e.target.value })}>
                <option value="">— Wählen —</option>
                {(REGIONS[data.country] || []).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {/* Hospital text */}
            <div className="bg-canvas p-3">
              <div className="mono-label mb-1">03 /// KLINIK</div>
              <input className="input-brutalist" value={data.hospital}
                onChange={e => onChange({ ...data, hospital: e.target.value })}
                placeholder="Klinikname eingeben…" />
            </div>
          </div>
        )}

        {/* City + Specialty + Year */}
        <div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">STADT</div>
            <input className="input-brutalist" value={data.city}
              onChange={e => onChange({ ...data, city: e.target.value })}
              placeholder="z.B. Berlin" />
          </div>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">FACHRICHTUNG</div>
            <select className="select-brutalist" value={data.specialty}
              onChange={e => onChange({ ...data, specialty: e.target.value })}>
              <option value="">— Wählen —</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="bg-canvas p-3">
            <div className="mono-label mb-1">JAHR</div>
            <input type="number" className="input-brutalist" value={data.year}
              min={2010} max={2026}
              onChange={e => onChange({ ...data, year: +e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onNext} disabled={!canProceed} className="btn-hazard disabled:opacity-30">
            WEITER &gt;&gt;&gt;
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] Replace `src/components/RatingForm/StepCriteria.jsx`

```jsx
import { CRITERIA_ESSENTIAL } from '../../data/criteria.js'

function BooleanField({ label, value, onChange }) {
  return (
    <div className="bg-canvas p-3">
      <div className="mono-label mb-2">{label}</div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => onChange(true)}  className={value === true  ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
        <button onClick={() => onChange(false)} className={value === false ? 'toggle-no-active'  : 'toggle-inactive'}>NEIN</button>
      </div>
    </div>
  )
}

function EnumField({ label, value, options, onChange }) {
  return (
    <div className="bg-canvas p-3">
      <div className="mono-label mb-2">{label}</div>
      <div className="ink-grid" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={value === opt ? 'tab-active' : 'tab-inactive'}>
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

function NumberField({ label, value, min, max, onChange }) {
  return (
    <div className="bg-canvas p-3">
      <div className="mono-label mb-2">{label}</div>
      <input type="number" min={min} max={max} value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? null : +e.target.value)}
        className="input-brutalist font-mono text-lg font-bold w-24 tabular-nums" />
    </div>
  )
}

export default function StepCriteria({ data, onChange, onBack, onNext }) {
  function set(key, val) {
    onChange({ ...data, [key]: val })
  }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 2 VON 4 /// PFLICHT-KRITERIEN
      </div>
      <div className="ink-grid p-0" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Arbeitszeiten */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">ARBEITSZEITEN</div>
          <div className="flex items-center gap-2">
            <input type="time" value={data.arbeitszeitenVon ?? '07:00'}
              onChange={e => set('arbeitszeitenVon', e.target.value)}
              className="input-brutalist font-mono text-sm flex-1" />
            <span className="mono-label">—</span>
            <input type="time" value={data.arbeitszeitenBis ?? '16:00'}
              onChange={e => set('arbeitszeitenBis', e.target.value)}
              className="input-brutalist font-mono text-sm flex-1" />
          </div>
        </div>

        <NumberField label="DIENSTE / MONAT" value={data.diensteProMonat} min={0} max={15}
          onChange={v => set('diensteProMonat', v)} />

        <NumberField label="OPS / MONAT" value={data.opsProMonat} min={0} max={50}
          onChange={v => set('opsProMonat', v)} />

        <EnumField label="DIENSTSYSTEM" value={data.dienstsystem} options={['12h', '24h']}
          onChange={v => set('dienstsystem', v)} />

        <BooleanField label="ÜBERSTUNDEN AUFSCHREIBEN" value={data.ueberstundenAufschreiben}
          onChange={v => set('ueberstundenAufschreiben', v)} />

        {/* Rotationspläne with text */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">ROTATIONSPLÄNE</div>
          <div className="ink-grid mb-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={() => set('rotationsplaene', true)}
              className={data.rotationsplaene === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
            <button onClick={() => set('rotationsplaene', false)}
              className={data.rotationsplaene === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
          </div>
          <input className="input-brutalist text-xs" placeholder="Details…"
            value={data.rotationsplaeneText ?? ''}
            onChange={e => set('rotationsplaeneText', e.target.value)} />
        </div>

        {/* Fortbildung */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">FORTBILDUNG</div>
          <div className="flex flex-col gap-2">
            <div>
              <div className="mono-label mb-1">FREISTELLUNG</div>
              <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button onClick={() => set('fortbildungFreistellung', true)}
                  className={data.fortbildungFreistellung === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
                <button onClick={() => set('fortbildungFreistellung', false)}
                  className={data.fortbildungFreistellung === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
              </div>
            </div>
            <div>
              <div className="mono-label mb-1">BEZAHLT</div>
              <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button onClick={() => set('fortbildungBezahlt', true)}
                  className={data.fortbildungBezahlt === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
                <button onClick={() => set('fortbildungBezahlt', false)}
                  className={data.fortbildungBezahlt === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
              </div>
            </div>
          </div>
        </div>

        <NumberField label="ABTEILUNGSGRÖSSE (ÄRZTE)" value={data.abteilungsgroesse} min={1} max={500}
          onChange={v => set('abteilungsgroesse', v)} />

        <NumberField label="MITARBEITERGESPRÄCHE / JAHR" value={data.mitarbeitergespraeche} min={0} max={12}
          onChange={v => set('mitarbeitergespraeche', v)} />
      </div>

      <div className="ink-grid border-t border-ink p-0" style={{ gridTemplateColumns: 'auto auto 1fr' }}>
        <button onClick={onBack} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onNext} className="btn-hazard border-r border-ink">WEITER &gt;&gt;&gt;</button>
        <div className="bg-canvas" />
      </div>
    </div>
  )
}
```

- [ ] Create `src/components/RatingForm/StepNiceToHave.jsx`

```jsx
export default function StepNiceToHave({ data, comment, onChange, onCommentChange, onBack, onSubmit }) {
  function set(key, val) { onChange({ ...data, [key]: val }) }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 3 VON 4 /// NICE-TO-HAVE
      </div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Parkplatz */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">PARKPLATZ</div>
          <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={() => set('parkplatz', true)}  className={data.parkplatz === true  ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
            <button onClick={() => set('parkplatz', false)} className={data.parkplatz === false ? 'toggle-no-active'  : 'toggle-inactive'}>NEIN</button>
          </div>
        </div>

        {/* WLB Slider */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">
            WORK-LIFE-BALANCE &nbsp;
            <span className="text-hazard font-bold">{data.workLifeBalance}</span>/10
          </div>
          <input type="range" min={1} max={10} value={data.workLifeBalance ?? 5}
            onChange={e => set('workLifeBalance', +e.target.value)}
            className="slider-brutalist" />
        </div>

        {/* Team Slider */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">
            TEAM-ATMOSPHÄRE &nbsp;
            <span className="text-hazard font-bold">{data.teamAtmosphaere}</span>/10
          </div>
          <input type="range" min={1} max={10} value={data.teamAtmosphaere ?? 5}
            onChange={e => set('teamAtmosphaere', +e.target.value)}
            className="slider-brutalist" />
        </div>

        {/* Benefits */}
        <div className="bg-canvas p-3" style={{ gridColumn: '1 / -1' }}>
          <div className="mono-label mb-2">BENEFITS (OPTIONAL)</div>
          <input className="input-brutalist" placeholder="z.B. Jobticket, Kantine, Kinderbetreuung…"
            value={data.benefits ?? ''}
            onChange={e => set('benefits', e.target.value)} />
        </div>

        {/* Comment */}
        <div className="bg-canvas p-3" style={{ gridColumn: '1 / -1' }}>
          <div className="mono-label mb-2">KOMMENTAR (OPTIONAL)</div>
          <textarea rows={3} className="input-brutalist resize-vertical"
            placeholder="Freitext…"
            value={comment}
            onChange={e => onCommentChange(e.target.value)} />
        </div>
      </div>

      <div className="ink-grid border-t border-ink" style={{ gridTemplateColumns: 'auto auto 1fr' }}>
        <button onClick={onBack}   className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onSubmit} className="btn-hazard border-r border-ink">ABSENDEN &gt;&gt;&gt;</button>
        <div className="bg-canvas" />
      </div>
    </div>
  )
}
```

- [ ] Replace `src/components/RatingForm/StepDone.jsx`

```jsx
import { Link } from 'react-router-dom'

export default function StepDone({ hospital, onNew }) {
  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 4 VON 4 /// BESTÄTIGUNG
      </div>
      <div className="p-8 border-b border-ink">
        <div className="mono-label-red mb-3">[ GESPEICHERT ]</div>
        <div className="font-display text-3xl text-ink uppercase tracking-tight leading-none mb-4">
          Danke.<br />/// Bewertung<br />gespeichert.
        </div>
        <div className="text-sm text-ink/60 mb-6">{hospital}</div>
        <div className="ink-grid" style={{ gridTemplateColumns: 'auto auto' }}>
          <button onClick={onNew} className="btn-ink">&gt;&gt;&gt; WEITERE BEWERTUNG</button>
          <Link to="/" className="btn-ghost-ink">[ ZUR STARTSEITE ]</Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] Replace `src/components/RatingForm/RatingForm.jsx`

```jsx
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import StepHospital    from './StepHospital.jsx'
import StepCriteria    from './StepCriteria.jsx'
import StepNiceToHave  from './StepNiceToHave.jsx'
import StepDone        from './StepDone.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { DEFAULT_CRITERIA } from '../../data/criteria.js'

const DEFAULT_HOSPITAL = { hospital: '', city: '', country: 'DE', region: '', specialty: '', year: new Date().getFullYear() }

export default function RatingForm() {
  const [step, setStep]           = useState(1)
  const [hospitalData, setHosp]   = useState(DEFAULT_HOSPITAL)
  const [criteriaData, setCrit]   = useState({ ...DEFAULT_CRITERIA })
  const [comment, setComment]     = useState('')
  const addRating = useRatingsStore((s) => s.addRating)

  function handleSubmit() {
    addRating({ id: uuidv4(), timestamp: new Date().toISOString(), ...hospitalData, criteria: criteriaData, comment })
    setStep(4)
  }

  function reset() {
    setStep(1); setHosp(DEFAULT_HOSPITAL); setCrit({ ...DEFAULT_CRITERIA }); setComment('')
  }

  /* Progress bar */
  const pct = step === 4 ? 100 : Math.round((step - 1) / 3 * 100)

  return (
    <div className="border border-ink max-w-3xl mx-auto my-6">
      {/* Progress */}
      {step < 4 && (
        <div className="h-0.5 bg-ink/10">
          <div className="h-full bg-hazard transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      )}

      {step === 1 && <StepHospital   data={hospitalData} onChange={setHosp} onNext={() => setStep(2)} />}
      {step === 2 && <StepCriteria   data={criteriaData} onChange={setCrit} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <StepNiceToHave data={criteriaData} comment={comment} onChange={setCrit} onCommentChange={setComment} onBack={() => setStep(2)} onSubmit={handleSubmit} />}
      {step === 4 && <StepDone hospital={hospitalData.hospital} onNew={reset} />}
    </div>
  )
}
```

- [ ] Replace `src/pages/BewertungPage.jsx`

```jsx
import RatingForm from '../components/RatingForm/RatingForm.jsx'

export default function BewertungPage() {
  return (
    <div className="px-4 py-6">
      <div className="register-strip border border-ink mb-6 max-w-3xl mx-auto">
        <span>/// BEWERTUNG SCHREIBEN</span>
      </div>
      <RatingForm />
    </div>
  )
}
```

- [ ] Verify full 4-step form at http://localhost:5173/bewerten — all steps render, submit saves to store

- [ ] Commit

```bash
git add src/components/RatingForm/ src/pages/BewertungPage.jsx
git commit -m "feat: 4-step rating form with new criteria and brutalist styling"
```

---

## Task 17: BarRanking.jsx + RankingPage.jsx

**Files:**
- Modify: `src/components/Charts/BarRanking.jsx`
- Modify: `src/pages/RankingPage.jsx`

- [ ] Replace `src/components/Charts/BarRanking.jsx`

```jsx
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'
import { scoreColor } from '../../utils/calculations.js'

function BrutalistTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ink text-canvas px-3 py-2 border border-canvas/20">
      <div className="font-mono text-[8px] tracking-widest uppercase text-canvas/50 mb-1">{d.city} · {d.country}</div>
      <div className="font-display text-sm uppercase">{d.hospital}</div>
      <div className="font-mono text-lg font-bold mt-1" style={{ color: scoreColor(d.score) }}>{d.score}</div>
      <div className="font-mono text-[8px] text-canvas/40">{d.count} BEWERTUNGEN</div>
    </div>
  )
}

export default function BarRanking() {
  const { ranked } = useRatings()
  const top = ranked.slice(0, 15)

  if (top.length === 0) {
    return <div className="p-8 font-mono text-[10px] uppercase tracking-widest text-ink/40">[ KEINE DATEN ]</div>
  }

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// TOP-KLINIKEN NACH SCORE</div>
      <ResponsiveContainer width="100%" height={top.length * 36 + 40}>
        <BarChart data={top} layout="vertical" margin={{ left: 200, right: 60, top: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 10]} tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#050505', textTransform: 'uppercase' }} tickLine={false} axisLine={{ stroke: '#050505' }} />
          <YAxis type="category" dataKey="hospital" width={195}
            tick={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, fill: '#050505', textTransform: 'uppercase' }}
            tickLine={false} axisLine={false} />
          <Tooltip content={<BrutalistTooltip />} cursor={{ fill: 'rgba(5,5,5,0.05)' }} />
          <Bar dataKey="score" radius={0} barSize={16}>
            {top.map((entry) => (
              <Cell key={entry.hospital} fill={scoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] Replace `src/pages/RankingPage.jsx`

```jsx
import BarRanking from '../components/Charts/BarRanking.jsx'
import StatsBar from '../components/Dashboard/StatsBar.jsx'

export default function RankingPage() {
  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// RANKING</span>
        <span className="text-canvas/40">TOP-KLINIKEN NACH SCORE</span>
      </div>
      <StatsBar />
      <div className="border-b border-ink">
        <BarRanking />
      </div>
    </div>
  )
}
```

- [ ] Verify at http://localhost:5173/ranking

- [ ] Commit

```bash
git add src/components/Charts/BarRanking.jsx src/pages/RankingPage.jsx
git commit -m "feat: brutalist bar ranking chart"
```

---

## Task 18: RadarComparison.jsx + HospitalSelector.jsx + VergleichPage.jsx

**Files:**
- Modify: `src/components/Charts/RadarComparison.jsx`
- Modify: `src/components/Charts/HospitalSelector.jsx`
- Modify: `src/pages/VergleichPage.jsx`

- [ ] Replace `src/components/Charts/RadarComparison.jsx`

```jsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'

const COLORS = ['#E61919', '#050505', '#F59E0B']

export default function RadarComparison({ selected = [] }) {
  const { radarChartData } = useRatings()
  const data = radarChartData(selected)

  if (selected.length === 0) {
    return (
      <div className="p-8 font-mono text-[10px] uppercase tracking-widest text-ink/40">
        [ KLINIK AUSWÄHLEN UM VERGLEICH ZU STARTEN ]
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// KRITERIENPROFIL</div>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="#050505" strokeOpacity={0.15} />
          <PolarAngleAxis dataKey="subject"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#050505', fontWeight: 700, textTransform: 'uppercase' }} />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          {selected.map((name, i) => (
            <Radar key={name} name={name} dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.12}
              strokeWidth={2} />
          ))}
          <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] Replace `src/components/Charts/HospitalSelector.jsx`

```jsx
import { useRatings } from '../../hooks/useRatings.js'
import { scoreColor } from '../../utils/calculations.js'

export default function HospitalSelector({ selected, onChange, max = 3 }) {
  const { ranked } = useRatings()

  function toggle(name) {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name))
    } else if (selected.length < max) {
      onChange([...selected, name])
    }
  }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        /// KLINIK AUSWÄHLEN (MAX {max})
      </div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {ranked.map((h) => {
          const active = selected.includes(h.hospital)
          return (
            <button key={h.hospital} onClick={() => toggle(h.hospital)}
              className={`bg-canvas p-3 text-left border-2 transition-colors ${active ? 'border-hazard bg-canvas-alt' : 'border-transparent hover:bg-canvas-alt'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-xs text-ink uppercase leading-tight">{h.hospital}</div>
                <div className="font-mono text-sm font-bold flex-shrink-0" style={{ color: scoreColor(h.score) }}>
                  {h.score}
                </div>
              </div>
              <div className="mono-label mt-1">{h.city} · {h.count} BEW.</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] Replace `src/pages/VergleichPage.jsx`

```jsx
import { useState } from 'react'
import HospitalSelector from '../components/Charts/HospitalSelector.jsx'
import RadarComparison from '../components/Charts/RadarComparison.jsx'

export default function VergleichPage() {
  const [selected, setSelected] = useState([])

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// KLINIK-VERGLEICH</span>
        <span className="text-canvas/40">BIS ZU 3 KLINIKEN VERGLEICHEN</span>
      </div>
      <HospitalSelector selected={selected} onChange={setSelected} />
      <div className="border-t border-ink">
        <RadarComparison selected={selected} />
      </div>
    </div>
  )
}
```

- [ ] Verify at http://localhost:5173/vergleich — selector + radar chart work

- [ ] Commit

```bash
git add src/components/Charts/ src/pages/VergleichPage.jsx
git commit -m "feat: brutalist radar comparison with hospital selector"
```

---

## Task 19: Update ratingsStore.js + useRatings.js

**Files:**
- Modify: `src/store/ratingsStore.js`
- Modify: `src/hooks/useRatings.js`

- [ ] Read existing `src/store/ratingsStore.js` and verify `addRating` and `hydrate` are present. Update the default criteria shape to `DEFAULT_CRITERIA` from new `criteria.js`:

Find any hardcoded default criteria object and replace with import of `DEFAULT_CRITERIA`. The store itself stores/retrieves raw JSON so no structural change needed — just ensure it doesn't crash on the new shape.

- [ ] Read existing `src/hooks/useRatings.js`. Verify it exports `stats`, `ranked`, and `radarChartData`. Update the `radarChartData` call to use the new `radarData` function signature from `calculations.js`:

```js
// In useRatings.js — replace existing radarData usage:
import { avgByHospital, avgByCity, computeStats, radarData } from '../utils/calculations.js'

// ...
radarChartData: (hospitalNames) => radarData(hospitalNames, ratings),
```

- [ ] Clear localStorage and verify seed data loads correctly at http://localhost:5173

In browser console:
```js
localStorage.removeItem('ratings'); location.reload()
```
Expected: StatsBar shows 10 ratings, map shows bubbles, ranking shows hospitals.

- [ ] Commit

```bash
git add src/store/ratingsStore.js src/hooks/useRatings.js
git commit -m "feat: update store and useRatings hook for new criteria model"
```

---

## Task 20: Final verification

- [ ] Run all data tests

```bash
npx vitest run
```
Expected: all tests PASS.

- [ ] Start dev server and verify all 6 routes

```bash
npm run dev
```

Verify each route loads without console errors:
- http://localhost:5173/ — hero, search, stats, map
- http://localhost:5173/berichte — filter bar, table
- http://localhost:5173/karte — map full-page
- http://localhost:5173/ranking — bar chart
- http://localhost:5173/vergleich — selector + radar
- http://localhost:5173/bewerten — 4-step form

- [ ] Test full form submission flow: navigate to `/bewerten`, complete all 4 steps, verify rating appears in `/berichte`

- [ ] Run production build to catch any bundling errors

```bash
npm run build
```
Expected: build completes without errors.

- [ ] Commit

```bash
git add -A
git commit -m "feat: complete swiss brutalist redesign — all 6 pages, new criteria model, brutalist design system"
```
