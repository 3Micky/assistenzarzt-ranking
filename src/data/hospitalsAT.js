/**
 * Österreichische Krankenhäuser mit Bundesland-Zuordnung
 * @typedef {{ name: string, street: string, plz: string, city: string, region: string, carrier: string }} HospitalAT
 * @type {HospitalAT[]}
 */
export const AT_HOSPITALS = [
  // Wien
  { name: "Allgemeines Krankenhaus der Stadt Wien (AKH)", street: "Währinger Gürtel 18-20", plz: "1090", city: "Wien", region: "Wien", carrier: "Medizinische Universität Wien" },
  { name: "Wilhelminenspital", street: "Montleartstraße 37", plz: "1160", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Ottakring", street: "Montleartstraße 37", plz: "1160", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Favoriten", street: "Kundratstraße 3", plz: "1100", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Donaustadt", street: "Langobardenstraße 122", plz: "1220", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Hietzing", street: "Wolkersbergenstraße 1", plz: "1130", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Landstraße", street: "Juchgasse 25", plz: "1030", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Floridsdorf", street: "Brünner Straße 68", plz: "1210", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Klinik Penzing", street: "Baumgartner Höhe 1", plz: "1140", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Rudolfstiftung", street: "Juchgasse 25", plz: "1030", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Sozialmedizinisches Zentrum Ost", street: "Langobardenstraße 122", plz: "1220", city: "Wien", region: "Wien", carrier: "Wiener Gesundheitsverbund" },
  { name: "Krankenhaus Hanusch", street: "Heinrich-Collin-Straße 30", plz: "1140", city: "Wien", region: "Wien", carrier: "Österreichische Gesundheitskasse" },
  { name: "Herz-Jesu-Krankenhaus", street: "Audergasse 6-8", plz: "1030", city: "Wien", region: "Wien", carrier: "Orden der Barmherzigen Schwestern" },
  { name: "Krankenhaus der Barmherzigen Brüder Wien", street: "Große Mohrengasse 9", plz: "1020", city: "Wien", region: "Wien", carrier: "Barmherzige Brüder" },
  { name: "Krankenhaus St. Elisabeth Wien", street: "Landstraßer Hauptstraße 4a", plz: "1030", city: "Wien", region: "Wien", carrier: "Vinzenz Gruppe" },
  { name: "Evangelisches Krankenhaus Wien", street: "Hans-Sachs-Gasse 10-12", plz: "1180", city: "Wien", region: "Wien", carrier: "Evangelisches Krankenhaus Wien GmbH" },
  { name: "Krankenhaus der Göttlichen Vorsehung Vinzentinum", street: "Vinzenzgasse 60", plz: "1180", city: "Wien", region: "Wien", carrier: "Vinzenz Gruppe" },
  { name: "Privatklinik Döbling", street: "Heiligenstädter Straße 57-63", plz: "1190", city: "Wien", region: "Wien", carrier: "PremiQaMed" },
  { name: "Privatklinik Confraternität – Privatklinik Josefstadt", street: "Skodagasse 32", plz: "1080", city: "Wien", region: "Wien", carrier: "PremiQaMed" },
  { name: "Sanatorium Hera", street: "Löblichgasse 14", plz: "1090", city: "Wien", region: "Wien", carrier: "Vinzenz Gruppe" },

  // Niederösterreich
  { name: "Universitätsklinikum Krems", street: "Mitterweg 10", plz: "3500", city: "Krems", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Universitätsklinikum St. Pölten", street: "Dunant-Platz 1", plz: "3100", city: "St. Pölten", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Wiener Neustadt", street: "Corvinusring 3-5", plz: "2700", city: "Wiener Neustadt", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Baden", street: "Wimmergasse 19", plz: "2500", city: "Baden", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Mödling", street: "Sr.-M.-Restituta-Platz 1", plz: "2340", city: "Mödling", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Amstetten", street: "Krankenhausstraße 21", plz: "3300", city: "Amstetten", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Mistelbach", street: "Liechtensteinstraße 67", plz: "2130", city: "Mistelbach", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Korneuburg", street: "Wiener Ring 3-5", plz: "2100", city: "Korneuburg", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Tulln", street: "Alter Ziegelweg 10", plz: "3430", city: "Tulln", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Landesklinikum Zwettl", street: "Chmelarz-Straße 1", plz: "3910", city: "Zwettl", region: "Niederösterreich", carrier: "NÖ Landesgesundheitsagentur" },
  { name: "Kardinal Schwarzenberg Klinikum", street: "Kardinal-Schwarzenberg-Straße 2-6", plz: "5620", city: "Schwarzach", region: "Niederösterreich", carrier: "Orden der Barmherzigen Brüder" },

  // Oberösterreich
  { name: "Kepler Universitätsklinikum Linz", street: "Krankenhausstraße 9", plz: "4020", city: "Linz", region: "Oberösterreich", carrier: "Kepler Universitätsklinikum GmbH" },
  { name: "Ordensklinikum Linz Barmherzige Schwestern", street: "Seilerstätte 4", plz: "4010", city: "Linz", region: "Oberösterreich", carrier: "Barmherzige Schwestern Linz" },
  { name: "Ordensklinikum Linz Elisabethinen", street: "Fadingerstraße 1", plz: "4020", city: "Linz", region: "Oberösterreich", carrier: "Elisabethinen Linz" },
  { name: "Krankenhaus der Barmherzigen Brüder Linz", street: "Seilerstätte 2", plz: "4010", city: "Linz", region: "Oberösterreich", carrier: "Barmherzige Brüder" },
  { name: "Klinikum Wels-Grieskirchen", street: "Grieskirchner Straße 42", plz: "4600", city: "Wels", region: "Oberösterreich", carrier: "gespag" },
  { name: "Klinikum Steyr", street: "Sierninger Straße 170", plz: "4400", city: "Steyr", region: "Oberösterreich", carrier: "gespag" },
  { name: "Pyhrn-Eisenwurzen Klinikum Kirchdorf", street: "Kirchdorfer Straße 53", plz: "4560", city: "Kirchdorf", region: "Oberösterreich", carrier: "gespag" },
  { name: "Salzkammergut Klinikum Vöcklabruck", street: "Dr.-Wilhelm-Bock-Straße 1", plz: "4840", city: "Vöcklabruck", region: "Oberösterreich", carrier: "gespag" },
  { name: "Klinikum Rohrbach", street: "Krankenhausstraße 1", plz: "4150", city: "Rohrbach", region: "Oberösterreich", carrier: "gespag" },

  // Salzburg
  { name: "Uniklinikum Salzburg – Landeskrankenhaus", street: "Müllner Hauptstraße 48", plz: "5020", city: "Salzburg", region: "Salzburg", carrier: "SALK" },
  { name: "Uniklinikum Salzburg – Christian-Doppler-Klinik", street: "Ignaz-Harrer-Straße 79", plz: "5020", city: "Salzburg", region: "Salzburg", carrier: "SALK" },
  { name: "Kardinal Schwarzenberg Klinikum Schwarzach", street: "Kardinal-Schwarzenberg-Straße 2-6", plz: "5620", city: "Schwarzach im Pongau", region: "Salzburg", carrier: "Orden der Barmherzigen Brüder" },
  { name: "St. Johanns Spital Salzburg", street: "Müllner Hauptstraße 48", plz: "5020", city: "Salzburg", region: "Salzburg", carrier: "SALK" },
  { name: "Landeskrankenhaus Hallein", street: "Bürgermeister-Bodner-Straße 5", plz: "5400", city: "Hallein", region: "Salzburg", carrier: "SALK" },
  { name: "Landeskrankenhaus Tamsweg", street: "Dorfstraße 2", plz: "5580", city: "Tamsweg", region: "Salzburg", carrier: "SALK" },
  { name: "Landeskrankenhaus Zell am See", street: "Paracelsusstraße 8", plz: "5700", city: "Zell am See", region: "Salzburg", carrier: "SALK" },

  // Tirol
  { name: "Universitätsklinik Innsbruck (TILAK)", street: "Anichstraße 35", plz: "6020", city: "Innsbruck", region: "Tirol", carrier: "TILAK" },
  { name: "Landeskrankenhaus Hall in Tirol", street: "Milser Straße 10", plz: "6060", city: "Hall in Tirol", region: "Tirol", carrier: "TILAK" },
  { name: "Landeskrankenhaus Kufstein", street: "Endach 27", plz: "6330", city: "Kufstein", region: "Tirol", carrier: "TILAK" },
  { name: "Landeskrankenhaus Schwaz", street: "Krankenhaus 1", plz: "6130", city: "Schwaz", region: "Tirol", carrier: "TILAK" },
  { name: "Bezirkskrankenhaus Reutte", street: "Krankenhausweg 4", plz: "6600", city: "Reutte", region: "Tirol", carrier: "TILAK" },
  { name: "Bezirkskrankenhaus Lienz", street: "Emanuel-von-Hibler-Straße 5", plz: "9900", city: "Lienz", region: "Tirol", carrier: "TILAK" },
  { name: "Krankenhaus St. Vinzenz Zams", street: "Sanatoriumstraße 43", plz: "6511", city: "Zams", region: "Tirol", carrier: "Vinzenz Gruppe" },

  // Vorarlberg
  { name: "Landeskrankenhaus Bregenz", street: "Carl-Pedenz-Straße 2", plz: "6900", city: "Bregenz", region: "Vorarlberg", carrier: "KHBG" },
  { name: "Landeskrankenhaus Feldkirch", street: "Carinagasse 47", plz: "6807", city: "Feldkirch", region: "Vorarlberg", carrier: "KHBG" },
  { name: "Landeskrankenhaus Dornbirn", street: "Lustenauer Straße 4", plz: "6850", city: "Dornbirn", region: "Vorarlberg", carrier: "KHBG" },
  { name: "Landeskrankenhaus Rankweil", street: "Valdunastraße 16", plz: "6830", city: "Rankweil", region: "Vorarlberg", carrier: "KHBG" },
  { name: "Krankenhaus Dornbirn – Kinderchirurgisches Zentrum", street: "Lustenauer Straße 4", plz: "6850", city: "Dornbirn", region: "Vorarlberg", carrier: "KHBG" },

  // Steiermark
  { name: "Universitätsklinikum Graz LKH", street: "Auenbruggerplatz 1", plz: "8036", city: "Graz", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Universitätsklinikum Graz – Chirurgie", street: "Auenbruggerplatz 29", plz: "8036", city: "Graz", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Leoben", street: "Vordernberger Straße 42", plz: "8700", city: "Leoben", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Judenburg-Knittelfeld", street: "Fohnsdorfer Straße 6", plz: "8720", city: "Knittelfeld", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Bruck-Mürzzuschlag", street: "Tragößer Straße 1", plz: "8605", city: "Kapfenberg", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Voitsberg", street: "Grillweg 1", plz: "8570", city: "Voitsberg", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Feldbach-Fürstenfeld", street: "Ottokar-Kernstock-Straße 18", plz: "8330", city: "Feldbach", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "LKH Mürzzuschlag", street: "Grazerstraße 27", plz: "8680", city: "Mürzzuschlag", region: "Steiermark", carrier: "Steiermärkische KAGes" },
  { name: "Krankenhaus der Barmherzigen Brüder Graz", street: "Marschallgasse 12", plz: "8020", city: "Graz", region: "Steiermark", carrier: "Barmherzige Brüder" },
  { name: "Krankenhaus der Elisabethinen Graz", street: "Elisabethinergasse 14", plz: "8020", city: "Graz", region: "Steiermark", carrier: "Elisabethinen" },

  // Kärnten
  { name: "Klinikum Klagenfurt am Wörthersee", street: "Feschnigstraße 11", plz: "9020", city: "Klagenfurt", region: "Kärnten", carrier: "KABEG" },
  { name: "LKH Villach", street: "Nikolaigasse 43", plz: "9500", city: "Villach", region: "Kärnten", carrier: "KABEG" },
  { name: "LKH Wolfsberg", street: "Glanzstraße 37", plz: "9400", city: "Wolfsberg", region: "Kärnten", carrier: "KABEG" },
  { name: "LKH Laas", street: "Laas 45", plz: "9470", city: "St. Paul im Lavanttal", region: "Kärnten", carrier: "KABEG" },
  { name: "LKH Hermagor", street: "Wulfeniaplatz 2", plz: "9620", city: "Hermagor", region: "Kärnten", carrier: "KABEG" },
  { name: "LKH Friesach", street: "Wiener Straße 10", plz: "9360", city: "Friesach", region: "Kärnten", carrier: "KABEG" },
  { name: "Krankenhaus der Barmherzigen Brüder St. Veit", street: "Spitalgasse 26", plz: "9300", city: "St. Veit an der Glan", region: "Kärnten", carrier: "Barmherzige Brüder" },

  // Burgenland
  { name: "Krankenhaus der Barmherzigen Brüder Eisenstadt", street: "Johannes von Gott-Platz 1", plz: "7000", city: "Eisenstadt", region: "Burgenland", carrier: "Barmherzige Brüder" },
  { name: "Krankenhaus Oberwart", street: "Dornburggasse 80", plz: "7400", city: "Oberwart", region: "Burgenland", carrier: "KRAGES" },
  { name: "Krankenhaus Güssing", street: "Grazer Straße 8", plz: "7540", city: "Güssing", region: "Burgenland", carrier: "KRAGES" },
  { name: "Krankenhaus Kittsee", street: "Hauptstraße 2", plz: "2421", city: "Kittsee", region: "Burgenland", carrier: "KRAGES" },
]
