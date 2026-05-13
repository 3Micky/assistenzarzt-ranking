export default function CountryFlag({ country, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] tracking-widest">
      <span className="border border-ink/30 px-1">{country ?? '?'}</span>
      {showLabel && <span className="text-ink/50">{country}</span>}
    </span>
  )
}
