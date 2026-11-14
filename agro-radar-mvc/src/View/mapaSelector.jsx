import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function MapaSelector({ latInicial = -27.7834, lonInicial = -64.2642, onSeleccionarPunto }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Inicializa el mapa centrado en la zona agrícola
    const map = L.map(mapContainerRef.current).setView([latInicial, lonInicial], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // Al hacer clic en cualquier punto del mapa, marca el lote y envía las coordenadas
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      onSeleccionarPunto(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

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
        👆 Tocá en el mapa el punto exacto donde está tu lote:
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