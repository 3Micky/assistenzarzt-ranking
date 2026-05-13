import { createClient } from '@supabase/supabase-js'
import { slugify } from '../src/utils/slugify.js'

const DOMAIN = 'https://assistenz-ranking.de'

function xmlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod   ? `    <lastmod>${lastmod}</lastmod>`         : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority   ? `    <priority>${priority}</priority>`       : '',
    '  </url>',
  ].filter(Boolean).join('\n')
}

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0]
  const entries = []

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data } = await supabase
        .from('ratings')
        .select('hospital, created_at')
        .order('created_at', { ascending: false })

      if (data?.length) {
        const hospitalMap = new Map()
        for (const row of data) {
          if (!row.hospital) continue
          const slug = slugify(row.hospital)
          const existing = hospitalMap.get(slug)
          if (!existing || new Date(row.created_at) > new Date(existing)) {
            hospitalMap.set(slug, row.created_at)
          }
        }

        for (const [slug, createdAt] of hospitalMap) {
          const lastmod = createdAt
            ? new Date(createdAt).toISOString().split('T')[0]
            : today
          entries.push(xmlEntry({
            loc:        `${DOMAIN}/klinik/${slug}`,
            lastmod,
            changefreq: 'weekly',
            priority:   '0.7',
          }))
        }
      }
    } catch (err) {
      console.error('[sitemap-kliniken] Supabase-Fehler:', err.message)
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
