import { MapaSelector } from "./mapaSelector";
import { traducirTextoDinamico } from "../Model/textosIdioma";
import { RotacionView } from "./rotacionView";

export function LoteView({
  idioma = "es",
  textos = {},
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
  cultivoAnterior,
  onCambiarCultivoAnterior,
  evaluacionRotacion,
  onEscucharRotacion,
}) {
  const tituloTraducido = diagnostico
    ? traducirTextoDinamico(diagnostico.titulo, idioma)
    : "";
  const mensajeTraducido = diagnostico
    ? traducirTextoDinamico(diagnostico.mensaje, idioma)
    : "";

  const extraidos = extraerPorcentajesDeMensaje(diagnostico?.mensaje);
  const humedadArriba =
    diagnostico?.humedadUtilizada?.arriba ??
    diagnostico?.metricas?.humSuperficial ??
    extraidos.arriba;
  const humedadAbajo =
    diagnostico?.humedadUtilizada?.abajo ??
    diagnostico?.metricas?.humProfunda ??
    extraidos.abajo;

  return (
    <div style={{ width: "100%", fontFamily: "sans-serif" }}>
      {/* Botón para volver al inicio */}
      {onVolverLanding && (
        <button
          type="button"
          onClick={onVolverLanding}
          style={{
            marginBottom: "14px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            color: "#1e293b",
            cursor: "pointer",
          }}
        >
          ⬅ {textos.volverInicio || (idioma === "en" ? "Back to mode selection" : "Cambiar modo de medición")}
        </button>
      )}

      {/* Tarjeta de Ubicación */}
      <div
        style={{
          marginBottom: "16px",
          padding: "14px 16px",
          borderRadius: "10px",
          backgroundColor: ubicacionNoDeterminada ? "#fff3e0" : "#f5f5f5",
          borderLeft: ubicacionNoDeterminada
            ? "6px solid #ef6c00"
            : "6px solid #1976d2",
          color: "#111111",
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: "17px", fontWeight: "bold" }}>
          📍{" "}
          {ubicacion
            ? ubicacion.nombreCorto
            : ubicacionNoDeterminada
            ? textos.ubicacionNoDeterminada || "Ubicación no determinada"
            : textos.detectandoGPS || "Detectando tu ubicación GPS..."}
        </div>

        {ubicacion && (
          <div style={{ fontSize: "13px", color: "#444", marginTop: "4px" }}>
            {textos.coordenadas || "Coordenadas"}: {ubicacion.lat}, {ubicacion.lon}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {onToggleMapa && (
            <button
              type="button"
              onClick={() => onToggleMapa(!mostrarMapa)}
              style={botonUbicacion}
            >
              🗺️ {mostrarMapa ? (textos.ocultarMapa || "Ocultar mapa") : (textos.elegirEnMapa || "Elegir lote en el mapa")}
            </button>
          )}
          {onReintentarGPS && (
            <button
              type="button"
              onClick={onReintentarGPS}
              style={{ ...botonUbicacion, backgroundColor: "#455a64" }}
            >
              📡 {textos.usarGPS || "Usar mi GPS"}
            </button>
          )}
        </div>
      </div>

      {/* Selector de Mapa */}
      {mostrarMapa && (
        <div style={{ marginBottom: "16px" }}>
          <MapaSelector
            coordenadasActuales={ubicacion}
            onSeleccionarPunto={onSeleccionarPuntoMapa}
          />
        </div>
      )}

      {/* Formulario de Medición con Instrumentos (si eligió el botón derecho en el Landing) */}
      {usarHumedadManual && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px",
            borderRadius: "10px",
            backgroundColor: "#eef2f6",
            border: "1px solid #cbd5e1",
            color: "#111",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: "16px", color: "#1565c0" }}>
            📟 {textos.medicionInstrumentos || "Medición con instrumentos"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Campo etiqueta={textos.humedadSuperficial || "Humedad superficial (%)"}>
              <input
                type="number"
                step="0.1"
                placeholder="Ej: 24"
                value={humedadManual.arriba}
                onChange={(e) => onCambiarHumedadManual?.("arriba", e.target.value)}
                style={control}
              />
            </Campo>
            <Campo etiqueta={textos.humedadProfunda || "Humedad profunda (%)"}>
              <input
                type="number"
                step="0.1"
                placeholder="Ej: 22"
                value={humedadManual.abajo}
                onChange={(e) => onCambiarHumedadManual?.("abajo", e.target.value)}
                style={control}
              />
            </Campo>
          </div>
        </div>
      )}

      {/* Botones de Acción: Siembra y Cosecha */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
        <button
          type="button"
          onClick={() => onAnalizar?.("SIEMBRA")}
          disabled={cargando}
          style={{ ...botonAccion, backgroundColor: "#2e7d32" }}
        >
          🌱 {textos.btnSembrar || "¿Se puede Sembrar?"}
        </button>

        <button
          type="button"
          onClick={() => onAnalizar?.("COSECHA")}
          disabled={cargando}
          style={{ ...botonAccion, backgroundColor: "#1565c0" }}
        >
          🚜 {textos.btnCosechar || "¿Se puede Cosechar?"}
        </button>
      </div>

      {cargando && (
        <p style={{ textAlign: "center", fontSize: "16px", marginTop: "12px" }}>
          {textos.consultando || "Consultando datos de tu ubicación..."}
        </p>
      )}

      {error && (
        <p style={{ color: "#d32f2f", fontSize: "15px", marginTop: "12px", textAlign: "center", fontWeight: "bold" }}>
          ⚠️ {traducirTextoDinamico(error, idioma)}
        </p>
      )}

      {/* Resultado del Semáforo de Siembra / Cosecha */}
      {diagnostico && !cargando && (
        <div
          style={{
            marginTop: "16px",
            padding: "18px",
            borderRadius: "12px",
            backgroundColor: diagnostico.color || colorPorTipo(diagnostico.semaforo),
            color: "white",
            textAlign: "left",
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", fontSize: "21px" }}>{tituloTraducido}</h2>
          <p style={{ fontSize: "16px", lineHeight: 1.4, margin: "0 0 12px" }}>
            {mensajeTraducido}
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
                {traducirContextoClimatico(
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
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "white",
              color: "#111111",
              cursor: "pointer",
            }}
          >
            🔊 {textos.btnEscuchar || "Escuchar recomendación"}
          </button>
        </div>
      )}

      {/* NUEVO MÓDULO: Rotación de Cultivo y Aproximación de Desgaste */}
      <RotacionView
        cultivoAnterior={cultivoAnterior}
        onCambiarCultivoAnterior={onCambiarCultivoAnterior}
        evaluacionRotacion={evaluacionRotacion}
        onEscucharRotacion={onEscucharRotacion}
      />
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

function traducirContextoClimatico(texto, idioma = "es") {
  if (!texto) {
    return idioma === "en"
      ? "NASA POWER did not return historical information for the current month."
      : "NASA POWER no devolvió información histórica para el mes actual.";
  }

  if (idioma !== "en") {
    return texto;
  }

  const meses = {
    Enero: "January",
    Febrero: "February",
    Marzo: "March",
    Abril: "April",
    Mayo: "May",
    Junio: "June",
    Julio: "July",
    Agosto: "August",
    Septiembre: "September",
    Octubre: "October",
    Noviembre: "November",
    Diciembre: "December",
  };

  let traducido = String(texto);

  Object.entries(meses).forEach(([mesEs, mesEn]) => {
    traducido = traducido.replace(new RegExp(`\\b${mesEs}\\b`, "g"), mesEn);
  });

  const reemplazos = [
    ["NASA POWER no devolvió un resumen para el mes actual.", "NASA POWER did not return a summary for the current month."],
    ["NASA POWER no devolvió información histórica para el mes actual.", "NASA POWER did not return historical information for the current month."],
    ["precipitación media no disponible", "average precipitation unavailable"],
    ["temperatura máxima media no disponible", "average maximum temperature unavailable"],
    ["mm de precipitación media", "mm of average precipitation"],
    ["°C de temperatura máxima media", "°C average maximum temperature"],
    ["°C de máxima media", "°C average maximum temperature"],
    ["La mayor racha seca del período fue de", "The longest dry spell in the period was"],
    ["días.", "days."],
    [" y ", " and "],
  ];

  reemplazos.forEach(([es, en]) => {
    traducido = traducido.split(es).join(en);
  });

  return traducido;
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
      <span style={{ fontSize: "13px", fontWeight: "bold" }}>{etiqueta}</span>
      {children}
      {ayuda && <span style={{ fontSize: "11px", color: "#666" }}>{ayuda}</span>}
    </label>
  );
}

function BloqueResultado({ titulo, children }) {
  return (
    <div
      style={{
        marginTop: "10px",
        padding: "10px 12px",
        borderRadius: "8px",
        backgroundColor: "rgba(0,0,0,0.18)",
      }}
    >
      <h3 style={{ margin: "0 0 6px", fontSize: "15px" }}>{titulo}</h3>
      {children}
    </div>
  );
}

function formatearPorcentaje(valor) {
  return Number.isFinite(valor) ? `${valor.toFixed(1)} %` : "No disponible";
}

function colorPorTipo(tipo) {
  if (tipo === "FAVORABLE" || tipo === "VERDE") return "#2e7d32";
  if (tipo === "HUMEDO" || tipo === "AMARILLO") return "#ef6c00";
  return "#d32f2f";
}

const botonUbicacion = {
  marginTop: "10px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: "bold",
  borderRadius: "6px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const botonAccion = {
  flex: 1,
  padding: "16px 10px",
  fontSize: "17px",
  fontWeight: "bold",
  borderRadius: "10px",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const control = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #aeb7c2",
  backgroundColor: "white",
  color: "#111",
};

const parrafoDetalle = {
  margin: "4px 0",
  fontSize: "13px",
  lineHeight: 1.4,
};