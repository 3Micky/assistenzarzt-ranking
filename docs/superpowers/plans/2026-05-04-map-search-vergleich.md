# Map, Suche & Vergleich – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Karte vollständig sichtbar mit Click-Navigation, Live-Suche zeigt Top-10, Genaue Suche in richtiger Reihenfolge, Klinikvergleich mit verbessertem Radar-Chart.

**Architecture:** Vier unabhängige Änderungen an bestehenden Komponenten. Keine neuen Dateien. URL-Params als Datenkanal zwischen Karte und Berichtepage. Recharts RadarChart bereits vorhanden und funktionsfähig, wird visuell verbessert.

**Tech Stack:** React 18, React Router v6 (`useNavigate`, `useSearchParams`), react-simple-maps, Recharts v2, Tailwind CSS v3

---

## Dateiübersicht

| Datei | Art | Änderung |
|---|---|---|
| `src/components/GeoMap/GeoMap.jsx` | Modify | Projektion, Hover/Click für Länder, Click für Marker |
| `src/pages/BerichtePage.jsx` | Modify | URL-Params `city` und `country` auslesen |
| `src/components/Berichte/FilterBar.jsx` | Modify | `city`-Filterfeld hinzufügen |
| `src/store/ratingsStore.js` / `src/utils/calculations.js` | Read-only | Keine Änderung nötig |
| `src/components/Search/SearchWidget.jsx` | Modify | Top-10 Ergebnisse |
| `src/components/RatingForm/StepHospital.jsx` | Modify | Genaue Suche: Stadt vor Klinik, Top-10 |
| `src/pages/VergleichPage.jsx` | Modify | Hinweistext verbessern |
| `src/components/Charts/RadarComparison.jsx` | Modify | Größere Grafik, deutschsprachige Achsen, Gesamtscore-Achse hinzufügen |

---

### Task 1: Karte – Projektion anpassen & DE/AT/CH vollständig sichtbar

**Files:**
- Modify: `src/components/GeoMap/GeoMap.jsx`

- [ ] **Schritt 1: MAP_CONFIG anpassen**

Ändere in `GeoMap.jsx` den `MAP_CONFIG`-Block (aktuell Zeilen 21–27):

```js
const MAP_CONFIG = {
  projection: 'geoMercator',
  projectionConfig: {
    center: [10, 50],
    scale: 1600,
  },
}
```

Und den `ZoomableGroup`-Prop `center` auf `[10, 50]` setzen (Zeile 67):
```jsx
<ZoomableGroup zoom={zoom} center={[10, 50]}>
```

- [ ] **Schritt 2: Visuell prüfen**

Dev-Server starten (`npm run dev`) und `/karte` öffnen. Prüfen: Norddeutschland (Hamburg, Flensburg ~55°N), Schweiz (Genf ~46°N), Westösterreich (Bregenz ~47°N) alle sichtbar.

---

### Task 2: Karte – Hover auf Länder reaktivieren

**Files:**
- Modify: `src/components/GeoMap/GeoMap.jsx`

- [ ] **Schritt 1: State für Country-Tooltip hinzufügen**

Nach `const [zoom, setZoom] = useState(1)` (Zeile 33) einfügen:
```js
const [hoveredCountry, setHoveredCountry] = useState(null)
```

- [ ] **Schritt 2: `onClick`, `onMouseEnter`, `onMouseLeave` zu Geography-Elementen hinzufügen**

Ersetze den gesamten `<Geography ... />` Block (Zeilen 74–103) durch:

```jsx
<Geography
  key={geo.rsmKey}
  geography={geo}
  onClick={isDACH ? () => handleCountryClick(geo.id) : undefined}
  onMouseEnter={isDACH ? (e) => handleCountryEnter(geo.id, e) : undefined}
  onMouseLeave={isDACH ? handleCountryLeave : undefined}
  style={{
    default: {
      fill:        '#F4F4F0',
      stroke:      '#050505',
      strokeWidth: 0.5,
      outline:     'none',
      cursor:      isDACH ? 'pointer' : 'default',
    },
    hover: isDACH ? {
      fill:        '#EAE8E3',
      stroke:      '#E61919',
      strokeWidth: 1.5,
      outline:     'none',
      cursor:      'pointer',
    } : {
      fill:        '#F4F4F0',
      stroke:      '#050505',
      strokeWidth: 0.5,
      outline:     'none',
    },
    pressed: {
      fill:        '#EAE8E3',
      stroke:      '#E61919',
      strokeWidth: 1.5,
      outline:     'none',
    },
  }}
/>
```

