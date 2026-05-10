import { Helmet } from 'react-helmet-async'

export default function DatenschutzPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Helmet>
        <title>Datenschutzerklärung | assistenz-ranking.de</title>
        <meta name="description" content="Datenschutzerklärung der Bewertungsplattform assistenz-ranking.de — DSGVO-konform, keine Cookies, keine Tracker." />
        <link rel="canonical" href="https://assistenz-ranking.de/datenschutz" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="mono-label-red mb-2">[ RECHTLICHES ]</div>
      <h1 className="font-display text-3xl text-ink uppercase tracking-tight mb-6">Datenschutzerklärung</h1>

      <div className="border border-ink divide-y divide-ink text-sm">

        <div className="p-4">
          <div className="mono-label mb-2">1. VERANTWORTLICHE STELLE</div>
          <p className="text-ink/80 leading-relaxed">
            Verantwortlich für die Datenverarbeitung auf dieser Plattform ist der Betreiber von{' '}
            <strong>assistenz-ranking.de</strong>, betrieben als privates, nicht-kommerzielles Projekt.
            Der Betreiber ist über folgende Adresse erreichbar:{' '}
            <a href="mailto:datenschutz@assistenz-ranking.de" className="underline text-hazard">
              datenschutz@assistenz-ranking.de
            </a>.
            Die Plattform speichert keine Nutzerdaten serverseitig, die eine Identifizierung
            des Betreibers durch Betroffene erfordern würden.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">2. GRUNDSÄTZE DER DATENVERARBEITUNG</div>
          <p className="text-ink/80 leading-relaxed">
            Diese Plattform ist auf Datenminimierung ausgelegt. Bewertungen werden ausschließlich
            lokal im Browser des jeweiligen Nutzers gespeichert (LocalStorage). Es werden keine
            Nutzerkonten angelegt, keine Registrierungsdaten erfasst und keine personenbezogenen
            Daten der Bewertenden serverseitig gespeichert oder verarbeitet.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">3. VERARBEITETE DATEN IM EINZELNEN</div>

          <p className="text-ink/80 font-semibold mb-1 mt-2">3.1 Server-Logdaten (Vercel)</p>
          <p className="text-ink/80 leading-relaxed mb-3">
            Beim Aufruf der Website verarbeitet unser Hosting-Anbieter Vercel Inc. automatisch
            technische Logdaten: IP-Adresse, Browsertyp, Betriebssystem, aufgerufene URL und
            Zeitstempel. Diese Daten werden von Vercel für maximal 30 Tage gespeichert und
            dienen ausschließlich dem sicheren Betrieb. Rechtsgrundlage: Art. 6 Abs. 1 lit. f
            DSGVO (berechtigtes Interesse).
          </p>

          <p className="text-ink/80 font-semibold mb-1">3.2 Lokaler Browserspeicher (LocalStorage)</p>
          <p className="text-ink/80 leading-relaxed mb-3">
            Bewertungsdaten werden ausschließlich im LocalStorage Ihres Browsers gespeichert.
            Diese Daten verbleiben auf Ihrem Gerät und werden zu keinem Zeitpunkt an den
            Server übertragen. Sie können diese Daten jederzeit durch Leeren des Browser-Caches
            vollständig löschen.
          </p>

          <p className="text-ink/80 font-semibold mb-1">3.3 Sitzungsdaten (SessionStorage)</p>
          <p className="text-ink/80 leading-relaxed mb-3">
            Der Zugangsschutz der Plattform (Beta-Phase) nutzt den SessionStorage des Browsers,
            um die Sitzungsauthentifizierung zu speichern. Diese Daten werden beim Schließen
            des Browsers automatisch gelöscht und nicht an Server übertragen.
          </p>

          <p className="text-ink/80 font-semibold mb-1">3.4 Meldungen (Kontaktformular)</p>
          <p className="text-ink/80 leading-relaxed">
            Wenn Sie eine Bewertung über das Meldeformular beanstanden, werden folgende Daten
            verarbeitet: Meldetyp, Begründungstext sowie optional Ihre E-Mail-Adresse oder
            Telefonnummer. Diese Daten werden über den E-Mail-Dienstleister Resend Inc.
            (Verarbeitungsort: USA; SCCs gemäß Art. 46 DSGVO abgeschlossen) an den Betreiber
            weitergeleitet und dort zur Bearbeitung Ihrer Meldung verarbeitet.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            rechtmäßigem Plattformbetrieb). Die Daten werden nach abgeschlossener Prüfung,
            spätestens nach 90 Tagen, gelöscht.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">4. COOKIES & TRACKING</div>
          <p className="text-ink/80 leading-relaxed">
            Diese Plattform verwendet <strong>keine Tracking-Cookies</strong>, keine
            Analyse-Dienste (z. B. Google Analytics), keine Werbenetzwerke und keine
            Social-Media-Einbindungen. Es werden ausschließlich technisch notwendige
            Browserspeicher-Mechanismen (LocalStorage, SessionStorage) eingesetzt,
            die keine Einwilligung gemäß § 25 TDDDG erfordern.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">5. ANONYMITÄT DER BEWERTENDEN</div>
          <p className="text-ink/80 leading-relaxed">
            Abgegebene Bewertungen enthalten keine Pflichtangaben zu personenbezogenen Daten
            der bewertenden Person. Nutzer sind eigenverantwortlich dafür, keine
            identifizierenden Angaben (Namen, Arbeitsstelle, sonstige Merkmale) in
            Freitextfeldern zu hinterlassen. Der Betreiber ist technisch nicht in der Lage,
            die Identität von Bewertenden festzustellen oder Auskunft darüber zu erteilen.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">6. HOSTING — VERCEL INC.</div>
          <p className="text-ink/80 leading-relaxed">
            Diese Website wird gehostet bei Vercel Inc., 340 Pine Street, Suite 701,
            San Francisco, CA 94104, USA. Mit Vercel besteht ein
            Auftragsverarbeitungsvertrag (Data Processing Agreement). Die Übertragung
            personenbezogener Daten in die USA erfolgt auf Basis von
            Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO.
            Weitere Informationen:{' '}
            <a href="https://vercel.com/legal/privacy-policy" className="underline text-hazard"
               target="_blank" rel="noreferrer">vercel.com/legal/privacy-policy</a>.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">7. E-MAIL-VERSAND — RESEND INC.</div>
          <p className="text-ink/80 leading-relaxed">
            Für die Verarbeitung von Meldungen (§ 3.4) wird der Dienst Resend Inc.,
            2261 Market Street #4496, San Francisco, CA 94114, USA, eingesetzt.
            Resend verarbeitet übermittelte Daten ausschließlich zur Zustellung der
            E-Mail und speichert diese nicht dauerhaft. Mit Resend besteht ein
            Auftragsverarbeitungsvertrag (DPA) auf Basis der EU-Standardvertragsklauseln.
            Weitere Informationen:{' '}
            <a href="https://resend.com/legal/privacy-policy" className="underline text-hazard"
               target="_blank" rel="noreferrer">resend.com/legal/privacy-policy</a>.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">8. IHRE RECHTE (ART. 15–22 DSGVO)</div>
          <p className="text-ink/80 leading-relaxed mb-2">
            Ihnen stehen folgende Rechte zu:
          </p>
          <ul className="list-disc list-inside text-ink/80 space-y-1 leading-relaxed mb-3">
            <li><strong>Auskunft</strong> (Art. 15 DSGVO): Welche Daten verarbeiten wir von Ihnen?</li>
            <li><strong>Berichtigung</strong> (Art. 16): Unrichtige Daten korrigieren lassen</li>
            <li><strong>Löschung</strong> (Art. 17): Löschung Ihrer Daten verlangen</li>
            <li><strong>Einschränkung</strong> (Art. 18): Verarbeitung einschränken lassen</li>
            <li><strong>Widerspruch</strong> (Art. 21): Verarbeitung auf Basis berechtigter Interessen widersprechen</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20): Daten in maschinenlesbarem Format erhalten</li>
          </ul>
          <p className="text-ink/80 leading-relaxed">
            Da serverseitig keine personenbezogenen Bewertungsdaten gespeichert werden,
            können Sie Ihre im Browser gespeicherten Daten jederzeit selbst löschen
            (Browsereinstellungen → Cache/LocalStorage leeren). Für Meldedaten wenden
            Sie sich an:{' '}
            <a href="mailto:datenschutz@assistenz-ranking.de" className="underline text-hazard">
              datenschutz@assistenz-ranking.de
            </a>.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">9. BESCHWERDERECHT</div>
          <p className="text-ink/80 leading-relaxed">
            Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
            Die für Deutschland zuständige Behörde ist der Bundesbeauftragte für den
            Datenschutz und die Informationsfreiheit (BfDI) sowie die jeweiligen
            Landesdatenschutzbehörden. Eine Liste aller Aufsichtsbehörden finden Sie unter:{' '}
            <a href="https://www.bfdi.bund.de" className="underline text-hazard"
               target="_blank" rel="noreferrer">bfdi.bund.de</a>.
          </p>
        </div>

        <div className="p-4 bg-ink/5">
          <p className="text-ink/70 text-xs">
            Stand: Mai 2026 · DSGVO, TDDDG, DSA/DDG-konform · Kein Einsatz von Cookies oder Tracking
          </p>
        </div>

      </div>
    </div>
  )
}
