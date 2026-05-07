/**
 * Leitet das deutsche Bundesland aus einer PLZ ab.
 * Deutsche PLZs sind 5-stellig (01000–99999), mit möglicher führender Null.
 * parseInt('01067') = 1067, daher werden 01xxx–09xxx als 1000–9999 behandelt.
 * @param {string} plz
 * @returns {string}
 */
export function plzToBundesland(plz) {
  if (!plz) return ''
  const n = parseInt(plz, 10)
  if (isNaN(n)) return ''

  // ── PLZs 01000–09999 (leading zero → Integer 1000–9999) ──────────────────
  if (n >= 1000 && n <= 1999) return 'Sachsen'          // 01000–01999
  if (n >= 2000 && n <= 2999) return 'Sachsen'          // 02000–02999
  if (n >= 3000 && n <= 3999) return 'Brandenburg'      // 03000–03999
  if (n >= 4000 && n <= 4999) return 'Sachsen'          // 04000–04999
  // 05000–05999 ungenutzt
  if (n >= 6000 && n <= 6999) return 'Sachsen-Anhalt'   // 06000–06999
  if (n >= 7000 && n <= 7999) return 'Thüringen'        // 07000–07999
  if (n >= 8000 && n <= 8999) return 'Sachsen'          // 08000–08999
  if (n >= 9000 && n <= 9999) return 'Sachsen'          // 09000–09999

  // ── PLZs 10000–99999 ─────────────────────────────────────────────────────
  if (n >= 10000 && n <= 14199) return 'Berlin'
  if (n >= 14200 && n <= 16999) return 'Brandenburg'
  if (n >= 17000 && n <= 19999) return 'Mecklenburg-Vorpommern'

  if (n >= 20000 && n <= 21999) return 'Hamburg'
  if (n >= 22000 && n <= 22999) return 'Hamburg'
  if (n >= 23000 && n <= 25999) return 'Schleswig-Holstein'

  if (n >= 26000 && n <= 26999) return 'Niedersachsen'
  if (n >= 27000 && n <= 27999) {
    if (n >= 27000 && n <= 27580) return 'Bremen'       // Bremerhaven
    return 'Niedersachsen'
  }
  if (n >= 28000 && n <= 28999) return 'Bremen'
  if (n >= 29000 && n <= 31999) return 'Niedersachsen'

  if (n >= 32000 && n <= 33999) return 'Nordrhein-Westfalen'
  if (n >= 34000 && n <= 34999) return 'Hessen'
  if (n >= 35000 && n <= 36999) return 'Hessen'
  if (n >= 37000 && n <= 37999) return 'Niedersachsen'
  if (n >= 38000 && n <= 38999) return 'Niedersachsen'
  if (n >= 39000 && n <= 39999) return 'Sachsen-Anhalt'

  if (n >= 40000 && n <= 48999) return 'Nordrhein-Westfalen'
  if (n >= 49000 && n <= 49999) return 'Niedersachsen'
  if (n >= 50000 && n <= 53999) return 'Nordrhein-Westfalen'
  if (n >= 54000 && n <= 56999) return 'Rheinland-Pfalz'
  if (n >= 57000 && n <= 59999) return 'Nordrhein-Westfalen'

  if (n >= 60000 && n <= 65999) return 'Hessen'
  if (n >= 66000 && n <= 66999) return 'Saarland'
  if (n >= 67000 && n <= 67999) return 'Rheinland-Pfalz'
  if (n >= 68000 && n <= 69999) return 'Baden-Württemberg'

  if (n >= 70000 && n <= 79999) return 'Baden-Württemberg'
  if (n >= 80000 && n <= 87999) return 'Bayern'
  if (n >= 88000 && n <= 88999) return 'Baden-Württemberg'
  if (n >= 89000 && n <= 89999) return 'Bayern'

  if (n >= 90000 && n <= 96999) return 'Bayern'
  if (n >= 97000 && n <= 97999) return 'Bayern'
  if (n >= 98000 && n <= 99999) return 'Thüringen'

  return ''
}

/**
 * Leitet das österreichische Bundesland aus einer PLZ ab.
 * @param {string} plz
 * @returns {string}
 */
export function plzToAustriaBundesland(plz) {
  if (!plz) return ''
  const n = parseInt(plz, 10)
  if (isNaN(n)) return ''

  if (n >= 1000 && n <= 1999) return 'Wien'
  if (n >= 2000 && n <= 3999) return 'Niederösterreich'
  if (n >= 4000 && n <= 4999) return 'Oberösterreich'
  if (n >= 5000 && n <= 5999) return 'Salzburg'
  if (n >= 6700 && n <= 6999) return 'Vorarlberg'
  if (n >= 6000 && n <= 6699) return 'Tirol'
  if (n >= 7000 && n <= 7999) return 'Burgenland'
  if (n >= 8000 && n <= 8999) return 'Steiermark'
  if (n >= 9000 && n <= 9999) return 'Kärnten'
  return ''
}

/**
 * Leitet den Schweizer Kanton aus einer PLZ ab.
 * @param {string} plz
 * @returns {string}
 */
export function plzToSwissKanton(plz) {
  if (!plz) return ''
  const n = parseInt(plz, 10)
  if (isNaN(n)) return ''

  if (n >= 1000 && n <= 1299) return 'Waadt'
  if (n >= 1300 && n <= 1399) return 'Waadt'
  if (n >= 1400 && n <= 1563) return 'Waadt'
  if (n >= 1564 && n <= 1699) return 'Freiburg'
  if (n >= 1700 && n <= 1799) return 'Freiburg'
  if (n >= 1800 && n <= 1899) return 'Waadt'
  if (n >= 1900 && n <= 1999) return 'Wallis'
  if (n >= 2000 && n <= 2149) return 'Neuenburg'
  if (n >= 2150 && n <= 2399) return 'Jura'
  if (n >= 2400 && n <= 2999) return 'Neuenburg'
  if (n >= 3000 && n <= 3799) return 'Bern'
  if (n >= 3800 && n <= 3999) return 'Bern'
  if (n >= 4000 && n <= 4059) return 'Basel-Stadt'
  if (n >= 4100 && n <= 4499) return 'Basel-Landschaft'
  if (n >= 4500 && n <= 4799) return 'Solothurn'
  if (n >= 4800 && n <= 4999) return 'Aargau'
  if (n >= 5000 && n <= 5999) return 'Aargau'
  if (n >= 6000 && n <= 6199) return 'Luzern'
  if (n >= 6200 && n <= 6299) return 'Nidwalden'
  if (n >= 6300 && n <= 6399) return 'Zug'
  if (n >= 6400 && n <= 6499) return 'Schwyz'
  if (n >= 6500 && n <= 6999) return 'Tessin'
  if (n >= 7000 && n <= 7999) return 'Graubünden'
  if (n >= 8000 && n <= 8499) return 'Zürich'
  if (n >= 8500 && n <= 8599) return 'Thurgau'
  if (n >= 8600 && n <= 8999) return 'Zürich'
  if (n >= 9000 && n <= 9299) return 'St. Gallen'
  if (n >= 9300 && n <= 9399) return 'Appenzell Ausserrhoden'
  if (n >= 9400 && n <= 9499) return 'Appenzell Innerrhoden'
  if (n >= 9500 && n <= 9599) return 'St. Gallen'
  if (n >= 9600 && n <= 9699) return 'Glarus'
  if (n >= 9700 && n <= 9999) return 'St. Gallen'
  return ''
}
