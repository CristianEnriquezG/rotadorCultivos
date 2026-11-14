export class ApiConae {
  /**
   * Consulta el valor del píxel en una capa WMS de CONAE (SAOCOM / PROSAT)
   */
  static async consultarPixelWMS(
    lat,
    lon,
    capa = 'PROSATII:AOHUMEDALES_CCH_20200502_20230316_gEBSUPHIIS6'
  ) {
    const delta = 0.002;
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

    const params = new URLSearchParams({
      SERVICE: 'WMS',
      VERSION: '1.1.1',
      REQUEST: 'GetFeatureInfo',
      LAYERS: capa,
      QUERY_LAYERS: capa,
      INFO_FORMAT: 'application/json',
      SRS: 'EPSG:4326',
      BBOX: bbox,
      WIDTH: '10',
      HEIGHT: '10',
      X: '5',
      Y: '5',
    });

    const response = await fetch(`/conae-wms?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Servidor WMS de CONAE no disponible');
    }

    const data = await response.json();
    const propiedades = data.features?.[0]?.properties || null;

    return {
      fuente: 'CONAE (SAOCOM / GeoServicios)',
      capaConsultada: capa,
      propiedadesCrudas: propiedades,
      // Extrae GRAY_INDEX o el primer atributo numérico que devuelva el raster/vector de CONAE
      valor: propiedades ? Object.values(propiedades)[0] : null,
    };
  }
}