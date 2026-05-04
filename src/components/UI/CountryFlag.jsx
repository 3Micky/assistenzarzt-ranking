const FLAGS = { DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭' }

export default function CountryFlag({ country, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span>{FLAGS[country] ?? '🏳️'}</span>
      {showLabel && <span className="text-slate-400">{country}</span>}
    </span>
  )
}
