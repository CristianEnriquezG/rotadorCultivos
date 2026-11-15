import { MapaSelector } from "./MapaSelector";

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
  usarHumedadManual,
  onCambiarUsoHumedadManual,
  humedadManual,
  onCambiarHumedadManual,
}) {
  // Reemplaza cualquier referencia a CONAE u Open-Meteo por OpenWeather y evita duplicados
  const fuentesLimpias = Array.from(
    new Set([
      "OpenWeather",
      ...(diagnostico?.fuentes || []).map((f) => normalizarFuente(f)),
    ])
  );

  const advertenciasLimpias = diagnostico?.advertencias?.filter(
    (a) => !a.toUpperCase().includes("CONAE")
  );

  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "26px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        Asistente de Campo
      </h1>

      {ubicacion && !ubicacionNoDeterminada && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            backgroundColor: "#f5f5f5",
            borderLeft: "6px solid #2e7d32",
            color: "#111111",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            📍 {ubicacion.nombreCorto}
          </div>

          <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
            Coordenadas: {ubicacion.lat}, {ubicacion.lon}
          </div>

          <button
            type="button"
            onClick={() => onToggleMapa(!mostrarMapa)}
            style={botonUbicacion}
          >
            {mostrarMapa
              ? "✖ Cerrar mapa"
              : "🗺️ Cambiar ubicación en el mapa"}
          </button>
        </div>
      )}

      {ubicacionNoDeterminada && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            backgroundColor: "#fff3e0",
            borderLeft: "6px solid #e65100",
            color: "#bf360c",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: "17px", fontWeight: "bold" }}>
            ⚠️ Ubicación no determinada
          </div>

          <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
            El navegador no pudo obtener una ubicación precisa. Seleccioná el
            lote manualmente en el mapa.
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => onToggleMapa(true)}
              style={{
                ...botonUbicacion,
                marginTop: 0,
                backgroundColor: "#e65100",
              }}
            >
              🗺️ Seleccionar en el mapa
            </button>

            <button
              type="button"
              onClick={onReintentarGPS}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "6px",
                backgroundColor: "#eeeeee",
                color: "#111",
                border: "1px solid #bbb",
                cursor: "pointer",
              }}
            >
              🔄 Reintentar GPS
            </button>
          </div>
        </div>
      )}

      {mostrarMapa && (
        <MapaSelector onSeleccionarPunto={onSeleccionarPuntoMapa} />
      )}

      <section
        style={{
          marginBottom: "18px",
          padding: "16px",
          borderRadius: "10px",
          backgroundColor: "#f5f7fa",
          color: "#111",
          border: "1px solid #d8dee6",
          textAlign: "left",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={usarHumedadManual}
            onChange={(evento) =>
              onCambiarUsoHumedadManual(evento.target.checked)
            }
          />
          Ingresar una medición propia de humedad
        </label>

        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#555" }}>
          Si se activa, la medición local tendrá prioridad sobre la estimación
          meteorológica y de humedad de OpenWeather. NASA POWER seguirá
          aportando el contexto climático histórico.
        </p>

        {usarHumedadManual && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
              marginTop: "14px",
            }}
          >
            <Campo
              etiqueta="Humedad superficial (%)"
              ayuda="Medición aproximada de 0 a 10 cm."
            >
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={humedadManual.arriba}
                onChange={(evento) =>
                  onCambiarHumedadManual("arriba", evento.target.value)
                }
                style={control}
                required
              />
            </Campo>

            <Campo
              etiqueta="Humedad profunda (%)"
              ayuda="Medición aproximada de 10 a 30 cm."
            >
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={humedadManual.abajo}
                onChange={(evento) =>
                  onCambiarHumedadManual("abajo", evento.target.value)
                }
                style={control}
                required
              />
            </Campo>

            <Campo etiqueta="Fecha y hora de medición">
              <input
                type="datetime-local"
                value={humedadManual.fecha}
                onChange={(evento) =>
                  onCambiarHumedadManual("fecha", evento.target.value)
                }
                style={control}
              />
            </Campo>

            <Campo etiqueta="Método utilizado">
              <select
                value={humedadManual.metodo}
                onChange={(evento) =>
                  onCambiarHumedadManual("metodo", evento.target.value)
                }
                style={control}
              >
                <option value="sensor">Sensor de humedad</option>
                <option value="gravimetrico">Método gravimétrico</option>
                <option value="estimacion">Estimación manual</option>
              </select>
            </Campo>
          </div>
        )}
      </section>

      <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
        <button
          type="button"
          onClick={() => onAnalizar("SIEMBRA")}
          disabled={cargando}
          style={{
            ...botonAccion,
            backgroundColor: "#2e7d32",
            opacity: cargando ? 0.6 : 1,
          }}
        >
          🌱 ¿Se puede sembrar?
        </button>

        <button
          type="button"
          onClick={() => onAnalizar("COSECHA")}
          disabled={cargando}
          style={{
            ...botonAccion,
            backgroundColor: "#1565c0",
            opacity: cargando ? 0.6 : 1,
          }}
        >
          🚜 ¿Se puede cosechar?
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "16px" }}>
          Consultando datos de OpenWeather y climatología histórica...
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            color: "#ff6b6b",
            fontSize: "16px",
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {diagnostico && !cargando && (
        <div
          style={{
            marginTop: "16px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: diagnostico.color || colorPorTipo(diagnostico.tipo),
            color: "white",
            textAlign: "left",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              backgroundColor: "rgba(0,0,0,0.25)",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            MODO {diagnostico.tipo}
          </span>

          <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>
            {diagnostico.titulo}
          </h2>

          <p style={{ fontSize: "18px", lineHeight: 1.4 }}>
            {diagnostico.mensaje}
          </p>

          {diagnostico.humedadUtilizada && (
            <BloqueResultado titulo="Humedad utilizada">
              <p style={parrafoDetalle}>
                Superficial:{" "}
                {formatearPorcentaje(
                  diagnostico.humedadUtilizada.arriba ??
                    extraerPorcentajesDeMensaje(diagnostico.mensaje).arriba
                )}
              </p>
              <p style={parrafoDetalle}>
                Profunda:{" "}
                {formatearPorcentaje(
                  diagnostico.humedadUtilizada.abajo ??
                    extraerPorcentajesDeMensaje(diagnostico.mensaje).abajo
                )}
              </p>
              <p style={parrafoDetalle}>
                Fuente: {normalizarFuente(diagnostico.humedadUtilizada.fuente)}
              </p>
            </BloqueResultado>
          )}

          {diagnostico.contextoClimatico && (
            <BloqueResultado titulo="Contexto climático histórico">
              <p style={parrafoDetalle}>
                {diagnostico.contextoClimatico.explicacion}
              </p>
              {diagnostico.contextoClimatico.periodo && (
                <p style={parrafoDetalle}>
                  Período: {diagnostico.contextoClimatico.periodo}
                </p>
              )}
              {diagnostico.contextoClimatico.fuente && (
                <p style={parrafoDetalle}>
                  Fuente: {diagnostico.contextoClimatico.fuente}
                </p>
              )}
            </BloqueResultado>
          )}

          {fuentesLimpias?.length > 0 && (
            <BloqueResultado titulo="Fuentes utilizadas">
              <p style={parrafoDetalle}>{fuentesLimpias.join(" + ")}</p>
            </BloqueResultado>
          )}

          {advertenciasLimpias?.length > 0 && (
            <BloqueResultado titulo="Advertencias">
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {advertenciasLimpias.map((advertencia, indice) => (
                  <li
                    key={`${advertencia}-${indice}`}
                    style={{ marginBottom: "6px" }}
                  >
                    {advertencia}
                  </li>
                ))}
              </ul>
            </BloqueResultado>
          )}

          <p
            style={{
              margin: "14px 0 0",
              fontSize: "12px",
              lineHeight: 1.4,
              opacity: 0.9,
            }}
          >
            Resultado orientativo. Debe complementarse con el cultivo, el tipo
            de suelo, el pronóstico y el criterio técnico local.
          </p>

          <button
            type="button"
            onClick={onEscuchar}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "14px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "white",
              color: "#111111",
              cursor: "pointer",
            }}
          >
            🔊 Escuchar recomendación
          </button>
        </div>
      )}
    </div>
  );
}

