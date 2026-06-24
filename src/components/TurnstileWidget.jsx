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
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.turnstile)
    script.onerror = reject
    document.head.appendChild(script)
  })

  return scriptPromise
}

export default function TurnstileWidget({ siteKey, onTokenChange, resetKey = 0 }) {
  const containerRef = useRef(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    onTokenChange('')
    if (!siteKey || !containerRef.current) return undefined

    let active = true
    let widgetId
    setLoadError(false)

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !turnstile || !containerRef.current) return
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language: 'de',
          callback: token => onTokenChange(token),
          'expired-callback': () => onTokenChange(''),
          'error-callback': () => {
            onTokenChange('')
            setLoadError(true)
          },
        })
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
      if (widgetId != null && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [siteKey, onTokenChange, resetKey])

  if (!siteKey) {
    return (
      <p className="font-mono text-[11.5px] text-hazard">
        CAPTCHA ist nicht konfiguriert. Bitte VITE_TURNSTILE_SITE_KEY setzen.
      </p>
    )
  }

  return (
    <div>
      <div ref={containerRef} />
      {loadError && (
        <p className="font-mono text-[11.5px] text-hazard mt-2">
          CAPTCHA konnte nicht geladen werden. Bitte Seite neu laden.
        </p>
      )}
    </div>
  )
}
