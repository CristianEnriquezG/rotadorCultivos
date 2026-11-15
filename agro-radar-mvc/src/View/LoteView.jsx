import { MapaSelector } from "./mapaSelector";
import { TEXTOS, traducirTextoDinamico } from "../Model/textosIdioma";

export function LoteView({
  idioma = "es",
  textos = TEXTOS.es,
  onVolverLanding,
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
  humedadManual = { arriba: "", abajo: "", fecha: "", metodo: "sensor" },
  onCambiarHumedadManual,
}) {
  const t = textos || TEXTOS[idioma] || TEXTOS.es;

  const fuentesLimpias = Array.from(
    new Set([
      "OpenWeather",
      ...(diagnostico?.fuentes || []).map((f) => normalizarFuente(f, idioma)),
    ])
  );

  const advertenciasLimpias = diagnostico?.advertencias?.filter(
    (a) => !a.toUpperCase().includes("CONAE")
  );

  return (
    <div>
      {/* Barra superior para volver al LandingView */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          padding: "8px 12px",
          backgroundColor: "#eef2f6",
          borderRadius: "8px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>
          {t.modoActual}{" "}
          {usarHumedadManual
            ? t.modoInstrumentosCorto
            : t.modoAproximadaCorto}
        </span>

        {onVolverLanding && (
          <button
            type="button"
            onClick={onVolverLanding}
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "6px",
              border: "1px solid #bbb",
              backgroundColor: "white",
              color: "#111",
              cursor: "pointer",
            }}
          >
            {t.cambiarModo}
          </button>
        )}
      </div>

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
            {t.coordenadas}: {ubicacion.lat}, {ubicacion.lon}
          </div>

          {onToggleMapa && (
            <button
              type="button"
              onClick={() => onToggleMapa(!mostrarMapa)}
              style={botonUbicacion}
            >
              {mostrarMapa ? t.cerrarMapa : t.cambiarUbicacionMapa}
            </button>
          )}
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
            {t.ubicacionNoDeterminada}
          </div>

          <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
            {t.ubicacionNoDeterminadaDesc}
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            {onToggleMapa && (
              <button
                type="button"
                onClick={() => onToggleMapa(true)}
                style={{
                  ...botonUbicacion,
                  marginTop: 0,
                  backgroundColor: "#e65100",
                }}
              >
                {t.seleccionarEnMapa}
              </button>
            )}

            {onReintentarGPS && (
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
                {t.reintentarGPS}
              </button>
            )}
          </div>
        </div>
      )}

      {mostrarMapa && (
        <MapaSelector onSeleccionarPunto={onSeleccionarPuntoMapa} />
      )}

      {usarHumedadManual && (
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
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            {t.tituloInstrumentos}
          </div>

          <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#555" }}>
            {t.descInstrumentos}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            <Campo etiqueta={t.humedadSuperficial} ayuda={t.ayudaSuperficial}>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={humedadManual?.arriba ?? ""}
                onChange={(e) =>
                  onCambiarHumedadManual?.("arriba", e.target.value)
                }
                style={control}
                required
              />
            </Campo>

            <Campo etiqueta={t.humedadProfunda} ayuda={t.ayudaProfunda}>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={humedadManual?.abajo ?? ""}
                onChange={(e) =>
                  onCambiarHumedadManual?.("abajo", e.target.value)
                }
                style={control}
                required
              />
            </Campo>

            <Campo etiqueta={t.fechaHora}>
              <input
                type="datetime-local"
                value={humedadManual?.fecha ?? ""}
                onChange={(e) =>
                  onCambiarHumedadManual?.("fecha", e.target.value)
                }
                style={control}
              />
            </Campo>

            <Campo etiqueta={t.metodoUtilizado}>
              <select
                value={humedadManual?.metodo ?? "sensor"}
                onChange={(e) =>
                  onCambiarHumedadManual?.("metodo", e.target.value)
                }
                style={control}
              >
                <option value="sensor">{t.metodoSensor}</option>
                <option value="gravimetrico">{t.metodoGravimetrico}</option>
                <option value="estimacion">{t.metodoEstimacion}</option>
              </select>
            </Campo>
          </div>
        </section>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
        <button
          type="button"
          onClick={() => onAnalizar?.("SIEMBRA")}
          disabled={cargando}
          style={{
            ...botonAccion,
            backgroundColor: "#2e7d32",
            opacity: cargando ? 0.6 : 1,
          }}
        >
          {t.btnSembrar}
        </button>

        <button
          type="button"
          onClick={() => onAnalizar?.("COSECHA")}
          disabled={cargando}
          style={{
            ...botonAccion,
            backgroundColor: "#1565c0",
            opacity: cargando ? 0.6 : 1,
          }}
        >
          {t.btnCosechar}
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "16px" }}>
          {t.cargando}
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
          ⚠️ {traducirTextoDinamico(error, idioma)}
        </p>
      )}

      {diagnostico && !cargando && (
        <div
          style={{
            marginTop: "16px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor:
              diagnostico.color || colorPorTipo(diagnostico.tipo),
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
            {t.modoEtiqueta} {diagnostico.tipo}
          </span>

          <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>
            {traducirTextoDinamico(diagnostico.titulo, idioma)}
          </h2>

          <p style={{ fontSize: "18px", lineHeight: 1.4 }}>
            {traducirTextoDinamico(diagnostico.mensaje, idioma)}
          </p>

          {diagnostico.humedadUtilizada && (
            <BloqueResultado titulo={t.humedadUtilizada}>
              <p style={parrafoDetalle}>
                {t.superficial}:{" "}
                {formatearPorcentaje(
                  diagnostico.humedadUtilizada.arriba ??
                    extraerPorcentajesDeMensaje(diagnostico.mensaje).arriba,
                  t.noDisponible
                )}
              </p>
              <p style={parrafoDetalle}>
                {t.profunda}:{" "}
                {formatearPorcentaje(
                  diagnostico.humedadUtilizada.abajo ??
                    extraerPorcentajesDeMensaje(diagnostico.mensaje).abajo,
                  t.noDisponible
                )}
              </p>
              <p style={parrafoDetalle}>
                {t.fuente}:{" "}
                {normalizarFuente(diagnostico.humedadUtilizada.fuente, idioma)}
              </p>
            </BloqueResultado>
          )}

          {diagnostico.contextoClimatico && (
            <BloqueResultado titulo={t.contextoClimatico}>
              <p style={parrafoDetalle}>
                {traducirTextoDinamico(
                  diagnostico.contextoClimatico.explicacion,
                  idioma
                )}
              </p>
              {diagnostico.contextoClimatico.periodo && (
                <p style={parrafoDetalle}>
                  {t.periodo}: {diagnostico.contextoClimatico.periodo}
                </p>
              )}
              {diagnostico.contextoClimatico.fuente && (
                <p style={parrafoDetalle}>
                  {t.fuente}: {diagnostico.contextoClimatico.fuente}
                </p>
              )}
            </BloqueResultado>
          )}

          {fuentesLimpias?.length > 0 && (
            <BloqueResultado titulo={t.fuentesUtilizadas}>
              <p style={parrafoDetalle}>{fuentesLimpias.join(" + ")}</p>
            </BloqueResultado>
          )}

          {advertenciasLimpias?.length > 0 && (
            <BloqueResultado titulo={t.advertencias}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {advertenciasLimpias.map((advertencia, indice) => (
                  <li
                    key={`${advertencia}-${indice}`}
                    style={{ marginBottom: "6px" }}
                  >
                    {traducirTextoDinamico(advertencia, idioma)}
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
            {t.notaOrientativa}
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
            {t.escuchar}
          </button>
        </div>
      )}
    </div>
  );
}

function normalizarFuente(fuente, idioma = "es") {
  if (!fuente) return "OpenWeather";
  const texto = String(fuente).toUpperCase();
  if (texto.includes("CONAE") || texto.includes("OPEN-METEO")) {
    return "OpenWeather";
  }
  if (idioma === "en" && texto.includes("MANUAL")) {
    return "Manual / Field sensor";
  }
  return fuente;
}

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

function formatearPorcentaje(valor, textoNoDisponible = "No disponible") {
  return Number.isFinite(valor) ? `${valor.toFixed(1)} %` : textoNoDisponible;
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