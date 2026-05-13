/**
 * Schritt 2: Strukturdaten — objektive Fakten zur Stelle
 */
export const CRITERIA_ESSENTIAL = [
  { key: 'arbeitszeitenVon',         label: 'Arbeitszeiten von',           type: 'time'    },
  { key: 'arbeitszeitenBis',         label: 'Arbeitszeiten bis',           type: 'time'    },
  { key: 'diensteProMonat',          label: 'Dienste / Monat',             type: 'number', min: 0, max: 15 },
  { key: 'schichtsystem',            label: 'Schichtsystem',               type: 'enum', options: ['2-Schicht', '3-Schicht', '24h-Dienste'] },
  { key: 'ueberstundenAufschreiben', label: 'Überstunden aufschreiben',    type: 'boolean' },
  { key: 'ueberstundenAusgleich',    label: 'Überstunden-Ausgleich',       type: 'enum', options: ['Bezahlt', 'Freizeitausgleich'] },
  { key: 'abteilungsgroesse',        label: 'Abteilungsgröße (Ärzt*innen)', type: 'number', min: 1, max: 500 },
  { key: 'personalschluessel',       label: 'Betten pro Arzt',              type: 'number', min: 1, max: 100 },
]

/**
 * Schritt 3: Ausbildung & Klinischer Alltag — spezifisch-rationale Felder
 */
export const CRITERIA_MEDICAL = [
  { key: 'wbeJahre',                label: 'WBE-Jahre am Haus',             type: 'number',  min: 0, max: 12 },
  { key: 'opsProMonat',             label: 'OPs / Monat',                   type: 'number',  min: 0, max: 50 },
  { key: 'rotationsplaene',         label: 'Rotationspläne',                type: 'boolean'              },
  { key: 'rotationsplaeneText',     label: 'Rotationspläne (Details)',       type: 'text'                 },
  { key: 'nachtdienstBegleitung',   label: 'OA-Hintergrundbereitschaft',    type: 'slider',  min: 1, max: 10 },
  { key: 'fortbildungFreistellung', label: 'Fortbildung — Freistellung',    type: 'boolean'              },
  { key: 'fortbildungBezahlt',      label: 'Fortbildung — Bezahlt',         type: 'boolean'              },
  { key: 'lehreTaetig',             label: 'Lehrtätigkeit vorhanden',       type: 'boolean'              },
  { key: 'lehreFreistellung',       label: 'Freistellung für Lehre',        type: 'boolean'              },
  { key: 'logbuchErfuellbarkeit',   label: 'Logbuch-Erfüllbarkeit',         type: 'slider',  min: 1, max: 10 },
  { key: 'supervisionQualitaet',    label: 'Supervision-Qualität',          type: 'slider',  min: 1, max: 10 },
  { key: 'autonomie',               label: 'Autonomie / Selbstständigkeit',  type: 'slider',  min: 1, max: 10 },
  { key: 'mitarbeitergespraeche',   label: 'Mitarbeitergespräche / Jahr',   type: 'number',  min: 0, max: 12 },
  { key: 'dokumentationsaufwand',   label: 'Dokumentationsaufwand',         type: 'slider',  min: 1, max: 10 },
]

/**
 * Schritt 4: Team, Leben & Extras — Subjektives, Emotionales, Nice-to-have
 */
export const CRITERIA_NICE = [
  { key: 'urlaubsgenehmigung',              label: 'Urlaubsgenehmigung',           type: 'slider',  min: 1, max: 10 },
  { key: 'workLifeBalance',                 label: 'Work-Life-Balance',           type: 'slider',  min: 1, max: 10 },
  { key: 'teamAtmosphaere',                 label: 'Team-Atmosphäre',             type: 'slider',  min: 1, max: 10 },
  { key: 'schwangerschaft',                 label: 'Schwangerschaft (Policy)',     type: 'enum', options: ['Sofortiges Arbeitsverbot', 'Individuelle Lösung', 'Normal weiterarbeiten'] },
  { key: 'schwangerschaftFamilienfreundlich', label: 'Schwangerschaft / Elternzeit', type: 'boolean' },
  { key: 'parkplatz',                       label: 'Parkplatz',                   type: 'boolean'              },
  { key: 'benefits',                        label: 'Benefits',                    type: 'text'                 },
]

export const ALL_CRITERIA_KEYS = [
  ...CRITERIA_ESSENTIAL.map(c => c.key),
  ...CRITERIA_MEDICAL.map(c => c.key),
  ...CRITERIA_NICE.map(c => c.key),
]

/** Default-Werte für ein leeres Formular */
export const DEFAULT_CRITERIA = {
  // Schritt 2: Arbeitszeit & Dienste
  arbeitszeitenVon:         '07:00',
  arbeitszeitenBis:         '16:00',
  diensteProMonat:          4,
  schichtsystem:            null,
  ueberstundenAufschreiben: null,
  ueberstundenAusgleich:    null,
  urlaubsgenehmigung:       5,
  workLifeBalance:          5,
  // Schritt 3: Weiterbildung & Klinischer Alltag
  wbeJahre:                 null,
  opsProMonat:              0,
  rotationsplaene:          null,
  rotationsplaeneText:      '',
  logbuchErfuellbarkeit:    5,
  supervisionQualitaet:     5,
  autonomie:                5,
  nachtdienstBegleitung:    5,
  fortbildungFreistellung:  null,
  fortbildungBezahlt:       null,
  lehreTaetig:              null,
  lehreFreistellung:        null,
  // Schritt 4: Abteilung, Team & Soziales
  abteilungsgroesse:        10,
  personalschluessel:       null,
  dokumentationsaufwand:    5,
  mitarbeitergespraeche:    1,
  teamAtmosphaere:          5,
  schwangerschaft:          null,
  schwangerschaftFamilienfreundlich: null,
  parkplatz:                null,
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
export const COUNTRY_FLAGS  = { DE: 'DE', AT: 'AT', CH: 'CH' }
