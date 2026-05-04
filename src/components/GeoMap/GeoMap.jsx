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

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
const DACH_CODES = new Set(['276', '40', '756'])

const colorScale = scaleLinear()
  .domain([1, 5, 8, 10])
  .range(['#EF4444', '#F59E0B', '#84cc16', '#22C55E'])
  .clamp(true)

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

  const markerRadius = (count) => Math.min(Math.max(Math.sqrt(count) * 7, 8), 40)

  return (
    <div className="bg-canvas relative overflow-hidden" style={{ minHeight: 480 }}>
      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-10 ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <button onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
          className="bg-canvas border-ink/20 font-mono text-xs px-2 py-1 hover:bg-canvas-alt transition-colors">+</button>
        <button onClick={() => setZoom(1)}
          className="bg-canvas border-ink/20 font-mono text-xs px-2 py-1 hover:bg-canvas-alt transition-colors">↺</button>
        <button onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
          className="bg-canvas border-ink/20 font-mono text-xs px-2 py-1 hover:bg-canvas-alt transition-colors">−</button>
      </div>

      {/* Map */}
      <div className="relative bg-canvas" style={{ height: 480 }}>
        <ComposableMap
          {...MAP_CONFIG}
          width={800}
          height={480}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={zoom} center={[12.5, 47.5]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isDACH = DACH_CODES.has(geo.id)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill:        '#F4F4F0',
                          stroke:      '#050505',
                          strokeWidth: 0.5,
                          outline:     'none',
                        },
                        hover: isDACH ? {
                          fill:        '#F4F4F0',
                          stroke:      '#E61919',
                          strokeWidth: 1.5,
                          outline:     'none',
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
                  )
                })
              }
            </Geographies>

            {validCities.map((city) => (
              <Marker
                key={city.city}
                coordinates={city.coordinates}
                onMouseEnter={(e) => handleMarkerEnter(city, e)}
                onMouseLeave={handleMarkerLeave}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={markerRadius(city.count) + 3}
                  fill={colorScale(city.score)}
                  opacity={0.15}
                />
                <circle
                  r={markerRadius(city.count)}
                  fill={colorScale(city.score)}
                  stroke="#050505"
                  strokeWidth={1}
                  opacity={0.85}
                />
                {markerRadius(city.count) >= 14 && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      fill: '#050505',
                      fontFamily: 'JetBrains Mono, monospace',
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

      {validCities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/30">
            /// NOCH KEINE STADTDATEN VORHANDEN
          </div>
        </div>
      )}
    </div>
  )
}