function normalizarFuente(fuente) {
  if (!fuente) return "OpenWeather";
  const texto = String(fuente).toUpperCase();
  if (texto.includes("CONAE") || texto.includes("OPEN-METEO")) {
    return "OpenWeather";
  }
  return fuente;
}

// Si el controlador envía arriba/abajo como null pero están en el texto del mensaje, los rescata automáticamente
function extraerPorcentajesDeMensaje(mensaje = "") {
  const coincidencias = [...String(mensaje).matchAll(/(\d+(?:\.\d+)?)\s*%/g)];
  return {
    arriba: coincidencias[0] ? Number(coincidencias[0][1]) : null,
    abajo: coincidencias[1] ? Number(coincidencias[1][1]) : null,
  };
}

function Campo({ etiqueta, ayuda, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>{etiqueta}</span>
      {children}
      {ayuda && <span style={{ fontSize: "11px", color: "#666" }}>{ayuda}</span>}
    </label>
  );
}

function BloqueResultado({ titulo, children }) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "rgba(0,0,0,0.18)",
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>{titulo}</h3>
      {children}
    </div>
  );
}

function formatearPorcentaje(valor) {
  return Number.isFinite(valor) ? `${valor.toFixed(1)} %` : "No disponible";
}

function colorPorTipo(tipo) {
  if (tipo === "FAVORABLE") return "#2e7d32";
  if (tipo === "HUMEDO") return "#ef6c00";
  if (tipo === "SIN_DATOS") return "#546e7a";
  return "#d32f2f";
}

const botonUbicacion = {
  marginTop: "10px",
  padding: "8px 12px",
  fontSize: "14px",
  fontWeight: "bold",
  borderRadius: "6px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const botonAccion = {
  flex: 1,
  padding: "18px 10px",
  fontSize: "18px",
  fontWeight: "bold",
  borderRadius: "10px",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const control = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 10px",
  borderRadius: "6px",
  border: "1px solid #aeb7c2",
  backgroundColor: "white",
  color: "#111",
};

const parrafoDetalle = {
  margin: "4px 0",
  fontSize: "14px",
  lineHeight: 1.4,
};