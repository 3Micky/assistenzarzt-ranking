import { useEffect, useState } from 'react'

const SESSION_KEY = 'ar_unlocked'
const PASSWORD    = 'be100aware.now'

export default function PasswordGate({ children }) {
  const isPublicLaunch = import.meta.env.VITE_PUBLIC_LAUNCH === 'true'
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput]       = useState('')
  const [error, setError]       = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setUnlocked(window.sessionStorage.getItem(SESSION_KEY) === '1')
  }, [])

  if (isPublicLaunch) return children
  if (unlocked) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (input === PASSWORD) {
      window.sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      <div className="border border-ink w-full max-w-sm">
        <div className="register-strip border-b border-ink">
          /// ASSISTENZDOC — PRIVATE BETA
        </div>
        <div className="p-6">
          <h1 className="font-display text-2xl text-ink uppercase tracking-tight mb-1">
            Zugang gesperrt
          </h1>
          <p className="text-xs text-ink/70 mb-6">
            Die Plattform befindet sich noch im Aufbau.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              className="input-brutalist"
              placeholder="Passwort eingeben…"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              autoFocus
            />
            {error && (
              <div className="mono-label-red text-xs">[ FALSCHES PASSWORT ]</div>
            )}
            <button type="submit" className="btn-hazard">
              ZUGANG &gt;&gt;&gt;
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
