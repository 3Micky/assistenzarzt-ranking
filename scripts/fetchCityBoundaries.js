#!/usr/bin/env node
/**
 * Holt Stadtgrenzen (administrative Polygone) von Nominatim/OSM
 * für alle REFERENCE_CITIES und speichert als GeoJSON in public/
 *
 * Ausführen: node scripts/fetchCityBoundaries.js
 * Rate-Limit Nominatim: 1 req/s → ~60s für 54 Städte
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/cityBoundaries.geojson')

const REFERENCE_CITIES = [
  // Deutschland
  { name: 'Berlin',      country: 'DE' },
  { name: 'Hamburg',     country: 'DE' },
  { name: 'München',     country: 'DE' },
  { name: 'Köln',        country: 'DE' },
  { name: 'Frankfurt',   country: 'DE' },
  { name: 'Stuttgart',   country: 'DE' },
  { name: 'Düsseldorf',  country: 'DE' },
  { name: 'Leipzig',     country: 'DE' },
  { name: 'Dortmund',    country: 'DE' },
  { name: 'Essen',       country: 'DE' },
  { name: 'Bremen',      country: 'DE' },
  { name: 'Dresden',     country: 'DE' },
  { name: 'Hannover',    country: 'DE' },
  { name: 'Nürnberg',    country: 'DE' },
  { name: 'Bonn',        country: 'DE' },
  { name: 'Münster',     country: 'DE' },
  { name: 'Aachen',      country: 'DE' },
  { name: 'Freiburg im Breisgau', country: 'DE' },
  { name: 'Heidelberg',  country: 'DE' },
  { name: 'Mannheim',    country: 'DE' },
  { name: 'Mainz',       country: 'DE' },
  { name: 'Würzburg',    country: 'DE' },
  { name: 'Tübingen',    country: 'DE' },
  { name: 'Ulm',         country: 'DE' },
  { name: 'Regensburg',  country: 'DE' },
  { name: 'Göttingen',   country: 'DE' },
  { name: 'Kiel',        country: 'DE' },
  { name: 'Rostock',     country: 'DE' },
  { name: 'Magdeburg',   country: 'DE' },
  { name: 'Erfurt',      country: 'DE' },
  { name: 'Kassel',      country: 'DE' },
  { name: 'Bielefeld',   country: 'DE' },
  { name: 'Bochum',      country: 'DE' },
  { name: 'Duisburg',    country: 'DE' },
  { name: 'Saarbrücken', country: 'DE' },
  { name: 'Wiesbaden',   country: 'DE' },
  // Österreich
  { name: 'Wien',        country: 'AT' },
  { name: 'Graz',        country: 'AT' },
  { name: 'Linz',        country: 'AT' },
  { name: 'Salzburg',    country: 'AT' },
  { name: 'Innsbruck',   country: 'AT' },
  { name: 'Klagenfurt',  country: 'AT' },
  { name: 'Villach',     country: 'AT' },
  { name: 'Wels',        country: 'AT' },
  // Schweiz
  { name: 'Zürich',      country: 'CH' },
  { name: 'Genf',        country: 'CH' },
  { name: 'Basel',       country: 'CH' },
  { name: 'Bern',        country: 'CH' },
  { name: 'Luzern',      country: 'CH' },
  { name: 'Lausanne',    country: 'CH' },
  { name: 'St. Gallen',  country: 'CH' },
  { name: 'Winterthur',  country: 'CH' },
  { name: 'Lugano',      country: 'CH' },
  { name: 'Biel/Bienne', country: 'CH' },
]

// Mapping: angezeigter Name → gespeicherter name im GeoJSON
const NAME_MAP = {
  'Freiburg im Breisgau': 'Freiburg',
  'Biel/Bienne': 'Biel',
  'Klagenfurt': 'Klagenfurt',
}

const CC = { DE: 'de', AT: 'at', CH: 'ch' }

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchBoundary(city) {
  const q = encodeURIComponent(city.name)
  const cc = CC[city.country]
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?city=${q}&country=${cc}` +
    `&format=json&limit=5` +
    `&polygon_geojson=1&polygon_threshold=0.005`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'assistenz-ranking.de boundary-fetcher/1.0 (hbartels22@gmail.com)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const results = await res.json()

  // Bevorzuge admin boundary mit Polygon/MultiPolygon
  const best = results.find(r =>
    r.class === 'boundary' &&
    (r.geojson?.type === 'Polygon' || r.geojson?.type === 'MultiPolygon')
  ) || results.find(r =>
    r.geojson?.type === 'Polygon' || r.geojson?.type === 'MultiPolygon'
  )

  return best?.geojson ?? null
}

async function main() {
  const features = []
  let ok = 0, fail = 0

  for (const city of REFERENCE_CITIES) {
    process.stdout.write(`  ${city.name} (${city.country}) ... `)
    try {
      const geom = await fetchBoundary(city)
      if (geom) {
        const displayName = NAME_MAP[city.name] ?? city.name
        features.push({
          type: 'Feature',
          properties: { name: displayName, country: city.country },
          geometry: geom,
        })
        console.log(`✓ ${geom.type}`)
        ok++
      } else {
        console.log('✗ kein Polygon')
        fail++
      }
    } catch (e) {
      console.log(`✗ Fehler: ${e.message}`)
      fail++
    }
    await sleep(1200) // Nominatim: max 1 req/s
  }

  fs.writeFileSync(OUT, JSON.stringify({ type: 'FeatureCollection', features }, null, 0))

  const kb = Math.round(fs.statSync(OUT).size / 1024)
  console.log(`\nGespeichert: ${OUT}`)
  console.log(`${ok} ✓  ${fail} ✗  |  ${kb} KB`)
}

main().catch(console.error)
