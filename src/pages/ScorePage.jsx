import { Head } from 'vite-react-ssg'
import { Link } from 'react-router-dom'

const CORE_QUESTIONS = [
  'Weiterbildungsziele',
  'Supervision',
  'Passende Selbstständigkeit',
  'Arbeitsbelastung',
  'Team und Führung',
  'Ausbildungsstruktur',
]

export default function ScorePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Score-Berechnung | Assistenzarzt-Ranking</title>
        <meta
          name="description"
          content="So berechnet das Assistenzarzt-Ranking den öffentlichen Score: sechs Kernfragen, Mindestanzahl an Antworten und Umgang mit älteren Bewertungen."
        />
        <link rel="canonical" href="https://assistenz-ranking.de/score" />
        <meta property="og:url" content="https://assistenz-ranking.de/score" />
        <meta property="og:title" content="Score-Berechnung | Assistenzarzt-Ranking" />
        <meta
          property="og:description"
          content="Einfache Erklärung der Score-Berechnung: welche Fragen zählen, wie der Mittelwert entsteht und wie ältere Bewertungen behandelt werden."
        />
      </Head>

      <div className="register-strip border-b border-ink">
        <span>/// SCORE-BERECHNUNG</span>
        <span className="text-canvas/60">EINFACH ERKLÄRT</span>
      </div>

      <div className="border-b border-ink px-6 py-8 space-y-8">
        <section className="space-y-3">
          <h1 className="section-heading text-3xl">Wie der Score entsteht</h1>
          <p className="text-sm leading-relaxed text-ink/80 max-w-2xl">
            Der öffentliche Score soll schnell verständlich und fair vergleichbar sein.
            Deshalb zählt nur der Kern der Weiterbildung — nicht jedes Detail aus dem Alltag.
          </p>
        </section>

        <section className="space-y-3">
          <div className="form-section-title">1. Diese sechs Fragen zählen</div>
          <ul className="grid gap-2 text-sm text-ink/80 sm:grid-cols-2">
            {CORE_QUESTIONS.map((question) => (
              <li key={question} className="border border-ink/15 bg-canvas-alt px-3 py-2">
                {question}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <div className="form-section-title">2. Mindestens fünf Antworten sind nötig</div>
          <p className="text-sm leading-relaxed text-ink/80">
            Sobald mindestens 5 der 6 Kernfragen beantwortet sind, wird ein gültiger Score berechnet.
            Antworten wie „nicht beurteilbar“ bleiben einfach außen vor.
          </p>
        </section>

        <section className="space-y-3">
          <div className="form-section-title">3. So wird gerechnet</div>
          <p className="text-sm leading-relaxed text-ink/80">
            Jede Kernfrage wird gleich gewichtet. Der Score ist also der einfache Mittelwert
            der beantworteten Kernfragen auf einer Skala von 0 bis 10.
          </p>
          <div className="border border-ink bg-white px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink">
            Score = Mittelwert der beantworteten Kernfragen
          </div>
        </section>

        <section className="space-y-3">
          <div className="form-section-title">4. Was nicht in den Score eingeht</div>
          <p className="text-sm leading-relaxed text-ink/80">
            Angaben wie Arbeitszeiten, Dienste, OP-Zahlen, Benefits, Kommentar oder
            Familienfreundlichkeit bleiben sichtbar, verändern den öffentlichen Score aber nicht.
            Sie helfen beim Einordnen der Abteilung.
          </p>
        </section>

        <section className="space-y-3">
          <div className="form-section-title">5. Ältere Bewertungen</div>
          <p className="text-sm leading-relaxed text-ink/80">
            Frühere Bewertungen behalten transparent ihre ältere Berechnungslogik. Neue Bewertungen
            nutzen das aktuelle Kernfragen-Modell. So werden Änderungen nicht still vermischt.
          </p>
        </section>
      </div>

      <div className="px-6 py-6 flex flex-wrap gap-3">
        <Link to="/bewerten" className="btn-hazard text-center">
          JETZT BEWERTEN →
        </Link>
        <Link to="/faq" className="btn-ghost-ink inline-block text-center">
          ZUR FAQ →
        </Link>
      </div>
    </div>
  )
}
