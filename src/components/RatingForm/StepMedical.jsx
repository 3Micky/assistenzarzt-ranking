function SliderField({ label, hint, value, onChange, invertLabel }) {
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

export default function StepMedical({ data, onChange, onBack, onNext }) {
  function set(key, val) { onChange({ ...data, [key]: val }) }

  return (
    <div>
      <div className="register-strip border-b border-ink">
        SCHRITT 3 VON 5 /// WEITERBILDUNG &amp; KLINISCHER ALLTAG
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Operative & Ausbildungszahlen */}
        <NumberField
          label="WB-ERMÄCHTIGUNG DER ABTEILUNG"
          value={data.wbeJahre} min={0} max={12} unit="JAHRE"
          onChange={v => set('wbeJahre', v)}
        />

        <NumberField
          label="OPS / MONAT"
          value={data.opsProMonat} min={0} max={50} unit="OPS"
          onChange={v => set('opsProMonat', v)}
        />

        {/* Rotationen */}
        <div className="bg-canvas-alt rounded p-3">
          <div className="mono-label mb-2">ROTATIONSPLÄNE</div>
          <div className="grid grid-cols-2 gap-1 mb-2">
            <button onClick={() => set('rotationsplaene', true)}
              className={data.rotationsplaene === true ? 'toggle-yes-active' : 'toggle-inactive'}>JA</button>
            <button onClick={() => set('rotationsplaene', false)}
              className={data.rotationsplaene === false ? 'toggle-no-active' : 'toggle-inactive'}>NEIN</button>
          </div>
          {data.rotationsplaene === true && (
            <input className="input-brutalist text-xs w-full" placeholder="Details zu Rotationen…"
              value={data.rotationsplaeneText ?? ''}
              onChange={e => set('rotationsplaeneText', e.target.value)} />
          )}
        </div>

        <SliderField
          label="NACHTDIENST-BEGLEITUNG"
          value={data.nachtdienstBegleitung}
          onChange={v => set('nachtdienstBegleitung', v)}
          invertLabel={['Nicht erreichbar', 'Immer erreichbar']}
        />

        {/* Qualitäts-Slider */}
        <SliderField
          label="LOGBUCH-ERFÜLLBARKEIT"
          hint="WBO-Pflichteingriffe erreichbar?"
          value={data.logbuchErfuellbarkeit}
          onChange={v => set('logbuchErfuellbarkeit', v)}
          invertLabel={['Kaum möglich', 'Vollständig erreichbar']}
        />

        <SliderField
          label="SUPERVISION-QUALITÄT"
          hint="OÄ präsent, erreichbar & engagiert?"
          value={data.supervisionQualitaet}
          onChange={v => set('supervisionQualitaet', v)}
          invertLabel={['Keine Begleitung', 'Exzellente Mentoren']}
        />

        <SliderField
          label="AUTONOMIE"
          hint="Eigenständig operativ/diagnostisch arbeiten?"
          value={data.autonomie}
          onChange={v => set('autonomie', v)}
          invertLabel={['Immer überwacht', 'Volle Selbstständigkeit']}
        />

        {/* Fortbildung & Lehre */}
        <BoolField
          label="FORTBILDUNG: FREISTELLUNG"
          value={data.fortbildungFreistellung}
          onChange={v => set('fortbildungFreistellung', v)}
        />

        <BoolField
          label="FORTBILDUNG: BEZAHLT"
          value={data.fortbildungBezahlt}
          onChange={v => set('fortbildungBezahlt', v)}
        />

        <BoolField
          label="LEHRTÄTIGKEIT VORHANDEN"
          value={data.lehreTaetig}
          onChange={v => set('lehreTaetig', v)}
        />

        {data.lehreTaetig === true && (
          <BoolField
            label="FREISTELLUNG FÜR LEHRE"
            value={data.lehreFreistellung}
            onChange={v => set('lehreFreistellung', v)}
          />
        )}

        <NumberField
          label="MITARBEITERGESPRÄCHE / JAHR"
          value={data.mitarbeitergespraeche} min={0} max={12} unit="× / JAHR"
          onChange={v => set('mitarbeitergespraeche', v)}
        />

        <SliderField
          label="DOKUMENTATIONSAUFWAND"
          value={data.dokumentationsaufwand}
          onChange={v => set('dokumentationsaufwand', v)}
          invertLabel={['Extreme Admin-Last', 'Minimale Doku']}
        />

      </div>

      <div className="flex border-t border-ink">
        <button onClick={onBack} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onNext} className="btn-hazard">WEITER &gt;&gt;&gt;</button>
      </div>
    </div>
  )
}
