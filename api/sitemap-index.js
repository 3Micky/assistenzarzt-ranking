const DOMAIN = 'https://assistenz-ranking.de'

function sitemapEntry(loc) {
  const lastmod = new Date().toISOString()
  return [
    '  <sitemap>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </sitemap>',
  ].join('\n')
}

export default async function handler(req, res) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapEntry(`${DOMAIN}/sitemap.xml`),
    sitemapEntry(`${DOMAIN}/sitemap-kliniken.xml`),
    '</sitemapindex>',
  ].join('\n')

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}
