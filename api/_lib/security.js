import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const PRODUCTION_ORIGIN = 'https://assistenz-ranking.de'
const LOCAL_ORIGIN_PATTERN = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/
const limiterCache = new Map()

export function isAllowedOrigin(origin) {
  return !origin || origin === PRODUCTION_ORIGIN || LOCAL_ORIGIN_PATTERN.test(origin)
}

export function applyCors(req, res) {
  const origin = req.headers.origin
  if (!isAllowedOrigin(origin)) return false

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')
  return true
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  if (Array.isArray(forwarded) && forwarded[0]) return forwarded[0].split(',')[0].trim()
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

export function getRequestBodySize(req) {
  const contentLength = Number(req.headers['content-length'])
  if (Number.isFinite(contentLength) && contentLength >= 0) return contentLength

  try {
    return new TextEncoder().encode(JSON.stringify(req.body ?? {})).byteLength
  } catch {
    return Number.POSITIVE_INFINITY
  }
}

export function hasUpstashConfig() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

function getLimiter({ limit, window, prefix }) {
  const cacheKey = `${prefix}:${limit}:${window}`
  if (!limiterCache.has(cacheKey)) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    limiterCache.set(cacheKey, new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, window),
      analytics: true,
      prefix,
    }))
  }
  return limiterCache.get(cacheKey)
}

export async function enforceRateLimits(identifier, rules) {
  for (const rule of rules) {
    const result = await getLimiter(rule).limit(identifier)
    if (!result.success) return result
  }
  return { success: true }
}

export async function verifyTurnstileToken(token, remoteIp) {
  if (typeof token !== 'string' || token.length < 1 || token.length > 2048) {
    return { success: false, error: 'CAPTCHA-Token fehlt oder ist ungültig.' }
  }

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  })
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return { success: false, error: 'CAPTCHA-Prüfung ist fehlgeschlagen.' }

    const result = await response.json()
    return result.success
      ? { success: true }
      : { success: false, error: 'CAPTCHA-Prüfung war nicht erfolgreich.' }
  } catch (error) {
    console.error('Turnstile-Verifikation fehlgeschlagen:', error)
    return { success: false, error: 'CAPTCHA-Prüfung ist derzeit nicht verfügbar.' }
  }
}
