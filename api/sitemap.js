import { createClient } from '@supabase/supabase-js'

const DOMAIN = 'https://assistenz-ranking.de'

// Statische Routen mit Priorität und Änderungsfrequenz
const STATIC_ROUTES = [
  { path: '/',           priority: '1.0', changefreq: 'daily'   },
  { path: '/berichte',   priority: '0.9', changefreq: 'daily'   },
  { path: '/ranking',    priority: '0.8', changefreq: 'daily'   },
  { path: '/karte',      priority: '0.7', changefreq: 'weekly'  },
  { path: '/vergleich',  priority: '0.6', changefreq: 'weekly'  },
  { path: '/bewerten',   priority: '0.5', changefreq: 'monthly' },
]

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

  const entries = STATIC_ROUTES.map(r =>
    xmlEntry({ loc: `${DOMAIN}${r.path}`, lastmod: today, ...r })
  )

  // Dynamische /berichte/:id Einträge aus Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data } = await supabase
        .from('ratings')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (data?.length) {
        for (const row of data) {
          const lastmod = row.created_at
            ? new Date(row.created_at).toISOString().split('T')[0]
            : today
          entries.push(xmlEntry({
            loc:        `${DOMAIN}/berichte/${row.id}`,
            lastmod,
            changefreq: 'never',
            priority:   '0.4',
          }))
        }
      }
    } catch (err) {
      // Supabase-Fehler → statische Sitemap reicht vorerst
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
