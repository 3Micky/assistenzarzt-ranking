/**
 * Vercel Edge Middleware — serverseitiger Passwortschutz (Private Beta).
 *
 * Cookie-basierter Login (statt HTTP Basic Auth, weil Vercel den
 * WWW-Authenticate-Header strippt → der Browser zeigt sonst keinen Login-Dialog).
 * Blockt JEDEN Request (HTML, Assets, /api, robots.txt, Sitemaps) am Edge, BEVOR
 * Inhalt ausgeliefert wird. Auf dem Vercel-Hobby-Plan der einzige kostenlose Weg,
 * die Production-Domain komplett zu schützen.
 *
 * Konfiguration über Vercel-Env (Settings → Environment Variables):
 *   SITE_PASSWORD  — das Beta-Passwort (ohne Wert bleibt der Zugang gesperrt)
 *   SITE_PRIVATE   — "false" = öffentlich (Launch), alles andere/leer = geschützt
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — optionales Login-Limit
 *
 * LAUNCH (ein Schritt): SITE_PRIVATE=false in Production setzen + neu deployen.
 *
 * Sicherheit: Das Cookie speichert NICHT das Passwort, sondern dessen SHA-256-Hash.
 * Ohne Kenntnis von SITE_PASSWORD lässt sich kein gültiges Cookie fälschen.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const COOKIE = 'ar_beta'
const AUTH_PATH = '/__beta-auth'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 Tage
let loginRateLimit

export const config = {
  matcher: '/:path*', // alles schützen — Assets, /api, robots.txt, Sitemaps inklusive
}

async function sha256hex(value) {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(left, right) {
  const leftBytes = new TextEncoder().encode(String(left ?? ''))
  const rightBytes = new TextEncoder().encode(String(right ?? ''))
  let mismatch = leftBytes.length ^ rightBytes.length

  // SHA-256 tokens are always 64 ASCII bytes. Keep the loop length fixed even
  // for malformed cookie values so comparisons do not exit early.
  for (let index = 0; index < 64; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0)
  }
  return mismatch === 0
}

function readCookie(header, name) {
  return (header || '').split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))?.slice(name.length + 1)
}

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

async function loginAllowed(request) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return true

  try {
    if (!loginRateLimit) {
      loginRateLimit = new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(10, '15 m'),
        analytics: true,
        prefix: 'beta-login',
      })
    }
    const result = await loginRateLimit.limit(getClientIp(request))
    return result.success
  } catch (error) {
    console.error('Beta-Login Rate-Limit fehlgeschlagen:', error)
    loginRateLimit = null // reset so next request retries initialization
    return true
  }
}

function loginPage({ error = false, misconfigured = false, rateLimited = false } = {}) {
  const notice = misconfigured
    ? '<div class="err">[ Zugangsschutz ist nicht konfiguriert. SITE_PASSWORD fehlt. ]</div>'
    : rateLimited
      ? '<div class="err">[ Zu viele Versuche. Bitte in 15 Minuten erneut versuchen. ]</div>'
      : error
        ? '<div class="err">[ Falsches Passwort ]</div>'
        : ''
  const form = misconfigured || rateLimited
    ? ''
    : `<form method="POST" action="${AUTH_PATH}">
      <input type="password" name="password" placeholder="Passwort eingeben…" autofocus required>
      <button type="submit">Zugang &gt;&gt;&gt;</button>
    </form>`
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Assistenz-Ranking — Private Beta</title>
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:#f5f0e8; color:#0a0a0a; font-family:ui-monospace,Menlo,Consolas,monospace; padding:24px }
  .box { border:1px solid #0a0a0a; width:100%; max-width:360px }
  .strip { background:#0a0a0a; color:#f5f0e8; font-size:11.5px; letter-spacing:.18em;
           text-transform:uppercase; padding:8px 12px }
  .pad { padding:24px }
  h1 { font-size:22px; text-transform:uppercase; letter-spacing:-.02em; margin:0 0 4px }
  p { font-size:12px; color:#0a0a0aaa; margin:0 0 20px }
  input { width:100%; border:1px solid #0a0a0a; background:#fff; padding:10px 12px;
          font:inherit; font-size:14px; margin-bottom:12px }
  button { width:100%; border:0; background:#c81318; color:#fff; padding:12px;
           font:inherit; font-size:12px; letter-spacing:.12em; text-transform:uppercase; cursor:pointer }
  .err { color:#c81318; font-size:11.5px; letter-spacing:.08em; text-transform:uppercase; margin-bottom:12px }
</style></head>
<body><div class="box">
  <div class="strip">/// Assistenz-Ranking — Private Beta</div>
  <div class="pad">
    <h1>Zugang gesperrt</h1>
    <p>Die Plattform befindet sich noch im Aufbau.</p>
    ${notice}
    ${form}
  </div>
</div></body></html>`
  return new Response(html, {
    status: misconfigured ? 503 : rateLimited ? 429 : error ? 401 : 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      ...(rateLimited ? { 'Retry-After': '900' } : {}),
    },
  })
}

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD
  if (!password || !password.trim()) return loginPage({ misconfigured: true })

  if (process.env.SITE_PRIVATE === 'false') return // Launch-Modus: durchlassen

  const token = await sha256hex(password)
  const url = new URL(request.url)

  // Bereits eingeloggt?
  if (timingSafeEqual(readCookie(request.headers.get('cookie'), COOKIE), token)) return

  // Login-Formular abgeschickt
  if (request.method === 'POST' && url.pathname === AUTH_PATH) {
    if (!await loginAllowed(request)) return loginPage({ rateLimited: true })

    const form = await request.formData()
    const submittedToken = await sha256hex(String(form.get('password') ?? ''))
    if (timingSafeEqual(submittedToken, token)) {
      return new Response(null, {
        status: 303,
        headers: {
          'Location': '/',
          'Set-Cookie': `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`,
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      })
    }
    return loginPage({ error: true }) // falsches Passwort
  }

  // Alles andere → Login-Seite
  return loginPage()
}
