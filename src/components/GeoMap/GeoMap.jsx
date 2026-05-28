import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { geoMercator } from 'd3-geo'
import { useRatings } from '../../hooks/useRatings.js'
import { slugify } from '../../utils/slugify.js'
import { REFERENCE_CITIES } from '../../data/cities.js'
import MapTooltip from './MapTooltip.jsx'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'

// Austria in world-atlas is stored as '040' (with leading zero), DE='276', CH='756'
const COUNTRY_CODE_MAP = { '276': 'DE', '40': 'AT', '040': 'AT', '756': 'CH' }
const DACH_IDS = new Set(['276', '40', '040', '756'])
const COUNTRY_NAMES = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }

const colorScale = scaleLinear()
  .domain([1, 5, 8, 10])
  .range(['#EF4444', '#F59E0B', '#84cc16', '#22C55E'])
  .clamp(true)

const MAP_HEIGHT = 640
const MAP_WIDTH = 800

const MAP_CONFIG = {
  projection: 'geoMercator',
  projectionConfig: {
    center: [10, 47],
    scale: 1550,
  },
}

export default function GeoMap() {
  const { cityData, hospitalData } = useRatings()
  const navigate = useNavigate()
  const [tooltip, setTooltip] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([10, 49])
  const svgRef = useRef(null)

  const ZOOM_THRESHOLD = 2.5
  const showHospitals = zoom >= ZOOM_THRESHOLD

  const validCities = useMemo(() => cityData.filter((c) => c.coordinates), [cityData])
  const validHospitals = useMemo(() => hospitalData.filter((h) => h.coordinates), [hospitalData])

  // Projection matching react-simple-maps internal setup
  const projection = useMemo(() =>
    geoMercator()
      .scale(1550)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
      .center([10, 47]),
    [])

  const handleMarkerEnter = useCallback((city, event) => {
    const rect = event.currentTarget.closest('svg').getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setTooltip({ ...city, x, y })
  }, [])

  const handleMarkerLeave = useCallback(() => setTooltip(null), [])

  const handleCountryEnter = useCallback((geoId, event) => {
    const code = COUNTRY_CODE_MAP[String(geoId)]
    if (!code) return
    const rect = event.currentTarget.closest('svg').getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setHoveredCountry({ code, name: COUNTRY_NAMES[code], x, y })
  }, [])

  const handleCountryLeave = useCallback(() => {
    setHoveredCountry(null)
  }, [])

  const handleCountryClick = useCallback((geoId) => {
    const code = COUNTRY_CODE_MAP[String(geoId)]
    if (!code) return
    navigate(`/berichte?country=${code}`)
  }, [navigate])

  const markerRadius = (count) => Math.min(Math.max(Math.sqrt(count) * 4, 5), 20)

  // Zoom to cursor: adjust center so the point under the mouse stays fixed
  const applyZoom = useCallback((zNew, mouseX, mouseY) => {
    if (!svgRef.current || zNew === zoom) return

    const svg = svgRef.current.querySelector('svg')
    if (!svg) return

    // Convert rendered mouse position to SVG viewBox coordinates (800×640)
    let pt
    try {
      pt = svg.createSVGPoint()
    } catch {
      // Fallback for browsers without SVGPoint
      const rect = svg.getBoundingClientRect()
      pt = {
        x: ((mouseX - rect.left) / rect.width) * MAP_WIDTH,
        y: ((mouseY - rect.top) / rect.height) * MAP_HEIGHT,
      }
    }
    if (pt.matrixTransform) {
      pt.x = mouseX
      pt.y = mouseY
      const ctm = svg.getScreenCTM()
      if (ctm) {
        const svgP = pt.matrixTransform(ctm.inverse())
        pt.x = svgP.x
        pt.y = svgP.y
      }
    }

    const [projCenterX, projCenterY] = projection(center)
    const projCenterNewX = projCenterX + (pt.x - MAP_WIDTH / 2) * (1 / zoom - 1 / zNew)
    const projCenterNewY = projCenterY + (pt.y - MAP_HEIGHT / 2) * (1 / zoom - 1 / zNew)
    const centerNew = projection.invert([projCenterNewX, projCenterNewY])

    setZoom(zNew)
    setCenter(centerNew)
  }, [zoom, center, projection])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const onWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.4 : 0.4
      const zNew = Math.min(Math.max(zoom + delta, 1), 8)
      applyZoom(zNew, e.clientX, e.clientY)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoom, applyZoom])

  return (
    <div className="bg-canvas relative" style={{ minHeight: `max(${MAP_HEIGHT}px, calc(100vh - 12rem))` }}>
      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-10 ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <button
          onClick={() => applyZoom(Math.min(zoom * 1.5, 8), window.innerWidth / 2, window.innerHeight / 2)}
          className="bg-canvas border-ink/20 font-mono text-xs px-2 py-1 hover:bg-canvas-alt transition-colors"
        >+</button>
        <button
          onClick={() => { setZoom(1); setCenter([10, 49]) }}
          className="bg-canvas border-ink/20 font-mono text-xs px-2 py-1 hover:bg-canvas-alt transition-colors"
        >↺</button>
        <button
          onClick={() => applyZoom(Math.max(zoom / 1.5, 1), window.innerWidth / 2, window.innerHeight / 2)}
          className="bg-canvas border-ink/20 font-mono text-xs px-2 py-1 hover:bg-canvas-alt transition-colors"
        >−</button>
      </div>

      {/* Map */}
      <div
        ref={svgRef}
        className="relative bg-canvas"
        style={{ height: `max(${MAP_HEIGHT}px, calc(100vh - 12rem))` }}
      >
        <ComposableMap
          {...MAP_CONFIG}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ zoom: newZoom, coordinates: newCenter }) => {
              setZoom(newZoom)
              setCenter(newCenter)
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                [...geographies]
                  .sort((a, b) => {
                    const aCode = COUNTRY_CODE_MAP[String(a.id)]
                    const bCode = COUNTRY_CODE_MAP[String(b.id)]
                    const aHovered = aCode && hoveredCountry?.code === aCode
                    const bHovered = bCode && hoveredCountry?.code === bCode
                    if (aHovered && !bHovered) return 1
                    if (!aHovered && bHovered) return -1
                    return 0
                  })
                  .map((geo) => {
                    const geoIdStr = String(geo.id)
                    const isDACH = DACH_IDS.has(geoIdStr)
                    const isHovered = !!COUNTRY_CODE_MAP[geoIdStr] && hoveredCountry?.code === COUNTRY_CODE_MAP[geoIdStr]

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={isDACH ? () => handleCountryClick(geoIdStr) : undefined}
                        onMouseEnter={isDACH ? (e) => handleCountryEnter(geoIdStr, e) : undefined}
                        onMouseLeave={isDACH ? handleCountryLeave : undefined}
                        style={{
                          default: {
                            fill: isHovered ? '#EAE8E3' : '#F4F4F0',
                            stroke: isHovered ? '#E61919' : '#050505',
                            strokeWidth: isHovered ? 1.5 : 0.5,
                            outline: 'none',
                            cursor: isDACH ? 'pointer' : 'default',
                          },
                          hover: {
                            fill: isDACH ? '#EAE8E3' : '#F4F4F0',
                            stroke: isDACH ? '#E61919' : '#050505',
                            strokeWidth: isDACH ? 1.5 : 0.5,
                            outline: 'none',
                            cursor: isDACH ? 'pointer' : 'default',
                          },
                          pressed: {
                            fill: '#EAE8E3',
                            stroke: '#E61919',
                            strokeWidth: 1.5,
                            outline: 'none',
                          },
                        }}
                      />
                    )
                  })
              }
            </Geographies>

            {/* Permanent reference city dots — always visible */}
            {REFERENCE_CITIES.map((rc) => (
              <Marker key={`ref-${rc.name}`} coordinates={rc.coordinates}>
                <circle
                  r={2.5}
                  fill="#050505"
                  opacity={0.12}
                  style={{ pointerEvents: 'none' }}
                />
              </Marker>
            ))}

            {showHospitals
              ? validHospitals.map((h) => (
                <Marker
                  key={h.hospital}
                  coordinates={h.coordinates}
                  onMouseEnter={(e) => handleMarkerEnter({ ...h, city: h.hospital }, e)}
                  onMouseLeave={handleMarkerLeave}
                  onClick={() => navigate(`/klinik/${slugify(h.hospital)}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={Math.max(3, 6 / zoom)}
                    fill={colorScale(h.score)}
                    stroke="#050505"
                    strokeWidth={0.5}
                    opacity={0.9}
                  />
                </Marker>
              ))
              : validCities.map((city) => (
                <Marker
                  key={city.city}
                  coordinates={city.coordinates}
                  onMouseEnter={(e) => handleMarkerEnter(city, e)}
                  onMouseLeave={handleMarkerLeave}
                  onClick={() => navigate(`/berichte?city=${encodeURIComponent(city.city)}&country=${city.country}`)}
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
                  {markerRadius(city.count) >= 10 && (
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

        {hoveredCountry && (
          <div
            className="absolute pointer-events-none z-20 bg-canvas border border-ink px-3 py-2 font-mono text-[11.5px] uppercase tracking-widest"
            style={{ left: hoveredCountry.x + 12, top: hoveredCountry.y - 20 }}
          >
            <div className="font-bold text-ink">{hoveredCountry.name}</div>
            <div className="text-ink/60 mt-0.5">KLICKEN FÜR BERICHTE</div>
          </div>
        )}
      </div>

      {validCities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-[11.5px] uppercase tracking-widest text-ink/50">
            /// NOCH KEINE STADTDATEN VORHANDEN
          </div>
        </div>
      )}
    </div>
  )
}
