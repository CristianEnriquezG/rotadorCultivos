import { CATALOGO_CULTIVOS } from "../Model/rotacionModel";

export function RotacionView({
  idioma = "es",
  textos = {},
  cultivoAnterior,
  onCambiarCultivoAnterior,
  evaluacionRotacion,
  onEscucharRotacion,
}) {
  if (!evaluacionRotacion) return null;

  const t = textos;
  const lang = idioma === "en" ? "en" : "es";

  return (
    <section
      style={{
        marginTop: "20px",
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: "#f5f7fa",
        border: "1px solid #d8dee6",
        color: "#111111",
        textAlign: "left",
      }}
    >
      <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#1b5e20" }}>
        {t.rotacionTitulo}
      </h3>
      <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#444" }}>
        {t.rotacionDesc}
      </p>

      {/* Selector de cultivo del ciclo anterior */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        {CATALOGO_CULTIVOS.map((item) => {
          const activo = cultivoAnterior === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onCambiarCultivoAnterior?.(item.id)}
              style={{
                padding: "8px 6px",
                borderRadius: "8px",
                border: activo ? "2px solid #2e7d32" : "1px solid #cbd5e1",
                backgroundColor: activo ? "#e8f5e9" : "#ffffff",
                color: "#111",
                fontWeight: activo ? "bold" : "normal",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icono}</span>
              <span>{item.nombre[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de aproximación del desgaste */}
      <div
        style={{
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          borderLeft: `6px solid ${evaluacionRotacion.color}`,
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>
            {t.desgasteDejadoPor} {evaluacionRotacion.nombreAnterior}
          </span>
          <span
            style={{
              backgroundColor: evaluacionRotacion.color,
              color: "white",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {evaluacionRotacion.desgastePorcentaje}%
          </span>
        </div>

        {/* Barra de progreso de desgaste */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e2e8f0",
            borderRadius: "6px",
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: `${evaluacionRotacion.desgastePorcentaje}%`,
              height: "100%",
              backgroundColor: evaluacionRotacion.color,
            }}
          />
        </div>

        <p style={{ margin: "0 0 8px", fontSize: "13px", lineHeight: 1.4 }}>
          {evaluacionRotacion.resumenDesgaste}
        </p>

        <div style={{ fontSize: "12px", color: "#333", lineHeight: 1.5 }}>
          <div>💧 <strong>{t.usoAgua}:</strong> {evaluacionRotacion.consumoAgua} (Kc {evaluacionRotacion.kcPromedio})</div>
          <div>🧪 <strong>{t.nitrogeno}:</strong> {evaluacionRotacion.balanceNitrogeno}</div>
          <div>🍂 <strong>{t.rastrojoCarbono}:</strong> {evaluacionRotacion.balanceCarbono}</div>
          <div>🌊 <strong>{t.efectoNapa}:</strong> {evaluacionRotacion.efectoNapa}</div>
        </div>

        {evaluacionRotacion.alertaNitrato && (
          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              padding: "6px 8px",
              backgroundColor: "#ffebee",
              color: "#b71c1c",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            ⚠️ {evaluacionRotacion.alertaNitrato}
          </p>
        )}
      </div>

      {/* Tarjeta de cultivo recomendado para rotar */}
      <div
        style={{
          padding: "14px",
          borderRadius: "10px",
          backgroundColor: "#2e7d32",
          color: "white",
        }}
      >
        <div style={{ fontSize: "11px", textTransform: "uppercase", opacity: 0.9, fontWeight: "bold" }}>
          {t.recomendacionRotacion} ({evaluacionRotacion.condicionHidricaTexto})
        </div>
        <h4 style={{ margin: "4px 0 6px", fontSize: "19px" }}>
          {evaluacionRotacion.recomendacion.icono} {evaluacionRotacion.recomendacion.cultivo}
        </h4>
        <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.4 }}>
          {evaluacionRotacion.recomendacion.motivo}
        </p>

        <button
          type="button"
          onClick={onEscucharRotacion}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "15px",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "white",
            color: "#111",
            cursor: "pointer",
          }}
        >
          {t.escucharRotacion}
        </button>
      </div>
    </section>
  );
}