import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'Was ist das Assistenz-Ranking?',
    a: 'Das Assistenz-Ranking ist eine anonyme Bewertungsplattform für Assistenzarztstellen in Deutschland, Österreich und der Schweiz. Ärzt*innen bewerten Kliniken anhand von sechs Kriterien-Dimensionen — für ein ausgewogenes, datenbasiertes Gesamtbild jeder Station.',
  },
  {
    q: 'Sind die Bewertungen wirklich anonym?',
    a: 'Ja. Es werden keine personenbezogenen Daten gespeichert oder veröffentlicht. Die Anonymität ist technisch sichergestellt — weder Name, noch Approbationsnummer, noch E-Mail-Adresse werden erhoben.',
  },
  {
    q: 'Nach welchen Kriterien werden Kliniken bewertet?',
    a: 'Jede Bewertung durchläuft sechs Dimensionen, die im Spider-Chart verglichen werden: Weiterbildung (Supervision, Logbuch, Weiterbildungsdauer), Autonomie (Selbstständigkeit im Alltag), Work-Life (Arbeitsbelastung, Dienste, Überstunden), Teamklima (Atmosphäre, Familienfreundlichkeit, Begleitung), Struktur (Rotationspläne, Fortbildung, Mitarbeitergespräche) und Infrastruktur (Parkplatz, Dokumentationsaufwand). Aus diesen sechs Faktoren errechnet sich ein gewichteter Gesamt-Score — dieser wird separat angezeigt, nicht als eigene Radar-Ecke.',
  },
  {
    q: 'Warum erscheint der Gesamt-Score nicht als eigene Ecke im Radar?',
    a: 'Der Gesamt-Score ist eine abgeleitete Variable — die gewichtete Summe der sechs Einzeldimensionen. Ihn als eigene Achse zu plotten würde das Polygon künstlich aufblasen und Schwächen in einzelnen Bereichen überdecken. Wir zeigen den Gesamt-Score deshalb als separate Kennzahl neben dem Chart an, während der Spider das echte Stärken-Schwächen-Profil abbildet.',
  },
  {
    q: 'Wie lange dauert eine Bewertung?',
    a: 'Eine Bewertung dauert etwa 3–5 Minuten. In drei Schritten: Klinik auswählen, Kriterien bewerten, optional einen Erfahrungsbericht schreiben.',
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
    a: 'Der Gesamt-Score (0–10) ist ein gewichteter Composite aus den sechs Dimensionen: Weiterbildung 30%, Work-Life 25%, Struktur 20%, Teamklima 15%, Infrastruktur 10%. Autonomie fließt in die Weiterbildungsdimension mit ein. Jede Dimension wird aus mehreren Einzelkriterien berechnet.',
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
      <Helmet>
        <title>Häufige Fragen | Assistenzarzt-Ranking</title>
        <meta name="description" content="Antworten auf die häufigsten Fragen zum Assistenzarzt-Ranking: Kriterien, Anonymität, Bewertungsablauf, Klinikvergleich und mehr." />
        <link rel="canonical" href="https://assistenz-ranking.de/faq" />
        <meta property="og:url" content="https://assistenz-ranking.de/faq" />
        <meta property="og:title" content="Häufige Fragen | Assistenzarzt-Ranking" />
        <meta property="og:description" content="Alles über Kriterien, Anonymität, Bewertungsablauf und den Unterschied zwischen Klinik- und Abteilungsvergleich." />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

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