- [ ] **Schritt 3: Handler-Funktionen hinzufügen**

Füge nach `handleMarkerLeave` (nach Zeile 43) folgende Handler ein. Dafür wird `useNavigate` benötigt – den Import aus react-router-dom ergänzen:

```js
import { useNavigate } from 'react-router-dom'
```

Innerhalb der Komponente:
```js
const navigate = useNavigate()

const COUNTRY_CODE_MAP = { '276': 'DE', '40': 'AT', '756': 'CH' }
const COUNTRY_NAMES    = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }

const handleCountryEnter = useCallback((geoId, event) => {
  const code = COUNTRY_CODE_MAP[geoId]
  if (!code) return
  const rect = event.currentTarget.closest('svg').getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  setHoveredCountry({ code, name: COUNTRY_NAMES[code], x, y })
}, [])

const handleCountryLeave = useCallback(() => setHoveredCountry(null), [])

const handleCountryClick = useCallback((geoId) => {
  const code = COUNTRY_CODE_MAP[geoId]
  if (!code) return
  navigate(`/berichte?country=${code}`)
}, [navigate])
```

- [ ] **Schritt 4: Country-Tooltip rendern**

Nach dem `{tooltip && <MapTooltip ... />}` Block (nach Zeile 157) einfügen:

```jsx
{hoveredCountry && (
  <div
    className="absolute pointer-events-none z-20 bg-canvas border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-widest"
    style={{ left: hoveredCountry.x + 12, top: hoveredCountry.y - 20 }}
  >
    <div className="font-bold text-ink">{hoveredCountry.name}</div>
    <div className="text-ink/40 mt-0.5">KLICKEN FÜR BERICHTE</div>
  </div>
)}
```

---

### Task 3: Karte – Marker-Klick navigiert zu /Berichte

**Files:**
- Modify: `src/components/GeoMap/GeoMap.jsx`

- [ ] **Schritt 1: Marker mit onClick versehen**

Ersetze den `<Marker ...>` Block (Zeile 109–113) – füge `onClick` und `onMouseEnter` inline hinzu:

```jsx
{validCities.map((city) => (
  <Marker
    key={city.city}
    coordinates={city.coordinates}
    onMouseEnter={(e) => handleMarkerEnter(city, e)}
    onMouseLeave={handleMarkerLeave}
    onClick={() => navigate(`/berichte?city=${encodeURIComponent(city.city)}&country=${city.country}`)}
    style={{ cursor: 'pointer' }}
  >
```

---

### Task 4: BerichtePage – URL-Params `city` und `country` verarbeiten

**Files:**
- Modify: `src/pages/BerichtePage.jsx`
- Modify: `src/components/Berichte/FilterBar.jsx`

- [ ] **Schritt 1: BerichtePage URL-Params erweitern**

Ersetze den `useState`-Initializer (Zeilen 12–15):

```js
const [filters, setFilters] = useState(() => ({
  ...EMPTY_FILTERS,
  country:  searchParams.get('country')  ?? '',
  hospital: searchParams.get('q')        ?? '',
  city:     searchParams.get('city')     ?? '',
}))
```

- [ ] **Schritt 2: `city`-Feld zu EMPTY_FILTERS hinzufügen**

Zeile 7 ändern:
```js
const EMPTY_FILTERS = { country: '', region: '', specialty: '', dienstsystem: '', hospital: '', city: '' }
```

- [ ] **Schritt 3: Filter-Logik um `city` erweitern**

Im `useMemo`-Block (Zeilen 21–30) nach der `hospital`-Zeile einfügen:
```js
if (filters.city && !r.city?.toLowerCase().includes(filters.city.toLowerCase())) return false
```

- [ ] **Schritt 4: City-Filterfeld in FilterBar hinzufügen**

In `FilterBar.jsx` nach dem KLINIK-Block (nach Zeile 77) und vor `{/* Filler */}` einfügen:

