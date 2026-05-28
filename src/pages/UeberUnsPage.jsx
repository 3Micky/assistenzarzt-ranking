import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function UeberUnsPage() {
  return (
    <div className="max-w-3xl mx-auto my-6 border border-ink">
      <Helmet>
        <title>Über uns — Assistenz-Ranking | assistenz-ranking.de</title>
        <meta name="description" content="Assistenz-Ranking ist eine unabhängige, anonyme Bewertungsplattform für Assistenzarztstellen in Deutschland, Österreich und der Schweiz. Peer-to-peer, kostenlos, DSGVO-konform." />
        <link rel="canonical" href="https://assistenz-ranking.de/ueber-uns" />
        <meta property="og:title" content="Über uns — Assistenz-Ranking" />
        <meta property="og:description" content="Wer steckt hinter Assistenz-Ranking? Mission, Funktionsweise und Kontakt." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="register-strip border-b border-ink">/// ÜBER UNS</div>

      {/* Mission */}
      <div className="border-b border-ink p-5">
        <div className="mono-label text-hazard mb-2">/// MISSION</div>
        <h1 className="font-display text-2xl text-ink uppercase tracking-tight leading-none mb-4">
          Ärzt*innen helfen Ärzt*innen
        </h1>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          Assistenz-Ranking ist eine unabhängige, anonyme Peer-to-peer-Plattform für Assistenzärzt*innen
          in Deutschland, Österreich und der Schweiz. Unser Ziel: Transparenz in einem System, in dem
          Weiterbildungsqualität und Arbeitsbedingungen kaum vergleichbar sind.
        </p>
        <p className="text-sm text-ink/80 leading-relaxed">
          Wer eine Assistenzarztstelle antritt, geht oft eine mehrjährige Bindung ein — ohne verlässliche
          Informationen über Teamklima, Weiterbildungsqualität oder Work-Life-Balance. Das wollen wir ändern.
        </p>
      </div>

      {/* Wie es funktioniert */}
      <div className="border-b border-ink">
        <div className="register-strip border-b border-ink">/// SO FUNKTIONIERT ES</div>
        <div className="ink-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[
            { nr: '01', title: 'ANONYM BEWERTEN', text: 'Keine Registrierung, keine E-Mail. Du bewertest anonym — niemand kann dich identifizieren.' },
            { nr: '02', title: 'KRITERIEN', text: 'Weiterbildungsqualität, Teamklima, Work-Life-Balance, Diensthäufigkeit und mehr — strukturiert und vergleichbar.' },
            { nr: '03', title: 'RANGLISTE', text: 'Alle Kliniken werden auf Basis der Bewertungen automatisch gerankt — keine redaktionelle Einflussnahme.' },
            { nr: '04', title: 'KOSTENLOS', text: 'Die Plattform ist kostenlos und werbefrei. Keine Klinik kann sich bessere Bewertungen kaufen.' },
          ].map(({ nr, title, text }) => (
            <div key={nr} className="bg-canvas p-4">
              <div className="font-mono text-2xl font-bold text-hazard mb-1">{nr}</div>
              <div className="mono-label mb-2">{title}</div>
              <p className="text-xs text-ink/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Datenschutz & Technik */}
      <div className="border-b border-ink p-5">
        <div className="mono-label text-hazard mb-2">/// DATENSCHUTZ & TECHNIK</div>
        <div className="space-y-3 text-sm text-ink/80 leading-relaxed">
          <p>
            Die Plattform speichert <strong>keine personenbezogenen Daten</strong> zu Nutzer*innen.
            Es gibt keine Accounts, keine Cookies, kein Tracking. Als Analytics-Tool nutzen wir
            GoatCounter — cookiefrei und DSGVO-konform.
          </p>
          <p>
            Bewertungen werden in einer gesicherten Supabase-Datenbank gespeichert. Die Verbindung
            zwischen Bewertung und Person ist technisch nicht herstellbar.
          </p>
        </div>
      </div>

      {/* Für wen */}
      <div className="border-b border-ink p-5">
        <div className="mono-label text-hazard mb-2">/// FÜR WEN?</div>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          Die Plattform richtet sich an Assistenzärzt*innen und Medizinstudierende im letzten Studienjahr,
          die eine Weiterbildungsstelle in DACH suchen oder vergleichen. Ebenso für alle, die ihre eigenen
          Erfahrungen teilen und zur Transparenz beitragen möchten.
        </p>
      </div>

      {/* Vertrauen & Transparenz */}
      <div className="border-b border-ink p-5">
        <div className="mono-label text-hazard mb-2">/// VERTRAUEN & TRANSPARENZ</div>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          Assistenz-Ranking wird von einem aktiven Assistenzarzt aus dem DACH-Raum betrieben —
          jemand, der die Herausforderungen der Weiterbildung hautnah kennt.
          Die Plattform ist unabhängig: Keine Klinik kann Bewertungen kaufen, löschen oder beeinflussen.
        </p>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          <strong>Moderation:</strong> Bewertungen werden algorithmisch auf Plausibilität geprüft.
          Offensichtlich manipulative oder beleidigende Inhalte werden entfernt.
          Es gibt keine redaktionelle Selektion — alle gültigen Bewertungen fließen in das Ranking ein.
        </p>
        <p className="text-sm text-ink/80 leading-relaxed">
          <strong>Finanzierung:</strong> Die Plattform ist kostenlos und werbefrei.
          Es gibt keine Paywall, keine Klinik-Kooperationen und keine Vermittlungsprovisionen.
        </p>
      </div>

      {/* Hinweis */}
      <div className="border-b border-ink p-5">
        <div className="mono-label text-hazard mb-2">/// HINWEIS</div>
        <p className="text-sm text-ink/80 leading-relaxed">
          Assistenz-Ranking ersetzt keine medizinische, juristische oder berufliche Beratung.
          Bewertungen spiegeln subjektive Erfahrungen wider.
          Bei rechtlichen Fragen zu Arbeitsverträgen oder Weiterbildungsordnungen konsultiere
          bitte die zuständige Ärztekammer oder einen Fachanwalt für Arbeitsrecht.
        </p>
      </div>

      {/* Kontakt */}
      <div className="border-b border-ink p-5">
        <div className="mono-label text-hazard mb-2">/// KONTAKT</div>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          Fragen, Feedback oder Meldungen zu Bewertungen? Wir sind erreichbar unter:
        </p>
        <a
          href="mailto:kontakt@assistenz-ranking.de"
          className="font-mono text-[11.5px] uppercase tracking-widest text-hazard hover:underline"
        >
          kontakt@assistenz-ranking.de
        </a>
      </div>

      {/* CTA */}
      <div className="p-5 flex flex-col sm:flex-row gap-3">
        <Link to="/berichte" className="btn-ghost-ink text-center flex-1 py-3">
          BERICHTE LESEN
        </Link>
        <Link to="/bewerten" className="btn-hazard text-center flex-1 py-3">
          [ + BEWERTUNG ABGEBEN ]
        </Link>
      </div>
    </div>
  )
}
