import { createClient } from '@supabase/supabase-js'
import { slugify } from '../src/utils/slugify.js'
import { SPECIALTIES, REGIONS } from '../src/data/criteria.js'

const DOMAIN = 'https://assistenz-ranking.de'

const STATIC_ROUTES = [
  { path: '/',           priority: '1.0', changefreq: 'daily'   },
  { path: '/berichte',   priority: '0.9', changefreq: 'daily'   },
  { path: '/ranking',    priority: '0.8', changefreq: 'daily'   },
  { path: '/vergleich',  priority: '0.6', changefreq: 'weekly'  },
  { path: '/bewerten',   priority: '0.5', changefreq: 'monthly' },
  { path: '/ueber-uns',  priority: '0.4', changefreq: 'monthly' },
  { path: '/karte',      priority: '0.5', changefreq: 'weekly'  },
]

// Alle Bundesland-/Kanton-Slugs
const ALL_REGIONS = [
  ...REGIONS.DE, ...REGIONS.AT, ...REGIONS.CH,
]

function xmlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod    ? `    <lastmod>${lastmod}</lastmod>`           : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority   ? `    <priority>${priority}</priority>`       : '',
    '  </url>',
  ].filter(Boolean).join('\n')
}

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0]

  const entries = STATIC_ROUTES.map(r =>
    xmlEntry({ loc: `${DOMAIN}${r.path}`, lastmod: today, ...r })
  )

  // Fachrichtungs-Seiten (alle statisch bekannt)
  for (const spec of SPECIALTIES) {
    entries.push(xmlEntry({
      loc:        `${DOMAIN}/fachrichtung/${slugify(spec)}`,
      lastmod:    today,
      changefreq: 'weekly',
      priority:   '0.6',
    }))
  }

  // Bundesland-/Kanton-Seiten (alle statisch bekannt)
  for (const region of ALL_REGIONS) {
    entries.push(xmlEntry({
      loc:        `${DOMAIN}/bundesland/${slugify(region)}`,
      lastmod:    today,
      changefreq: 'weekly',
      priority:   '0.6',
    }))
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data } = await supabase
        .from('ratings')
        .select('id, hospital, city, created_at')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (data?.length) {
        const hospitalSet = new Set()
        const citySet = new Set()

        for (const row of data) {
          const lastmod = row.created_at
            ? new Date(row.created_at).toISOString().split('T')[0]
            : today

          // Einzelberichte mit Klinik-Slug im Pfad
          if (row.hospital) {
            entries.push(xmlEntry({
              loc:        `${DOMAIN}/berichte/${slugify(row.hospital)}/${row.id}`,
              lastmod,
              changefreq: 'never',
              priority:   '0.4',
            }))
            hospitalSet.add(row.hospital)
          } else {
            entries.push(xmlEntry({
              loc:        `${DOMAIN}/berichte/${row.id}`,
              lastmod,
              changefreq: 'never',
              priority:   '0.4',
            }))
          }

          if (row.city) citySet.add(row.city)
        }

        // Klinik-Profile
        for (const hospital of hospitalSet) {
          entries.push(xmlEntry({
            loc:        `${DOMAIN}/klinik/${slugify(hospital)}`,
            lastmod:    today,
            changefreq: 'weekly',
            priority:   '0.7',
          }))
        }

        // Stadt-Seiten
        for (const city of citySet) {
          entries.push(xmlEntry({
            loc:        `${DOMAIN}/stadt/${slugify(city)}`,
            lastmod:    today,
            changefreq: 'weekly',
            priority:   '0.6',
          }))
        }
      }
    } catch (err) {
      console.error('[sitemap] Supabase-Fehler:', err.message)
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n')

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}
