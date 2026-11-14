export class ApiGeo {
  static async obtenerNombreLugar(lat, lon) {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error de geocodificación');

      const data = await res.json();
      const localidad = data.city || data.locality || 'Zona rural';
      const provincia = data.principalSubdivision || '';

      return {
        nombreCorto: [localidad, provincia].filter(Boolean).join(', '),
        lat: +Number(lat).toFixed(4),
        lon: +Number(lon).toFixed(4),
      };
    } catch {
      return {
        nombreCorto: 'Ubicación GPS activa',
        lat: +Number(lat).toFixed(4),
        lon: +Number(lon).toFixed(4),
      };
    }
  }
}