/**
 * Schweizer Krankenhäuser mit Kanton-Zuordnung
 * @typedef {{ name: string, street: string, plz: string, city: string, region: string, carrier: string }} HospitalCH
 * @type {HospitalCH[]}
 */
export const CH_HOSPITALS = [
  // Zürich
  { name: "Universitätsspital Zürich (USZ)", street: "Rämistraße 100", plz: "8091", city: "Zürich", region: "Zürich", carrier: "Kanton Zürich" },
  { name: "Kinderspital Zürich", street: "Steinwiesstraße 75", plz: "8032", city: "Zürich", region: "Zürich", carrier: "Stiftung Kinderspital Zürich" },
  { name: "Stadtspital Triemli", street: "Birmensdorferstraße 497", plz: "8063", city: "Zürich", region: "Zürich", carrier: "Stadt Zürich" },
  { name: "Stadtspital Waid", street: "Tièchestraße 99", plz: "8037", city: "Zürich", region: "Zürich", carrier: "Stadt Zürich" },
  { name: "Stadtspital Zürich Waid und Triemli", street: "Birmensdorferstraße 497", plz: "8063", city: "Zürich", region: "Zürich", carrier: "Stadt Zürich" },
  { name: "Schulthess Klinik", street: "Lengghalde 2", plz: "8008", city: "Zürich", region: "Zürich", carrier: "Schulthess Klinik AG" },
  { name: "Klinik Hirslanden Zürich", street: "Witellikerstraße 40", plz: "8032", city: "Zürich", region: "Zürich", carrier: "Hirslanden AG" },
  { name: "Spital Uster", street: "Brunnenstraße 42", plz: "8610", city: "Uster", region: "Zürich", carrier: "Spital Uster" },
  { name: "Kantonsspital Winterthur", street: "Brauerstraße 15", plz: "8401", city: "Winterthur", region: "Zürich", carrier: "Kanton Zürich" },
  { name: "Spital Männedorf", street: "Asylstraße 10", plz: "8708", city: "Männedorf", region: "Zürich", carrier: "Spital Männedorf AG" },
  { name: "Spital Limmattal", street: "Urdorferstraße 100", plz: "8952", city: "Schlieren", region: "Zürich", carrier: "Spital Limmattal" },
  { name: "Spital Bülach", street: "Spitalstraße 24", plz: "8180", city: "Bülach", region: "Zürich", carrier: "Spitalverbund Bülach" },
  { name: "GZO Spital Wetzikon", street: "Spitalstraße 66", plz: "8620", city: "Wetzikon", region: "Zürich", carrier: "GZO AG" },

  // Bern
  { name: "Inselspital Universitätsspital Bern", street: "Freiburgstraße 18", plz: "3010", city: "Bern", region: "Bern", carrier: "Inselgruppe AG" },
  { name: "Lindenhofspital Bern", street: "Bremgartenstraße 117", plz: "3012", city: "Bern", region: "Bern", carrier: "Lindenhof-Gruppe AG" },
  { name: "Spital Netz Bern Tiefenau", street: "Tiefenaustraße 112", plz: "3004", city: "Bern", region: "Bern", carrier: "Spital Netz Bern AG" },
  { name: "Kantonsspital Graubünden", street: "Loestraße 170", plz: "7000", city: "Chur", region: "Graubünden", carrier: "Kanton Graubünden" },
  { name: "Spital Thun", street: "Krankenhausstraße 12", plz: "3600", city: "Thun", region: "Bern", carrier: "Inselgruppe AG" },
  { name: "Spital Frutigen-Meiringen-Interlaken (fmi)", street: "Weißensteinstraße 31", plz: "3800", city: "Interlaken", region: "Bern", carrier: "fmi AG" },
  { name: "Regionalspital Emmental", street: "Oberburgstraße 54", plz: "3400", city: "Burgdorf", region: "Bern", carrier: "Regionalspital Emmental AG" },
  { name: "Spital STS Zweisimmen", street: "Lenker Straße 1", plz: "3770", city: "Zweisimmen", region: "Bern", carrier: "Spital STS AG" },

  // Basel
  { name: "Universitätsspital Basel", street: "Petersgraben 4", plz: "4031", city: "Basel", region: "Basel-Stadt", carrier: "Universitätsspital Basel" },
  { name: "Kantonsspital Baselland Bruderholz", street: "4101 Bruderholz", plz: "4101", city: "Bruderholz", region: "Basel-Landschaft", carrier: "Kantonsspital Baselland" },
  { name: "Kantonsspital Baselland Liestal", street: "Rheinstraße 26", plz: "4410", city: "Liestal", region: "Basel-Landschaft", carrier: "Kantonsspital Baselland" },
  { name: "Kantonsspital Baselland Laufen", street: "Auf der Eh 12", plz: "4242", city: "Laufen", region: "Basel-Landschaft", carrier: "Kantonsspital Baselland" },
  { name: "St. Claraspital Basel", street: "Kleinriehenstraße 30", plz: "4058", city: "Basel", region: "Basel-Stadt", carrier: "St. Claraspital AG" },
  { name: "Bethesda-Spital Basel", street: "Gellertstraße 144", plz: "4052", city: "Basel", region: "Basel-Stadt", carrier: "Bethesda-Spital AG" },

  // Luzern / Zentralschweiz
  { name: "Luzerner Kantonsspital (LUKS)", street: "Spitalstraße 16", plz: "6000", city: "Luzern", region: "Luzern", carrier: "Luzerner Kantonsspital" },
  { name: "Hirslanden Klinik St. Anna Luzern", street: "St. Anna-Straße 32", plz: "6006", city: "Luzern", region: "Luzern", carrier: "Hirslanden AG" },
  { name: "Kantonsspital Nidwalden", street: "Engelbergstraße 19", plz: "6370", city: "Stans", region: "Nidwalden", carrier: "Kanton Nidwalden" },
  { name: "Spital Schwyz", street: "Rickenbachstraße 19", plz: "6430", city: "Schwyz", region: "Schwyz", carrier: "Spital Schwyz AG" },
  { name: "Kantonsspital Uri", street: "Spitalstraße 1", plz: "6460", city: "Altdorf", region: "Uri", carrier: "Kanton Uri" },
  { name: "Zuger Kantonsspital", street: "Landhausstraße 11", plz: "6340", city: "Baar", region: "Zug", carrier: "Zuger Kantonsspital AG" },

  // Aargau / Solothurn
  { name: "Kantonsspital Aarau", street: "Tellstraße 25", plz: "5001", city: "Aarau", region: "Aargau", carrier: "Kantonsspital Aarau AG" },
  { name: "Kantonsspital Baden", street: "Im Ergel 1", plz: "5404", city: "Baden", region: "Aargau", carrier: "Kantonsspital Baden AG" },
  { name: "Hirslanden Klinik Aarau", street: "Schänisweg", plz: "5001", city: "Aarau", region: "Aargau", carrier: "Hirslanden AG" },
  { name: "Spital Muri", street: "Kantonsstraße 57", plz: "5630", city: "Muri", region: "Aargau", carrier: "Spital Muri AG" },
  { name: "Kantonsspital Olten", street: "Baslerstraße 150", plz: "4600", city: "Olten", region: "Solothurn", carrier: "Solothurner Spitäler AG" },
  { name: "Bürgerspital Solothurn", street: "Schöngrünstraße 42", plz: "4500", city: "Solothurn", region: "Solothurn", carrier: "Solothurner Spitäler AG" },

  // St. Gallen / Ostschweiz
  { name: "Kantonsspital St. Gallen", street: "Rorschacher Straße 95", plz: "9007", city: "St. Gallen", region: "St. Gallen", carrier: "Kanton St. Gallen" },
  { name: "Spital Wattwil", street: "Schulhausstraße 15", plz: "9630", city: "Wattwil", region: "St. Gallen", carrier: "Spitalverbund Appenzell Ausserrhoden" },
  { name: "Spital Grabs", street: "Spitalstraße 44", plz: "9472", city: "Grabs", region: "St. Gallen", carrier: "Spital Grabs AG" },
  { name: "Kantonsspital Münsterlingen", street: "Spitalcampus 1", plz: "8596", city: "Münsterlingen", region: "Thurgau", carrier: "Spital Thurgau AG" },
  { name: "Spital Frauenfeld", street: "Pfaffenholzstraße 4", plz: "8501", city: "Frauenfeld", region: "Thurgau", carrier: "Spital Thurgau AG" },
  { name: "Cantonal Hospital Appenzell", street: "Appenzell Straße 1", plz: "9050", city: "Appenzell", region: "Appenzell Innerrhoden", carrier: "Kanton Appenzell Innerrhoden" },

  // Graubünden
  { name: "Kantonsspital Graubünden Chur", street: "Loestraße 170", plz: "7000", city: "Chur", region: "Graubünden", carrier: "Kanton Graubünden" },
  { name: "Spital Davos", street: "Promenade 134", plz: "7270", city: "Davos Platz", region: "Graubünden", carrier: "Spital Davos AG" },
  { name: "Spital Surselva Ilanz", street: "Via Principala 109", plz: "7130", city: "Ilanz", region: "Graubünden", carrier: "Spital Surselva AG" },

  // Tessin
  { name: "Ente Ospedaliero Cantonale (EOC) Lugano", street: "Via Tesserete 46", plz: "6900", city: "Lugano", region: "Tessin", carrier: "EOC" },
  { name: "Ospedale Regionale di Bellinzona e Valli", street: "Via Ospedale 17", plz: "6500", city: "Bellinzona", region: "Tessin", carrier: "EOC" },
  { name: "Ospedale Regionale di Locarno La Carità", street: "Via all'Ospedale 1", plz: "6600", city: "Locarno", region: "Tessin", carrier: "EOC" },
  { name: "Ospedale Regionale di Mendrisio", street: "Via Turconi 23", plz: "6850", city: "Mendrisio", region: "Tessin", carrier: "EOC" },

  // Waadt / Westschweiz
  { name: "Centre Hospitalier Universitaire Vaudois (CHUV)", street: "Rue du Bugnon 46", plz: "1011", city: "Lausanne", region: "Waadt", carrier: "Kanton Waadt" },
  { name: "Hôpital de la Tour Genf", street: "Avenue J.-D. Maillard 3", plz: "1217", city: "Meyrin", region: "Genf", carrier: "Hirslanden AG" },
  { name: "Hôpitaux Universitaires de Genève (HUG)", street: "Rue Gabrielle-Perret-Gentil 4", plz: "1205", city: "Genf", region: "Genf", carrier: "Kanton Genf" },
  { name: "Réseau Hospitalier Neuchâtelois Pourtalès", street: "Rue de la Maladière 45", plz: "2000", city: "Neuchâtel", region: "Neuenburg", carrier: "Kanton Neuenburg" },
  { name: "Hôpital fribourgeois (HFR)", street: "Chemin des Pensionnats 2-6", plz: "1752", city: "Villars-sur-Glâne", region: "Freiburg", carrier: "Kanton Freiburg" },

  // Wallis
  { name: "Hôpital du Valais – Spital Wallis Sitten", street: "Avenue du Grand-Champsec 80", plz: "1951", city: "Sitten", region: "Wallis", carrier: "Spital Wallis" },
  { name: "Hôpital du Valais – Spital Wallis Brig", street: "Überlandstraße 14", plz: "3900", city: "Brig", region: "Wallis", carrier: "Spital Wallis" },
  { name: "Hôpital du Valais Visp", street: "Spitalstraße 28", plz: "3930", city: "Visp", region: "Wallis", carrier: "Spital Wallis" },

  // Jura
  { name: "Hôpital du Jura Delémont", street: "Rue des Remparts 4", plz: "2800", city: "Delémont", region: "Jura", carrier: "Hôpital du Jura" },
  { name: "Hôpital du Jura Porrentruy", street: "Rue de la Promenade 1", plz: "2900", city: "Porrentruy", region: "Jura", carrier: "Hôpital du Jura" },

  // Schaffhausen / Glarus
  { name: "Kantonsspital Schaffhausen", street: "Geißbergstraße 81", plz: "8208", city: "Schaffhausen", region: "Schaffhausen", carrier: "Kanton Schaffhausen" },
  { name: "Kantonsspital Glarus", street: "Burgstraße 99", plz: "8750", city: "Glarus", region: "Glarus", carrier: "Kanton Glarus" },
]
