export default function StepNiceToHave({ data, comment, onChange, onCommentChange, onBack, onSubmit }) {
  function set(key, val) { onChange({ ...data, [key]: val }) }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 3 VON 4 /// NICE-TO-HAVE
      </div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Parkplatz */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">PARKPLATZ</div>
          <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={() => set('parkplatz', true)}  className={data.parkplatz === true  ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
            <button onClick={() => set('parkplatz', false)} className={data.parkplatz === false ? 'toggle-no-active'  : 'toggle-inactive'}>NEIN</button>
          </div>
        </div>

        {/* WLB Slider */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">
            WORK-LIFE-BALANCE &nbsp;
            <span className="text-hazard font-bold">{data.workLifeBalance}</span>/10
          </div>
          <input type="range" min={1} max={10} value={data.workLifeBalance ?? 5}
            onChange={e => set('workLifeBalance', +e.target.value)}
            className="slider-brutalist" />
        </div>

        {/* Team Slider */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">
            TEAM-ATMOSPHÄRE &nbsp;
            <span className="text-hazard font-bold">{data.teamAtmosphaere}</span>/10
          </div>
          <input type="range" min={1} max={10} value={data.teamAtmosphaere ?? 5}
            onChange={e => set('teamAtmosphaere', +e.target.value)}
            className="slider-brutalist" />
        </div>

        {/* Benefits */}
        <div className="bg-canvas p-3" style={{ gridColumn: '1 / -1' }}>
          <div className="mono-label mb-2">BENEFITS (OPTIONAL)</div>
          <input className="input-brutalist" placeholder="z.B. Jobticket, Kantine, Kinderbetreuung…"
            value={data.benefits ?? ''}
            onChange={e => set('benefits', e.target.value)} />
        </div>

        {/* Comment */}
        <div className="bg-canvas p-3" style={{ gridColumn: '1 / -1' }}>
          <div className="mono-label mb-2">KOMMENTAR (OPTIONAL)</div>
          <textarea rows={3} className="input-brutalist resize-y"
            placeholder="Freitext…"
            value={comment}
            onChange={e => onCommentChange(e.target.value)} />
        </div>
      </div>

      <div className="ink-grid border-t border-ink" style={{ gridTemplateColumns: 'auto auto 1fr' }}>
        <button onClick={onBack}   className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onSubmit} className="btn-hazard border-r border-ink">ABSENDEN &gt;&gt;&gt;</button>
        <div className="bg-canvas" />
      </div>
    </div>
  )
}
