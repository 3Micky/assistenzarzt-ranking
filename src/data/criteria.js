/**
 * Schritt 2: Strukturdaten — objektive Fakten zur Stelle
 * Legacy-Schema v2. Wird für bestehende Bewertungen weiter angezeigt.
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
 * Legacy-Schema v2. Wird für bestehende Bewertungen weiter angezeigt.
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
  { key: 'hauptoperateurAnteil',    label: 'Anteil als Hauptoperateur*in',  type: 'slider',  min: 1, max: 10 },
  { key: 'mitarbeitergespraeche',   label: 'Mitarbeitergespräche / Jahr',   type: 'number',  min: 0, max: 12 },
  { key: 'dokumentationsaufwand',   label: 'Dokumentationsaufwand',         type: 'slider',  min: 1, max: 10 },
]

/**
 * Schritt 4: Team, Leben & Extras — Subjektives, Emotionales, Nice-to-have
 * Legacy-Schema v2. Wird für bestehende Bewertungen weiter angezeigt.
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

export const SCALE_5_OPTIONS = [
  { value: 1, shortLabel: 'Sehr schlecht' },
  { value: 2, shortLabel: 'Eher schlecht' },
  { value: 3, shortLabel: 'Mittel' },
  { value: 4, shortLabel: 'Eher gut' },
  { value: 5, shortLabel: 'Sehr gut' },
]

/**
 * Schnellformular v3: Diese sechs Fragen bilden allein den neuen Gesamt-Score.
 */
export const CRITERIA_CORE_V3 = [
  {
    key: 'weiterbildungsziele',
    label: 'Weiterbildungsziele',
    question: 'Konntest du die vorgesehenen Weiterbildungsinhalte und Logbuchziele erreichen?',
    type: 'scale5',
    min: 1,
    max: 5,
  },
  {
    key: 'supervision',
    label: 'Supervision',
    question: 'Wie zuverlässig war fachärztliche oder oberärztliche Unterstützung verfügbar?',
    type: 'scale5',
    min: 1,
    max: 5,
  },
  {
    key: 'selbststaendigkeit',
    label: 'Passende Selbstständigkeit',
    question: 'Wie gut passte deine Selbstständigkeit zu deinem Weiterbildungsstand?',
    type: 'scale5',
    min: 1,
    max: 5,
  },
  {
    key: 'arbeitsbelastung',
    label: 'Arbeitsbelastung',
    question: 'Wie gut waren Arbeitszeit, Dienste und Erholung insgesamt vereinbar?',
    type: 'scale5',
    min: 1,
    max: 5,
  },
  {
    key: 'teamFuehrung',
    label: 'Team und Führung',
    question: 'Wie respektvoll und unterstützend waren Team und Vorgesetzte?',
    type: 'scale5',
    min: 1,
    max: 5,
  },
  {
    key: 'ausbildungsstruktur',
    label: 'Ausbildungsstruktur',
    question: 'Wie zuverlässig wurden Einarbeitung, Rotationen und Fortbildung umgesetzt?',
    type: 'scale5',
    min: 1,
    max: 5,
  },
]

export const CRITERIA_CONTEXT_V3 = [
  {
    key: 'weiterbildungsjahr',
    label: 'Weiterbildungsjahr',
    type: 'number',
    min: 1,
    max: 12,
  },
  {
    key: 'weiterempfehlung',
    label: 'Weiterempfehlung',
    type: 'enum',
    options: ['Ja', 'Mit Einschränkungen', 'Nein'],
  },
]

export const ALL_CRITERIA_KEYS = [
  ...CRITERIA_ESSENTIAL.map(c => c.key),
  ...CRITERIA_MEDICAL.map(c => c.key),
  ...CRITERIA_NICE.map(c => c.key),
  ...CRITERIA_CORE_V3.map(c => c.key),
  ...CRITERIA_CONTEXT_V3.map(c => c.key),
]

/** Erlaubte JSON-Schlüssel inklusive Schema-Metadatum. */
export const ALLOWED_CRITERIA_KEYS = ['schemaVersion', ...ALL_CRITERIA_KEYS]

/** Default-Werte für das Schnellformular v3. */
export const DEFAULT_CRITERIA = {
  schemaVersion: 3,
  weiterbildungsjahr: null,
  weiterbildungsziele: null,
  supervision: null,
  selbststaendigkeit: null,
  arbeitsbelastung: null,
  teamFuehrung: null,
  ausbildungsstruktur: null,
  weiterempfehlung: null,
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

/**
 * Prozedurale Fachrichtungen — nur hier ist der OP-/Interventions-Score sinnvoll.
 * 'operativ' = klassisch operierende Fächer, 'interventionell' = katheter-/endoskopiebasiert,
 * 'mixed' = beides. Alle übrigen Fächer → kein OP-Score (N/A, nicht 0).
 */
export const SPECIALTY_PROCEDURE_TYPE = {
  'Chirurgie (Allgemein)': 'operativ',
  'Chirurgie (Unfall)':    'operativ',
  'Chirurgie (Viszeral)':  'operativ',
  'Neurochirurgie':        'operativ',
  'Orthopädie':            'operativ',
  'Urologie':              'operativ',
  'Frauenheilkunde':       'operativ',
  'HNO':                   'operativ',
  'Augenheilkunde':        'operativ',
  'Kardiologie':           'interventionell',
  'Gastroenterologie':     'interventionell',
  'Radiologie':            'interventionell',
  'Notfallmedizin':        'mixed',
  'Dermatologie':          'mixed',
}

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
