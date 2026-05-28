/**
 * Hauptstädte/Medizin-Standorte DACH mit lat/lng
 * lng, lat Reihenfolge (GeoJSON Standard, auch react-simple-maps)
 */
export const CITIES = [
  // Deutschland
  { name: 'Berlin',        country: 'DE', region: 'Berlin',                 coordinates: [13.405, 52.520] },
  { name: 'Hamburg',       country: 'DE', region: 'Hamburg',                coordinates: [9.993, 53.551] },
  { name: 'München',       country: 'DE', region: 'Bayern',                 coordinates: [11.576, 48.137] },
  { name: 'Köln',          country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [6.960, 50.938] },
  { name: 'Frankfurt',     country: 'DE', region: 'Hessen',                 coordinates: [8.682, 50.110] },
  { name: 'Stuttgart',     country: 'DE', region: 'Baden-Württemberg',      coordinates: [9.182, 48.775] },
  { name: 'Düsseldorf',    country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [6.773, 51.227] },
  { name: 'Leipzig',       country: 'DE', region: 'Sachsen',                coordinates: [12.374, 51.340] },
  { name: 'Nürnberg',      country: 'DE', region: 'Bayern',                 coordinates: [11.078, 49.452] },
  { name: 'Hannover',      country: 'DE', region: 'Niedersachsen',          coordinates: [9.732, 52.374] },
  { name: 'Bremen',        country: 'DE', region: 'Bremen',                 coordinates: [8.807, 53.073] },
  { name: 'Dresden',       country: 'DE', region: 'Sachsen',                coordinates: [13.737, 51.050] },
  { name: 'Freiburg',      country: 'DE', region: 'Baden-Württemberg',      coordinates: [7.852, 47.997] },
  { name: 'Heidelberg',    country: 'DE', region: 'Baden-Württemberg',      coordinates: [8.692, 49.398] },
  { name: 'Essen',         country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [7.011, 51.457] },
  // Österreich
  { name: 'Wien',          country: 'AT', region: 'Wien',                   coordinates: [16.373, 48.209] },
  { name: 'Graz',          country: 'AT', region: 'Steiermark',             coordinates: [15.440, 47.070] },
  { name: 'Linz',          country: 'AT', region: 'Oberösterreich',         coordinates: [14.292, 48.306] },
  { name: 'Salzburg',      country: 'AT', region: 'Salzburg',               coordinates: [13.044, 47.799] },
  { name: 'Innsbruck',     country: 'AT', region: 'Tirol',                  coordinates: [11.392, 47.269] },
  // Schweiz
  { name: 'Zürich',        country: 'CH', region: 'Zürich',                 coordinates: [8.541, 47.376] },
  { name: 'Bern',          country: 'CH', region: 'Bern',                   coordinates: [7.447, 46.948] },
  { name: 'Basel',         country: 'CH', region: 'Basel',                  coordinates: [7.589, 47.558] },
  { name: 'Genf',          country: 'CH', region: 'Genf',                   coordinates: [6.143, 46.204] },
  { name: 'Lausanne',      country: 'CH', region: 'Waadt',                  coordinates: [6.633, 46.520] },
  { name: 'Luzern',        country: 'CH', region: 'Luzern',                 coordinates: [8.301, 47.050] },
  { name: 'Dortmund',      country: 'DE', region: 'Nordrhein-Westfalen',    coordinates: [7.465, 51.514] },
]

