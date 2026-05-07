/** Pflicht-Kriterien */
export const CRITERIA_ESSENTIAL = [
  { key: 'arbeitszeitenVon',         label: 'Arbeitszeiten von',          type: 'time'    },
  { key: 'arbeitszeitenBis',         label: 'Arbeitszeiten bis',          type: 'time'    },
  { key: 'diensteProMonat',          label: 'Dienste / Monat',            type: 'number', min: 0, max: 15 },
  { key: 'opsProMonat',              label: 'OPs / Monat',               type: 'number', min: 0, max: 50 },
  { key: 'rotationsplaene',          label: 'Rotationspläne',            type: 'boolean' },
  { key: 'rotationsplaeneText',      label: 'Rotationspläne (Details)',  type: 'text'    },
  { key: 'schichtsystem',            label: 'Schichtsystem',             type: 'enum', options: ['2-Schicht', '3-Schicht', '24h-Dienste'] },
  { key: 'ueberstundenAufschreiben', label: 'Überstunden aufschreiben',  type: 'boolean' },
  { key: 'ueberstundenAusgleich',    label: 'Überstunden-Ausgleich',     type: 'enum', options: ['Bezahlt', 'Freizeitausgleich'] },
  { key: 'lehreTaetig',              label: 'Lehrtätigkeit vorhanden',   type: 'boolean' },
  { key: 'lehreFreistellung',        label: 'Freistellung für Lehre',    type: 'boolean' },
  { key: 'schwangerschaft',          label: 'Schwangerschaft',           type: 'enum', options: ['Sofortiges Arbeitsverbot', 'Individuelle Lösung', 'Normal weiterarbeiten'] },
  { key: 'fortbildungFreistellung',  label: 'Fortbildung — Freistellung', type: 'boolean' },
  { key: 'fortbildungBezahlt',       label: 'Fortbildung — Bezahlt',     type: 'boolean' },
  { key: 'abteilungsgroesse',        label: 'Abteilungsgröße (Ärzt*innen)',   type: 'number', min: 1, max: 500 },
  { key: 'mitarbeitergespraeche',    label: 'Mitarbeitergespräche / Jahr', type: 'number', min: 0, max: 12 },
]

/** Medizinische Weiterbildungs-Kriterien */
export const CRITERIA_MEDICAL = [
  { key: 'wbeJahre',               label: 'WBE-Jahre am Haus',            type: 'number',  min: 0, max: 12 },
  { key: 'logbuchErfuellbarkeit',  label: 'Logbuch-Erfüllbarkeit',        type: 'slider',  min: 1, max: 10 },
  { key: 'supervisionQualitaet',   label: 'Supervision-Qualität',         type: 'slider',  min: 1, max: 10 },
  { key: 'autonomie',              label: 'Autonomie / Selbstständigkeit', type: 'slider',  min: 1, max: 10 },
  { key: 'nachtdienstBegleitung',  label: 'Nachtdienst-Begleitung (OA)',  type: 'boolean'              },
  { key: 'dokumentationsaufwand',  label: 'Dokumentationsaufwand',        type: 'slider',  min: 1, max: 10 },
  { key: 'personalschluessel',     label: 'Betten pro Arzt',              type: 'number',  min: 1, max: 100 },
  { key: 'urlaubsgenehmigung',     label: 'Urlaubsgenehmigung',           type: 'slider',  min: 1, max: 10 },
  { key: 'schwangerschaftFamilienfreundlich', label: 'Schwangerschaft / Elternzeit', type: 'boolean' },
]

/** Nice-to-have-Kriterien */
export const CRITERIA_NICE = [
  { key: 'parkplatz',       label: 'Parkplatz',          type: 'boolean'            },
  { key: 'workLifeBalance', label: 'Work-Life-Balance',  type: 'slider', min: 1, max: 10 },
  { key: 'teamAtmosphaere', label: 'Team-Atmosphäre',    type: 'slider', min: 1, max: 10 },
  { key: 'benefits',        label: 'Benefits',           type: 'text'               },
]

export const ALL_CRITERIA_KEYS = [
  ...CRITERIA_ESSENTIAL.map(c => c.key),
  ...CRITERIA_MEDICAL.map(c => c.key),
  ...CRITERIA_NICE.map(c => c.key),
]

/** Default-Werte für ein leeres Formular */
export const DEFAULT_CRITERIA = {
  arbeitszeitenVon:         '07:00',
  arbeitszeitenBis:         '16:00',
  diensteProMonat:          4,
  opsProMonat:              0,
  rotationsplaene:          null,
  rotationsplaeneText:      '',
  schichtsystem:            null,
  ueberstundenAufschreiben: null,
  ueberstundenAusgleich:    null,
  lehreTaetig:              null,
  lehreFreistellung:        null,
  schwangerschaft:          null,
  fortbildungFreistellung:  null,
  fortbildungBezahlt:       null,
  abteilungsgroesse:        10,
  mitarbeitergespraeche:    1,
  // Medizinische Scores
  wbeJahre:                        null,
  logbuchErfuellbarkeit:           5,
  supervisionQualitaet:            5,
  autonomie:                       5,
  nachtdienstBegleitung:           null,
  dokumentationsaufwand:           5,
  personalschluessel:              null,
  urlaubsgenehmigung:              5,
  schwangerschaftFamilienfreundlich: null,
  // Nice-to-have
  parkplatz:                null,
  workLifeBalance:          5,
  teamAtmosphaere:          5,
  benefits:                 '',
}

export const SPECIALTIES = [
  'Allgemeinmedizin', 'Anästhesiologie', 'Augenheilkunde',
  'Chirurgie (Allgemein)', 'Chirurgie (Unfall)', 'Chirurgie (Viszeral)',
  'Dermatologie', 'Frauenheilkunde', 'Gastroenterologie', 'Geriatrie',
  'HNO', 'Hämatologie/Onkologie', 'Innere Medizin', 'Kardiologie',
  'Kinderheilkunde', 'Neurologie', 'Neurochirurgie', 'Notfallmedizin',
  'Orthopädie', 'Psychiatrie', 'Radiologie', 'Rheumatologie',
  'Urologie', 'Sonstige',
]

export const REGIONS = {
  DE: [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
    'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
    'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
    'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
  ],
  AT: [
    'Burgenland', 'Kärnten', 'Niederösterreich', 'Oberösterreich',
    'Salzburg', 'Steiermark', 'Tirol', 'Vorarlberg', 'Wien',
  ],
  CH: [
    'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
    'Basel-Landschaft', 'Basel-Stadt', 'Bern', 'Freiburg', 'Genf', 'Glarus',
    'Graubünden', 'Jura', 'Luzern', 'Neuenburg', 'Nidwalden', 'Obwalden',
    'Schaffhausen', 'Schwyz', 'Solothurn', 'St. Gallen', 'Tessin',
    'Thurgau', 'Uri', 'Waadt', 'Wallis', 'Zug', 'Zürich',
  ],
}

export const COUNTRY_LABELS = { DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz' }
export const COUNTRY_FLAGS  = { DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭' }
