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

/** 20 größte / wichtigste DACH-Städte als permanente Referenz-Marker auf der Karte */
export const REFERENCE_CITIES = [
  // Deutschland (12)
  { name: 'Berlin',     country: 'DE', coordinates: [13.405, 52.520] },
  { name: 'Hamburg',    country: 'DE', coordinates: [9.993, 53.551] },
  { name: 'München',    country: 'DE', coordinates: [11.576, 48.137] },
  { name: 'Köln',       country: 'DE', coordinates: [6.960, 50.938] },
  { name: 'Frankfurt',  country: 'DE', coordinates: [8.682, 50.110] },
  { name: 'Stuttgart',  country: 'DE', coordinates: [9.182, 48.775] },
  { name: 'Düsseldorf', country: 'DE', coordinates: [6.773, 51.227] },
  { name: 'Leipzig',    country: 'DE', coordinates: [12.374, 51.340] },
  { name: 'Dortmund',   country: 'DE', coordinates: [7.465, 51.514] },
  { name: 'Essen',      country: 'DE', coordinates: [7.011, 51.457] },
  { name: 'Bremen',     country: 'DE', coordinates: [8.807, 53.073] },
  { name: 'Dresden',    country: 'DE', coordinates: [13.737, 51.050] },
  // Österreich (4)
  { name: 'Wien',       country: 'AT', coordinates: [16.373, 48.209] },
  { name: 'Graz',       country: 'AT', coordinates: [15.440, 47.070] },
  { name: 'Linz',       country: 'AT', coordinates: [14.292, 48.306] },
  { name: 'Salzburg',   country: 'AT', coordinates: [13.044, 47.799] },
  // Schweiz (4)
  { name: 'Zürich',     country: 'CH', coordinates: [8.541, 47.376] },
  { name: 'Genf',       country: 'CH', coordinates: [6.143, 46.204] },
  { name: 'Basel',      country: 'CH', coordinates: [7.589, 47.558] },
  { name: 'Bern',       country: 'CH', coordinates: [7.447, 46.948] },
]

/** Hilfsfunktion: Stadt aus name finden */
export const getCityCoords = (cityName) =>
  CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase())?.coordinates ?? null
