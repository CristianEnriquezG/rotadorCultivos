// Ejemplo de endpoint en Node.js (/api/humedad)
export async function getHumedadSuelo(lat, lon) {
  // Construimos un micro-recuadro (Bounding Box) alrededor del punto GPS
  const delta = 0.001;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

  // URL del servicio WMS de CONAE extraída del XML de metadatos
  const wmsUrl = new URL('https://geoservicios.conae.gov.ar/geoserver/wms');
  wmsUrl.searchParams.append('SERVICE', 'WMS');
  wmsUrl.searchParams.append('VERSION', '1.1.1');
  wmsUrl.searchParams.append('REQUEST', 'GetFeatureInfo');
  wmsUrl.searchParams.append('LAYERS', 'MHS:CONAE_MOD_MHS_DSS_MSM'); // Capa del registro
  wmsUrl.searchParams.append('QUERY_LAYERS', 'MHS:CONAE_MOD_MHS_DSS_MSM');
  wmsUrl.searchParams.append('INFO_FORMAT', 'application/json');
  wmsUrl.searchParams.append('SRS', 'EPSG:4326');
  wmsUrl.searchParams.append('WIDTH', '10');
  wmsUrl.searchParams.append('HEIGHT', '10');
  wmsUrl.searchParams.append('X', '5');
  wmsUrl.searchParams.append('Y', '5');
  wmsUrl.searchParams.append('BBOX', bbox);

  const response = await fetch(wmsUrl.toString());
  const data = await response.json();

  // Extraemos el valor numérico puro del píxel
  const valorHumedad = data.features?.[0]?.properties?.GRAY_INDEX ?? null;
  return valorHumedad;
}