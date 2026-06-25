import { SPECIALTIES, REGIONS } from '../data/criteria.js'
import { slugify } from '../utils/slugify.js'
import { fetchAllRatings } from './ratingsData.js'

let ratingsPromise

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

async function getRatings() {
  ratingsPromise ??= fetchAllRatings()
  return ratingsPromise
}

export async function getClinicStaticPaths() {
  const ratings = await getRatings()
  return unique(ratings.map((rating) => `klinik/${slugify(rating.hospital)}`))
}

export async function getCityStaticPaths() {
  const ratings = await getRatings()
  return unique(ratings.map((rating) => `stadt/${slugify(rating.city)}`))
}

export async function getReportStaticPaths() {
  const ratings = await getRatings()
  return ratings.map((rating) => {
    if (rating.hospital) {
      return `berichte/${slugify(rating.hospital)}/${rating.id}`
    }

    return `berichte/${rating.id}`
  })
}

export async function getLegacyReportStaticPaths() {
  const ratings = await getRatings()
  return ratings.map((rating) => `berichte/${rating.id}`)
}

export function getSpecialtyStaticPaths() {
  return SPECIALTIES.map((specialty) => `fachrichtung/${slugify(specialty)}`)
}

export function getRegionStaticPaths() {
  return [...REGIONS.DE, ...REGIONS.AT, ...REGIONS.CH].map((region) => `bundesland/${slugify(region)}`)
}
