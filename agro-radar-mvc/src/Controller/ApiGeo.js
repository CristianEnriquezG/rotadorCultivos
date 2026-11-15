const IDIOMAS_SOPORTADOS = ["es", "en"];

export class ApiGeo {
  /**
   * Nombre legible del lugar para cualquier punto del planeta.
   * Devuelve "Localidad, Provincia/Región, País" en el idioma pedido.
   * @param {number} lat
   * @param {number} lon
   * @param {"es"|"en"} idioma
   */
  static async obtenerNombreLugar(lat, lon, idioma = "es") {
    const lang = IDIOMAS_SOPORTADOS.includes(idioma) ? idioma : "en";
    const coords = {
      lat: +Number(lat).toFixed(4),
      lon: +Number(lon).toFixed(4),
    };

    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error de geocodificación');

      const data = await res.json();
      // Los textos de respaldo quedan en español; la vista los traduce.
      const localidad = data.city || data.locality || 'Zona rural';
      const region = data.principalSubdivision || '';
      const pais = data.countryName || '';

      // Evita repetir cuando localidad y región se llaman igual (p. ej. "Mary, Mary")
      const partes = [localidad, region, pais].filter(Boolean);
      const sinRepetir = partes.filter((p, i) => partes.indexOf(p) === i);

      return {
        nombreCorto: sinRepetir.join(', '),
        pais: pais || null,
        codigoPais: data.countryCode || null,
        ...coords,
      };
    } catch {
      return {
        nombreCorto: 'Ubicación GPS activa',
        pais: null,
        codigoPais: null,
        ...coords,
      };
    }
  }
}