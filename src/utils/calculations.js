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
