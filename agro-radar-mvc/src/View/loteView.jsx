import { MapaSelector } from './MapaSelector';

export function LoteView({
  ubicacion,
  ubicacionNoDeterminada,
  mostrarMapa,
  onToggleMapa,
  onReintentarGPS,
  onSeleccionarPuntoMapa,
  diagnostico,
  cargando,
  error,
  onAnalizar,
  onEscuchar,
}) {
  return (
    <div style={{ maxWidth: '460px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '16px', textAlign: 'center' }}>
        Asistente de Campo
      </h1>

      {/* Estado 1: Ubicación confirmada (por GPS válido o elegida en el mapa) */}
      {ubicacion && !ubicacionNoDeterminada && (
        <div
          style={{
            marginBottom: '16px',
            padding: '14px 16px',
            borderRadius: '10px',
            backgroundColor: '#f5f5f5',
            borderLeft: '6px solid #2e7d32',
            color: '#111111',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            📍 {ubicacion.nombreCorto}
          </div>
          <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>
            Coordenadas: {ubicacion.lat}, {ubicacion.lon}
          </div>
          <button
            onClick={() => onToggleMapa(!mostrarMapa)}
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {mostrarMapa ? '✖ Cerrar mapa' : '🗺️ Cambiar ubicación en el mapa'}
          </button>
        </div>
      )}

      {/* Estado 2: Ubicación NO determinada -> Pide ingresar manualmente en el mapa */}
      {ubicacionNoDeterminada && (
        <div
          style={{
            marginBottom: '16px',
            padding: '14px 16px',
            borderRadius: '10px',
            backgroundColor: '#fff3e0',
            borderLeft: '6px solid #e65100',
            color: '#bf360c',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
            ⚠️ Ubicación no determinada
          </div>
          <div style={{ fontSize: '14px', color: '#333', marginTop: '4px' }}>
            El navegador no pudo obtener un GPS preciso. Ingresá manualmente seleccionando tu lote en el mapa:
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={() => onToggleMapa(true)}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                backgroundColor: '#e65100',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              🗺️ Ingresar manualmente en el mapa
            </button>
            <button
              onClick={onReintentarGPS}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                backgroundColor: '#eeeeee',
                color: '#111',
                border: '1px solid #bbb',
                cursor: 'pointer',
              }}
            >
              🔄 Reintentar GPS
            </button>
          </div>
        </div>
      )}

      {/* Mapa interactivo para seleccionar el lote con un clic */}
      {mostrarMapa && (
        <MapaSelector onSeleccionarPunto={onSeleccionarPuntoMapa} />
      )}

      {/* Botones de acción agronómica */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        <button
          onClick={() => onAnalizar('SIEMBRA')}
          disabled={cargando}
          style={{
            flex: 1,
            padding: '18px 10px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '10px',
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            opacity: cargando ? 0.6 : 1,
          }}
        >
          🌱 ¿Se puede Sembrar?
        </button>

        <button
          onClick={() => onAnalizar('COSECHA')}
          disabled={cargando}
          style={{
            flex: 1,
            padding: '18px 10px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '10px',
            backgroundColor: '#1565c0',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            opacity: cargando ? 0.6 : 1,
          }}
        >
          🚜 ¿Se puede Cosechar?
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '16px' }}>
          Consultando datos satelitales del lote...
        </p>
      )}

      {error && (
        <p style={{ color: '#ff6b6b', fontSize: '16px', marginTop: '12px', textAlign: 'center' }}>
          ⚠️ {error}
        </p>
      )}

      {diagnostico && !cargando && (
        <div
          style={{
            marginTop: '16px',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: diagnostico.color,
            color: 'white',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            MODO {diagnostico.tipo}
          </span>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>{diagnostico.titulo}</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.4' }}>{diagnostico.mensaje}</p>

          <button
            onClick={onEscuchar}
            style={{
              marginTop: '14px',
              width: '100%',
              padding: '14px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'white',
              color: '#111111',
              cursor: 'pointer',
            }}
          >
            🔊 Escuchar recomendación
          </button>
        </div>
      )}
    </div>
  );
}