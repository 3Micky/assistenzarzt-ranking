/**
 * Konvertiert InEK-Krankenhaus-CSV ($-getrennt) in unser hospitals.js Format
 * Nutzung: node scripts/convert-hospital-csv.js
 */

import fs from 'fs'
import path from 'path'

const DATA_DIR = './20260508-Verzeichnisabruf'
const OUT_FILE = './src/data/hospitals_NEW.js'

// Bundesland-Codes → Namen (numerische Codes aus der InEK-CSV)
const BUNDESLAND_MAP = {
  '01': 'Schleswig-Holstein',
  '02': 'Hamburg',
  '03': 'Niedersachsen',
  '04': 'Bremen',
  '05': 'Nordrhein-Westfalen',
  '06': 'Hessen',
  '07': 'Rheinland-Pfalz',
  '08': 'Baden-Württemberg',
  '09': 'Bayern',
  '10': 'Saarland',
  '11': 'Berlin',
  '12': 'Brandenburg',
  '13': 'Mecklenburg-Vorpommern',
  '14': 'Sachsen',
  '15': 'Sachsen-Anhalt',
  '16': 'Thüringen',
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(Boolean)
  const headers = lines[0].split('$').map(h => h.replace(/^"|"$/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('$')
    if (parts.length < headers.length) continue
    const row = {}
    for (let j = 0; j < headers.length; j++) {
      let val = parts[j] || ''
      val = val.replace(/^"|"$/g, '').trim()
      row[headers[j]] = val
    }
    rows.push(row)
  }
  return rows
}

// Krankenhäuser laden
const krankenhausRows = parseCSV(path.join(DATA_DIR, '20260508-krankenhaus.csv'))
const khMap = new Map()
for (const row of krankenhausRows) {
  khMap.set(row.id, {
    name: row.Bezeichnung,
    carrier: row.TrägerBezeichnung,
  })
}

// Standorte laden
const standortRows = parseCSV(path.join(DATA_DIR, '20260508-standort.csv'))
const hospitals = []
const seenNames = new Set()

for (const row of standortRows) {
  // Nur aktive Standorte
  if (row.Aktiv !== '1') continue

  const kh = khMap.get(row.khId)
  if (!kh) continue

  const name = row.Bezeichnung || kh.name
  if (!name) continue

  // Duplikate überspringen (gleicher Name + PLZ)
  const key = `${name}|${row.GeoPLZ}`
  if (seenNames.has(key)) continue
  seenNames.add(key)

  const plz = row.GeoPLZ || ''
  const city = row.GeoOrt || ''
  const street = row.GeoStraße || ''
  const hausnummer = row.GeoHausnummer || ''
  const fullStreet = street + (hausnummer ? ' ' + hausnummer : '')
  const bundeslandCode = row.Bundesland || ''
  const region = BUNDESLAND_MAP[bundeslandCode] || ''

  hospitals.push({
    name,
    street: fullStreet,
    plz,
    city,
    carrier: kh.carrier || '',
    region,
  })
}

// Alphabetisch sortieren
hospitals.sort((a, b) => a.name.localeCompare(b.name, 'de'))

// JS-Datei generieren
const lines = [
  `// Automatisch generiert aus InEK-Verzeichnisabruf vom 08.05.2026`,
  `// ${hospitals.length.toLocaleString('de-DE')} Krankenhäuser in Deutschland`,
  ``,
  `/** @typedef {{ name: string, street: string, plz: string, city: string, carrier: string, region: string }} Hospital */`,
  ``,
  `/** @type {Hospital[]} */`,
  `export const DE_HOSPITALS = [`,
]

for (const h of hospitals) {
  const name = h.name.replace(/"/g, '\\"')
  const street = h.street.replace(/"/g, '\\"')
  const city = h.city.replace(/"/g, '\\"')
  const carrier = h.carrier.replace(/"/g, '\\"')
  const region = h.region.replace(/"/g, '\\"')
  lines.push(`  {`)
  lines.push(`    name: "${name}",`)
  lines.push(`    street: "${street}",`)
  lines.push(`    plz: "${h.plz}",`)
  lines.push(`    city: "${city}",`)
  lines.push(`    carrier: "${carrier}",`)
  lines.push(`    region: "${region}",`)
  lines.push(`  },`)
}

lines.push(`]`)

fs.writeFileSync(OUT_FILE, lines.join('\n') + '\n', 'utf-8')
console.log(`✅ ${hospitals.length.toLocaleString('de-DE')} Krankenhäuser geschrieben nach ${OUT_FILE}`)
