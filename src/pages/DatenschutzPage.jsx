export default function DatenschutzPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mono-label-red mb-2">[ RECHTLICHES ]</div>
      <h1 className="font-display text-3xl text-ink uppercase tracking-tight mb-6">Datenschutzerklärung</h1>

      <div className="border border-ink divide-y divide-ink text-sm">

        <div className="p-4">
          <div className="mono-label mb-2">1. VERANTWORTLICHER</div>
          <p className="text-ink/80">Angaben wie im <a href="/impressum" className="underline text-hazard">Impressum</a>.</p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">2. WELCHE DATEN WIR VERARBEITEN</div>
          <p className="text-ink/80 leading-relaxed mb-3">
            Diese Plattform speichert Bewertungen ausschließlich im <strong>LocalStorage Ihres Browsers</strong>.
            Es werden keine personenbezogenen Daten an Server übertragen oder gespeichert.
          </p>
          <p className="text-ink/80 leading-relaxed">
            Beim Besuch der Webseite verarbeitet unser Hosting-Anbieter (Vercel Inc.) technisch
            notwendige Log-Daten (IP-Adresse, Browser-Typ, Zeitstempel) für maximal 30 Tage.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">3. COOKIES & TRACKING</div>
          <p className="text-ink/80 leading-relaxed">
            Wir setzen <strong>keine Tracking-Cookies</strong> und keine Analytics-Dienste ein.
            Es werden ausschließlich technisch notwendige Speichermechanismen (LocalStorage) genutzt,
            die keine Einwilligung erfordern.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">4. ANONYMITÄT DER BEWERTUNGEN</div>
          <p className="text-ink/80 leading-relaxed">
            Abgegebene Bewertungen enthalten keine Pflichtangaben zu personenbezogenen Daten des
            Bewertenden. Nutzer sind selbst dafür verantwortlich, keine identifizierenden Angaben
            in Freitextfeldern zu hinterlassen.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">5. HOSTING</div>
          <p className="text-ink/80 leading-relaxed">
            Diese Website wird gehostet bei Vercel Inc., 340 Pine Street, Suite 701, San Francisco,
            CA 94104, USA. Mit Vercel besteht ein Auftragsverarbeitungsvertrag (DPA). Datenübertragung
            in die USA erfolgt auf Basis von Standardvertragsklauseln (SCC) gemäß Art. 46 DSGVO.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">6. IHRE RECHTE (ART. 15–22 DSGVO)</div>
          <p className="text-ink/80 leading-relaxed">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
            sowie Datenübertragbarkeit. Da wir keine personenbezogenen Daten serverseitig speichern,
            können Sie Ihre Bewertungs-Daten jederzeit selbst löschen (Browser-LocalStorage leeren).
            Beschwerden können Sie bei der zuständigen Datenschutzaufsichtsbehörde einreichen.
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">7. KONTAKT DATENSCHUTZ</div>
          <p className="text-ink/80">
            E-Mail: <a href="mailto:datenschutz@assistenz-ranking.de" className="underline text-hazard">datenschutz@assistenz-ranking.de</a>
          </p>
        </div>

        <div className="p-4 bg-ink/5">
          <p className="text-ink/70 text-xs">Stand: Mai 2026</p>
        </div>

      </div>
    </div>
  )
}