```jsx
{/* Stadt */}
<div className="bg-canvas px-3 py-2">
  <div className="mono-label mb-1">STADT</div>
  <input
    className="input-brutalist text-[11px] py-1"
    placeholder="Name…"
    value={filters.city}
    onChange={e => onChange('city', e.target.value)}
  />
</div>
```

Außerdem `gridTemplateColumns` in der äußeren `ink-grid` div von `'repeat(5, auto) 1fr'` auf `'repeat(6, auto) 1fr'` ändern.

---

### Task 5: Live-Suche – Top 10 Ergebnisse in SearchWidget

**Files:**
- Modify: `src/components/Search/SearchWidget.jsx`

- [ ] **Schritt 1: Limits in `buildResults` erhöhen**

Zeile 51: `.slice(0, 4)` → `.slice(0, 5)` (Kliniken)
Zeile 56: `.slice(0, 3)` bleibt (Städte)
Zeile 62: `.slice(0, 2)` bleibt (Regionen)
Zeile 68: `.slice(0, 8)` → `.slice(0, 10)` (Gesamt)

Damit: max 5 Kliniken + 3 Städte + 2 Regionen = 10.

---

### Task 6: Live-Suche – Top 10 in StepHospital

**Files:**
- Modify: `src/components/RatingForm/StepHospital.jsx`

- [ ] **Schritt 1: Limits in `buildResults` erhöhen**

Zeile 27: `.slice(0, 4)` → `.slice(0, 5)` (Kliniken)  
Zeile 31: `.slice(0, 2)` → `.slice(0, 3)` (Städte)  
Zeile 35: `.slice(0, 2)` bleibt (Regionen)  
Zeile 39: `.slice(0, 8)` → `.slice(0, 10)` (Gesamt)

---

### Task 7: Genaue Suche – Stadt vor Klinik

**Files:**
- Modify: `src/components/RatingForm/StepHospital.jsx`

- [ ] **Schritt 1: Genaue Suche Grid neu anordnen**

Ersetze den `searchMode === 'genau'` Block (Zeilen 95–123) komplett durch:

```jsx
<div className="ink-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
  {/* Land */}
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
  {/* Bundesland */}
  <div className="bg-canvas p-3">
    <div className="mono-label mb-1">02 /// BUNDESLAND / KANTON</div>
    <select className="select-brutalist" value={data.region}
      onChange={e => onChange({ ...data, region: e.target.value })}>
      <option value="">— Wählen —</option>
      {(REGIONS[data.country] || []).map(r => <option key={r} value={r}>{r}</option>)}
    </select>
  </div>
  {/* Stadt */}
  <div className="bg-canvas p-3">
    <div className="mono-label mb-1">03 /// STADT</div>
    <input className="input-brutalist" value={data.city}
      onChange={e => onChange({ ...data, city: e.target.value })}
      placeholder="z.B. Berlin" />
  </div>
  {/* Klinik */}
  <div className="bg-canvas p-3">
    <div className="mono-label mb-1">04 /// KLINIK</div>
    <input className="input-brutalist" value={data.hospital}
      onChange={e => onChange({ ...data, hospital: e.target.value })}
      placeholder="Klinikname eingeben…" />
  </div>
</div>
```

- [ ] **Schritt 2: Unterhalb liegende Stadt-Zeile im genau-Modus ausblenden**

Im Block ab Zeile 127 (`{/* City + Specialty + Year */}`) – das STADT-Feld dort ist nur noch im Schnell-Modus relevant. Wrap diesen Block:

```jsx
{/* Stadt nur im Schnellsuche-Modus, da Genaue Suche eigenes Stadtfeld hat */}
<div className="ink-grid mb-4" style={{ gridTemplateColumns: searchMode === 'schnell' ? '1fr 1fr 1fr' : '1fr 1fr' }}>
  {searchMode === 'schnell' && (
    <div className="bg-canvas p-3">
      <div className="mono-label mb-1">STADT</div>
      <input className="input-brutalist" value={data.city}
        onChange={e => onChange({ ...data, city: e.target.value })}
        placeholder="z.B. Berlin" />
    </div>
  )}
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
```

---

### Task 8: Klinikvergleich – Radar-Chart verbessern

**Files:**
- Modify: `src/components/Charts/RadarComparison.jsx`
- Modify: `src/utils/calculations.js`

