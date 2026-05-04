import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchDropdown from './SearchDropdown.jsx'
import { useRatingsStore } from '../../store/ratingsStore.js'
import { COUNTRY_LABELS } from '../../data/criteria.js'

const COUNTRY_ALIASES = {
  deutschland: 'DE', de: 'DE',
  österreich: 'AT', oesterreich: 'AT', at: 'AT', austria: 'AT',
  schweiz: 'CH', ch: 'CH', swiss: 'CH', switzerland: 'CH',
}

/**
 * @param {{ defaultMode?: 'lesen'|'bewerten' }} props
 */
export default function SearchWidget({ defaultMode = 'lesen' }) {
  const [mode, setMode]       = useState(defaultMode)
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
  const ratings               = useRatingsStore((s) => s.ratings)
  const navigate              = useNavigate()
  const wrapperRef            = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function buildResults(q) {
    if (!q.trim()) return []
    const lower = q.toLowerCase().trim()

    const countryCode = COUNTRY_ALIASES[lower]

    const hospitals = [...new Set(ratings.map(r => r.hospital))]
    const cities    = [...new Set(ratings.map(r => r.city))]
    const regions   = [...new Set(ratings.map(r => r.region).filter(Boolean))]

    const out = []

    if (countryCode) {
      const label = COUNTRY_LABELS[countryCode]
      const count = [...new Set(ratings.filter(r => r.country === countryCode).map(r => r.hospital))].length
      out.push({ type: 'bundesland', label, country: countryCode, count })
    }

    hospitals.filter(h => h.toLowerCase().includes(lower)).slice(0, 5).forEach(h => {
      const r = ratings.find(r => r.hospital === h)
      out.push({ type: 'klinik', label: h, country: r.country })
    })

    cities.filter(c => c.toLowerCase().includes(lower)).slice(0, 3).forEach(c => {
      const r   = ratings.find(r => r.city === c)
      const cnt = [...new Set(ratings.filter(r => r.city === c).map(r => r.hospital))].length
      out.push({ type: 'stadt', label: c, country: r.country, count: cnt })
    })

    regions.filter(rg => rg.toLowerCase().includes(lower)).slice(0, 2).forEach(rg => {
      const r   = ratings.find(r => r.region === rg)
      const cnt = [...new Set(ratings.filter(r => r.region === rg).map(r => r.hospital))].length
      out.push({ type: 'bundesland', label: rg, country: r.country, count: cnt })
    })

    return out.slice(0, 10)
  }

  function handleChange(e) {
    const q = e.target.value
    setQuery(q)
    setResults(buildResults(q))
    setOpen(true)
  }

  function handleSelect(r) {
    setQuery(r.label)
    setOpen(false)
    navigate(`/berichte?q=${encodeURIComponent(r.label)}&type=${r.type}&country=${r.country}`)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setOpen(false)
    if (mode === 'bewerten') {
      navigate(`/bewerten?q=${encodeURIComponent(query)}`)
    } else {
      navigate(`/berichte?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="border border-ink bg-canvas">
      {/* Mode toggle */}
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button
          onClick={() => setMode('lesen')}
          className={mode === 'lesen' ? 'tab-active' : 'tab-inactive'}
        >
          &gt;&gt;&gt; BERICHTE LESEN
        </button>
        <button
          onClick={() => { setMode('bewerten'); navigate('/bewerten') }}
          className={mode === 'bewerten' ? 'tab-active' : 'tab-inactive'}
        >
          [ BEWERTEN ]
        </button>
      </div>

      {/* Search row */}
      <form onSubmit={handleSubmit} className="relative" ref={wrapperRef}>
        <div className="ink-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <input
            className="bg-white border-none outline-none px-4 py-3 text-sm font-sans text-ink placeholder-ink/30 w-full"
            placeholder="Klinik, Stadt, Bundesland, Deutschland…"
            value={query}
            onChange={handleChange}
            onFocus={() => query && setOpen(true)}
            autoComplete="off"
          />
          <button type="submit" className="btn-hazard px-6 border-l border-ink whitespace-nowrap">
            SUCHEN &gt;&gt;&gt;
          </button>
        </div>

        {open && (
          <SearchDropdown results={results} onSelect={handleSelect} />
        )}
      </form>
    </div>
  )
}