/** Wichtigste DACH-Städte als permanente Referenz-Marker auf der Karte */
export const REFERENCE_CITIES = [
  // Deutschland
  { name: 'Berlin',      country: 'DE', coordinates: [13.405, 52.520] },
  { name: 'Hamburg',     country: 'DE', coordinates: [9.993,  53.551] },
  { name: 'München',     country: 'DE', coordinates: [11.576, 48.137] },
  { name: 'Köln',        country: 'DE', coordinates: [6.960,  50.938] },
  { name: 'Frankfurt',   country: 'DE', coordinates: [8.682,  50.110] },
  { name: 'Stuttgart',   country: 'DE', coordinates: [9.182,  48.775] },
  { name: 'Düsseldorf',  country: 'DE', coordinates: [6.773,  51.227] },
  { name: 'Leipzig',     country: 'DE', coordinates: [12.374, 51.340] },
  { name: 'Dortmund',    country: 'DE', coordinates: [7.465,  51.514] },
  { name: 'Essen',       country: 'DE', coordinates: [7.011,  51.457] },
  { name: 'Bremen',      country: 'DE', coordinates: [8.807,  53.073] },
  { name: 'Dresden',     country: 'DE', coordinates: [13.737, 51.050] },
  { name: 'Hannover',    country: 'DE', coordinates: [9.732,  52.374] },
  { name: 'Nürnberg',    country: 'DE', coordinates: [11.078, 49.452] },
  { name: 'Bonn',        country: 'DE', coordinates: [7.099,  50.734] },
  { name: 'Münster',     country: 'DE', coordinates: [7.626,  51.960] },
  { name: 'Aachen',      country: 'DE', coordinates: [6.083,  50.776] },
  { name: 'Freiburg',    country: 'DE', coordinates: [7.852,  47.997] },
  { name: 'Heidelberg',  country: 'DE', coordinates: [8.692,  49.398] },
  { name: 'Mannheim',    country: 'DE', coordinates: [8.466,  49.487] },
  { name: 'Mainz',       country: 'DE', coordinates: [8.271,  49.998] },
  { name: 'Würzburg',    country: 'DE', coordinates: [9.929,  49.795] },
  { name: 'Tübingen',    country: 'DE', coordinates: [9.059,  48.520] },
  { name: 'Ulm',         country: 'DE', coordinates: [9.987,  48.401] },
  { name: 'Regensburg',  country: 'DE', coordinates: [12.097, 49.013] },
  { name: 'Göttingen',   country: 'DE', coordinates: [9.935,  51.533] },
  { name: 'Kiel',        country: 'DE', coordinates: [10.135, 54.323] },
  { name: 'Rostock',     country: 'DE', coordinates: [12.140, 54.093] },
  { name: 'Magdeburg',   country: 'DE', coordinates: [11.627, 52.121] },
  { name: 'Erfurt',      country: 'DE', coordinates: [11.032, 50.984] },
  { name: 'Kassel',      country: 'DE', coordinates: [9.492,  51.312] },
  { name: 'Bielefeld',   country: 'DE', coordinates: [8.533,  52.021] },
  { name: 'Bochum',      country: 'DE', coordinates: [7.216,  51.481] },
  { name: 'Duisburg',    country: 'DE', coordinates: [6.762,  51.435] },
  { name: 'Saarbrücken', country: 'DE', coordinates: [6.993,  49.235] },
  { name: 'Wiesbaden',   country: 'DE', coordinates: [8.241,  50.082] },
  // Österreich
  { name: 'Wien',        country: 'AT', coordinates: [16.373, 48.209] },
  { name: 'Graz',        country: 'AT', coordinates: [15.440, 47.070] },
  { name: 'Linz',        country: 'AT', coordinates: [14.292, 48.306] },
  { name: 'Salzburg',    country: 'AT', coordinates: [13.044, 47.799] },
  { name: 'Innsbruck',   country: 'AT', coordinates: [11.392, 47.269] },
  { name: 'Klagenfurt',  country: 'AT', coordinates: [14.307, 46.624] },
  { name: 'Villach',     country: 'AT', coordinates: [13.847, 46.615] },
  { name: 'Wels',        country: 'AT', coordinates: [14.024, 48.158] },
  // Schweiz
  { name: 'Zürich',      country: 'CH', coordinates: [8.541,  47.376] },
  { name: 'Genf',        country: 'CH', coordinates: [6.143,  46.204] },
  { name: 'Basel',       country: 'CH', coordinates: [7.589,  47.558] },
  { name: 'Bern',        country: 'CH', coordinates: [7.447,  46.948] },
  { name: 'Luzern',      country: 'CH', coordinates: [8.301,  47.050] },
  { name: 'Lausanne',    country: 'CH', coordinates: [6.633,  46.520] },
  { name: 'St. Gallen',  country: 'CH', coordinates: [9.370,  47.423] },
  { name: 'Winterthur',  country: 'CH', coordinates: [8.723,  47.500] },
  { name: 'Lugano',      country: 'CH', coordinates: [8.951,  46.005] },
  { name: 'Biel',        country: 'CH', coordinates: [7.244,  47.137] },
]

/** Hilfsfunktion: Stadt aus name finden */
export const getCityCoords = (cityName) =>
  CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase())?.coordinates ?? null