- [ ] **Schritt 1: Gesamtscore als 6. Achse in radarData hinzufügen**

In `src/utils/calculations.js` die `axes`-Array in `radarData()` (ab Zeile 74) um eine Gesamtscore-Achse erweitern:

```js
export function radarData(hospitalNames, ratings) {
  const axes = [
    { key: 'workLifeBalance',          label: 'Work-Life',    extract: c => c.workLifeBalance  ?? 5 },
    { key: 'teamAtmosphaere',          label: 'Team',         extract: c => c.teamAtmosphaere  ?? 5 },
    { key: 'ueberstundenAufschreiben', label: 'Überstunden',  extract: c => c.ueberstundenAufschreiben === true ? 10 : c.ueberstundenAufschreiben === false ? 1 : 5 },
    { key: 'fortbildungFreistellung',  label: 'Fortbildung',  extract: c => c.fortbildungFreistellung  === true ? 10 : c.fortbildungFreistellung  === false ? 4 : 5 },
    { key: 'diensteProMonat',          label: 'Dienste',      extract: c => Math.max(1, 10 - ((c.diensteProMonat ?? 4) * 0.6)) },
    { key: 'gesamtscore',              label: 'Gesamt',       extract: c => overallScore(c) },
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
```

- [ ] **Schritt 2: RadarComparison visuell verbessern**

Ersetze den gesamten Inhalt von `src/components/Charts/RadarComparison.jsx`:

```jsx
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { useRatings } from '../../hooks/useRatings.js'

const COLORS = ['#0EA5E9', '#E61919', '#22C55E']

export default function RadarComparison({ selected = [] }) {
  const { radarChartData } = useRatings()
  const data = radarChartData(selected)

  if (selected.length === 0) {
    return (
      <div className="p-12 text-center font-mono text-[10px] uppercase tracking-widest text-ink/40">
        [ MINDESTENS EINE KLINIK AUSWÄHLEN UM VERGLEICH ZU STARTEN ]
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="mono-label-red mb-4">/// KRITERIENPROFIL – SPIDER-VERGLEICH</div>
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={data} margin={{ top: 30, right: 60, bottom: 30, left: 60 }}>
          <PolarGrid stroke="#050505" strokeOpacity={0.12} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#050505', fontWeight: 700 }}
          />
          <PolarRadiusAxis
            domain={[0, 10]}
            tick={{ fontFamily: 'JetBrains Mono', fontSize: 8, fill: '#050505' }}
            tickCount={6}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              background: '#F4F4F0',
              border: '1px solid #050505',
              borderRadius: 0,
            }}
            formatter={(value, name) => [value.toFixed(1) + ' / 10', name]}
          />
          {selected.map((name, i) => (
            <Radar
              key={name}
              name={name}
              dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.20}
              strokeWidth={2.5}
              dot={{ r: 3, fill: COLORS[i % COLORS.length] }}
            />
          ))}
          <Legend
            wrapperStyle={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              textTransform: 'uppercase',
              paddingTop: 16,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

### Task 9: Abschluss-Check

- [ ] **Schritt 1: Dev-Server starten**

```bash
npm run dev
```

- [ ] **Schritt 2: Alle 4 Features manuell testen**

1. `/karte` – DE/AT/CH vollständig sichtbar, Hover zeigt Tooltip, Länder-Klick führt zu `/berichte?country=DE`, Marker-Klick führt zu `/berichte?city=...`
2. `/berichte` – URL-Params `country` und `city` werden als Filter gesetzt
3. Homepage SearchWidget – Live-Eingabe zeigt bis zu 10 Vorschläge
4. `/bewerten` → Genaue Suche – Reihenfolge: Land → Bundesland → Stadt → Klinik
5. `/vergleich` – 2 Kliniken auswählen, Spider-Chart mit 6 Achsen erscheint

- [ ] **Schritt 3: Commit**

```bash
git add src/components/GeoMap/GeoMap.jsx \
        src/pages/BerichtePage.jsx \
        src/components/Berichte/FilterBar.jsx \
        src/components/Search/SearchWidget.jsx \
        src/components/RatingForm/StepHospital.jsx \
        src/components/Charts/RadarComparison.jsx \
        src/utils/calculations.js
git commit -m "feat: map navigation, top-10 search, city-first exact search, improved radar chart"
```
