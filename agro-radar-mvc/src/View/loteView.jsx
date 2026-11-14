export function LoteView({
  diagnostico,
  ubicacion,
  cargando,
  error,
  onAnalizarGPS,
  onEscuchar,
}) {
  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '16px', textAlign: 'center' }}>
        Asistente de Campo
      </h1>

      {/* Tarjeta de Ubicación Actual siempre visible arriba */}
      <div
        style={{
          marginBottom: '20px',
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: '#f5f5f5',
          borderLeft: '6px solid #1976d2',
          color: '#111111',
          textAlign: 'left',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          📍 {ubicacion ? ubicacion.nombreCorto : 'Detectando tu ubicación GPS...'}
        </div>
        {ubicacion && (
          <div style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>
            Coordenadas: {ubicacion.lat}, {ubicacion.lon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        <button
          onClick={() => onAnalizarGPS('SIEMBRA')}
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
          }}
        >
          🌱 ¿Se puede Sembrar?
        </button>

        <button
          onClick={() => onAnalizarGPS('COSECHA')}
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
          }}
        >
          🚜 ¿Se puede Cosechar?
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '16px' }}>
          Consultando datos satelitales de tu ubicación...
        </p>
      )}

      {error && (
        <p style={{ color: '#ff6b6b', fontSize: '18px', marginTop: '16px', textAlign: 'center' }}>
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