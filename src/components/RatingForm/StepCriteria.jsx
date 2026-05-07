function BooleanField({ label, value, onChange }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-1">
        <button onClick={() => onChange(true)}  className={value === true  ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
        <button onClick={() => onChange(false)} className={value === false ? 'toggle-no-active'  : 'toggle-inactive'}>NEIN</button>
      </div>
    </div>
  )
}

function EnumField({ label, value, options, onChange }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-2">{label}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={value === opt ? 'tab-active' : 'tab-inactive'}>
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

function NumberField({ label, value, min, max, onChange }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-2">{label}</div>
      <input type="number" min={min} max={max} value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? null : +e.target.value)}
        className="input-brutalist font-mono text-lg font-bold w-24 tabular-nums" />
    </div>
  )
}

function SliderField({ label, value, hint, invertLabel, onChange }) {
  return (
    <div className="bg-canvas-alt rounded p-3">
      <div className="mono-label mb-2">
        {hint ? `${label} · ${hint}` : label}
      </div>
      <div className="flex items-center gap-3">
        <input type="range" min={1} max={10} value={value ?? 5}
          onChange={e => onChange(+e.target.value)}
          className="slider-brutalist flex-1" />
        <span className="text-hazard font-bold font-mono w-6 text-right">{value ?? 5}</span>
      </div>
      {invertLabel && (
        <div className="flex justify-between text-[11.5px] text-ink/70 mt-1">
          <span>{invertLabel[0]}</span><span>{invertLabel[1]}</span>
        </div>
      )}
    </div>
  )
}

export default function StepCriteria({ data, onChange, onBack, onNext }) {
  function set(key, val) {
    onChange({ ...data, [key]: val })
  }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 2 VON 5 /// ARBEITSZEIT &amp; DIENSTE
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Arbeitszeiten */}
        <div className="bg-canvas-alt rounded p-3">
          <div className="mono-label mb-2">ARBEITSZEITEN</div>
          <div className="flex items-center gap-2">
            <input type="time" value={data.arbeitszeitenVon ?? '07:00'}
              onChange={e => set('arbeitszeitenVon', e.target.value)}
              className="input-brutalist font-mono text-sm flex-1" />
            <span className="mono-label">—</span>
            <input type="time" value={data.arbeitszeitenBis ?? '16:00'}
              onChange={e => set('arbeitszeitenBis', e.target.value)}
              className="input-brutalist font-mono text-sm flex-1" />
          </div>
        </div>

        <NumberField label="DIENSTE / MONAT" value={data.diensteProMonat} min={0} max={15}
          onChange={v => set('diensteProMonat', v)} />

        <EnumField label="SCHICHTSYSTEM" value={data.schichtsystem}
          options={['2-Schicht', '3-Schicht', '24h-Dienste']}
          onChange={v => set('schichtsystem', v)} />

        <BooleanField label="ÜBERSTUNDEN AUFSCHREIBEN" value={data.ueberstundenAufschreiben}
          onChange={v => set('ueberstundenAufschreiben', v)} />

        {data.ueberstundenAufschreiben === true && (
          <EnumField label="ÜBERSTUNDEN-AUSGLEICH" value={data.ueberstundenAusgleich}
            options={['Bezahlt', 'Freizeitausgleich']}
            onChange={v => set('ueberstundenAusgleich', v)} />
        )}

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

      </div>

      <div className="flex border-t border-ink">
        <button onClick={onBack} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onNext} className="btn-hazard">WEITER &gt;&gt;&gt;</button>
      </div>
    </div>
  )
}
