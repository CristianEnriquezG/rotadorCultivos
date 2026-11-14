export function LoteView({
  diagnostico,
  cargando,
  error,
  onAnalizarGPS,
  onProbarFernandez,
  onEscuchar,
}) {
  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Estado de mi Lote</h1>

      <button
        onClick={onAnalizarGPS}
        disabled={cargando}
        style={{
          width: '100%',
          padding: '18px',
          fontSize: '20px',
          fontWeight: 'bold',
          borderRadius: '10px',
          backgroundColor: '#1976d3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {cargando ? 'Revisando el suelo...' : '📍 Revisar mi ubicación actual'}
      </button>

      {/* Botón auxiliar para probar en PC sin salir al campo */}
      <button
        onClick={onProbarFernandez}
        disabled={cargando}
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          backgroundColor: '#eeeeee',
          border: '1px solid #cccccc',
          cursor: 'pointer',
        }}
      >
        🧪 Probar lote en Fernández (Sgo. del Estero)
      </button>

      {error && (
        <p style={{ color: '#d32f2f', fontSize: '18px', marginTop: '16px' }}>
          ⚠️ {error}
        </p>
      )}

      {diagnostico && (
        <div
          style={{
            marginTop: '24px',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: diagnostico.color,
            color: 'white',
          }}
        >
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