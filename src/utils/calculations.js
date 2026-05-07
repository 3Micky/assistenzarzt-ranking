/**
 * 5-Dimensionen-Composite-Score (0–10).
 * Gewichtung: Weiterbildung 30% · WLB 25% · Ausbildungsstruktur 20% · Teamkultur 15% · Infrastruktur 10%
 */
export function overallScore(criteria) {
  const c = criteria
  const bool = (v, yes = 10, no = 2, dflt = 5) =>
    v === true ? yes : v === false ? no : dflt

  // Dimension 1: Weiterbildungsqualität (30%)
  const wbe = c.wbeJahre != null ? Math.min(10, (c.wbeJahre / 12) * 10) : 5
  const dim1 = (wbe + (c.logbuchErfuellbarkeit ?? 5) + (c.supervisionQualitaet ?? 5) + (c.autonomie ?? 5)) / 4

  // Dimension 2: Work-Life-Balance (25%)
  const diensteScore   = c.diensteProMonat != null ? Math.max(1, 10 - c.diensteProMonat * 0.6) : 5
  const dienstsysScore = c.dienstsystem === '12h' ? 7 : c.dienstsystem === '24h' ? 3 : 5
  const dim2 = (diensteScore + bool(c.ueberstundenAufschreiben, 10, 1) + dienstsysScore + (c.workLifeBalance ?? 5) + (c.urlaubsgenehmigung ?? 5)) / 5

  // Dimension 3: Ausbildungsstruktur (20%)
  const mitarbScore = c.mitarbeitergespraeche != null ? Math.min(10, c.mitarbeitergespraeche * 2.5) : 5
  const dim3 = (bool(c.rotationsplaene, 10, 3) + bool(c.fortbildungFreistellung, 10, 4) + bool(c.fortbildungBezahlt, 10, 4) + mitarbScore) / 4

  // Dimension 4: Teamkultur & Klima (15%)
  const dim4 = ((c.teamAtmosphaere ?? 5) + bool(c.schwangerschaftFamilienfreundlich, 10, 2) + bool(c.nachtdienstBegleitung, 10, 3)) / 3

  // Dimension 5: Infrastruktur & Benefits (10%)
  const dim5 = (bool(c.parkplatz, 10, 5) + (c.dokumentationsaufwand ?? 5)) / 2

  const score = dim1 * 0.30 + dim2 * 0.25 + dim3 * 0.20 + dim4 * 0.15 + dim5 * 0.10

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
    { key: 'supervisionQualitaet',     label: 'Supervision',  extract: c => c.supervisionQualitaet  ?? 5 },
    { key: 'autonomie',                label: 'Autonomie',    extract: c => c.autonomie              ?? 5 },
    { key: 'logbuchErfuellbarkeit',    label: 'Logbuch',      extract: c => c.logbuchErfuellbarkeit  ?? 5 },
    { key: 'workLifeBalance',          label: 'Work-Life',    extract: c => c.workLifeBalance        ?? 5 },
    { key: 'teamAtmosphaere',          label: 'Team',         extract: c => c.teamAtmosphaere        ?? 5 },
    { key: 'ueberstundenAufschreiben', label: 'Überstunden',  extract: c => c.ueberstundenAufschreiben === true ? 10 : c.ueberstundenAufschreiben === false ? 1 : 5 },
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
