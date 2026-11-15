export function LandingView({ textos, onSeleccionarAproximada, onSeleccionarInstrumentos }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        margin: "20px 0",
      }}
    >
      {/* Izquierda: Medición aproximada */}
      <button
        type="button"
        onClick={onSeleccionarAproximada}
        style={{
          ...botonLanding,
          backgroundColor: "#2e7d32",
        }}
      >
        <span style={{ fontSize: "36px", marginBottom: "10px" }}>☁️</span>
        <span>{textos.medicionAproximada}</span>
        <span style={subtextoBoton}>{textos.subAproximada}</span>
      </button>

      {/* Derecha: Medición con instrumentos */}
      <button
        type="button"
        onClick={onSeleccionarInstrumentos}
        style={{
          ...botonLanding,
          backgroundColor: "#1565c0",
        }}
      >
        <span style={{ fontSize: "36px", marginBottom: "10px" }}>📟</span>
        <span>{textos.medicionInstrumentos}</span>
        <span style={subtextoBoton}>{textos.subInstrumentos}</span>
      </button>
    </div>
  );
}

const botonLanding = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "28px 16px",
  fontSize: "18px",
  fontWeight: "bold",
  borderRadius: "14px",
  color: "white",
  border: "none",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  minHeight: "170px",
};

const subtextoBoton = {
  fontSize: "12px",
  fontWeight: "normal",
  marginTop: "8px",
  opacity: 0.9,
  lineHeight: 1.3,
};