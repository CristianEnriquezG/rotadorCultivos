import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Vista general por defecto: toda la Argentina continental.
const VISTA_GENERAL = { centro: [-38.4, -63.6], zoom: 4 };
// Zoom al que se acerca el mapa cuando ya hay un lote ubicado.
const ZOOM_LOTE = 12;

const ESTILO_MARCADOR = {
  radius: 9,
  fillColor: '#d32f2f',
  color: '#ffffff',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.9,
};

export function MapaSelector({
  coordenadasActuales = null, // { lat, lon } del lote ya ubicado (GPS o selección previa)
  textos = {},
  onSeleccionarPunto,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const callbackRef = useRef(onSeleccionarPunto);
  const coordsInicialesRef = useRef(coordenadasActuales);

  useEffect(() => {
    callbackRef.current = onSeleccionarPunto;
  }, [onSeleccionarPunto]);

  const ubicarMarcador = (map, lat, lon) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
    } else {
      markerRef.current = L.circleMarker([lat, lon], ESTILO_MARCADOR).addTo(map);
    }
  };

  // Crea el mapa una sola vez.
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const inicial = coordsInicialesRef.current;
    const tieneInicial =
      Number.isFinite(Number(inicial?.lat)) && Number.isFinite(Number(inicial?.lon));

    const map = tieneInicial
      ? L.map(mapContainerRef.current).setView([Number(inicial.lat), Number(inicial.lon)], ZOOM_LOTE)
      : L.map(mapContainerRef.current).setView(VISTA_GENERAL.centro, VISTA_GENERAL.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    if (tieneInicial) {
      ubicarMarcador(map, Number(inicial.lat), Number(inicial.lon));
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      ubicarMarcador(map, lat, lng);
      callbackRef.current?.(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Si la ubicación cambia desde afuera (p. ej. GPS), mueve el marcador sin recrear el mapa.
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lat = Number(coordenadasActuales?.lat);
    const lon = Number(coordenadasActuales?.lon);
    if (!map || !Number.isFinite(lat) || !Number.isFinite(lon)) return;
    ubicarMarcador(map, lat, lon);
  }, [coordenadasActuales?.lat, coordenadasActuales?.lon]);

  return (
    <div style={{ marginTop: '12px', marginBottom: '18px' }}>
      <div
        style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '10px 12px',
          borderRadius: '8px 8px 0 0',
          fontSize: '15px',
          fontWeight: 'bold',
          border: '1px solid #ffeeba',
        }}
      >
        {textos.instruccionMapa || '👆 Tap the exact spot on the map where your field is:'}
      </div>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '280px',
          borderRadius: '0 0 10px 10px',
          border: '2px solid #1976d2',
        }}
      />
    </div>
  );
}