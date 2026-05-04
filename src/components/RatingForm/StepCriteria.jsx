function BooleanField({ label, value, onChange }) {
  return (
    <div className="bg-canvas p-3">
      <div className="mono-label mb-2">{label}</div>
      <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => onChange(true)}  className={value === true  ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
        <button onClick={() => onChange(false)} className={value === false ? 'toggle-no-active'  : 'toggle-inactive'}>NEIN</button>
      </div>
    </div>
  )
}

function EnumField({ label, value, options, onChange }) {
  return (
    <div className="bg-canvas p-3">
      <div className="mono-label mb-2">{label}</div>
      <div className="ink-grid" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
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
    <div className="bg-canvas p-3">
      <div className="mono-label mb-2">{label}</div>
      <input type="number" min={min} max={max} value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? null : +e.target.value)}
        className="input-brutalist font-mono text-lg font-bold w-24 tabular-nums" />
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
        SCHRITT 2 VON 4 /// PFLICHT-KRITERIEN
      </div>
      <div className="ink-grid p-0" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Arbeitszeiten */}
        <div className="bg-canvas p-3">
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

        <NumberField label="OPS / MONAT" value={data.opsProMonat} min={0} max={50}
          onChange={v => set('opsProMonat', v)} />

        <EnumField label="DIENSTSYSTEM" value={data.dienstsystem} options={['12h', '24h']}
          onChange={v => set('dienstsystem', v)} />

        <BooleanField label="ÜBERSTUNDEN AUFSCHREIBEN" value={data.ueberstundenAufschreiben}
          onChange={v => set('ueberstundenAufschreiben', v)} />

        {/* Rotationspläne with text */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">ROTATIONSPLÄNE</div>
          <div className="ink-grid mb-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={() => set('rotationsplaene', true)}
              className={data.rotationsplaene === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
            <button onClick={() => set('rotationsplaene', false)}
              className={data.rotationsplaene === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
          </div>
          <input className="input-brutalist text-xs" placeholder="Details…"
            value={data.rotationsplaeneText ?? ''}
            onChange={e => set('rotationsplaeneText', e.target.value)} />
        </div>

        {/* Fortbildung */}
        <div className="bg-canvas p-3">
          <div className="mono-label mb-2">FORTBILDUNG</div>
          <div className="flex flex-col gap-2">
            <div>
              <div className="mono-label mb-1">FREISTELLUNG</div>
              <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button onClick={() => set('fortbildungFreistellung', true)}
                  className={data.fortbildungFreistellung === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
                <button onClick={() => set('fortbildungFreistellung', false)}
                  className={data.fortbildungFreistellung === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
              </div>
            </div>
            <div>
              <div className="mono-label mb-1">BEZAHLT</div>
              <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button onClick={() => set('fortbildungBezahlt', true)}
                  className={data.fortbildungBezahlt === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
                <button onClick={() => set('fortbildungBezahlt', false)}
                  className={data.fortbildungBezahlt === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
              </div>
            </div>
          </div>
        </div>

        <NumberField label="ABTEILUNGSGRÖSSE (ÄRZTE)" value={data.abteilungsgroesse} min={1} max={500}
          onChange={v => set('abteilungsgroesse', v)} />

        <NumberField label="MITARBEITERGESPRÄCHE / JAHR" value={data.mitarbeitergespraeche} min={0} max={12}
          onChange={v => set('mitarbeitergespraeche', v)} />
      </div>

      <div className="ink-grid border-t border-ink p-0" style={{ gridTemplateColumns: 'auto auto 1fr' }}>
        <button onClick={onBack} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onNext} className="btn-hazard border-r border-ink">WEITER &gt;&gt;&gt;</button>
        <div className="bg-canvas" />
      </div>
    </div>
  )
}
