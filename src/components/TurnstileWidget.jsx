import { useEffect, useRef, useState } from 'react'

const SCRIPT_ID = 'cloudflare-turnstile-script'
let scriptPromise

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.turnstile), { once: true })
      existing.addEventListener('error', (error) => {
        scriptPromise = undefined
        existing.remove()
        reject(error)
      }, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = (error) => {
      scriptPromise = undefined
      script.remove()
      reject(error)
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

export default function TurnstileWidget({ siteKey, onTokenChange, onStatusChange, resetKey = 0 }) {
  const containerRef = useRef(null)
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    onTokenChange('')
    if (!siteKey || !containerRef.current) {
      onStatusChange?.('missing-config')
      return undefined
    }

    let active = true
    let widgetId
    setLoadError(false)
    setIsLoading(true)
    onStatusChange?.('loading')

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !turnstile || !containerRef.current) return
        setIsLoading(false)
        onStatusChange?.('ready')
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language: 'de',
          appearance: 'always',
          theme: 'light',
          callback: (token) => {
            onTokenChange(token)
            onStatusChange?.('verified')
          },
          'expired-callback': () => {
            onTokenChange('')
            onStatusChange?.('ready')
          },
          'error-callback': () => {
            onTokenChange('')
            setLoadError(true)
            setIsLoading(false)
            onStatusChange?.('error')
          },
          'unsupported-callback': () => {
            onTokenChange('')
            setLoadError(true)
            setIsLoading(false)
            onStatusChange?.('error')
          },
        })
      })
      .catch(() => {
        if (active) {
          setIsLoading(false)
          setLoadError(true)
          onStatusChange?.('error')
        }
      })

    return () => {
      active = false
      if (widgetId != null && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [siteKey, onTokenChange, onStatusChange, resetKey, retryKey])

  if (!siteKey) {
    return (
      <p className="font-mono text-[11.5px] text-hazard">
        CAPTCHA ist nicht konfiguriert. Bitte VITE_TURNSTILE_SITE_KEY setzen.
      </p>
    )
  }

  return (
    <div>
      <div ref={containerRef} className="min-h-[65px]" />
      {isLoading && !loadError && (
        <p className="font-mono text-[11.5px] text-ink/60 mt-2">
          Bot-Schutz lädt …
        </p>
      )}
      {loadError && (
        <div className="mt-2 space-y-2">
          <p className="font-mono text-[11.5px] text-hazard">
            Bot-Schutz konnte nicht geladen werden. Bitte Adblocker/Tracking-Schutz prüfen oder erneut versuchen.
          </p>
          <button
            type="button"
            className="btn-ghost-ink"
            onClick={() => setRetryKey(key => key + 1)}
          >
            Bot-Schutz neu laden
          </button>
        </div>
      )}
    </div>
  )
}
