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
        SCHRITT 3 VON 5 /// WEITERBILDUNG &amp; AUSBILDUNGSQUALITÄT
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

        <NumberField
          label="WBE-JAHRE AM HAUS"
          hint="WB-Ermächtigung der Abteilung"
          value={data.wbeJahre} min={0} max={12} unit="JAHRE"
          onChange={v => set('wbeJahre', v)}
        />

        <NumberField
          label="BETTEN PRO ARZT"
          hint="Personalschlüssel im Regeldienst"
          value={data.personalschluessel} min={1} max={100} unit="BETTEN"
          onChange={v => set('personalschluessel', v)}
        />

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

        <SliderField
          label="DOKUMENTATIONSAUFWAND"
          hint="10 = wenig Admin-Last · 1 = viel Bürokratie"
          value={data.dokumentationsaufwand}
          onChange={v => set('dokumentationsaufwand', v)}
          invertLabel={['Extreme Admin-Last', 'Minimale Doku']}
        />

        <SliderField
          label="URLAUBSGENEHMIGUNG"
          hint="Urlaub unkompliziert genehmigt?"
          value={data.urlaubsgenehmigung}
          onChange={v => set('urlaubsgenehmigung', v)}
          invertLabel={['Wird immer verschoben', 'Problemlos genehmigt']}
        />

        <BoolField
          label="NACHTDIENST-BEGLEITUNG"
          hint="OA als Hintergrundbereitschaft erreichbar?"
          value={data.nachtdienstBegleitung}
          onChange={v => set('nachtdienstBegleitung', v)}
          yesLabel="OA-HINTERGRUND" noLabel="ALLEIN-DIENST"
        />

        <div className="sm:col-span-2">
          <BoolField
            label="SCHWANGERSCHAFT / ELTERNZEIT"
            hint="Abteilung familienfreundlich?"
            value={data.schwangerschaftFamilienfreundlich}
            onChange={v => set('schwangerschaftFamilienfreundlich', v)}
            yesLabel="FAMILIENFREUNDLICH" noLabel="PROBLEMATISCH"
          />
        </div>

      </div>

      <div className="flex border-t border-ink">
        <button onClick={onBack} className="btn-ghost-ink border-r border-ink">&lt;&lt;&lt; ZURÜCK</button>
        <button onClick={onNext} className="btn-hazard">WEITER &gt;&gt;&gt;</button>
      </div>
    </div>
  )
}
