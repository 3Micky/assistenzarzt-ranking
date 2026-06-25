import { Head } from 'vite-react-ssg'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'Was ist das Assistenz-Ranking?',
    a: 'Das Assistenz-Ranking ist eine anonyme Bewertungsplattform für Assistenzarztstellen in Deutschland, Österreich und der Schweiz. Sechs Kernfragen und freiwillige quantitative Angaben ergeben ein vergleichbares Bild der Weiterbildung und Arbeitsbedingungen.',
  },
  {
    q: 'Sind die Bewertungen wirklich anonym?',
    a: 'Ja. Es werden keine personenbezogenen Daten gespeichert oder veröffentlicht. Die Anonymität ist technisch sichergestellt — weder Name, noch Approbationsnummer, noch E-Mail-Adresse werden erhoben.',
  },
  {
    q: 'Nach welchen Kriterien werden Kliniken bewertet?',
    a: 'Der Hauptscore umfasst Weiterbildungsziele, Supervision, passende Selbstständigkeit, Arbeitsbelastung, Team und Führung sowie Ausbildungsstruktur. Zusätzlich können Arbeitszeiten, Dienste, OP-Zahlen, Fortbildung, Teamkultur und weitere praktische Angaben erfasst werden.',
  },
  {
    q: 'Warum erscheint der Gesamt-Score nicht als eigene Ecke im Radar?',
    a: 'Der Gesamt-Score ist der Mittelwert der beantworteten Kernfragen. Ihn als eigene Achse zu plotten würde das Polygon künstlich aufblasen und Schwächen in einzelnen Bereichen überdecken. Wir zeigen ihn deshalb separat neben dem Profil an.',
  },
  {
    q: 'Wie lange dauert eine Bewertung?',
    a: 'Eine Bewertung dauert ungefähr drei bis vier Minuten. In vier Schritten werden Klinik und Zeitraum, Zahlen und Fakten, Qualitätsfragen sowie der optionale Kommentar erfasst.',
  },
  {
    q: 'Was ist der Unterschied zwischen Klinik- und Abteilungsvergleich?',
    a: 'Im Klinikvergleich werden alle Bewertungen einer Klinik aggregiert — unabhängig von der Fachrichtung. Im Abteilungsvergleich siehst du das Profil einer konkreten Abteilung, zum Beispiel „Neurologie Charité“ gegen „Neurologie LMU“. Das gibt ein präziseres Bild, da sich Qualität zwischen Abteilungen derselben Klinik stark unterscheiden kann.',
  },
  {
    q: 'Kann ich meine Bewertung nachträglich ändern oder löschen?',
    a: 'Nein. Da keine persönlichen Daten erhoben werden, können wir Bewertungen nicht einzelnen Personen zuordnen. Jede Bewertung ist daher endgültig. Melde dich bei uns, falls Inhalte gegen die Nutzungsbedingungen verstoßen.',
  },
  {
    q: 'Werden alle Kliniken im DACH-Raum erfasst?',
    a: 'Unsere Datenbank umfasst über 2.000 Krankenhäuser aus Deutschland, Österreich und der Schweiz. Nicht jede Klinik hat bereits Bewertungen — je mehr Nutzer*innen teilnehmen, desto lückenloser wird das Bild.',
  },
  {
    q: 'Wie entsteht der Gesamt-Score?',
    a: 'Der Gesamt-Score ist der gleich gewichtete Mittelwert aus bis zu sechs Kernfragen und wird auf einer Skala von 0 bis 10 dargestellt. Mindestens fünf Fragen müssen beantwortet sein. „Nicht beurteilbar“ wird ausgelassen. Ältere Bewertungen behalten transparent ihre frühere Berechnung.',
  },
  {
    q: 'Ist die Plattform wirklich kostenlos?',
    a: 'Ja. Das Assistenz-Ranking ist ein gemeinnütziges Peer-to-Peer-Projekt. Es gibt keine Bezahlschranken, keine Premium-Accounts und keine Werbung. Die Finanzierung erfolgt über Spenden und Fördermittel.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Head>
        <title>Häufige Fragen | Assistenzarzt-Ranking</title>
        <meta name="description" content="Antworten auf die häufigsten Fragen zum Assistenzarzt-Ranking: Kriterien, Anonymität, Bewertungsablauf, Klinikvergleich und mehr." />
        <link rel="canonical" href="https://assistenz-ranking.de/faq" />
        <meta property="og:url" content="https://assistenz-ranking.de/faq" />
        <meta property="og:title" content="Häufige Fragen | Assistenzarzt-Ranking" />
        <meta property="og:description" content="Alles über Kriterien, Anonymität, Bewertungsablauf und den Unterschied zwischen Klinik- und Abteilungsvergleich." />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Head>

      <div className="register-strip border-b border-ink">
        <span>/// HÄUFIGE FRAGEN</span>
        <span className="text-canvas/60">{FAQS.length} ANTWORTEN</span>
      </div>

      <dl className="border-b border-ink">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-b border-ink/20 last:border-b-0 px-6 py-6">
            <dt className="font-semibold text-ink mb-2">{faq.q}</dt>
            <dd className="text-sm text-ink/80 leading-relaxed">{faq.a}</dd>
          </div>
        ))}
      </dl>

      <div className="px-6 py-6">
        <Link to="/" className="btn-ghost-ink inline-block text-center">
          &#8249;&#8249;&#8249; ZURÜCK ZUR STARTSEITE
        </Link>
      </div>
    </div>
  )
}
