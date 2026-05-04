# Agent 05 – DACH Geo-Karte (Bubble Map)

## Ziel
Interaktive Karte von Deutschland, Österreich und der Schweiz.
Auf jeder Stadt mit Bewertungen erscheint ein farbiger Kreis:
- Farbe = durchschnittlicher Score (Rot → Gelb → Grün)
- Größe = Anzahl Bewertungen
- Hover-Tooltip mit Details

Technologie: react-simple-maps + topojson-client + d3-scale

---

## Abhängigkeiten prüfen

Diese Pakete müssen in package.json vorhanden sein (aus Agent 01):
- `react-simple-maps`
- `topojson-client`
- `d3-scale`
- `d3-interpolate`

Falls nicht installiert: `npm install react-simple-maps topojson-client d3-scale d3-interpolate`

---

## src/components/GeoMap/MapTooltip.jsx

```jsx
import ScoreBadge from '../UI/ScoreBadge.jsx'
import CountryFlag from '../UI/CountryFlag.jsx'

/**
 * Schwebendes Tooltip über einer Stadt
 * @param {{ city, country, score, count, x, y }} props
 */
export default function MapTooltip({ city, country, score, count, x, y }) {
  if (!city) return null

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: x + 12, top: y - 40 }}
    >
      <div className="card-sm shadow-xl border-slate-700 min-w-[160px]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-semibold text-slate-100 text-sm">{city}</span>
          <CountryFlag country={country} />
        </div>
        <div className="flex items-center justify-between">
          <ScoreBadge score={score} size="sm" />
          <span className="text-xs text-slate-500">{count} Bewertung{count !== 1 ? 'en' : ''}</span>
        </div>
      </div>
    </div>
  )
}
```

---

## src/components/GeoMap/GeoMap.jsx

```jsx
import { useState, useCallback, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { useRatings } from '../../hooks/useRatings.js'
import MapTooltip from './MapTooltip.jsx'
import EmptyState from '../UI/EmptyState.jsx'

// World Atlas Countries (50m) – stabil gecacht von jsDelivr
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'

// ISO 3166-1 numerische Codes für DACH
const DACH_CODES = new Set(['276', '40', '756']) // DE, AT, CH

// Farbskala Score 1–10
const colorScale = scaleLinear()
  .domain([1, 5, 8, 10])
  .range(['#ef4444', '#f59e0b', '#84cc16', '#22c55e'])
  .clamp(true)

// Mercator-Projektion zentriert auf DACH
const MAP_CONFIG = {
  projection: 'geoMercator',
  projectionConfig: {
    center: [12.5, 47.5],
    scale: 1900,
  },
}

export default function GeoMap() {
  const { cityData } = useRatings()
  const [tooltip, setTooltip] = useState(null)
  const [zoom, setZoom] = useState(1)

  const validCities = useMemo(() => cityData.filter((c) => c.coordinates), [cityData])

  const handleMarkerEnter = useCallback((city, event) => {
    const rect = event.currentTarget.closest('svg').getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setTooltip({ ...city, x, y })
  }, [])

  const handleMarkerLeave = useCallback(() => setTooltip(null), [])

  // Radius: proportional zur Anzahl Bewertungen
  const markerRadius = (count) => Math.min(Math.max(Math.sqrt(count) * 7, 8), 40)

  return (
    <div className="card relative overflow-hidden" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title">🗺️ DACH-Übersicht</div>
          <div className="section-subtitle">
            {validCities.length} Städte mit Bewertungen
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
            className="btn-ghost text-lg w-9 h-9 p-0"
            title="Hineinzoomen"
          >+</button>
          <button
            onClick={() => setZoom(1)}
            className="btn-ghost text-xs h-9 px-2"
            title="Reset"
          >↺</button>
          <button
            onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
            className="btn-ghost text-lg w-9 h-9 p-0"
            title="Herauszoomen"
          >−</button>
        </div>
      </div>

      {/* Score Legend */}
      <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
        <span>Score:</span>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#ef4444' }} />
          <span>1–4</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#f59e0b' }} />
          <span>5–7</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#22c55e' }} />
          <span>8–10</span>
        </div>
        <span className="ml-2">Kreisgröße = Anzahl Bewertungen</span>
      </div>

      {/* Map Canvas */}
      <div
        className="rounded-xl overflow-hidden relative"
        style={{ background: 'var(--color-map-bg)', height: 400 }}
      >
        <ComposableMap
          {...MAP_CONFIG}
          width={800}
          height={400}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={zoom} center={[12.5, 47.5]}>
            {/* Länder */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const id = String(geo.id)
                  const isDACH = DACH_CODES.has(id)
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isDACH ? 'var(--color-map-dach)' : 'var(--color-map-land)'}
                      stroke="var(--color-map-border)"
                      strokeWidth={isDACH ? 0.8 : 0.3}
                      style={{
                        default: { outline: 'none' },
                        hover:   { fill: isDACH ? 'var(--color-map-dach-hover)' : 'var(--color-map-land)', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* City Bubbles */}
            {validCities.map((city) => (
              <Marker
                key={city.city}
                coordinates={city.coordinates}
                onMouseEnter={(e) => handleMarkerEnter(city, e)}
                onMouseLeave={handleMarkerLeave}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow-Ring */}
                <circle
                  r={markerRadius(city.count) + 4}
                  fill={colorScale(city.score)}
                  opacity={0.15}
                />
                {/* Hauptkreis */}
                <circle
                  r={markerRadius(city.count)}
                  fill={colorScale(city.score)}
                  stroke="#0f172a"
                  strokeWidth={1.5}
                  opacity={0.9}
                />
                {/* Score-Text (nur ab Radius > 14) */}
                {markerRadius(city.count) >= 14 && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      fill: '#0f172a',
                      fontFamily: 'Inter, sans-serif',
                      pointerEvents: 'none',
                    }}
                  >
                    {city.score.toFixed(1)}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Floating Tooltip */}
        {tooltip && (
          <MapTooltip
            city={tooltip.city}
            country={tooltip.country}
            score={tooltip.score}
            count={tooltip.count}
            x={tooltip.x}
            y={tooltip.y}
          />
        )}
      </div>

      {/* Empty State */}
      {validCities.length === 0 && (
        <EmptyState
          icon="🗺️"
          title="Noch keine Bewertungen auf der Karte"
          description="Füge Bewertungen für Städte in DE, AT oder CH hinzu."
        />
      )}
    </div>
  )
}
```

---

## Hinweis zur Kartenprojektion

Die Karte zeigt den DACH-Raum stark vergrößert durch:
- `center: [12.5, 47.5]` — Mittelpunkt zwischen DE/AT/CH
- `scale: 1900` — stark vergrößert (Standard wäre ~150 für die Welt)
- `ZoomableGroup` erlaubt zusätzliches interaktives Zoomen (1×–8×)

Bubble-Koordinaten kommen aus `cities.js` als `[lng, lat]`.

## Verifizierung
- Karte zeigt DE, AT, CH in dunkelblau hervorgehoben
- Bubble erscheint über Berlin, Wien, Zürich etc. (Seed-Daten)
- Hover → Tooltip erscheint mit Score + Anzahl
- Zoom-Buttons (+/−/↺) funktionieren
- Auf Mobile: Karte scrollbar/pinch-zoombar via ZoomableGroup
