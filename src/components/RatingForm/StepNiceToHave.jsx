function SliderField({ label, value, invertLabel, onChange }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-2">
        {label} &nbsp;<span className="text-hazard font-bold">{value ?? 5}</span>/10
      </div>
      <input type="range" min={1} max={10} value={value ?? 5}
        onChange={e => onChange(+e.target.value)}
        className="slider-brutalist w-full" />
      {invertLabel && (
        <div className="flex justify-between text-[11.5px] text-ink/70 mt-1">
          <span>{invertLabel[0]}</span><span>{invertLabel[1]}</span>
        </div>
      )}
    </div>
  )
}

function BoolField({ label, hint, value, onChange, yesLabel = 'JA', noLabel = 'NEIN' }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-1">{label}</div>
      {hint && <div className="text-xs text-ink/70 mb-2">{hint}</div>}
      <div className="grid grid-cols-2 gap-1">
        <button onClick={() => onChange(true)}  className={value === true  ? 'toggle-yes-active' : 'toggle-inactive'}>{yesLabel}</button>
        <button onClick={() => onChange(false)} className={value === false ? 'toggle-no-active'  : 'toggle-inactive'}>{noLabel}</button>
      </div>
    </div>
  )
}

function NumberField({ label, hint, value, min, max, unit, onChange }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-1">{label}</div>
      {hint && <div className="text-xs text-ink/70 mb-2">{hint}</div>}
      <div className="flex items-center gap-2">
        <input type="number" min={min} max={max} value={value ?? ''}
          onChange={e => onChange(e.target.value === '' ? null : +e.target.value)}
          className="input-brutalist font-mono text-lg font-bold w-24 tabular-nums" />
        {unit && <span className="mono-label text-xs">{unit}</span>}
      </div>
    </div>
  )
}

export default function StepNiceToHave({ data, comment, onChange, onCommentChange, onBack, onSubmit }) {
  function set(key, val) { onChange({ ...data, [key]: val }) }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 4 VON 5 /// ABTEILUNG, TEAM &amp; SOZIALES
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

        <SliderField
          label="URLAUBSGENEHMIGUNG"
          value={data.urlaubsgenehmigung}
          onChange={v => set('urlaubsgenehmigung', v)}
          invertLabel={['Wird immer verschoben', 'Problemlos genehmigt']}
        />

        <SliderField
          label="WORK-LIFE-BALANCE"
          value={data.workLifeBalance}
          onChange={v => set('workLifeBalance', v)}
          invertLabel={['Kaum Erholung', 'Gute Balance']}
        />

        <SliderField
          label="TEAM-ATMOSPHÄRE"
          value={data.teamAtmosphaere}
          onChange={v => set('teamAtmosphaere', v)}
          invertLabel={['Toxisches Klima', 'Exzellentes Team']}
        />

        {/* Schwangerschaft & Familie */}
        <div className="bg-canvas-alt rounded p-3">
          <div className="mono-label mb-2">SCHWANGERSCHAFT (POLICY)</div>
          <div className="grid grid-cols-1 gap-1">
            {['Sofortiges Arbeitsverbot', 'Individuelle Lösung', 'Normal weiterarbeiten'].map(opt => (
              <button key={opt} onClick={() => set('schwangerschaft', opt)}
                className={data.schwangerschaft === opt ? 'tab-active' : 'tab-inactive'}>
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <BoolField
          label="SCHWANGERSCHAFT / ELTERNZEIT"
          hint="Wird Elternzeit unterstützt?"
          value={data.schwangerschaftFamilienfreundlich}
          onChange={v => set('schwangerschaftFamilienfreundlich', v)}
          yesLabel="FAMILIENFREUNDLICH" noLabel="PROBLEMATISCH"
        />

        <BoolField
          label="PARKPLATZ"
          value={data.parkplatz}
          onChange={v => set('parkplatz', v)}
        />

        {/* Benefits & Kommentar */}
        <div className="bg-canvas-alt rounded p-3 sm:col-span-2">
          <div className="mono-label mb-2">BENEFITS (OPTIONAL)</div>
          <input className="input-brutalist w-full" placeholder="z.B. Jobticket, Kantine, Kinderbetreuung…"
            value={data.benefits ?? ''}
            onChange={e => set('benefits', e.target.value)} />
        </div>

        <div className="bg-canvas-alt rounded p-3 sm:col-span-2">
          <div className="mono-label mb-2">KOMMENTAR (OPTIONAL)</div>
          <textarea rows={3} className="input-brutalist resize-y w-full"
            placeholder="Freitext — was noch wichtig ist…"
            value={comment}
            onChange={e => onCommentChange(e.target.value)} />
        </div>

      </div>

      <div className="flex border-t border-ink">
        <button onClick={onBack}   className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onSubmit} className="btn-hazard">ABSENDEN &gt;&gt;&gt;</button>
      </div>
    </div>
  )
}
