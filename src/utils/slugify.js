/**
 * Erzeugt einen URL-Slug aus einem Kliniknamen.
 * Deutsche Umlaute werden normalisiert, Sonderzeichen entfernt.
 *
 * @param {string} name
 * @returns {string}
 */
export function slugify(name) {
  if (!name) return ''
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Prüft ob ein gegebener Slug zu einem Kliniknamen passt.
 * @param {string} slug
 * @param {string} name
 * @returns {boolean}
 */
export function matchSlug(slug, name) {
  return slugify(name) === slug
}
