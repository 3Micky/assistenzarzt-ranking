import { Link } from 'react-router-dom'

export default function StepDone({ hospital, onNew }) {
  return (
    <div>
      <div className="register-strip border-b border-ink">
        /// BESTÄTIGUNG
      </div>
      <div className="p-8 border-b border-ink">
        <div className="mono-label-red mb-3">[ GESPEICHERT ]</div>
        <div className="font-display text-3xl text-ink uppercase tracking-tight leading-none mb-4">
          Danke.<br />/// Bewertung<br />gespeichert.
        </div>
        <div className="text-sm text-ink/80 mb-6">{hospital}</div>
        <div className="ink-grid" style={{ gridTemplateColumns: 'auto auto' }}>
          <button onClick={onNew} className="btn-ink">&gt;&gt;&gt; WEITERE BEWERTUNG</button>
          <Link to="/" className="btn-ghost-ink">[ ZUR STARTSEITE ]</Link>
        </div>
      </div>
    </div>
  )
}
