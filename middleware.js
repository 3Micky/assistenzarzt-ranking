/**
 * Vercel Edge Middleware — serverseitiger Passwortschutz (Private Beta).
 *
 * Blockt JEDEN Request (HTML, Assets, /api, robots.txt, Sitemaps) am Edge mit HTTP
 * Basic Auth, BEVOR Inhalt ausgeliefert wird. Anders als das client-seitige
 * PasswordGate gelangt so kein Inhalt in den HTML-Quelltext oder zu Crawlern/AI-Bots.
 * Auf dem Vercel-Hobby-Plan ist das der einzige kostenlose Weg, die Production-Domain
 * komplett zu schützen (Vercels eigener Passwortschutz ist Pro+ / kostenpflichtig).
 *
 * Konfiguration über Vercel-Env (Dashboard → Settings → Environment Variables):
 *   SITE_PASSWORD  — das Beta-Passwort (Pflicht; ohne Wert wird fail-closed gesperrt)
 *   SITE_PRIVATE   — "false" = öffentlich (Launch), alles andere/leer = geschützt
 *
 * LAUNCH (ein Schritt): SITE_PRIVATE=false in Production setzen + neu deployen.
 * (Env-Änderungen greifen erst beim nächsten Deploy.) Das vorbereitete
 * Prerendering/SEO wird damit in einem Zug öffentlich & crawlbar.
 */

export const config = {
  // Alles schützen — Assets, /api, robots.txt, Sitemaps bewusst inklusive,
  // damit es keine Leck-Pfade am Schutz vorbei gibt.
  matcher: '/:path*',
}

export default function middleware(request) {
  // Öffentlich nur, wenn explizit freigeschaltet (fail-closed by default).
  if (process.env.SITE_PRIVATE === 'false') return

  const expected = process.env.SITE_PASSWORD || 'be100aware.now'
  const header = request.headers.get('authorization') || ''

  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6))
      const password = decoded.slice(decoded.indexOf(':') + 1)
      if (password === expected) return // korrekt → Request durchlassen
    } catch {
      // ungültiges Base64 → wie fehlgeschlagene Auth behandeln
    }
  }

  return new Response('Assistenz-Ranking — Private Beta. Authentifizierung erforderlich.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Assistenz-Ranking — Private Beta", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}
