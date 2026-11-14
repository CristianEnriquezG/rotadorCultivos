export function LoteView({
  diagnostico,
  cargando,
  error,
  onAnalizarGPS,
  onProbarFernandez,
  onEscuchar,
}) {
  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>
        Asistente de Campo
      </h1>

      <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
        📍 Con mi ubicación actual (GPS):
      </p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <button
          onClick={() => onAnalizarGPS('SIEMBRA')}
          disabled={cargando}
          style={{
            flex: 1,
            padding: '16px 10px',
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
            padding: '16px 10px',
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

      <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
        🧪 Prueba rápida en Fernández (Sgo. del Estero):
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onProbarFernandez('SIEMBRA')}
          disabled={cargando}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            borderRadius: '8px',
            backgroundColor: '#eeeeee',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Probar Siembra
        </button>
        <button
          onClick={() => onProbarFernandez('COSECHA')}
          disabled={cargando}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            borderRadius: '8px',
            backgroundColor: '#eeeeee',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Probar Cosecha
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '16px' }}>
          Consultando datos satelitales del lote...
        </p>
      )}

      {error && (
        <p style={{ color: '#d32f2f', fontSize: '18px', marginTop: '16px' }}>
          ⚠️ {error}
        </p>
      )}

      {diagnostico && !cargando && (
        <div
          style={{
            marginTop: '24px',
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
              color: '#111',
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