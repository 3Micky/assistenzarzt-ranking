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

export default function StepCriteria({ data, onChange, onBack, onNext }) {
  function set(key, val) {
    onChange({ ...data, [key]: val })
  }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 2 VON 5 /// PFLICHT-KRITERIEN
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

        <NumberField label="OPS / MONAT" value={data.opsProMonat} min={0} max={50}
          onChange={v => set('opsProMonat', v)} />

        {/* Schichtsystem — ersetzt Dienstsystem */}
        <EnumField label="SCHICHTSYSTEM" value={data.schichtsystem}
          options={['2-Schicht', '3-Schicht', '24h-Dienste']}
          onChange={v => set('schichtsystem', v)} />

        {/* Überstunden */}
        <BooleanField label="ÜBERSTUNDEN AUFSCHREIBEN" value={data.ueberstundenAufschreiben}
          onChange={v => set('ueberstundenAufschreiben', v)} />

        {data.ueberstundenAufschreiben === true && (
          <EnumField label="ÜBERSTUNDEN-AUSGLEICH" value={data.ueberstundenAusgleich}
            options={['Bezahlt', 'Freizeitausgleich']}
            onChange={v => set('ueberstundenAusgleich', v)} />
        )}

        {/* Rotationspläne */}
        <div className="bg-canvas-alt rounded p-3">
          <div className="mono-label mb-2">ROTATIONSPLÄNE</div>
          <div className="grid grid-cols-2 gap-1 mb-2">
            <button onClick={() => set('rotationsplaene', true)}
              className={data.rotationsplaene === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
            <button onClick={() => set('rotationsplaene', false)}
              className={data.rotationsplaene === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
          </div>
          <input className="input-brutalist text-xs w-full" placeholder="Details…"
            value={data.rotationsplaeneText ?? ''}
            onChange={e => set('rotationsplaeneText', e.target.value)} />
        </div>

        {/* Lehrtätigkeit */}
        <BooleanField label="LEHRTÄTIGKEIT VORHANDEN" value={data.lehreTaetig}
          onChange={v => set('lehreTaetig', v)} />

        {data.lehreTaetig === true && (
          <BooleanField label="FREISTELLUNG FÜR LEHRE" value={data.lehreFreistellung}
            onChange={v => set('lehreFreistellung', v)} />
        )}

        {/* Schwangerschaft */}
        <div className="bg-canvas-alt rounded p-3 sm:col-span-2">
          <div className="mono-label mb-2">SCHWANGERSCHAFT</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            {['Sofortiges Arbeitsverbot', 'Individuelle Lösung', 'Normal weiterarbeiten'].map(opt => (
              <button key={opt} onClick={() => set('schwangerschaft', opt)}
                className={data.schwangerschaft === opt ? 'tab-active' : 'tab-inactive'}>
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <BooleanField label="FORTBILDUNG: FREISTELLUNG" value={data.fortbildungFreistellung}
          onChange={v => set('fortbildungFreistellung', v)} />

        <BooleanField label="FORTBILDUNG: BEZAHLT" value={data.fortbildungBezahlt}
          onChange={v => set('fortbildungBezahlt', v)} />

        <NumberField label="ABTEILUNGSGRÖSSE (ÄRZTE)" value={data.abteilungsgroesse} min={1} max={500}
          onChange={v => set('abteilungsgroesse', v)} />

        <NumberField label="MITARBEITERGESPRÄCHE / JAHR" value={data.mitarbeitergespraeche} min={0} max={12}
          onChange={v => set('mitarbeitergespraeche', v)} />

      </div>

      <div className="flex border-t border-ink">
        <button onClick={onBack} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onNext} className="btn-hazard">WEITER &gt;&gt;&gt;</button>
      </div>
    </div>
  )
}
