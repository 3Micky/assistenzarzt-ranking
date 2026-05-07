export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mono-label-red mb-2">[ RECHTLICHES ]</div>
      <h1 className="font-display text-3xl text-ink uppercase tracking-tight mb-6">Impressum</h1>

      <div className="border border-ink divide-y divide-ink text-sm">

        <div className="p-4">
          <div className="mono-label mb-2">ANGABEN GEMÄSS § 5 TMG</div>
          {/* TODO: Hier echte Adresse eintragen — entweder eigene ladungsfähige Anschrift
              oder Impressum-Dienstleister (z.B. WBS-Law.de ~80 €/Jahr) */}
          <p className="text-ink/80 leading-relaxed">
            [VORNAME NACHNAME]<br />
            [STRAßE HAUSNUMMER]<br />
            [PLZ ORT]<br />
            Deutschland
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">KONTAKT</div>
          <p className="text-ink/80">
            E-Mail: <a href="mailto:kontakt@assistenz-ranking.de" className="underline text-hazard">kontakt@assistenz-ranking.de</a>
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">VERANTWORTLICH FÜR DEN INHALT (§ 55 ABS. 2 RSTV)</div>
          <p className="text-ink/80">[VORNAME NACHNAME] — Anschrift wie oben</p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">HAFTUNGSAUSSCHLUSS</div>
          <p className="text-ink/80 leading-relaxed">
            Die Inhalte dieser Plattform stammen ausschließlich von registrierten Nutzern und
            spiegeln deren persönliche Erfahrungen wider. Der Betreiber macht sich diese Inhalte
            nicht zu eigen und übernimmt keine Haftung für deren Richtigkeit, Vollständigkeit
            oder Aktualität. Bei Kenntnis von Rechtsverstößen werden entsprechende Inhalte
            unverzüglich entfernt (§ 10 TMG).
          </p>
        </div>

        <div className="p-4">
          <div className="mono-label mb-2">STREITSCHLICHTUNG</div>
          <p className="text-ink/80 leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            <a href="https://ec.europa.eu/consumers/odr" className="underline text-hazard ml-1" target="_blank" rel="noreferrer">
              ec.europa.eu/consumers/odr
            </a>.
            Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

      </div>
    </div>
  )
}
